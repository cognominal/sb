<script lang="ts">
	// import { PageServerData } from './../../.svelte-kit/types/src/routes/t/$types.d.ts'
	import { type LangCode, type PageState, getAndProcessDefinition } from '$lib';
	import { X } from 'lucide-svelte';
	import { Segment } from '@skeletonlabs/skeleton-svelte';
	let iframeElement: HTMLIFrameElement | null = $state(null);

	let { pageState = $bindable<PageState>() } = $props();

	// State to hold processed HTML
	let processedHtml: string | null = $state(null);

	const langs = ['en', 'ru', 'fr']; // hardwired for now

	pageState.wlang = 'ru' as LangCode;

	// Effect to extract and process words when wordDefinition changes
	$effect(() => {
		console.log('Effect triggered');
		if (pageState.wlang && pageState.selectedWord) {
			getAndProcessDefinition(pageState);
		}
		if (pageState.wordDefinition !== null) {
			extractAndProcessWords(pageState.wordDefinition);
		}
	});

	// Extract words from form-of-definition-link spans and process them
	function extractAndProcessWords(html: string) {
		// Use a temporary <div> for robust extraction from HTML fragments
		const tempDiv = document.createElement('div');
		console.log(tempDiv);
		tempDiv.innerHTML = html;

		const spans = tempDiv.querySelectorAll('span.form-of-definition-link');
		console.log(`Found ${spans.length} form-of-definition-link spans`);
		const words: string[] = [];
		spans.forEach((span) => {
			const a = span.querySelector('a');
			if (a) {
				// a!.href = 'https://en.wiktionary.org/' + a!.href
				// console.log(a.outerHTML)
				// words.push(a.outerHTML)
				return `<button onclick=> ${a.textContent}</button>`;
			}
		});
		// Example processing: list words, and include the original definition
		processedHtml = `
	  <div>
		<h3>Original Definition</h3>
		<div class="original-definition">${html}</div>
	  </div>
	  <div>
		<h3>Extracted Words</h3>
		<ul>${words.map((w) => `<li>${w}</li>`).join('')}</ul>
	  </div>
	`;
		updateIframeContent();
	}

	// This function is only for initial iframe setup
	function handleIframeLoad(event: Event) {
		iframeElement = event.target as HTMLIFrameElement;
		updateIframeContent();
	}

	// Function to close the panel and reset state
	function closePanel() {
		pageState.wiktionaryPanelClosed = true;
		// pageState.selectedWord = null
		pageState.wordDefinition = null;
	}

	// Separate function to updwiktionaryPanelClosedme content
	function updateIframeContent() {
		if (!iframeElement) return;

		const iframeDoc = iframeElement.contentDocument || iframeElement.contentWindow?.document;

		if (!pageState.selectedWord) {
			pageState.iframeLoading = false;
			return;
		}
		if (!iframeDoc) {
			console.error('Could not access iframe document');
			pageState.iframeLoading = false;
			return;
		}

		// If we have processedHtml, use it; otherwise, use the definition
		if (processedHtml) {
			iframeDoc.body.innerHTML = processedHtml;
		} else if (pageState.wordDefinition) {
			iframeDoc.body.innerHTML = pageState.wordDefinition;
		}

		// Add styles from external CSS file
		fetch('/src/lib/wiktionary-panel-iframe.css')
			.then((response) => response.text())
			.then((cssContent) => {
				const style = iframeDoc.createElement('style');
				style.textContent = cssContent;
				iframeDoc.head.appendChild(style);
			});

		pageState.iframeLoading = false;
	}
</script>

<div class="relative h-full w-full">
	<div>{pageState.wlang}</div>
	<!-- Language selection radio group -->
	<div class="mb-4 flex items-center gap-4">
		<fieldset class="m-0 border-0 p-0">
			<div class="flex flex-row items-center gap-4">
				<legend class="m-0 p-0 font-semibold">Wiktionary language</legend>
				{#each langs as wlang}
					<label class="flex cursor-pointer items-center gap-1">
						<input type="radio" name="lang-group" value={wlang} bind:group={pageState.wlang} />
						{wlang.toUpperCase()}
					</label>
				{/each}
			</div>
		</fieldset>
	</div>
	<!-- Close button -->
	<button
		class="absolute top-2 right-2 z-10 rounded-full bg-gray-200 p-1.5 text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-300 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		onclick={closePanel}
		aria-label="Close panel"
		title="Close panel"
	>
		<X size={18} strokeWidth={2.5} />
	</button>

	{#if pageState.iframeLoading}
		<div class="bg-opacity-75 absolute inset-0 flex items-center justify-center bg-white">
			<div class="text-lg text-gray-600">Loading...</div>
		</div>
	{/if}

	<iframe
		title="wiktionary"
		id="wiktionary-frame"
		srcdoc="<html><body></body></html>"
		onload={handleIframeLoad}
		bind:this={iframeElement}
		class="h-full w-full border-none"
	></iframe>
</div>
