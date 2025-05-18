
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db, getWordDataFromDbOrNull, storeWordDataIndB, fetchWiktionaryPageAndProcessIt, type ProcessedWiktPage } from '$lib/server';
import { type WordData } from '$lib/server';
import { exposedDocumentsTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/expressions';
import type { LangCode } from '$lib';


export const load: PageServerLoad = async ({ params }) => {
    const id = Number(params.id);
    if (isNaN(id)) {
        throw error(400, 'Invalid document id');
    }

    const document = await db
        .select()
        .from(exposedDocumentsTable)
        .where(eq(exposedDocumentsTable.id, id))
        .get();

    if (!document) {
        throw error(404, `Document with ID ${id} not found`);
    }

    return {
        doc: document
    };
};

export const actions: Actions = {
    getDefinition: async ({ request }) => {
        try {
            const data = await request.formData();
            const word = data.get('word')?.toString()
            const lang = data.get('lang')?.toString() as LangCode
            const wlang = data.get('wlang')?.toString() as LangCode
            console.log(`Word '${word}' with lang '${lang}' and wlang '${wlang}'`);


            if (!word) {
                throw error(400, 'Word is required');
            }

            // Check if the word exists in the database
            let wordData: WordData | null = await getWordDataFromDbOrNull(word, lang!, wlang!);
            // console.log(`Word data: ${JSON.stringify(wordData)}`);


            // If the word doesn't exist in the database or has no Wiktionary content
            if (!wordData) {
                console.log(`Word '${word}' not found in database. Fetching from Wiktionary...`);

                // Fetch and process the definition from Wiktionary
                // The fetchWiktionaryContent function now includes the processing step
                const p: ProcessedWiktPage = await fetchWiktionaryPageAndProcessIt(word, lang!, wlang!);
                console.log(p.status);


                // If wordData exists but has no Wiktionary content, preserve its indices
                wordData = {
                    word,
                    lang: lang!,
                    wlang: wlang!,
                    // indices: [],
                    content: p.processedWiktionaryPage!
                };
                // const indices = wordData ? wordData.indices : [];
                await storeWordDataIndB(wordData!);

                console.log(`Stored definition for '${word}' in database.`);
            }

            return wordData
        }
        catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            console.error('Error in getDefinition action:', errorMessage);
            throw error(500, `Error fetching definition: ${errorMessage}`);
        }
    }
}
