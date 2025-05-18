
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';

export const GET: RequestHandler = async () => {
    const dbPath = path.join(process.cwd(), 'local.db');
    try {
        await fs.access(dbPath);
        return json({ exists: true });
    } catch {
        return json({ exists: false });
    }
};

export const POST: RequestHandler = async () => {
    const dbPath = path.join(process.cwd(), 'local.db');
    try {
        await fs.unlink(dbPath);
        return json({ success: true });
    } catch (e) {
        return json({ success: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
};
