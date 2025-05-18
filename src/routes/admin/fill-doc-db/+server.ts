import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { exec } from 'child_process';
import path from 'path';

export const POST: RequestHandler = async () => {
    const scriptPath = path.join(process.cwd(), 'bin', 'fill-doc-db.ts');
    return new Promise((resolve) => {
        exec(`bun ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                resolve(json({ success: false, error: stderr || error.message }, { status: 500 }));
            } else {
                resolve(json({ success: true, output: stdout }));
            }
        });
    });
};
