<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	let { children } = $props();

	let experimental = $state(false);
</script>

<nav class="w-full">
	<div class="flex w-full flex-row items-center gap-4">
	   <div>
		   <a href="/" class="text-gray-800 hover:text-blue-600 {($page.url.pathname === '/' ? 'font-bold underline text-blue-600' : '')}">home</a>
	   </div>
	   <div>
		   <a href="/docs" class="text-gray-800 hover:text-blue-600 {($page.url.pathname.startsWith('/docs') ? 'font-bold underline text-blue-600' : '')}">docs</a>
	   </div>
	   {#if experimental}
		   <div>
			   <a href="/admin" class="text-gray-800 hover:text-blue-600 {($page.url.pathname.startsWith('/admin') ? 'font-bold underline text-blue-600' : '')}">admin</a>
		   </div>
		   <div>
			   <a href="/create-doc" class="text-gray-800 hover:text-blue-600 {($page.url.pathname.startsWith('/create-doc') ? 'font-bold underline text-blue-600' : '')}">create-doc</a>
		   </div>
		   <div>
			   <a href="/attach-test" class="text-gray-800 hover:text-blue-600 {($page.url.pathname.startsWith('/attach-test') ? 'font-bold underline text-blue-600' : '')}">attach-test</a>
		   </div>
	   {/if}
		<div class="ml-auto flex flex-row items-center gap-4">
			<label class="flex items-center gap-1">
				<input type="checkbox" bind:checked={experimental} />
				<span class="text-sm text-gray-400">experimental</span>
			</label>
			<a href="https://github.com/cognominal/sb">
				<img src="/github-mark/github-mark.svg" class="h-6 w-auto sm:h-8" alt="GitHub Logo" />
			</a>
		</div>
	</div>
</nav>
{@render children()}
