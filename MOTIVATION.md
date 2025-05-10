There are good online translations of text. There are ok translation tools. But
I don't know any online tool that uses existing good translations to learn a
language for someone of intermediate level. This tool wants to address that
need.

I asked grok to pair each sentence of the [solzhenitsyn address](
https://www.americanrhetoric.com/speeches/alexandersolzhenitsynharvard.htm)
with its translation. The format it used will become the basis to handle other
translations.

My tool allows to show the original text and focus to any sentence to display
its translation. One can click on any word and get the corresponding wiktionary
entry of the word in its flexed form on a side panel. Only the translation
subsection are opened. Later the unflexed form will be available as well. The
difficulty is that a word can have many translations so many flexed/unflexed
pairs.

Eventually, the user will be able get the wiktionary word in the
language of its choice.

The wiktionary words are cached on a database.

Currently the columns of the db are :

* word : the wiktionary word
* lang : the language for that word. That allow to acess the right section of the wiktionary page. For example there can be a bulgarian and a russian section for a given word in cyrillic.
* tlang : the language of the wiktionary page
* content : the section of the wiktionary page to be cached as per `lang`.

I want the tool to be a [spaced repetion learning](https://en.wikipedia.org/wiki/Spaced_repetition) one but I got side tracked by the wiktionary support.
On the other hand, my tool (translations + wiktionary) will eventually provide more context than mere than SRL flashcards.

