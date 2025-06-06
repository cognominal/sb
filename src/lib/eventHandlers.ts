import { type PageState } from '$lib';
import { type LangCode, isTargetLanguage } from '$lib';

export function handleClickTargetLangWord(event: MouseEvent | KeyboardEvent, pageState: PageState): boolean {

    const target = event.target as HTMLElement;
    if (!isTargetLanguage(target.getAttribute("data-lang") as LangCode)) return false;

    const word = target.getAttribute("data-word");
    if (word) {
        if (pageState.selectedElement)
            pageState.selectedElement.style.removeProperty('color');
        pageState.selectedElement = target;
        pageState.selectedWord = word;
        getAndProcessDefinition(pageState);
    }
    return true;
}

//  A language section is a russian sentence and its translation.
// When clicking a section but not a russian word, we grey out all the other sections and hide their translation

export function handleClickSection(event: MouseEvent | KeyboardEvent, pageState: PageState): boolean {
    let target = event.target as HTMLElement;
    if (target.hasAttribute('data-word')) {
        target = target.parentElement!;
    }

    if (target.classList.contains('break-words')) {
        document.querySelectorAll('li.break-words').forEach(li => {

            if (li === target) {
                // For the target li, remove color property and set display to inline for all child elements except strong
                li.querySelectorAll('*').forEach(element => {
                    if (pageState.selectedElement === element) {
                        (element as HTMLElement).style.color = '#EE0000';
                    } else {
                        (element as HTMLElement).style.removeProperty('color');
                    }
                    // Set display to inline for all elements except strong
                    if (element.tagName.toLowerCase() !== 'strong') {
                        (element as HTMLElement).style.display = 'inline';
                    }
                });

                // Add a solid black border to the target li
                (li as HTMLElement).style.border = '1px solid black';
                // Remove any filter for the target li
                (li as HTMLElement).style.removeProperty('filter');
            } else {
                // Set non-target li's to grey and remove any border
                (li as HTMLElement).style.color = '#9ca3af'; // grey color
                (li as HTMLElement).style.border = 'none'; // remove border
                // Set filter to 30% opacity for non-target li's
                (li as HTMLElement).style.filter = 'opacity(65%)';

                // Find all strong elements within this li
                li.querySelectorAll('strong').forEach(strong => {
                    strong.style.display = 'none'
                    // Check if the strong element contains the text "English:"
                    if (strong.textContent && strong.textContent.trim() === 'English:') {
                        // Hide all next siblings of the strong element
                        let nextSibling = strong.nextElementSibling;
                        while (nextSibling) {
                            (nextSibling as HTMLElement).style.display = 'none';
                            nextSibling = nextSibling.nextElementSibling;
                        }
                    }
                });
            }
        });
    }

    return true;
}


export function handleClick(event: MouseEvent | KeyboardEvent, pageState: PageState) {
    handleClickTargetLangWord(event, pageState);
    if (handleClickSection(event, pageState)) return;

}

// get the definition for `word` in `lang` using the `wlang` language wiktionary
async function getDefinition(word: string, lang: string, wlang: string): Promise<string> {
    const form = new FormData();
    form.append("word", word);
    form.append("lang", lang);
    form.append("wlang", lang);

    try {
        const response: Response = await fetch("?/getDefinition", {
            method: "POST",
            body: form,
        });
        const result: { data: string } = await response.json();
        const parsed = JSON.parse(result.data);
        // why parsed has this form
        // [
        //     {
        //         "word": 1,
        //         "indices": 2,
        //         "processedWiktionaryPage": 3
        //     },
        //     "это",
        //     [],
        //     "<!DOCTYPE ..."
        // ]


        let defn = parsed[3];
        return defn

    } catch (error) { return "WTF" }
}

export async function getAndProcessDefinition(pageState: PageState) {
    try {
        const word = pageState.selectedWord;
        // pageState.selectedWord = word;
        pageState.iframeLoading = true;
        console.log(`getAndProc Fetching definition for word: ${word},lang: ${pageState.lang}, wlang: ${pageState.wlang}`);

        getDefinition(word!, pageState.lang, pageState.wlang).then((defn) => {
            if (defn) {
                pageState.wordDefinition = defn;
            } else {
                pageState.wordDefinition = "<div class='p-4 text-center text-red-600'>Definition not found</div>";
            }
        })
    } catch (error) {
        console.error("Error fetching definition:", error);
        pageState.wordDefinition = "<div class='p-4 text-center text-red-600'>Error loading definition</div>";
    }

}
