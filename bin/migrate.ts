import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { createClient, type Client } from '@libsql/client';
import * as schema from '$lib/server/db/schema';
import { exposedDocumentsTable } from '$lib/server/db/schema';
import { readdirSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import { migrate } from 'drizzle-orm/libsql/migrator'; // <-- Import migrate

const client = createClient({ url: 'file:local.db' });
type DB = LibSQLDatabase<typeof schema> & {
    $client: Client;
};

let db: DB = drizzle(client, { schema });

await migrate(db, { migrationsFolder: './drizzle' }); // <-- Run migrations

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