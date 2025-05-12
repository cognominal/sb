import { describe, it, expect, beforeAll } from 'vitest';
import config from '../drizzle.config';

beforeAll(() => {
	// Mock the DATABASE_URL environment variable
	process.env.DATABASE_URL = 'sqlite://:memory:';
});

describe('Drizzle Configuration', () => {
	it('should have the correct schema path', () => {
		expect(config.schema).toBe('./src/lib/server/db/schema.ts');
	});

	// it('should have the correct database URL', () => {
	// 	expect(config.dbUrl).toBe(process.env.DATABASE_URL); // Use dbUrl instead of driver or dbCredentials
	// });

	it('should use the SQLite dialect', () => {
		expect(config.dialect).toBe('sqlite');
	});
});
