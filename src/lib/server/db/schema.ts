import { sqliteTable, text, integer, primaryKey, foreignKey } from 'drizzle-orm/sqlite-core';



export const wordsTable = sqliteTable('words', {
	word: text('word').notNull(),
	lang: text('lang').notNull(),   // language of the wiktionary entry
	wlang: text('wlang').notNull(), // language of the word
	content: text('content'), //  part of the wiktionary entry for wlang
}, (table) => ({
	pk: primaryKey({ columns: [table.word, table.lang, table.wlang] }),
}));

export const exposedDocumentsTable = sqliteTable('documents', {
	id: integer('id').primaryKey(),
	title: text('title').notNull(),
	// lang: text('lang').notNull(), // language of the document
	content: text('content').notNull(), // content of the processed document
});

export const docPrezTable = sqliteTable('docprez', {
	id: integer('id').primaryKey(),
	documentId: integer('document_id').notNull().references(() => exposedDocumentsTable.id),
	lang: text('lang').notNull(),
	markdown: text('markdown').notNull(),
});