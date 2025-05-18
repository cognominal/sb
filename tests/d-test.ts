import { drizzle } from 'drizzle-orm/libsql';
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

// const db = drizzle({
//     connection: {
//         url: 'file:./data/words.db'
//         // url: process.env.DATABASE_URL,
//         // authToken: process.env.DATABASE_AUTH_TOKEN
//     }
// });

export const usersTable = sqliteTable("users_table", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    age: int().notNull(),
    email: text().notNull().unique(),
});