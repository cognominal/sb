import { describe, it, expect, beforeAll } from 'vitest';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../src/lib/server/db/schema';
import { wordsTable } from '../src/lib/server/db/schema';
import { and, eq } from 'drizzle-orm/expressions';
import { initializeDatabase } from '../src/lib/server/db';

// .env is git ignored so don't use it for tests.
// import dotenv from 'dotenv';

// Load environment variables from .env file
// dotenv.config();

// const client = createClient({ url: process.env.DB_FILE_NAME! });


const client = createClient({ url: 'file:local-test.db' });
const db = drizzle(client, { schema });

beforeAll(async () => {
    await initializeDatabase();
    // Clear the `words` table before running tests
    await db.run(`DELETE FROM words`);
});


describe('Database Tests', () => {
    it('should insert and retrieve a row with content "fakecontent"', async () => {
        // Insert a row into the wordsTable
        await db.insert(schema.wordsTable).values({
            word: 'fakeword',
            lang: 'en',
            wlang: 'en',
            content: 'fakecontent'
        }).run();

        // Find the row using the primary keys
        const row = await db.select().from(wordsTable)
            .where(
                and(
                    eq(wordsTable.word, 'fakeword'),
                    eq(wordsTable.lang, 'en'),
                    eq(wordsTable.wlang, 'en')
                )
            )
            .get();

        // Assert the content of the row
        expect(row?.content).toBe('fakecontent');
    });
});
