<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();

	// data = {
	// 	docs: [
	// 		{
	// 			id: '123',
	// 			title: 'Hello world',
	// 			content: 'This is a test'
	// 		}
	// 	]
	// };
</script>

{#if data.docs.length === 0}
	<p>No documents available</p>
{/if}
<h2>Documents available</h2>
<ul>
	{#each data.docs as doc}
		<li><a href="/docs/{doc.id}">{doc.title}</a></li>
	{/each}
</ul>
