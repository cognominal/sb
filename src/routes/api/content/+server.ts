import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server'; // Assuming a database connection is exported here
import { exposedDocumentsTable } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm/expressions';
import { fetchWiktionaryPageAndProcessIt, type ProcessedWiktPage, storeWordDataIndB, getWordDataFromDbOrNull } from '$lib/server';


export const GET: RequestHandler = async ({ url }) => {
    try {
        const id = url.searchParams.get('id');
        console.log('ID:', id);

        if (!id) {
            return new Response(JSON.stringify({ error: 'Missing document ID' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Fetch the document content from the database
        const document = await db
            .select()
            .from(exposedDocumentsTable)
            .where(eq(exposedDocumentsTable.id, Number(id)))
            .get();

        if (!document) {
            return new Response(JSON.stringify({ error: 'Document not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Return the content as JSON
        console.log('Document content:');

        return json({
            processedHtml: document.content
        });
    } catch (error) {
        console.error('Error fetching document content:', error);
        return new Response(JSON.stringify({ error: 'Failed to load content' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
