<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();

	import { SplitPane } from '@rich_harris/svelte-split-pane';
	import WiktDefnPanel from '$lib/c/WiktDefnPanel.svelte';
	import MainPanel from '$lib/c/MainPanel.svelte';
	import { type PageState, initPageState } from '$lib';

	let error = '';

	import { page } from '$app/state';
	import { onMount } from 'svelte';

	// Access the slug from page.params
	let id = page.params.id;
	let pageState: PageState = $state(initPageState());

	$effect(() => {});

	async function fetchDocument(id: string): Promise<{ err: string; str: string }> {
		try {
			// Fetch the processed HTML content
			const response = await fetch(`/api/content/?id=${id}`);

			if (!response.ok) {
				throw new Error(`Failed to load content: ${response.statusText}`);
			}

			const data = await response.json();

			return { err: '', str: data.processedHtml };
			console.log('Main panel : Fetched content:');
		} catch (err) {
			console.error('Error loading content:', err);
			error = err instanceof Error ? err.message : String(err);
			return { err: error, str: '' };
		}
	}

	// No need for data prop anymore as MainPanel fetches its own data

	// Define the PageState class with reactive members

	// Create an instance of PageState
	onMount(async () => {
		// Fetch the document content when the component mounts
		// console.log('onMount');

		let { err, str } = await fetchDocument(id);
		pageState.documentContent = str;
		// console.log('Main panel : Fetched content:', str);
	});

	// Effect to update the panel layout when a word is selected
	$effect(() => {
		if (pageState.selectedWord) {
			pageState.wiktionaryPanelClosed = false;
		}
	});
</script>

<main class="mx-auto flex h-screen w-full flex-col overflow-hidden p-5">
	{#if pageState.wiktionaryPanelClosed}
		<MainPanel bind:pageState></MainPanel>
	{:else}
		<SplitPane
			type="horizontal"
			id="lower-split"
			min="200px"
			max="-200px"
			pos="50%"
			--color="#e5e7eb"
			--thickness="4px"
		>
			{#snippet a()}
				<MainPanel bind:pageState></MainPanel>
			{/snippet}

			{#snippet b()}
				<WiktDefnPanel bind:pageState></WiktDefnPanel>
			{/snippet}
		</SplitPane>
	{/if}
</main>

<style>
	:global(.russian-word) {
		cursor: pointer;
		border-bottom: 1px dashed #9ca3af;
		display: inline-block;
		padding-left: 0.125rem;
		padding-right: 0.125rem;
	}

	:global(.russian-word:hover) {
		background-color: #f3f4f6;
	}
</style>
