<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<nav class="w-full">
  <div class="flex flex-row gap-4 items-center w-full">
    <div><a href="/" class="text-gray-800 hover:text-blue-600">home</a></div>
    <div><a href="/docs" class="text-gray-800 hover:text-blue-600">docs</a></div>
    <div class="ml-auto">
      <a href="https://github.com/cognominal/sb">
        <img src="github-mark/github-mark.svg" class="h-6 sm:h-8 w-auto" alt="GitHub Logo" />
      </a>
    </div>
  </div>
</nav>
{@render children()}
