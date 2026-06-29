import type { Lang, Localised, Status } from './types';

export const DEFAULT_LANGUAGE: Lang = 'en';
export const AVAILABLE_LANGUAGES: Lang[] = ['en', 'cy'];

/** Select localised text with fallback to English when the chosen language is empty. */
export function t(text: Localised | undefined, lang: Lang): string {
  if (!text) return '';
  return (text[lang] && text[lang].trim()) || text.en || text.cy || '';
}

/** Read the language from a ?lang= query string, validated against config. */
export function langFromQuery(search: string, available: Lang[], fallback: Lang): Lang {
  const params = new URLSearchParams(search);
  const value = params.get('lang') as Lang | null;
  return value && available.includes(value) ? value : fallback;
}

export const STRINGS: Record<string, Localised> = {
  siteTitle: { en: 'Public backlog', cy: 'Ôl-groniad cyhoeddus' },
  skipToContent: { en: 'Skip to main content', cy: 'Neidio i\u2019r prif gynnwys' },
  aboutHeading: { en: 'About this board', cy: 'Am y bwrdd hwn' },
  aboutBody: {
    en: 'This board shows what we are considering, building, have queued and have decided against. It is built from our public GitHub issues. Upvotes are a signal the team weighs, not an automatic decision.',
    cy: 'Mae\u2019r bwrdd hwn yn dangos yr hyn rydym yn ei ystyried, yn ei adeiladu, sydd yn y rhes ac yr ydym wedi penderfynu yn ei erbyn. Caiff ei adeiladu o\u2019n materion GitHub cyhoeddus. Mae pleidleisiau yn arwydd y mae\u2019r tim yn ei bwyso, nid penderfyniad awtomatig.',
  },
  suggest: { en: 'Suggest a feature', cy: 'Awgrymu nodwedd' },
  suggestHelp: {
    en: 'Opens a form on GitHub. New ideas are reviewed before they appear here.',
    cy: 'Yn agor ffurflen ar GitHub. Adolygir syniadau newydd cyn iddynt ymddangos yma.',
  },
  configNotice: {
    en: 'This fork is not configured yet. Set the GitHub owner and repository in config.json.',
    cy: 'Nid yw\u2019r fforc hon wedi\u2019i ffurfweddu eto. Gosodwch berchennog a storfa GitHub yn config.json.',
  },
  empty: { en: 'Nothing here right now.', cy: 'Dim byd yma ar hyn o bryd.' },
  votesLabel: { en: 'people support this', cy: 'o bobl yn cefnogi hwn' },
  upvote: { en: 'Upvote on GitHub', cy: 'Pleidleisio ar GitHub' },
  upvoteHelp: {
    en: 'A free GitHub account is needed. Your vote is registered on GitHub.',
    cy: 'Mae angen cyfrif GitHub am ddim. Cofnodir eich pleidlais ar GitHub.',
  },
  rationale: { en: 'Why this is parked', cy: 'Pam mae hwn wedi\u2019i barcio' },
  rationaleMissing: { en: 'No rationale recorded yet.', cy: 'Dim rhesymeg wedi\u2019i chofnodi eto.' },
  lastUpdated: { en: 'Last updated', cy: 'Diweddarwyd ddiwethaf' },
  stale: { en: 'This has not moved recently.', cy: 'Nid yw hwn wedi symud yn ddiweddar.' },
  translationPending: { en: 'Welsh translation pending.', cy: 'Cyfieithiad Saesneg yn yr arfaeth.' },
  filterAll: { en: 'All tags', cy: 'Pob tag' },
  filterLabel: { en: 'Filter by tag', cy: 'Hidlo yn ol tag' },
  staleSnapshot: {
    en: 'This board may be out of date. We could not refresh it from GitHub.',
    cy: 'Efallai bod y bwrdd hwn yn hen. Ni allem ei adnewyddu o GitHub.',
  },
  langEn: { en: 'English', cy: 'English' },
  langCy: { en: 'Cymraeg', cy: 'Cymraeg' },
  footerAccessibility: { en: 'Accessibility statement', cy: 'Datganiad hygyrchedd' },
  footerPrivacy: { en: 'Privacy', cy: 'Preifatrwydd' },
  backToTop: { en: 'Back to top', cy: 'Yn ol i\u2019r brig' },
};

export const COLUMN_TITLES: Record<Status, Localised> = {
  considering: { en: 'New ideas being considered', cy: 'Syniadau newydd yn cael eu hystyried' },
  'in-progress': { en: 'In progress', cy: 'Ar y gweill' },
  backlog: { en: 'Backlog', cy: 'Ol-groniad' },
  parked: { en: 'Not being considered right now', cy: 'Heb eu hystyried ar hyn o bryd' },
  shipped: { en: 'Recently shipped', cy: 'Wedi\u2019u cyflawni\u2019n ddiweddar' },
};

export const COLUMN_DESCRIPTIONS: Record<Status, Localised> = {
  considering: { en: 'Ideas we are weighing up. Upvote to show support.', cy: 'Syniadau rydym yn eu pwyso. Pleidleisiwch i ddangos cefnogaeth.' },
  'in-progress': { en: 'Work under way now.', cy: 'Gwaith ar y gweill nawr.' },
  backlog: { en: 'Queued work, in priority order.', cy: 'Gwaith yn y rhes, yn nhrefn blaenoriaeth.' },
  parked: { en: 'Things we have decided against for now, with reasons.', cy: 'Pethau yr ydym wedi penderfynu yn eu herbyn am nawr, gyda rhesymau.' },
  shipped: { en: 'Recently delivered work.', cy: 'Gwaith a gyflawnwyd yn ddiweddar.' },
};
