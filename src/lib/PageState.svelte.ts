
// the selection of a `word` in the document or the change of `wlang` will trigger the search
// of the `wordDefinition` in the database or fetch it from the 
// Wiktionary, according to  `wlang`. The selected word is in the
// `selectedElement` that is set in red.
// The close button in the WiktDefinition component will 
//  close the said component.

import { type LangCode } from '$lib';

export type PageState = {
    selectedWord: string | null;
    selectedElement: HTMLElement | null;
    wordDefinition: string | null;
    iframeLoading: boolean;
    wiktionaryPanelClosed: boolean;
    lang: LangCode;         // lang of the studied text
    wlang: LangCode;        // lang of wiktionary entry
    documentContent: string | null;
}

export function initPageState() : PageState {
    return {
        selectedWord: null,
        selectedElement: null,
        wordDefinition: null,
        iframeLoading: true,
        wiktionaryPanelClosed: true,
        lang: 'ru',         // lang of the studied text
        wlang: 'en',        // lang of wiktionary entry
        documentContent: null
    };
}


// export class PageState {
//     selectedWord = $state<string | null>(null);
//     selectedElement = $state<HTMLElement | null>(null);
//     wordDefinition = $state<string | null>(null);
//     iframeLoading = $state(true);
//     wiktionaryPanelClosed = $state(true);
//     lang = $state<string>('ru')         // lang of the studied text
//     wlang = $state<string>('en')        // lang of wiktionary entry
//     documentContent = $state<string | null>(null);
// }
