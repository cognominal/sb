import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { user } from '../src/lib/server/db/schema';


beforeAll(async () => {
});

afterAll(async () => {
    // Close the database connection
    await db.close();
});

describe('User Table Tests', () => {
    it('should insert a user into the table', async () => {
        await db.insert(user).values({ id: 1, age: 25 }).run();
        const result = await db.select().from(user).where(user.id.eq(1)).get();
        expect(result).toEqual({ id: 1, age: 25 });
    });

    it('should update a user\'s age', async () => {
        await db.update(user).set({ age: 30 }).where(user.id.eq(1)).run();
        const result = await db.select().from(user).where(user.id.eq(1)).get();
        expect(result?.age).toBe(30);
    });

    it('should delete a user from the table', async () => {
        await db.delete(user).where(user.id.eq(1)).run();
        const result = await db.select().from(user).where(user.id.eq(1)).get();
        expect(result).toBeUndefined();
    });
});
