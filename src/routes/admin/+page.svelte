<script lang="ts">
	import { onMount } from 'svelte';
	let dbExists = false;
	let filling = false;

	let schema = '';
	let loadingSchema = false;

	async function showSchema() {
		loadingSchema = true;
		const res = await fetch('/admin/db-schema');
		const data = await res.json();
		loadingSchema = false;
		if (data.success) {
			schema = data.schema;
		} else {
			alert('Failed to fetch schema: ' + (data.error || 'Unknown error'));
		}
	}

	async function checkDb() {
		const res = await fetch('/admin/delete-db');
		const data = await res.json();
		dbExists = data.exists;
	}

	onMount(checkDb);

	async function deleteDb() {
		const res = await fetch('/admin/delete-db', { method: 'POST' });
		const data = await res.json();
		if (data.success) {
			alert('local.db deleted!');
			dbExists = false;
		} else {
			alert('Failed to delete local.db: ' + (data.error || 'Unknown error'));
		}
	}

	async function fillDb() {
		filling = true;
		const res = await fetch('/admin/fill-doc-db', { method: 'POST' });
		const data = await res.json();
		filling = false;
		if (data.success) {
			alert('local.db created!');
			dbExists = true;
		} else {
			alert('Failed to create local.db: ' + (data.error || 'Unknown error'));
		}
	}
</script>

<button
	on:click={deleteDb}
	style="margin:2em;padding:1em 2em; opacity: {dbExists ? 1 : 0.5}; cursor: {dbExists
		? 'pointer'
		: 'not-allowed'};"
	disabled={!dbExists}
>
	Delete local.db
</button>

<button
	on:click={fillDb}
	style="margin:2em;padding:1em 2em; opacity: {!dbExists && !filling
		? 1
		: 0.5}; cursor: {!dbExists && !filling ? 'pointer' : 'not-allowed'};"
	disabled={dbExists || filling}
>
	{filling ? 'Creating...' : 'Create local.db'}
</button>

<button
	on:click={showSchema}
	style="margin:2em;padding:1em 2em; opacity: {dbExists && !loadingSchema
		? 1
		: 0.5}; cursor: {dbExists && !loadingSchema ? 'pointer' : 'not-allowed'};"
	disabled={!dbExists || loadingSchema}
>
	{loadingSchema ? 'Loading schema...' : 'Show DB Schema'}
</button>

{#if schema}
	<pre
		style="margin:2em; background:#f8f8f8; padding:1em; border-radius:6px; max-width:90vw; overflow-x:auto;">
{schema}
</pre>
{/if}
