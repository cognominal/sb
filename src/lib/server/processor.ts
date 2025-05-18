/**
 * Content Processing Module
 * =======================
 *
 * This module provides functionality for processing HTML content containing Russian text.
 * It identifies Russian words, wraps them in interactive spans, and fetches their definitions
 * from Wiktionary when needed.
 *
 * Key Features:
 * - Identifies Russian words in HTML content using Cyrillic character detection
 * - Wraps Russian words in <span> elements with appropriate classes and data attributes
 * - Fetches and stores Wiktionary definitions for Russian words
 * - Processes English translations and wraps them in appropriate elements
 * - Maintains a database of words and their definitions for efficient retrieval
 *
 * Main Functions:
 * - findRussianWords: Extracts Russian words from text using regex
 * - fetchWiktionaryContent: Retrieves definitions from Wiktionary for a given word
 * - processContent: Main function that processes HTML content, identifies words,
 *   and optionally fetches definitions
 *
 * The module uses JSDOM for HTML parsing and manipulation, allowing it to work in
 * both browser and Node.js environments.
 */

import { JSDOM } from 'jsdom';
import { storeWordDataIndB, getWordDataFromDbOrNull, type WordData, processWiktionary, } from '$lib/server';
import { type LangCode, langs } from '$lib';


/**
 * Removes all elements matching a CSS selector from a document
 *
 * @param document - The document to modify
 * @param selector - CSS selector for elements to remove
 */
function removeElements(document: Document, selector: string): void {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.parentNode?.removeChild(element);
    });
}

/**
 * Finds all Russian words in a given text string
 *
 * @param text - The text to search for Russian words
 * @returns An array of Russian words found in the text
 */
export function findRussianWords(text: string): string[] {
    // Regular expression to match Cyrillic characters (Russian alphabet)
    const russianPattern = /[\u0430-\u044f\u0451\u0410-\u042f\u0401]+/g;
    const matches = text.match(russianPattern) || [];
    return matches;
}

export type ProcessedWiktPage = { status: string, processedWiktionaryPage?: string }

/**
 * Fetches content from Wiktionary for a given Russian word
 *
 * @param word - The Russian word to look up
 * @returns A promise that resolves to the processed HTML content from Wiktionary
 */
export async function fetchWiktionaryPageAndProcessIt(word: string, lang: LangCode, wlang: LangCode): Promise<ProcessedWiktPage> {
    try {
        // Encode the word for use in a URL
        const encodedWord = encodeURIComponent(word);

        // Construct the Wiktionary URL
        const url = `https://${wlang}.wiktionary.org/wiki/${encodedWord}`;

        // Fetch the content
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch Wiktionary content: ${response.statusText}`);
        }

        // Get the HTML content
        const htmlContent = await response.text();

        // Process the content to extract only the Russian section and transform it
        const processedWiktionaryPage = processWiktionary(htmlContent, lang, wlang);
        console.log(`Fetched definition for "${word}"`);



        return { status: 'success', processedWiktionaryPage };
    } catch (error) {
        console.error('Error fetching Wiktionary content:', error);
        return {
            status: `Error fetching definition for "${word}": ${error instanceof Error ? error.message : String(error)} }`
        }
    }
}



/**
 * Gets all text nodes in an element
 *
 * @param element - The element to search for text nodes
 * @returns An array of text nodes
 */
function getTextNodes(element: Element): Node[] {
    const textNodes: Node[] = [];

    // Function to recursively collect text nodes
    function collectTextNodes(node: Node): void {
        if (node.nodeType === 3) { // Text node
            // Only include non-empty text nodes
            if (node.textContent && node.textContent.trim() !== '') {
                textNodes.push(node);
            }
        } else if (node.nodeType === 1) { // Element node
            // Skip certain elements
            const tagName = (node as Element).tagName.toLowerCase();
            if (['script', 'style', 'textarea'].includes(tagName)) {
                return;
            }

            // Process child nodes
            for (let i = 0; i < node.childNodes.length; i++) {
                collectTextNodes(node.childNodes[i]);
            }
        }
    }

    collectTextNodes(element);
    return textNodes;
}

/**
 * Processes English translations in HTML content
 *
 * @param htmlContent - The HTML content to process
 * @returns The processed HTML with wrapped English translations
 */
export function processEnglishTranslations(htmlContent: string): string {
    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;

    // Find all elements with the class "translation"
    const translationElements = document.querySelectorAll('.translation');

    translationElements.forEach(element => {
        if (!element.textContent) return;

        // Extract the English translation
        const englishText = element.textContent.trim();

        // Wrap each word in a span
        const words = englishText.split(/\s+/);
        const wrappedWords = words.map(word => {
            // Remove punctuation for the data attribute
            const cleanWord = word.replace(/[.,;:!?()[\]{}""'']/g, '');

            if (cleanWord) {
                return `<span class="english-word" data-lang="en" data-word="${cleanWord}">${word}</span>`;
            }
            return word;
        });

        // Replace the content with the wrapped version
        element.innerHTML = wrappedWords.join(' ');
    });

    return dom.serialize();
}


/**
 * Processes a section of HTML content to highlight and make interactive specific elements
 *
 * @param htmlContent - The HTML content to process
 * @param sectionId - The ID of the section to process
 * @returns The processed HTML with interactive elements
 */
export function processSection(htmlContent: string, sectionId: string): string {
    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;

    // Find the section
    const section = document.getElementById(sectionId);

    if (!section) {
        console.warn(`Section with ID "${sectionId}" not found`);
        return htmlContent;
    }

    // Process all links in the section
    const links = section.querySelectorAll('a');

    links.forEach(link => {
        // Add a class to the link
        link.classList.add('interactive-link');

        // Add a data attribute with the href
        link.setAttribute('data-href', link.getAttribute('href') || '');

        // Remove the href to prevent default navigation
        link.removeAttribute('href');
    });

    return dom.serialize();
}

/**
 * Extracts the main content from a Wiktionary page
 *
 * @param htmlContent - The HTML content of the Wiktionary page
 * @returns The extracted main content
 */
export function extractWiktionaryContent(htmlContent: string): string {
    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;

    // Find the main content div
    const contentDiv = document.querySelector('#mw-content-text');

    if (!contentDiv) {
        console.warn('Main content div not found');
        return htmlContent;
    }

    // Create a new document with just the content
    const newDom = new JSDOM('<!DOCTYPE html><html><head><title>Wiktionary Extract</title></head><body></body></html>');
    const newDocument = newDom.window.document;
    const newBody = newDocument.querySelector('body');

    if (newBody) {
        // Clone the content div and add it to the new document
        newBody.appendChild(contentDiv.cloneNode(true));
    }

    return newDom.serialize();
}

