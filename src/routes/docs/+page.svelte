<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();

	data = {
		docs: [
			{
				id: '123',
				title: 'Hello world',
				content: 'This is a test'
			}
		]
	};
</script>

<h1>available docs:</h1>

{#if data.docs.length === 0}
	<p>No documents available</p>
{/if}
{#each data.docs as doc}
	<p>title: {doc.title}</p>
	<p>{doc.id}</p>
	<p>content: {doc.content}</p>
{/each}
