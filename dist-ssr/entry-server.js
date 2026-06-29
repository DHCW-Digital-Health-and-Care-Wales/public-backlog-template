import { jsx, jsxs, Fragment } from "preact/jsx-runtime";
import { renderToString } from "preact/compat/server";
import { createContext, useState, useCallback, useEffect, useMemo, createElement, useContext, StrictMode } from "preact/compat";
const team = { "name": "Primary, Community and Mental Health", "organisation": { "en": "Digital Health and Care Wales", "cy": "Iechyd a Gofal Digidol Cymru" } };
const github = { "owner": "DHCW-Digital-Health-and-Care-Wales", "repo": "public-backlog-template", "featureTemplate": "feature_request.yml" };
const language = { "default": "en", "available": ["en", "cy"] };
const health$1 = { "freshnessWindowHours": 24 };
const rawConfig = {
  team,
  github,
  language,
  health: health$1
};
const config = rawConfig;
const generatedAt = "2026-06-29T13:02:09.715Z";
const columns = { "considering": [{ "number": 21, "url": "https://github.com/DHCW-Digital-Health-and-Care-Wales/public-backlog-template/issues/21", "status": "considering", "title": { "en": "Reminders by text message", "cy": "Reminders by text message" }, "summary": { "en": "Send appointment reminders by text message, so fewer people miss appointments.", "cy": "Anfon nodiadau atgoffa apwyntiadau drwy neges destun, fel bod llai o bobl yn methu apwyntiadau." }, "tags": ["type: reminders"], "votes": 34, "createdAt": "2026-06-10T09:00:00Z", "updatedAt": "2026-06-20T09:00:00Z", "shippedAt": null, "flags": [] }, { "number": 25, "url": "https://github.com/DHCW-Digital-Health-and-Care-Wales/public-backlog-template/issues/25", "status": "considering", "title": { "en": "Dark mode for the clinic dashboard", "cy": "Dark mode for the clinic dashboard" }, "summary": { "en": "Offer a dark colour theme for staff who work long shifts on the dashboard.", "cy": "" }, "tags": ["type: accessibility"], "votes": 12, "createdAt": "2026-06-25T09:00:00Z", "updatedAt": "2026-06-26T09:00:00Z", "shippedAt": null, "flags": ["missing-welsh"] }], "in-progress": [{ "number": 12, "url": "https://github.com/DHCW-Digital-Health-and-Care-Wales/public-backlog-template/issues/12", "status": "in-progress", "title": { "en": "Single sign-on for clinic staff", "cy": "Single sign-on for clinic staff" }, "summary": { "en": "Let clinic staff sign in once with their NHS Wales account, instead of a separate password for this service.", "cy": "Gadewch i staff clinig fewngofnodi unwaith gyda'u cyfrif GIG Cymru, yn lle cyfrinair ar wahan ar gyfer y gwasanaeth hwn." }, "tags": ["type: access"], "votes": 12, "createdAt": "2026-03-01T09:00:00Z", "updatedAt": "2026-06-22T14:00:00Z", "shippedAt": null, "flags": [] }, { "number": 9, "url": "https://github.com/DHCW-Digital-Health-and-Care-Wales/public-backlog-template/issues/9", "status": "in-progress", "title": { "en": "Bulk export of vaccination records", "cy": "Bulk export of vaccination records" }, "summary": { "en": "Export a clinic's vaccination records in a single file for audit and reporting.", "cy": "Allforio cofnodion brechu clinig mewn un ffeil ar gyfer archwilio ac adrodd." }, "tags": ["type: reporting"], "votes": 6, "createdAt": "2025-11-01T09:00:00Z", "updatedAt": "2026-02-10T11:00:00Z", "shippedAt": null, "flags": ["stale-in-progress"] }], "backlog": [{ "number": 17, "url": "https://github.com/DHCW-Digital-Health-and-Care-Wales/public-backlog-template/issues/17", "status": "backlog", "title": { "en": "Offline mode for rural clinics", "cy": "Offline mode for rural clinics" }, "summary": { "en": "Keep the service usable where the network drops, syncing records when the connection returns.", "cy": "Cadw'r gwasanaeth yn ddefnyddiadwy lle mae'r rhwydwaith yn gollwng, gan gysoni cofnodion pan ddaw'r cysylltiad yn ol." }, "tags": ["service: clinics"], "votes": 20, "createdAt": "2026-04-20T10:00:00Z", "updatedAt": "2026-06-12T10:00:00Z", "shippedAt": null, "flags": [] }, { "number": 14, "url": "https://github.com/DHCW-Digital-Health-and-Care-Wales/public-backlog-template/issues/14", "status": "backlog", "title": { "en": "Welsh-language SMS reminders by default", "cy": "Welsh-language SMS reminders by default" }, "summary": { "en": "Send reminders in a person's chosen language by default, including Welsh.", "cy": "Anfon nodiadau atgoffa yn iaith ddewisol y person yn ddiofyn, gan gynnwys Cymraeg." }, "tags": ["type: reminders", "cymraeg"], "votes": 41, "createdAt": "2026-04-15T10:00:00Z", "updatedAt": "2026-06-18T10:00:00Z", "shippedAt": null, "flags": [] }, { "number": 19, "url": "https://github.com/DHCW-Digital-Health-and-Care-Wales/public-backlog-template/issues/19", "status": "backlog", "title": { "en": "Barcode scanning for vaccine batch numbers", "cy": "Barcode scanning for vaccine batch numbers" }, "summary": { "en": "Scan the batch number from the vial barcode, instead of typing it, to cut data-entry errors.", "cy": "Sganio'r rhif swp o god bar y ffiol, yn lle ei deipio, i leihau gwallau cofnodi data." }, "tags": ["type: data-quality"], "votes": 8, "createdAt": "2026-05-02T10:00:00Z", "updatedAt": "2026-06-05T10:00:00Z", "shippedAt": null, "flags": [] }], "parked": [{ "number": 7, "url": "https://github.com/DHCW-Digital-Health-and-Care-Wales/public-backlog-template/issues/7", "status": "parked", "title": { "en": "Native mobile app", "cy": "Native mobile app" }, "summary": { "en": "Build a native iOS and Android app in addition to the website.", "cy": "Adeiladu ap brodorol iOS ac Android yn ychwanegol at y wefan." }, "tags": ["type: platform"], "votes": 15, "createdAt": "2026-02-01T10:00:00Z", "updatedAt": "2026-05-20T10:00:00Z", "shippedAt": null, "flags": [], "rationale": { "en": "The website already works well on mobile browsers, so a native app would duplicate effort for little gain right now. We will revisit this if offline needs grow.", "cy": "Mae'r wefan eisoes yn gweithio'n dda ar boryddion symudol, felly byddai ap brodorol yn dyblygu ymdrech am ychydig o fudd ar hyn o bryd. Byddwn yn ailystyried hyn os bydd anghenion all-lein yn tyfu." } }, { "number": 8, "url": "https://github.com/DHCW-Digital-Health-and-Care-Wales/public-backlog-template/issues/8", "status": "parked", "title": { "en": "Integrate with a third-party booking widget", "cy": "Integrate with a third-party booking widget" }, "summary": { "en": "Embed an external booking widget rather than building our own booking flow.", "cy": "Mewnosod teclyn archebu allanol yn hytrach nag adeiladu ein llif archebu ein hunain." }, "tags": ["type: integration"], "votes": 4, "createdAt": "2026-02-12T10:00:00Z", "updatedAt": "2026-05-22T10:00:00Z", "shippedAt": null, "flags": [], "rationale": { "en": "A third-party widget would send patient data to an external processor, which we cannot justify for this service. We will keep booking in-house.", "cy": "Byddai teclyn trydydd parti yn anfon data cleifion at brosesydd allanol, na allwn ei gyfiawnhau ar gyfer y gwasanaeth hwn. Byddwn yn cadw archebu yn fewnol." } }], "shipped": [{ "number": 30, "url": "https://github.com/DHCW-Digital-Health-and-Care-Wales/public-backlog-template/issues/30", "status": "shipped", "title": { "en": "Accessible colour contrast across the dashboard", "cy": "Accessible colour contrast across the dashboard" }, "summary": { "en": "Every text and interface element now meets WCAG 2.2 AA contrast.", "cy": "Mae pob elfen testun a rhyngwyneb bellach yn bodloni cyferbyniad WCAG 2.2 AA." }, "tags": ["type: accessibility"], "votes": 18, "createdAt": "2026-01-10T10:00:00Z", "updatedAt": "2026-05-15T10:00:00Z", "shippedAt": "2026-05-15T10:00:00Z", "flags": [] }, { "number": 28, "url": "https://github.com/DHCW-Digital-Health-and-Care-Wales/public-backlog-template/issues/28", "status": "shipped", "title": { "en": "Search clinics by postcode", "cy": "Search clinics by postcode" }, "summary": { "en": "People can now find their nearest clinic by entering a postcode.", "cy": "Gall pobl bellach ddod o hyd i'w clinig agosaf drwy nodi cod post." }, "tags": ["type: search"], "votes": 22, "createdAt": "2026-01-05T10:00:00Z", "updatedAt": "2026-03-30T10:00:00Z", "shippedAt": "2026-03-30T10:00:00Z", "flags": [] }] };
const health = { "staleInProgress": 1, "untriaged": 1, "oldestUntriagedDays": 2, "contentErrors": 1, "flags": [{ "number": 9, "flags": ["stale-in-progress"] }, { "number": 25, "flags": ["missing-welsh"] }] };
const baselineSnapshot = {
  generatedAt,
  columns,
  health
};
const strings = {
  skipToContent: {
    en: "Skip to main content",
    cy: "Neidio i'r prif gynnwys"
  },
  pageTitle: {
    en: "Public backlog",
    cy: "Ol-groniad cyhoeddus"
  },
  introHeading: {
    en: "What we are considering, building and have decided",
    cy: "Yr hyn rydym yn ei ystyried, yn ei adeiladu ac wedi penderfynu arno"
  },
  introBody: {
    en: "This board shows what our team is considering, what we are building, what is queued and in what order, and what we are not pursuing right now. It is drawn from our public GitHub issues and refreshed regularly.",
    cy: "Mae'r bwrdd hwn yn dangos yr hyn y mae ein tim yn ei ystyried, yr hyn rydym yn ei adeiladu, yr hyn sydd yn y ciw ac ym mha drefn, a'r hyn nad ydym yn mynd ar ei ol ar hyn o bryd. Daw o'n materion GitHub cyhoeddus ac fe'i diweddarir yn rheolaidd."
  },
  // Column titles
  col_considering_title: {
    en: "New ideas being considered",
    cy: "Syniadau newydd dan ystyriaeth"
  },
  col_considering_desc: {
    en: "Recent ideas we are weighing up. Not yet committed.",
    cy: "Syniadau diweddar rydym yn eu pwyso a'u mesur. Heb ymrwymo eto."
  },
  col_inprogress_title: {
    en: "In progress",
    cy: "Ar y gweill"
  },
  col_inprogress_desc: {
    en: "Work we are actively building.",
    cy: "Gwaith rydym wrthi yn ei adeiladu."
  },
  col_backlog_title: {
    en: "Backlog",
    cy: "Ol-groniad"
  },
  col_backlog_desc: {
    en: "The queue, ordered by priority. Each item shows how much support it has.",
    cy: "Y ciw, wedi'i drefnu yn ol blaenoriaeth. Mae pob eitem yn dangos faint o gefnogaeth sydd iddi."
  },
  col_parked_title: {
    en: "Not being considered right now",
    cy: "Ddim dan ystyriaeth ar hyn o bryd"
  },
  col_parked_desc: {
    en: "Things we have looked at and decided against for the time being, with a short reason.",
    cy: "Pethau rydym wedi edrych arnynt ac wedi penderfynu yn eu herbyn am y tro, gyda rheswm byr."
  },
  col_shipped_title: {
    en: "Recently shipped",
    cy: "Wedi eu cyflawni yn ddiweddar"
  },
  col_shipped_desc: {
    en: "Work we have delivered.",
    cy: "Gwaith rydym wedi ei gyflawni."
  },
  emptyColumn: {
    en: "There is nothing here at the moment.",
    cy: "Nid oes dim yma ar hyn o bryd."
  },
  // About this board
  aboutHeading: {
    en: "About this board",
    cy: "Am y bwrdd hwn"
  },
  aboutBody: {
    en: "Items appear only after a person on our team has reviewed them, so the board stays clear and useful. The further an item is from In progress, the less certain it is. Votes are a signal the team weighs up, not an automatic decision.",
    cy: "Mae eitemau yn ymddangos dim ond ar ol i rywun ar ein tim eu hadolygu, fel bod y bwrdd yn aros yn glir ac yn ddefnyddiol. Po bellaf yw eitem o Ar y gweill, y lleiaf sicr ydyw. Mae pleidleisiau yn arwydd y mae'r tim yn ei bwyso a'i fesur, nid penderfyniad awtomatig."
  },
  // Voting
  votingLimitations: {
    en: "Voting needs a free GitHub account. Your vote is registered on GitHub, and each account counts once.",
    cy: "Mae angen cyfrif GitHub am ddim i bleidleisio. Cofrestrir eich pleidlais ar GitHub, ac mae pob cyfrif yn cyfrif unwaith."
  },
  upvoteHelper: {
    en: "You need a free GitHub account to add your support.",
    cy: "Mae angen cyfrif GitHub am ddim arnoch i ychwanegu eich cefnogaeth."
  },
  votesReadonlyLabel: {
    en: "support",
    cy: "o gefnogaeth"
  },
  // Suggest a feature
  suggestLabel: {
    en: "Suggest a feature",
    cy: "Awgrymu nodwedd"
  },
  suggestHelper: {
    en: "Opens a short form on GitHub. New suggestions are reviewed before they appear here.",
    cy: "Yn agor ffurflen fer ar GitHub. Adolygir awgrymiadau newydd cyn iddynt ymddangos yma."
  },
  configNotice: {
    en: "This is a fresh fork. Set your GitHub owner and repository in config.json to enable suggestions.",
    cy: "Fforch newydd yw hon. Gosodwch eich perchennog a'ch ystorfa GitHub yn config.json i alluogi awgrymiadau."
  },
  // Filtering
  filterHeading: {
    en: "Filter by tag",
    cy: "Hidlo yn ol tag"
  },
  filterAll: {
    en: "All",
    cy: "Pob un"
  },
  filterClear: {
    en: "Clear filter",
    cy: "Clirio'r hidlydd"
  },
  // Language
  languageToggleToCy: {
    en: "Cymraeg",
    cy: "Cymraeg"
  },
  languageToggleToEn: {
    en: "English",
    cy: "English"
  },
  languageToggleLabel: {
    en: "Choose a language",
    cy: "Dewiswch iaith"
  },
  translationPending: {
    en: "Translation pending. Showing the available language.",
    cy: "Cyfieithiad ar y gweill. Yn dangos yr iaith sydd ar gael."
  },
  // Freshness and staleness
  lastUpdatedLabel: {
    en: "Last updated",
    cy: "Diweddarwyd ddiwethaf"
  },
  staleInProgress: {
    en: "This has not moved for a while.",
    cy: "Nid yw hyn wedi symud ers tro."
  },
  boardUpdated: {
    en: "Board last refreshed",
    cy: "Bwrdd wedi ei adnewyddu ddiwethaf"
  },
  staleSnapshotNotice: {
    en: "This board has not refreshed recently, so some details may be out of date.",
    cy: "Nid yw'r bwrdd hwn wedi adnewyddu yn ddiweddar, felly efallai bod rhai manylion wedi dyddio."
  },
  contentErrorRationale: {
    en: "A reason for this decision has not been recorded yet.",
    cy: "Nid yw rheswm dros y penderfyniad hwn wedi ei gofnodi eto."
  },
  rationaleHeading: {
    en: "Why this is not being pursued",
    cy: "Pam nad yw hyn yn cael ei ddilyn"
  },
  // Footer
  accessibilityStatement: {
    en: "Accessibility statement",
    cy: "Datganiad hygyrchedd"
  },
  privacyNote: {
    en: "Privacy note",
    cy: "Nodyn preifatrwydd"
  },
  backToTop: {
    en: "Back to top",
    cy: "Yn ol i'r brig"
  },
  discussOnGithub: {
    en: "Read and discuss on GitHub",
    cy: "Darllen a thrafod ar GitHub"
  }
};
function localise(value, lang) {
  if (lang === "cy") {
    return value.cy && value.cy.length > 0 ? value.cy : value.en;
  }
  return value.en && value.en.length > 0 ? value.en : value.cy;
}
function localiseWithLang(value, lang) {
  if (lang === "cy") {
    return value.cy && value.cy.length > 0 ? { text: value.cy, lang: "cy" } : { text: value.en, lang: "en" };
  }
  return value.en && value.en.length > 0 ? { text: value.en, lang: "en" } : { text: value.cy, lang: "cy" };
}
function t(key, lang) {
  return localise(strings[key], lang);
}
function voteAnnouncement(count, lang) {
  if (lang === "cy") {
    return count === 1 ? `Mae 1 person yn cefnogi hyn` : `Mae ${count} o bobl yn cefnogi hyn`;
  }
  return count === 1 ? `1 person supports this` : `${count} people support this`;
}
function upvoteActionLabel(count, title, lang) {
  if (lang === "cy") {
    return `Cefnogi "${title}" ar GitHub. ${voteAnnouncement(count, "cy")} ar hyn o bryd.`;
  }
  return `Support "${title}" on GitHub. ${voteAnnouncement(count, "en")} so far.`;
}
const DEFAULT_LANGUAGE = config.language.default;
const AVAILABLE = config.language.available;
function isLanguage(value) {
  return value === "en" || value === "cy";
}
const LanguageContext = createContext(null);
function LanguageProvider({
  children,
  initialLanguage
}) {
  const [lang, setLangState] = useState(
    initialLanguage ?? DEFAULT_LANGUAGE
  );
  const setLang = useCallback((next) => {
    setLangState(next);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (next === DEFAULT_LANGUAGE) {
        url.searchParams.delete("lang");
      } else {
        url.searchParams.set("lang", next);
      }
      window.history.replaceState({}, "", url);
      document.documentElement.lang = next;
    }
  }, []);
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("lang");
    if (isLanguage(fromUrl) && AVAILABLE.includes(fromUrl)) {
      setLangState(fromUrl);
    }
  }, []);
  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key) => t(key, lang),
      localise: (v) => localise(v, lang)
    }),
    [lang, setLang]
  );
  return createElement(LanguageContext.Provider, { value }, children);
}
function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
function SkipLink() {
  const { t: t2 } = useLanguage();
  return /* @__PURE__ */ jsx("a", { className: "skip-link", href: "#main", children: t2("skipToContent") });
}
function newIssueUrl(config2) {
  const { owner, repo, featureTemplate } = config2.github;
  const configured = Boolean(owner) && Boolean(repo);
  if (!configured) {
    const base = owner && !repo ? `https://github.com/${owner}` : "https://github.com";
    return { url: `${base}/issues/new`, configured: false };
  }
  const template = encodeURIComponent(featureTemplate || "feature_request.yml");
  return {
    url: `https://github.com/${owner}/${repo}/issues/new?template=${template}`,
    configured: true
  };
}
function SuggestButton({
  variant = "header"
}) {
  const { t: t2 } = useLanguage();
  const { url } = newIssueUrl(config);
  const base = "inline-flex items-center justify-center gap-2 rounded-card px-4 py-2 font-medium focus-visible:outline focus-visible:outline-2";
  const styles = variant === "header" ? "bg-yellow text-navy hover:bg-[#f6c02f]" : "w-full border border-action bg-surface text-action hover:bg-surface-muted";
  return /* @__PURE__ */ jsxs(
    "a",
    {
      className: `${base} ${styles}`,
      href: url,
      "data-testid": `suggest-${variant}`,
      rel: "noopener noreferrer",
      children: [
        /* @__PURE__ */ jsx(PlusIcon, {}),
        t2("suggestLabel")
      ]
    }
  );
}
function PlusIcon() {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      "aria-hidden": "true",
      focusable: "false",
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.5",
      strokeLinecap: "round",
      children: [
        /* @__PURE__ */ jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
        /* @__PURE__ */ jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" })
      ]
    }
  );
}
function LanguageToggle() {
  const { lang, setLang, t: t2 } = useLanguage();
  const available = config.language.available;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "inline-flex items-center gap-1 rounded-card bg-surface p-1",
      role: "group",
      "aria-label": t2("languageToggleLabel"),
      children: available.map((option) => {
        const isActive = option === lang;
        const label = option === "cy" ? "Cymraeg" : "English";
        return /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            lang: option,
            onClick: () => setLang(option),
            "aria-pressed": isActive,
            className: "rounded px-3 py-1 text-sm font-medium " + (isActive ? "bg-action text-surface" : "text-action hover:bg-surface-muted"),
            children: label
          },
          option
        );
      })
    }
  );
}
function Header() {
  const { localise: localise2 } = useLanguage();
  return /* @__PURE__ */ jsx("header", { className: "bg-nhs-wales-blue text-surface", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-content flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-surface/90", children: localise2(config.team.organisation) }),
      /* @__PURE__ */ jsx("p", { className: "text-lg font-bold", children: config.team.name })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsx(LanguageToggle, {}),
      /* @__PURE__ */ jsx(SuggestButton, { variant: "header" })
    ] })
  ] }) });
}
function Intro() {
  const { t: t2 } = useLanguage();
  return /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-heading sm:text-3xl", children: t2("introHeading") }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-ink-900", children: t2("introBody") })
  ] });
}
function AboutBoard() {
  const { t: t2 } = useLanguage();
  return /* @__PURE__ */ jsxs(
    "section",
    {
      "aria-labelledby": "about-heading",
      className: "mb-6 rounded-card border border-border bg-surface p-4",
      "data-testid": "about-board",
      children: [
        /* @__PURE__ */ jsx("h2", { id: "about-heading", className: "text-lg font-bold text-heading", children: t2("aboutHeading") }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-ink-900", children: t2("aboutBody") }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-ink-700", children: t2("votingLimitations") })
      ]
    }
  );
}
function formatDateTime(iso, lang) {
  const locale = lang === "cy" ? "cy" : "en-GB";
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toISOString();
  }
}
function StalenessNotice({
  generatedAt: generatedAt2,
  isStale
}) {
  const { t: t2, lang } = useLanguage();
  return /* @__PURE__ */ jsxs("div", { className: "mb-6 text-sm", "data-testid": "board-freshness", children: [
    /* @__PURE__ */ jsxs("p", { className: "text-ink-700", children: [
      /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
        t2("boardUpdated"),
        ":"
      ] }),
      " ",
      /* @__PURE__ */ jsx("time", { dateTime: generatedAt2, children: formatDateTime(generatedAt2, lang) })
    ] }),
    isStale && /* @__PURE__ */ jsx(
      "p",
      {
        role: "status",
        className: "mt-2 rounded-card border border-yellow bg-[#fdf6e3] p-3 text-ink-900",
        "data-testid": "stale-notice",
        children: t2("staleSnapshotNotice")
      }
    )
  ] });
}
function TagFilter({
  tags,
  selected,
  onSelect
}) {
  const { t: t2 } = useLanguage();
  if (tags.length === 0) return null;
  return /* @__PURE__ */ jsxs("section", { "aria-labelledby": "filter-heading", className: "mb-6", children: [
    /* @__PURE__ */ jsx("h2", { id: "filter-heading", className: "text-sm font-bold text-heading", children: t2("filterHeading") }),
    /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap gap-2", role: "group", "aria-labelledby": "filter-heading", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onSelect(null),
          "aria-pressed": selected === null,
          className: "rounded-full px-3 py-1 text-sm font-medium " + (selected === null ? "bg-action text-surface" : "border border-border bg-surface text-ink-700 hover:bg-surface-muted"),
          children: t2("filterAll")
        }
      ),
      tags.map((tag) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onSelect(tag),
          "aria-pressed": selected === tag,
          "data-testid": "tag-filter",
          className: "rounded-full px-3 py-1 text-sm font-medium " + (selected === tag ? "bg-action text-surface" : "border border-border bg-surface text-ink-700 hover:bg-surface-muted"),
          children: tag
        },
        tag
      ))
    ] })
  ] });
}
function getVoteCount(card) {
  return card.votes ?? 0;
}
function ThumbsUpIcon() {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      "aria-hidden": "true",
      focusable: "false",
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M7 10v11" }),
        /* @__PURE__ */ jsx("path", { d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" })
      ]
    }
  );
}
function VoteControl({
  card,
  interactive
}) {
  const { lang, localise: localise2, t: t2 } = useLanguage();
  const count = getVoteCount(card);
  const title = localise2(card.title);
  if (!interactive) {
    return /* @__PURE__ */ jsxs(
      "span",
      {
        className: "inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1 text-sm font-medium text-ink-700",
        "data-testid": "vote-readonly",
        children: [
          /* @__PURE__ */ jsx(ThumbsUpIcon, {}),
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: count }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: voteAnnouncement(count, lang) })
        ]
      }
    );
  }
  const helperId = `upvote-help-${card.number}`;
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex flex-col items-start gap-1", children: [
    /* @__PURE__ */ jsxs(
      "a",
      {
        href: card.url,
        rel: "noopener noreferrer",
        className: "inline-flex items-center gap-1.5 rounded-full border border-action bg-surface px-3 py-1 text-sm font-medium text-action hover:bg-surface-muted",
        "aria-label": upvoteActionLabel(count, title, lang),
        "aria-describedby": helperId,
        "data-testid": "vote-control",
        children: [
          /* @__PURE__ */ jsx(ThumbsUpIcon, {}),
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: count })
        ]
      }
    ),
    /* @__PURE__ */ jsx("span", { id: helperId, className: "sr-only", children: t2("upvoteHelper") })
  ] });
}
function TranslationPending() {
  const { t: t2 } = useLanguage();
  return /* @__PURE__ */ jsx(
    "p",
    {
      className: "mt-2 text-xs italic text-ink-700",
      role: "note",
      "data-testid": "translation-pending",
      children: t2("translationPending")
    }
  );
}
const INTERACTIVE_STATUSES = /* @__PURE__ */ new Set(["considering", "backlog", "parked"]);
function formatDate(iso, lang) {
  const locale = lang === "cy" ? "cy" : "en-GB";
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toISOString().slice(0, 10);
  }
}
function BacklogCard({ card }) {
  const { lang, t: t2 } = useLanguage();
  const interactive = INTERACTIVE_STATUSES.has(card.status);
  const title = localiseWithLang(card.title, lang);
  const summary = localiseWithLang(card.summary, lang);
  const summaryMissing = lang === "en" && card.flags.includes("missing-english") || lang === "cy" && card.flags.includes("missing-welsh");
  const isStale = card.flags.includes("stale-in-progress");
  const parkedWithoutRationale = card.flags.includes("parked-without-rationale");
  return /* @__PURE__ */ jsxs(
    "article",
    {
      className: "rounded-card border border-border bg-surface p-4 shadow-sm",
      "data-testid": "card",
      "data-number": card.number,
      "data-status": card.status,
      "data-tags": card.tags.join("|"),
      children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-heading", children: /* @__PURE__ */ jsx(
          "a",
          {
            className: "text-heading underline-offset-2 hover:underline",
            href: card.url,
            lang: title.lang,
            rel: "noopener noreferrer",
            children: title.text
          }
        ) }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-ink-900", lang: summary.lang, children: summary.text }),
        summaryMissing && /* @__PURE__ */ jsx(TranslationPending, {}),
        card.status === "parked" && /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded bg-surface-subtle p-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-ink-700", children: t2("rationaleHeading") }),
          card.rationale && !parkedWithoutRationale ? /* @__PURE__ */ jsx(ParkedRationale, { card }) : /* @__PURE__ */ jsx(
            "p",
            {
              className: "mt-1 text-sm italic text-ink-700",
              "data-testid": "rationale-missing",
              children: t2("contentErrorRationale")
            }
          )
        ] }),
        card.tags.length > 0 && /* @__PURE__ */ jsx("ul", { className: "mt-3 flex flex-wrap gap-2", "aria-label": "Tags", children: card.tags.map((tag) => /* @__PURE__ */ jsx(
          "li",
          {
            className: "rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-ink-700",
            children: tag
          },
          tag
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsx(VoteControl, { card, interactive }),
          isStale && /* @__PURE__ */ jsxs(
            "span",
            {
              className: "text-xs text-ink-700",
              "data-testid": "stale-indicator",
              children: [
                /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                  t2("lastUpdatedLabel"),
                  ":"
                ] }),
                " ",
                formatDate(card.updatedAt, lang),
                /* @__PURE__ */ jsxs("span", { className: "sr-only", children: [
                  " ",
                  t2("staleInProgress")
                ] })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function ParkedRationale({ card }) {
  const { lang } = useLanguage();
  if (!card.rationale) return null;
  const rationale = localiseWithLang(card.rationale, lang);
  return /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-ink-900", lang: rationale.lang, children: rationale.text });
}
function Column({
  status,
  titleKey,
  descKey,
  cards,
  headingId,
  leadingItem
}) {
  const { t: t2 } = useLanguage();
  const isEmpty = cards.length === 0 && !leadingItem;
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: "flex flex-col",
      "aria-labelledby": headingId,
      "data-testid": "column",
      "data-column": status,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3 border-t-4 border-action pt-3", children: [
          /* @__PURE__ */ jsx("h2", { id: headingId, className: "text-lg font-bold text-heading", children: t2(titleKey) }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-ink-700", children: t2(descKey) })
        ] }),
        isEmpty ? /* @__PURE__ */ jsx(
          "p",
          {
            className: "rounded-card border border-dashed border-border bg-surface p-4 text-sm text-ink-700",
            "data-testid": "empty-state",
            children: t2("emptyColumn")
          }
        ) : /* @__PURE__ */ jsxs("ul", { className: "flex flex-col gap-3", "data-testid": "card-list", children: [
          leadingItem && /* @__PURE__ */ jsx("li", { children: leadingItem }),
          cards.map((card) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(BacklogCard, { card }) }, card.number))
        ] })
      ]
    }
  );
}
const COLUMN_META = [
  {
    status: "considering",
    titleKey: "col_considering_title",
    descKey: "col_considering_desc"
  },
  {
    status: "in-progress",
    titleKey: "col_inprogress_title",
    descKey: "col_inprogress_desc"
  },
  { status: "backlog", titleKey: "col_backlog_title", descKey: "col_backlog_desc" },
  { status: "parked", titleKey: "col_parked_title", descKey: "col_parked_desc" }
];
function filterCards(cards, tag) {
  if (!tag) return cards;
  return cards.filter((c) => c.tags.includes(tag));
}
function Board({
  snapshot,
  selectedTag
}) {
  const columns2 = snapshot.columns;
  const showShipped = columns2.shipped.length > 0;
  const filtered = useMemo(() => {
    const result = {};
    for (const [status, cards] of Object.entries(columns2)) {
      result[status] = filterCards(cards, selectedTag);
    }
    return result;
  }, [columns2, selectedTag]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4", children: COLUMN_META.map((meta) => /* @__PURE__ */ jsx(
      Column,
      {
        status: meta.status,
        titleKey: meta.titleKey,
        descKey: meta.descKey,
        cards: filtered[meta.status] ?? [],
        headingId: `column-${meta.status}`,
        leadingItem: meta.status === "considering" ? /* @__PURE__ */ jsx(SuggestButton, { variant: "column" }) : void 0
      },
      meta.status
    )) }),
    showShipped && /* @__PURE__ */ jsx("div", { className: "mt-10", children: /* @__PURE__ */ jsx(
      Column,
      {
        status: "shipped",
        titleKey: "col_shipped_title",
        descKey: "col_shipped_desc",
        cards: filtered.shipped ?? [],
        headingId: "column-shipped"
      }
    ) })
  ] });
}
function AccessibilityStatement() {
  const { lang } = useLanguage();
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "accessibility",
      "aria-labelledby": "accessibility-heading",
      className: "rounded-card border border-border bg-surface p-4",
      "data-testid": "accessibility-statement",
      children: [
        /* @__PURE__ */ jsx(
          "h2",
          {
            id: "accessibility-heading",
            className: "text-lg font-bold text-heading",
            lang,
            children: lang === "cy" ? "Datganiad hygyrchedd" : "Accessibility statement"
          }
        ),
        lang === "cy" ? /* @__PURE__ */ jsxs("div", { className: "mt-2 space-y-2 text-sm text-ink-900", lang: "cy", children: [
          /* @__PURE__ */ jsx("p", { children: "Rydym am i gymaint o bobl a phosibl allu defnyddio'r wefan hon. Rydym yn anelu at gydymffurfio a Chanllawiau Hygyrchedd Cynnwys Gwe (WCAG) 2.2 lefel AA." }),
          /* @__PURE__ */ jsx("p", { children: "[LleNwr] Cwblhewch y datganiad hwn cyn cyhoeddi: y dyddiad adolygu, sut i roi gwybod am broblemau hygyrchedd, a llwybr cyswllt." })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "mt-2 space-y-2 text-sm text-ink-900", lang: "en", children: [
          /* @__PURE__ */ jsx("p", { children: "We want as many people as possible to be able to use this website. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 level AA." }),
          /* @__PURE__ */ jsx("p", { children: "[Placeholder] Complete this statement before publishing: the review date, how to report accessibility problems, and a contact route." })
        ] })
      ]
    }
  );
}
function PrivacyNote() {
  const { lang } = useLanguage();
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "privacy",
      "aria-labelledby": "privacy-heading",
      className: "rounded-card border border-border bg-surface p-4",
      "data-testid": "privacy-note",
      children: [
        /* @__PURE__ */ jsx("h2", { id: "privacy-heading", className: "text-lg font-bold text-heading", lang, children: lang === "cy" ? "Nodyn preifatrwydd" : "Privacy note" }),
        lang === "cy" ? /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-ink-900", lang: "cy", children: "Nid yw'r safle hwn yn gosod cwcis tracio, nid yw'n defnyddio dadansoddeg trydydd parti, ac mae'n hunan-westeia ei ffontiau, felly nid oes dim i gydsynio iddo. Cynhelir pleidleisio a thrafod ar GitHub." }) : /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-ink-900", lang: "en", children: "This site sets no tracking cookies, uses no third-party analytics, and self-hosts its fonts, so there is nothing to consent to. Voting and discussion take place on GitHub." })
      ]
    }
  );
}
function Footer() {
  const { t: t2, localise: localise2 } = useLanguage();
  return /* @__PURE__ */ jsx("footer", { className: "mt-10 bg-navy text-surface", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-content px-4 py-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsx(AccessibilityStatement, {}),
      /* @__PURE__ */ jsx(PrivacyNote, {})
    ] }),
    /* @__PURE__ */ jsxs(
      "nav",
      {
        className: "mt-6 flex flex-wrap gap-4 text-sm",
        "aria-label": localise2(config.team.organisation),
        children: [
          /* @__PURE__ */ jsx("a", { className: "underline hover:no-underline", href: "#accessibility", children: t2("accessibilityStatement") }),
          /* @__PURE__ */ jsx("a", { className: "underline hover:no-underline", href: "#privacy", children: t2("privacyNote") })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("p", { className: "mt-4 text-xs text-surface/80", children: [
      localise2(config.team.organisation),
      " · Code: MIT · Content: Open Government Licence v3.0"
    ] })
  ] }) });
}
function BackToTop() {
  const { t: t2 } = useLanguage();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: () => window.scrollTo({ top: 0 }),
      className: "fixed bottom-4 right-4 z-40 rounded-card bg-action px-4 py-2 text-sm font-medium text-surface shadow-md",
      children: t2("backToTop")
    }
  );
}
const baseline = baselineSnapshot;
function isSnapshotStale(generatedAt2, now) {
  const windowMs = config.health.freshnessWindowHours * 60 * 60 * 1e3;
  return now - new Date(generatedAt2).getTime() > windowMs;
}
function collectTags(snapshot) {
  const set = /* @__PURE__ */ new Set();
  for (const cards of Object.values(snapshot.columns)) {
    for (const card of cards) {
      for (const tag of card.tags) set.add(tag);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}
function App() {
  const [snapshot, setSnapshot] = useState(baseline);
  const [isStale, setIsStale] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const res = await fetch(new URL("backlog.json", document.baseURI), {
          cache: "no-store"
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setSnapshot(data);
        setIsStale(isSnapshotStale(data.generatedAt, Date.now()));
      } catch {
        if (cancelled) return;
        setIsStale(isSnapshotStale(baseline.generatedAt, Date.now()));
      }
    }
    void refresh();
    return () => {
      cancelled = true;
    };
  }, []);
  const tags = useMemo(() => collectTags(snapshot), [snapshot]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SkipLink, {}),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { id: "main", className: "mx-auto max-w-content px-4 py-6", children: [
      /* @__PURE__ */ jsx(Intro, {}),
      /* @__PURE__ */ jsx(StalenessNotice, { generatedAt: snapshot.generatedAt, isStale }),
      /* @__PURE__ */ jsx(AboutBoard, {}),
      /* @__PURE__ */ jsx(TagFilter, { tags, selected: selectedTag, onSelect: setSelectedTag }),
      /* @__PURE__ */ jsx(Board, { snapshot, selectedTag })
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(BackToTop, {})
  ] });
}
function render() {
  return renderToString(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(LanguageProvider, { initialLanguage: DEFAULT_LANGUAGE, children: /* @__PURE__ */ jsx(App, {}) }) })
  );
}
export {
  render
};
