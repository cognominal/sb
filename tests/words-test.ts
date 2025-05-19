import { eq } from 'drizzle-orm';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { wordsTable } from '../src/lib/server/db/schema';

let db: ReturnType<typeof drizzle>;

beforeAll(async () => {
    // Initialize an in-memory SQLite database for testing
    const sqliteDb = new Database(':memory:');
    db = drizzle(sqliteDb);

    // Create the words table
    await db.run(`
		CREATE TABLE words (
			word TEXT NOT NULL,
			lang TEXT NOT NULL,
			wiktionary TEXT,
			PRIMARY KEY (word, lang)
		)
	`);
});

afterAll(async () => {
    // Close the database connection
    // await db.close();
});

describe('Words Table Tests', () => {
    it('should insert a row into the words table', async () => {
        await db.insert(wordsTable).values({
            word: 'привет',
            lang: 'ru',
            wlang: 'ru',
            content: '<html>Definition</html>'
        }).run();

        const result = await db.select().from(wordsTable).where(eq(wordsTable.word, 'привет')).get();
        expect(result).toEqual({
            word: 'привет',
            lang: 'ru',
            wlang: 'ru',
            content: '<html>Definition</html>'
        });
    });
});
