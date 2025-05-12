import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { wordsTable } from './schema';
import { and, eq } from 'drizzle-orm/expressions';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const client = createClient({ url: process.env.DB_FILE_NAME! });

export const db = drizzle(client, { schema });

async function initializeDatabase() {
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
                tlang TEXT NOT NULL,
                content TEXT,
                PRIMARY KEY (word, lang, tlang)
            )
        `);
    }
}

async function main() {
    // Initialize the database
    await initializeDatabase();

    // Insert a row into the wordsTable
    await db.insert(schema.wordsTable).values({
        word: 'fakeword',
        lang: 'en',
        tlang: 'en',
        content: 'fakecontent'
    }).run();

    // Find the row using the primary keys
    const row = await db.select().from(wordsTable)
        .where(
            and(
                eq(wordsTable.word, 'fakeword'),
                eq(wordsTable.lang, 'en'),
                eq(wordsTable.tlang, 'en')
            )
        )
        .get();

    // Print the content of the row
    console.log(`Row content: ${row?.content}`);
}

main().catch(console.error);
