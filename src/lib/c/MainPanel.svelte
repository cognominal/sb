<script lang="ts">
	import { handleClick } from '$lib';
	import { onMount } from 'svelte';
	import { type PageState } from '$lib';

	// Get pageState from props
	let { pageState = $bindable<PageState>() } = $props();
</script>

<section class="h-full w-full overflow-hidden bg-white p-4 text-black">
	<!-- {#if loading}
		<div class="flex h-full items-center justify-center">
			<div class="text-lg text-gray-600">Loading content...</div>
		</div>
	{:else if error}
		<div class="flex h-full items-center justify-center">
			<div class="text-lg text-red-600">Error: {error}</div>
		</div>
	{:else  -->
	{#if pageState.documentContent}
		<div
			class="h-full w-full overflow-y-auto"
			style="max-height: 100%; overflow-y: auto;"
			onclick={(e) => handleClick(e, pageState)}
			onkeydown={(e) => e.key === 'Enter' && handleClick(e, pageState)}
			role="textbox"
			tabindex="0"
			aria-label="Russian text with clickable words"
		>
			{@html pageState.documentContent}
		</div>
	{:else}
		<div class="flex h-full items-center justify-center">
			<div class="text-lg text-red-600">No content available</div>
		</div>
	{/if}
</section>
