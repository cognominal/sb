/**
 * Database Module for Word Storage and Retrieval
 * =============================================
 * * 
 * we are adapting code from  https://github.com/cognominal/spc-learn to adapt it to drizzle-orm
 * 
 * we cargo culted from https://github.com/drizzle-team/drizzle-orm/tree/main/examples/bun-sqlite
 * 
 * we added two primary keys : `lang` and `wlang` to the `words` table
 * the column indices was commented out
 * 
 *  DOC BELOW THIS IS NOT UP TO DATE.
 * 
 * 
 * This module provides a SQLite database interface for storing and retrieving
 * Russian words, their occurrences (indices), and their Wiktionary definitions.
 *
 * Key Features:
 * - Automatic database initialization and table creation
 * - Automatic restoration from YAML dump if database is empty
 * - Asynchronous API for database operations
 * - Word normalization (lowercase, trimmed)
 *
 * Database Schema:
 * - words table:
 *   - word: TEXT PRIMARY KEY - The Russian word (normalized)
 *   - indices: TEXT - JSON string of indices where the word appears in the text
 *   - wiktionary: TEXT - HTML content from Wiktionary for the word
 *
 * Persistence Strategy:
 * - Database is stored in a SQLite file in the data directory
 * - Database is dumped to a YAML file for version control and backup
 * - Database can be restored from the YAML dump if needed
 */

import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { createClient, type Client } from '@libsql/client';
import * as schema from './db/schema';
import { wordsTable } from './db/schema';
import { and, eq } from 'drizzle-orm/expressions';
import path from 'path';
import fs from 'fs/promises';

const client = createClient({ url: 'file:local.db' });
type DB = LibSQLDatabase<typeof schema> & {
    $client: Client;
};

export let db: DB = drizzle(client, { schema });

// Database file path
// const DB_PATH = path.join(process.cwd(), 'data', 'words.db');
// const YAML_PATH = path.join(process.cwd(), 'data', 'words.yaml');

export async function initializeDatabase() {
    // Check if the `words` table exists using raw SQL
    const tableExists = await db.all<{ count: number }>(
        `SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='words'`
    );

    // Create the `words` table if it doesn't exist
    if (tableExists[0].count === 0) {
        await db.run(`
            CREATE TABLE words (
                word TEXT NOT NULL,
                lang TEXT NOT NULL,
                wlang TEXT NOT NULL,
                content TEXT,
                PRIMARY KEY (word, lang, wlang)
            )
        `);
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

/**
 * Stores word data in the database
 *
 * @param word - The word to store
 * @param wiktionary - The Wiktionary HTML content for the word
 * @param indices - Optional array of indices where the word appears
 * @returns A promise that resolves when the word is stored
 */


export type WordData = {
    word: string;
    // indices: number[];
    // processedWiktionaryPage: string;
    lang: string;
    wlang: string;
    content: string
}

export async function storeWordDataIndB(wd: WordData): Promise<void> {
    try {
        await initializeDatabase();
        const normalizedWord = normalizeWord(wd.word);

        // Check if the word already exists for the given lang and wlang
        const existingWord = await db
            .select()
            .from(wordsTable)
            .where(
                and(
                    eq(wordsTable.word, normalizedWord),
                    eq(wordsTable.lang, wd.lang),
                    eq(wordsTable.wlang, wd.wlang)
                )
            )
            .get();

        if (existingWord) {
            // Optionally update the existing row if needed
            await db
                .update(wordsTable)
                .set({ content: wd.content })
                .where(
                    and(
                        eq(wordsTable.word, normalizedWord),
                        eq(wordsTable.lang, wd.lang),
                        eq(wordsTable.wlang, wd.wlang)
                    )
                )
                .run();
        } else {
            // Insert the new word data
            await db
                .insert(wordsTable)
                .values({
                    word: normalizedWord,
                    lang: wd.lang,
                    wlang: wd.wlang || 'en',
                    content: wd.content
                })
                .run();
        }
    } catch (err) {
        console.error(`Error storing word data for "${wd.word}" (lang: ${wd.lang}):`, err);
        throw err;
    }
}

export async function getWordDataFromDbOrNull(word: string, lang: string, wlang: string): Promise<WordData | null> {
    try {
        await initializeDatabase();
        const normalizedWord = normalizeWord(word);
        // Query for the word, lang, and wlang using Drizzle ORM query builder
        const wordData = await db
            .select()
            .from(wordsTable)
            .where(
                and(
                    eq(wordsTable.word, normalizedWord),
                    eq(wordsTable.lang, lang),
                    eq(wordsTable.wlang, wlang)
                )
            )
            .get();
        if (!wordData) {
            return null;
        }
        return {
            word: wordData.word,
            lang: wordData.lang,
            wlang: wordData.wlang,
            content: wordData.content!
        };
    } catch (error) {
        console.error(`Error getting word data for "${word}" (lang: ${lang}, wlang: ${wlang}):`, error);
        return null;
    }
}

// export async function dumpDatabaseToYAML(): Promise<void> {
//     try {
//         // Ensure database is initialized
//         await initializeDatabase();

//         // Get all words from the database
//         const words = await db.all('SELECT * FROM words');

//         // Convert to a more YAML-friendly format
//         const data = words.map((word: WordData) => ({
//             word: word.word,
//             indices: word.indices || '[]',
//             wiktionary: word.processedWiktionaryPage
//         }));

//         // Convert to YAML
//         const yamlData = yaml.stringify(data);

//         // Write to file
//         await fs.writeFile(YAML_PATH, yamlData, 'utf8');

//         console.log(`Database dumped to ${YAML_PATH}`);
//     } catch (error) {
//         console.error('Error dumping database to YAML:', error);
//         throw error;
//     }
// }

// export async function restoreFromYAML(): Promise<void> {
//     try {
//         // Check if the YAML file exists
//         try {
//             await fs.access(YAML_PATH);
//         } catch (error) {
//             console.log(`YAML file not found at ${YAML_PATH}`);
//             return;
//         }

//         // Ensure database is initialized
//         db = await initializeDatabase();

//         // Read the YAML file
//         const yamlData = await fs.readFile(YAML_PATH, 'utf8');

//         // Parse the YAML
//         const data = yaml.parse(yamlData) as Array<{
//             word: string;
//             indices: number[];
//             wiktionary: string;
//         }>;

//         // Begin a transaction
//         await db.run('BEGIN TRANSACTION');

//         // Clear the existing data
//         await db.run('DELETE FROM words');

//         // Insert the data
//         for (const item of data) {
//             await db.run(
//                 'INSERT INTO words (word, indices, wiktionary) VALUES (?, ?, ?)',
//                 item.word,
//                 JSON.stringify(item.indices),
//                 item.wiktionary
//             );
//         }

//         // Commit the transaction
//         await db.exec('COMMIT');

//         console.log(`Database restored from ${YAML_PATH}`);
//     } catch (error) {
//         // Rollback the transaction if there was an error
//         if (db) {
//             await db.exec('ROLLBACK');
//         }

//         console.error('Error restoring database from YAML:', error);
//         throw error;
//     }
// }

export async function closeDatabase(): Promise<void> {
    // db = await initializeDatabase();
    // if (db) {
    // await db.close();
    // db = null;
    // }
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
