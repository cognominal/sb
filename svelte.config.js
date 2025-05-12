import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

const config = {
	preprocess: vitePreprocess(),
	kit: { adapter: adapter() },
	alias: {
		'$c': path.resolve('./src/lib/c'),
		// '$c/*': path.resolve('./src/lib/c/*'),
	}
};

export default config;
