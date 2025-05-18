import type { PageServerLoad } from './$types';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { exposedDocumentsTable } from '$lib/server/db/schema';


const client = createClient({ url: 'file:local.db' });
const db = drizzle(client);

export const load: PageServerLoad = async () => {
    // Fetch all documents from the exposedDocumentsTable
    const docs = await db.select().from(exposedDocumentsTable).all();
    return {
        docs
    };
};
