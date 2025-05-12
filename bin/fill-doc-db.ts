import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { createClient, type Client } from '@libsql/client';
import * as schema from '$lib/server';
import { exposedDocumentsTable } from '$lib/server';
import { read, readFile } from 'fs';
import { readFileSync } from 'fs';


const client = createClient({ url: 'file:local.db' });
type DB = LibSQLDatabase<typeof schema> & {
    $client: Client;
};

let db: DB = drizzle(client, { schema });

export async function initializeDatabase() {
    // Check if the `documents` table exists using raw SQL
    const tableExists = await db.$client.execute(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='documents';`
    );
    if (tableExists.rows.length === 0) {
        // Corrected SQL syntax for creating the `documents` table
        await db.$client.execute(`
            CREATE TABLE documents (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL
            );
        `);
    }
}

await initializeDatabase();
let DocuimentTableRowID = 0;
const docContent = readFileSync('static/grok-processed-file.html', 'utf-8');
await db.insert(exposedDocumentsTable).values({
    id: DocuimentTableRowID++,
    title: 'Grok',
    content: docContent
}).run();

