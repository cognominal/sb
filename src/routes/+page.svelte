<script lang="ts">
	import { marked } from 'marked';

	const txt = `
# Statement of purpose

This web app uses the [wiktionary](https://en.wikipedia.org/wiki/Wiktionary) as a tool for people of intermediate level to learn a language. This means learning the vocabulary about language. You are provided with a corpus of
translated text.

## target and proxy languages

The target language is the language to learn.
A proxy language is a language used to learn th target language.
The student uses a proxy language to learn a target language. An important step is to be able to
use the wiktionary in the target language to learn it. The proxy language may not be the native
language of the student so the student may improve his proxy language proficiency as well.

## Clicking words

The student will click on words to get the wiktionay pane with the
translation section expanded.

## Word corpus

From this corpus we calculate the frequency of each non inflected word. 

## The wiktionary

The wiktionary is a dictionary that provides the meaning of words in many languages. It uses linguistic terms to describe the said words
To use the wiktionary in the target language, you must learn
that vocabulary. Or 



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
