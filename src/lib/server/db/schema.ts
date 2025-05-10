import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';



export const wordsTable = sqliteTable('words', {
	word: text('word').notNull(),
	lang: text('lang').notNull(),   // language of the wiktionary entry
	tlang: text('tlang').notNull(), // language of the word
	content: text('content'), //  part of the wiktionary entry for tlang
}, (table) => ({
	pk: primaryKey({ columns: [table.word, table.lang, table.tlang] }),
}));