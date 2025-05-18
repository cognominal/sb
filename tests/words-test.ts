import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { drizzle } from 'drizzle-orm/sqlite-core';
import { Database } from 'sqlite';
import { words } from '../src/lib/server/db/schema';

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
    await db.close();
});

describe('Words Table Tests', () => {
    it('should insert a row into the words table', async () => {
        await db.insert(words).values({
            word: 'привет',
            lang: 'ru',
            wiktionary: '<html>Definition</html>'
        }).run();

        const result = await db.select().from(words).where(words.word.eq('привет')).get();
        expect(result).toEqual({
            word: 'привет',
            lang: 'ru',
            wiktionary: '<html>Definition</html>'
        });
    });
});
