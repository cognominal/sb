<script lang="ts">
	import { marked } from 'marked';

	const txt = `
# Statement of purpose

The student uses a proxy language to learn a target language. An important step is to be able to
use the [wiktionary](https://en.wikipedia.org/wiki/Wiktionary) in the target language to learn it. The proxy language may not be the native
language of the student so the student may improve his proxy language profiiency as well.

This web app uses the wiktionary as a tool for people of intermediate level to learn a target
language. This means learning the vocabulary about language. You are provided with a corpus of
translated text.
From this corpus we calculate the frequency of each unflexed word. verb, noun, adjective, pronoun.

Using the word frequency, we will be able to rate the difficulty of sentences. Also for each word
we can track the occurrences, and present them to the learner

Eventually a system of [spaced repetition learning](https://en.wikipedia.org/wiki/Spaced_repetition) will be implemented.

Choose a [text](/docs) to learn from.
`;
	const html = marked.parse(txt);
</script>

<main class="m-5">
	<article class="prose lg:prose-xl">
		{@html html}
	</article>
</main>
