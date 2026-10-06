import type { ReactNode, RefObject } from "react";
import type { TranslationKey } from "../../i18n";

export interface IntuitionSection {
  id: string;
  titleKey: TranslationKey;
  summaryKey?: TranslationKey;
  bodyKey?: TranslationKey;
  formula?: string;
  exampleKey?: TranslationKey;
  content?: ReactNode;
}

export interface IntuitionDocument {
  titleKey: TranslationKey;
  sections: readonly IntuitionSection[];
}

export interface IntuitionContextValue {
  document: IntuitionDocument;
  panelId: string;
  open: boolean;
  sectionId?: string;
  request: number;
  show: (sectionId?: string) => void;
  close: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}
