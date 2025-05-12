/**
 * Database Module for Word Storage and Retrieval
 * =============================================
 * 
 * Refactored to use Drizzle ORM with the schema defined in schema.ts.
 */

import { drizzle } from 'drizzle-orm/sqlite';
import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import { words } from './schema';

// Database file path
const DB_PATH = path.join(process.cwd(), 'data', 'words.db');
const YAML_PATH = path.join(process.cwd(), 'data', 'words.yaml');

// Drizzle database instance
let db: ReturnType<typeof drizzle> | null = null;

/**
 * Initializes the database connection and creates tables if they don't exist
 *
 * @returns A promise that resolves when the database is initialized
 */
async function initializeDatabase() {
    if (db) return db;

    try {
        // Ensure the data directory exists
        await fs.mkdir(path.dirname(DB_PATH), { recursive: true });

        // Open the SQLite database
        const sqlite = new sqlite3.Database(DB_PATH);
        const sqliteDb = new Database({ filename: DB_PATH, driver: sqlite3.Database });

        // Initialize Drizzle ORM
        db = drizzle(sqliteDb);

        // Check if the database is empty
        const count = await db.select({ count: db.fn.count() }).from(words).get();
        if (count.count === 0) {
            // Try to restore from YAML if the database is empty
            try {
                await restoreFromYAML();
            } catch (error) {
                console.log('No YAML backup found or error restoring from YAML. Starting with empty database.');
            }
        }

        return db;
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

/**
 * Normalizes a word by converting to lowercase and trimming whitespace
 *
 * @param word - The word to normalize
 * @returns The normalized word
 */
function normalizeWord(word: string): string {
    return word.toLowerCase().trim();
}

export type WordData = {
    word: string;
    indices: number[];
    processedWiktionaryPage: string;
    lang: string;
};

export async function storeWordDataIndB(wd: WordData): Promise<void> {
    try {
        db = await initializeDatabase();
        const normalizedWord = normalizeWord(wd.word);

        // Check if the word already exists for the given lang
        const existingWord = await db.select().from(words).where(words.word.eq(normalizedWord)).get();
        if (existingWord) {
            const existingIndices = JSON.parse(existingWord.indices || '[]');
            const mergedIndices = [...new Set([...existingIndices, ...wd.indices])];
            await db.update(words)
                .set({
                    indices: JSON.stringify(mergedIndices),
                    wiktionary: wd.processedWiktionaryPage || existingWord.wiktionary
                })
                .where(words.word.eq(normalizedWord))
                .run();
        } else {
            await db.insert(words).values({
                word: normalizedWord,
                indices: JSON.stringify(wd.indices),
                wiktionary: wd.processedWiktionaryPage
            }).run();
        }
    } catch (error) {
        console.error(`Error storing word data for "${wd.word}" (lang: ${wd.lang}):`, error);
        throw error;
    }
}

export async function getWordDataFromDbOrNull(word: string, lang: string): Promise<WordData | null> {
    try {
        db = await initializeDatabase();
        const normalizedWord = normalizeWord(word);

        // Query for the word
        const wordData = await db.select().from(words).where(words.word.eq(normalizedWord)).get();
        if (!wordData) {
            return null;
        }
        const indices = JSON.parse(wordData.indices || '[]');
        return {
            word: wordData.word,
            indices,
            processedWiktionaryPage: wordData.wiktionary,
            lang
        };
    } catch (error) {
        console.error(`Error getting word data for "${word}" (lang: ${lang}):`, error);
        return null;
    }
}

export async function dumpDatabaseToYAML(): Promise<void> {
    try {
        db = await initializeDatabase();

        // Get all words from the database
        const wordsData = await db.select().from(words).all();

        // Convert to a more YAML-friendly format
        const data = wordsData.map(word => ({
            word: word.word,
            indices: word.indices || '[]',
            wiktionary: word.wiktionary
        }));

        // Convert to YAML
        const yamlData = yaml.stringify(data);

        // Write to file
        await fs.writeFile(YAML_PATH, yamlData, 'utf8');

        console.log(`Database dumped to ${YAML_PATH}`);
    } catch (error) {
        console.error('Error dumping database to YAML:', error);
        throw error;
    }
}

export async function restoreFromYAML(): Promise<void> {
    try {
        // Check if the YAML file exists
        try {
            await fs.access(YAML_PATH);
        } catch (error) {
            console.log(`YAML file not found at ${YAML_PATH}`);
            return;
        }

        db = await initializeDatabase();

        // Read the YAML file
        const yamlData = await fs.readFile(YAML_PATH, 'utf8');

        // Parse the YAML
        const data = yaml.parse(yamlData) as Array<{
            word: string;
            indices: number[];
            wiktionary: string;
        }>;

        // Begin a transaction
        await db.transaction(async (trx) => {
            // Clear the existing data
            await trx.delete(words).run();

            // Insert the data
            for (const item of data) {
                await trx.insert(words).values({
                    word: item.word,
                    indices: JSON.stringify(item.indices),
                    wiktionary: item.wiktionary
                }).run();
            }
        });

        console.log(`Database restored from ${YAML_PATH}`);
    } catch (error) {
        console.error('Error restoring database from YAML:', error);
        throw error;
    }
}

export async function closeDatabase(): Promise<void> {
    if (db) {
        await db.close();
        db = null;
    }
}

/**
 * Checks if the database is initialized
 *
 * @returns True if the database is initialized, false otherwise
 */
export function checkDatabase(): boolean {
    return db !== null;
}

// Initialize the database when the module is imported
initializeDatabase().catch(error => {
    console.error('Error initializing database:', error);
});
