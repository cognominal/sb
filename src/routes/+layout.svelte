<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<nav class="w-full">
	<div class="flex w-full flex-row items-center gap-4">
		<div><a href="/" class="text-gray-800 hover:text-blue-600">home</a></div>
		<div><a href="/docs" class="text-gray-800 hover:text-blue-600">docs</a></div>
		<div><a href="/admin" class="text-gray-800 hover:text-blue-600">admin</a></div>
		<div><a href="/create-doc" class="text-gray-800 hover:text-blue-600">create-doc</a></div>
		<div><a href="/attach-test" class="text-gray-800 hover:text-blue-600">attach-test</a></div>

		<div class="ml-auto">
			<a href="https://github.com/cognominal/sb">
				<img src="/github-mark/github-mark.svg" class="h-6 w-auto sm:h-8" alt="GitHub Logo" />
			</a>
		</div>
	</div>
</nav>
{@render children()}
