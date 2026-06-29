import type { Language, Localised } from './types';

// Every interface string exists in both languages (specs/08). Welsh and
// English are equal; neither is a partial translation. British English copy,
// no em dashes, no exclamation marks (docs/BUILD_BRIEF.md editorial rules).
export const strings = {
  skipToContent: {
    en: 'Skip to main content',
    cy: "Neidio i'r prif gynnwys",
  },
  pageTitle: {
    en: 'Public backlog',
    cy: 'Ol-groniad cyhoeddus',
  },
  introHeading: {
    en: 'What we are considering, building and have decided',
    cy: "Yr hyn rydym yn ei ystyried, yn ei adeiladu ac wedi penderfynu arno",
  },
  introBody: {
    en: 'This board shows what our team is considering, what we are building, what is queued and in what order, and what we are not pursuing right now. It is drawn from our public GitHub issues and refreshed regularly.',
    cy: "Mae'r bwrdd hwn yn dangos yr hyn y mae ein tim yn ei ystyried, yr hyn rydym yn ei adeiladu, yr hyn sydd yn y ciw ac ym mha drefn, a'r hyn nad ydym yn mynd ar ei ol ar hyn o bryd. Daw o'n materion GitHub cyhoeddus ac fe'i diweddarir yn rheolaidd.",
  },

  // Column titles
  col_considering_title: {
    en: 'New ideas being considered',
    cy: "Syniadau newydd dan ystyriaeth",
  },
  col_considering_desc: {
    en: 'Recent ideas we are weighing up. Not yet committed.',
    cy: "Syniadau diweddar rydym yn eu pwyso a'u mesur. Heb ymrwymo eto.",
  },
  col_inprogress_title: {
    en: 'In progress',
    cy: 'Ar y gweill',
  },
  col_inprogress_desc: {
    en: 'Work we are actively building.',
    cy: 'Gwaith rydym wrthi yn ei adeiladu.',
  },
  col_backlog_title: {
    en: 'Backlog',
    cy: 'Ol-groniad',
  },
  col_backlog_desc: {
    en: 'The queue, ordered by priority. Each item shows how much support it has.',
    cy: "Y ciw, wedi'i drefnu yn ol blaenoriaeth. Mae pob eitem yn dangos faint o gefnogaeth sydd iddi.",
  },
  col_parked_title: {
    en: 'Not being considered right now',
    cy: 'Ddim dan ystyriaeth ar hyn o bryd',
  },
  col_parked_desc: {
    en: 'Things we have looked at and decided against for the time being, with a short reason.',
    cy: "Pethau rydym wedi edrych arnynt ac wedi penderfynu yn eu herbyn am y tro, gyda rheswm byr.",
  },
  col_shipped_title: {
    en: 'Recently shipped',
    cy: 'Wedi eu cyflawni yn ddiweddar',
  },
  col_shipped_desc: {
    en: 'Work we have delivered.',
    cy: 'Gwaith rydym wedi ei gyflawni.',
  },

  emptyColumn: {
    en: 'There is nothing here at the moment.',
    cy: 'Nid oes dim yma ar hyn o bryd.',
  },

  // About this board
  aboutHeading: {
    en: 'About this board',
    cy: "Am y bwrdd hwn",
  },
  aboutBody: {
    en: 'Items appear only after a person on our team has reviewed them, so the board stays clear and useful. The further an item is from In progress, the less certain it is. Votes are a signal the team weighs up, not an automatic decision.',
    cy: "Mae eitemau yn ymddangos dim ond ar ol i rywun ar ein tim eu hadolygu, fel bod y bwrdd yn aros yn glir ac yn ddefnyddiol. Po bellaf yw eitem o Ar y gweill, y lleiaf sicr ydyw. Mae pleidleisiau yn arwydd y mae'r tim yn ei bwyso a'i fesur, nid penderfyniad awtomatig.",
  },

  // Voting
  votingLimitations: {
    en: 'Voting needs a free GitHub account. Your vote is registered on GitHub, and each account counts once.',
    cy: "Mae angen cyfrif GitHub am ddim i bleidleisio. Cofrestrir eich pleidlais ar GitHub, ac mae pob cyfrif yn cyfrif unwaith.",
  },
  upvoteHelper: {
    en: 'You need a free GitHub account to add your support.',
    cy: 'Mae angen cyfrif GitHub am ddim arnoch i ychwanegu eich cefnogaeth.',
  },
  votesReadonlyLabel: {
    en: 'support',
    cy: 'o gefnogaeth',
  },

  // Suggest a feature
  suggestLabel: {
    en: 'Suggest a feature',
    cy: 'Awgrymu nodwedd',
  },
  suggestHelper: {
    en: 'Opens a short form on GitHub. New suggestions are reviewed before they appear here.',
    cy: "Yn agor ffurflen fer ar GitHub. Adolygir awgrymiadau newydd cyn iddynt ymddangos yma.",
  },
  configNotice: {
    en: 'This is a fresh fork. Set your GitHub owner and repository in config.json to enable suggestions.',
    cy: "Fforch newydd yw hon. Gosodwch eich perchennog a'ch ystorfa GitHub yn config.json i alluogi awgrymiadau.",
  },

  // Filtering
  filterHeading: {
    en: 'Filter by tag',
    cy: 'Hidlo yn ol tag',
  },
  filterAll: {
    en: 'All',
    cy: 'Pob un',
  },
  filterClear: {
    en: 'Clear filter',
    cy: "Clirio'r hidlydd",
  },

  // Language
  languageToggleToCy: {
    en: 'Cymraeg',
    cy: 'Cymraeg',
  },
  languageToggleToEn: {
    en: 'English',
    cy: 'English',
  },
  languageToggleLabel: {
    en: 'Choose a language',
    cy: 'Dewiswch iaith',
  },

  translationPending: {
    en: 'Translation pending. Showing the available language.',
    cy: "Cyfieithiad ar y gweill. Yn dangos yr iaith sydd ar gael.",
  },

  // Freshness and staleness
  lastUpdatedLabel: {
    en: 'Last updated',
    cy: 'Diweddarwyd ddiwethaf',
  },
  staleInProgress: {
    en: 'This has not moved for a while.',
    cy: 'Nid yw hyn wedi symud ers tro.',
  },
  boardUpdated: {
    en: 'Board last refreshed',
    cy: 'Bwrdd wedi ei adnewyddu ddiwethaf',
  },
  staleSnapshotNotice: {
    en: 'This board has not refreshed recently, so some details may be out of date.',
    cy: "Nid yw'r bwrdd hwn wedi adnewyddu yn ddiweddar, felly efallai bod rhai manylion wedi dyddio.",
  },
  contentErrorRationale: {
    en: 'A reason for this decision has not been recorded yet.',
    cy: 'Nid yw rheswm dros y penderfyniad hwn wedi ei gofnodi eto.',
  },
  rationaleHeading: {
    en: 'Why this is not being pursued',
    cy: 'Pam nad yw hyn yn cael ei ddilyn',
  },

  // Footer
  accessibilityStatement: {
    en: 'Accessibility statement',
    cy: 'Datganiad hygyrchedd',
  },
  privacyNote: {
    en: 'Privacy note',
    cy: 'Nodyn preifatrwydd',
  },
  backToTop: {
    en: 'Back to top',
    cy: "Yn ol i'r brig",
  },
  discussOnGithub: {
    en: 'Read and discuss on GitHub',
    cy: 'Darllen a thrafod ar GitHub',
  },
} satisfies Record<string, Localised>;

