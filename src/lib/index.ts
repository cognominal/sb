export { cleanProcessedHtml } from '$lib/utils.js';
export { handleClick, handleClickTargetLangWord, getAndProcessDefinition } from '$lib/eventHandlers.js';
export { type PageState, initPageState } from '$lib/PageState.svelte.js';

export type LangCode = 'en' | 'ru' | 'fr' | 'de' | 'es';
export const langs: Record<LangCode, Record<LangCode, string>> = {
    en: { ru: "russian", en: "english", de: "german", fr: "french", es: "spanish" },
    ru: { ru: "русский", en: "английский", de: "немецкий", fr: "французский", es: "испанский" },
    fr: { ru: "russe", en: "anglais", de: "allemand", fr: "français", es: "espagnol" },
    de: { ru: "russisch", en: "englisch", de: "deutsch", fr: "französisch", es: "spanisch" },
    es: { ru: "ruso", en: "inglés", de: "alemán", fr: "francés", es: "español" }
};

let targetLanguages: LangCode[] = ['ru']

export const isTargetLanguage = (lang: LangCode): boolean => {
    return targetLanguages.includes(lang);
}
