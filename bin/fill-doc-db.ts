import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { createClient, type Client } from '@libsql/client';
import * as schema from '../src/lib/server';
import { exposedDocumentsTable } from '../src/lib/server';
import { readdirSync, readFileSync } from 'fs';
import { join, basename } from 'path';



const client = createClient({ url: 'file:local.db' });
type DB = LibSQLDatabase<typeof schema> & {
    $client: Client;
};

let db: DB = drizzle(client, { schema });



// Temporary: create tables using raw SQL if they do not exist (remove when migrations work)
export async function initializeDatabase() {
    // Check if the `documents` table exists using raw SQL
    const tableExists = await db.$client.execute(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='documents';`
    );
    if (tableExists.rows.length === 0) {
        await db.$client.execute(`
            CREATE TABLE documents (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL
            );
        `);
    }
    const docPreztableExists = await db.$client.execute(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='docprez';`
    );
    if (docPreztableExists.rows.length === 0) {
        await db.$client.execute(`
            CREATE TABLE docprez (
                id INTEGER PRIMARY KEY,
                lang TEXT NOT NULL,
                markdown TEXT NOT NULL,
                FOREIGN KEY (id) REFERENCES documents(id)
            );
        `);
    }
}

await initializeDatabase();

// Directory containing the HTML files
const docsDir = 'static/multilingual_docs';
const files = readdirSync(docsDir).filter(file => file.endsWith('.html'));

let documentTableRowID = 0;

// Insert each file into the database
for (const file of files) {
    const filePath = join(docsDir, file);
    const docContent = readFileSync(filePath, 'utf-8');
    const title = basename(file, '.html'); // Use the file basename without extension as the title

    await db.insert(exposedDocumentsTable).values({
        id: documentTableRowID++,
        title,
        content: docContent
    }).run();
}