export type StringKey = keyof typeof strings;

/** Select a localised value, falling back to English when Welsh is empty. */
export function localise(value: Localised, lang: Language): string {
  if (lang === 'cy') {
    return value.cy && value.cy.length > 0 ? value.cy : value.en;
  }
  return value.en && value.en.length > 0 ? value.en : value.cy;
}

/**
 * Like {@link localise} but also reports the language actually shown, so the
 * rendered text can carry the correct `lang` attribute when a fallback is in
 * use (specs/08 language-of-parts).
 */
export function localiseWithLang(
  value: Localised,
  lang: Language,
): { text: string; lang: Language } {
  if (lang === 'cy') {
    return value.cy && value.cy.length > 0
      ? { text: value.cy, lang: 'cy' }
      : { text: value.en, lang: 'en' };
  }
  return value.en && value.en.length > 0
    ? { text: value.en, lang: 'en' }
    : { text: value.cy, lang: 'cy' };
}

/** Translate an interface string key for the active language. */
export function t(key: StringKey, lang: Language): string {
  return localise(strings[key], lang);
}

/** Whether a localised value is missing the requested language (so a
 * "translation pending" note should be shown). */
export function isTranslationMissing(value: Localised, lang: Language): boolean {
  return !value[lang] || value[lang].length === 0;
}

/** Accessible vote announcement, for example "41 people support this". */
export function voteAnnouncement(count: number, lang: Language): string {
  if (lang === 'cy') {
    return count === 1
      ? `Mae 1 person yn cefnogi hyn`
      : `Mae ${count} o bobl yn cefnogi hyn`;
  }
  return count === 1
    ? `1 person supports this`
    : `${count} people support this`;
}

/** Accessible name for an interactive upvote control. */
export function upvoteActionLabel(
  count: number,
  title: string,
  lang: Language,
): string {
  if (lang === 'cy') {
    return `Cefnogi "${title}" ar GitHub. ${voteAnnouncement(count, 'cy')} ar hyn o bryd.`;
  }
  return `Support "${title}" on GitHub. ${voteAnnouncement(count, 'en')} so far.`;
}
