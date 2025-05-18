import { JSDOM } from 'jsdom';
import {  storeWordDataIndB, getWordDataFromDbOrNull, type WordData, fetchWiktionaryPageAndProcessIt, findRussianWords } from '$lib/server';
import {type  LangCode } from '$lib';

function removeElements(document: Document, selector: string): void {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.parentNode?.removeChild(element);
    });
}

function getTextNodes(element: Element): Node[] {
    const textNodes: Node[] = [];
    function collectTextNodes(node: Node): void {
        if (node.nodeType === 3) {
            if (node.textContent && node.textContent.trim() !== '') {
                textNodes.push(node);
            }
        } else if (node.nodeType === 1) {
            const tagName = (node as Element).tagName.toLowerCase();
            if (["script", "style", "textarea"].includes(tagName)) {
                return;
            }
            for (let i = 0; i < node.childNodes.length; i++) {
                collectTextNodes(node.childNodes[i]);
            }
        }
    }
    collectTextNodes(element);
    return textNodes;
}

/**
 * Processes HTML content to identify and wrap Russian words
 *
 * @param htmlContent - The HTML content to process
 * @param fetchDefinitions - Whether to fetch definitions for words not in the database
 * @returns A promise that resolves to an object containing the processed HTML and the list of Russian words found
 */
export async function processContent(
    htmlContent: string,
    lang: LangCode, wlang: LangCode,
    fetchDefinitions: boolean = true
): Promise<{ html: string; words: string[] }> {
    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;
    removeElements(document, 'script');
    const textNodes = getTextNodes(document.body);
    const uniqueWords = new Set<string>();
    for (const node of textNodes) {
        if (!node.textContent) continue;
        const russianWords = findRussianWords(node.textContent);
        if (russianWords.length === 0) continue;
        russianWords.forEach(word => uniqueWords.add(word));
        let newHtml = node.textContent;
        const sortedWords = [...russianWords].sort((a, b) => b.length - a.length);
        for (const word of sortedWords) {
            const regex = new RegExp(`(${word})`, 'g');
            newHtml = newHtml.replace(regex, `<span class=\"russian-word\" data-lang=\"ru\" data-word=\"$1\">$1</span>`);
        }
        const temp = document.createElement('div');
        temp.innerHTML = newHtml;
        const parent = node.parentNode;
        if (parent) {
            while (temp.firstChild) {
                parent.insertBefore(temp.firstChild, node);
            }
            parent.removeChild(node);
        }
    }
    const wordsArray = Array.from(uniqueWords);
    if (fetchDefinitions) {
        const wordsToFetch = wordsArray.filter(word => !getWordDataFromDbOrNull(word, lang, wlang));
        if (wordsToFetch.length > 0) {
            console.log(`Fetching definitions for ${wordsToFetch.length} words...`);
            for (const word of wordsToFetch) {
                try {
                    console.log(`Fetching definition for \"${word}\"...`);
                    const { status, processedWiktionaryPage } = await fetchWiktionaryPageAndProcessIt(word, lang, wlang);
                    let wd: WordData;
                    if (status !== 'success') {
                        wd = { word, lang, wlang, content: processedWiktionaryPage! };
                    } else {
                        wd = { word, lang, wlang, content: "" };
                    }
                    await storeWordDataIndB(wd);
                    console.log(`Stored definition for \"${word}\"`);
                } catch (error) {
                    console.error(`Error processing word \"${word}\":`, error);
                }
            }
        }
    }
    const processedHtml = dom.serialize();
    return {
        html: processedHtml,
        words: wordsArray
    };
}
