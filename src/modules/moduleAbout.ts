import type { TranslationKey } from "../i18n";

/// Searchable "About this tool" copy for a module: an intro and question/answer pairs.
export type ModuleAbout = {
  intro: TranslationKey;
  faq: { question: TranslationKey; answer: TranslationKey }[];
};

type AboutPrefix = TranslationKey extends infer K ? (K extends `about${infer P}Intro` ? P : never) : never;

/// Keys follow `about<Prefix>Intro`, `…Q1`/`…A1`, `…Q2`/`…A2` in `Language/ModuleAbout.ts`.
export const moduleAbout = (prefix: AboutPrefix, faqCount = 2): ModuleAbout => ({
  intro: `about${prefix}Intro`,
  faq: Array.from({ length: faqCount }, (_, i) => ({
    question: `about${prefix}Q${i + 1}` as TranslationKey,
    answer: `about${prefix}A${i + 1}` as TranslationKey,
  })),
});
