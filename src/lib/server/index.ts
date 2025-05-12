export { processWiktionary } from './ProcessWiktionary';
export { fetchWiktionaryPageAndProcessIt, type ProcessedWiktPage, processContent, findRussianWords } from './processor';
export { type WordData, getWordDataFromDbOrNull, storeWordDataIndB, closeDatabase, checkDatabase, dumpDatabaseToYAML, restoreFromYAML } from './db';
import { initializeDatabase, closeDatabase } from './db';
export { wordsTable, exposedDocumentsTable } from './db/schema';
