import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { exec } from 'child_process';
import path from 'path';

export const GET: RequestHandler = async () => {
    const dbPath = path.join(process.cwd(), 'local.db');
    return new Promise((resolve) => {
        exec(`sqlite3 ${dbPath} .schema`, (error, stdout, stderr) => {
            if (error) {
                resolve(json({ success: false, error: stderr || error.message }, { status: 500 }));
            } else {
                resolve(json({ success: true, schema: stdout }));
            }
        });
    });
};
