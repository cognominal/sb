# Motivation

## I need a tool

There are good online translations of text. There are ok translation tools. But I don't know any online tool that uses existing good translations to learn a language for someone of intermediate level. This tool wants to address that need.

## pairing sentences with grok

I asked grok to pair each sentence of the [solzhenitsyn address](
https://www.americanrhetoric.com/speeches/alexandersolzhenitsynharvard.htm) with its translation. The format it used will become the basis to handle other translations.

I call this format paired text. But it could associate material translated in many languages. It looks like that.

```html
<ol class="marker:text-secondary">
	<li class="break-words">
		<strong>Russian:</strong>
		<span data-lang="ru" data-word="я" data-common="true">Я</span>
        <strong>English:</strong>
        <span data-lang="en-word">I</span>
    </li>
</ol>      
```

But instead of a single word and its translation. There are sentences as spans of words


## An UI

My tool will allow to show the original text and focus to any sentence to display its translation. One can click on any word and get the corresponding wiktionary entry of the word in its flexed form on a side panel. Only the translation subsection are opened. 

## Flexed/unflexed

Later the unflexed form will be available as well on the witionary side panel. The difficulty is that a word can have many translations so many flexed/unflexed
pairs.

Example ?

## Accessing the wiktionary and caching it

Eventually, the user will be able get the wiktionary word in the
language of its choice.

The wiktionary words are cached on a database.

Currently the columns of the db are :

* word : the wiktionary word
* lang : the language for that word. That allow to acess the right section of the wiktionary page. For example there can be a bulgarian and a russian section for a given word in cyrillic.
* tlang : the language of the wiktionary page
* content : the section of the wiktionary page to be cached as per `lang`.

I want the tool to be a [spaced repetion learning](https://en.wikipedia.org/wiki/Spaced_repetition) one but I got side tracked by the wiktionary support. On the other hand, my tool (translations + wiktionary) will eventually provide more context than mere than SRL flashcards.

## A tool for pairing sentences

It is currently html only. I have not yet commited it. It shows side by side in iframes a text and its translation. It allows to type selectors to weed out uneeded material so that the original and its translation can be paired sentence by sentence.


## A useful ressource

But I want to have right away many text translated to create a table for them and a UI to access them. I found something that I can easily exploit.

https://pastebin.com/raw/aQAnpzQr
https://frequencylists.blogspot.com/2016/08/5000-russian-sentences-sorted-from.html