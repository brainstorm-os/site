// Locale plumbing for the marketing site. English is the default and lives at
// the root; German lives under `/de/`. Nothing auto-redirects — the audience
// that cares about local-first tools does not want IP-based geo-sniffing.

export const languages = {
	en: "English",
	de: "Deutsch",
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "en";

// The list of non-default locales that carry a URL prefix. `en` is unprefixed.
export const prefixedLangs = (Object.keys(languages) as Lang[]).filter((l) => l !== defaultLang);

function isLang(value: string): value is Lang {
	return value in languages;
}

// The locale a request is for, read from the first path segment.
export function getLangFromUrl(url: URL): Lang {
	const seg = url.pathname.split("/")[1] ?? "";
	return isLang(seg) ? seg : defaultLang;
}

// Drop a leading `/de` (or any non-default locale) so the path is locale-neutral.
export function stripLangPrefix(pathname: string): string {
	const seg = pathname.split("/")[1] ?? "";
	if (isLang(seg) && seg !== defaultLang) {
		const rest = pathname.slice(seg.length + 1);
		return rest === "" ? "/" : rest;
	}
	return pathname;
}

// Turn a locale-neutral in-site path into the path for `lang`. External URLs
// (http/mailto/tel) and pure hashes pass through untouched.
export function localizePath(path: string, lang: Lang): string {
	if (/^(?:[a-z]+:|\/\/|#)/i.test(path)) return path;
	const base = stripLangPrefix(path);
	if (lang === defaultLang) return base;
	return base === "/" ? `/${lang}` : `/${lang}${base}`;
}

export interface Alternate {
	hreflang: string;
	href: string;
}

// The full set of <link rel="alternate" hreflang> targets for a page, plus
// x-default. `site` is the absolute origin (Astro.site).
export function alternatesFor(pathname: string, site: URL | string): Alternate[] {
	const origin = new URL(site).origin;
	const neutral = stripLangPrefix(pathname);
	const langs = Object.keys(languages) as Lang[];
	const out: Alternate[] = langs.map((lang) => ({
		hreflang: lang,
		href: origin + localizePath(neutral, lang),
	}));
	out.push({ hreflang: "x-default", href: origin + localizePath(neutral, defaultLang) });
	return out;
}

// The BCP-47 tag used for <html lang> and og:locale.
export const htmlLang: Record<Lang, string> = {
	en: "en",
	de: "de",
};

export const ogLocale: Record<Lang, string> = {
	en: "en_US",
	de: "de_DE",
};

type UiKey = keyof (typeof ui)["en"];

// Chrome strings — nav, header, footer, banners, shared form copy. Long-form
// page bodies live in per-page copy modules (e.g. `home.ts`), not here.
export const ui = {
	en: {
		"star.text": "Brainstorm is free and open source — if it's useful to you,",
		"star.link": "star it on GitHub",
		"nav.overview": "Overview",
		"nav.apps": "Apps",
		"nav.how": "How it works",
		"nav.roadmap": "Roadmap",
		"nav.screenshots": "Screenshots",
		"header.docs": "Docs",
		"header.download": "Download",
		"header.toggleTheme": "Toggle theme",
		"footer.positioning":
			"A local-first, AI-native operating system for your knowledge work. Your data lives on your machine — no account required.",
		"footer.updatesLabel": "Get product updates",
		"footer.download": "Download",
		"footer.docs": "Docs",
		"footer.github": "GitHub",
		"footer.opensource": "Open source · AGPL-3.0",
		"newsletter.cta": "Subscribe",
		"newsletter.success": "You're subscribed. We'll send the occasional update.",
		"cta.download": "Download",
		"cta.readDocs": "Read the docs",
		"video.watch": "Watch the tour",
		"video.title": "Brainstorm — product tour",
		"video.fallback": "Trouble playing? Open on YouTube ↗",
		"video.close": "Close video",
		"email.label": "Email address",
		"email.placeholder": "you@example.com",
		"lang.label": "Language",
	},
	de: {
		"star.text": "Brainstorm ist kostenlos und quelloffen — wenn es dir nützt,",
		"star.link": "gib ihm einen Stern auf GitHub",
		"nav.overview": "Überblick",
		"nav.apps": "Apps",
		"nav.how": "So funktioniert's",
		"nav.roadmap": "Roadmap",
		"nav.screenshots": "Screenshots",
		"header.docs": "Doku",
		"header.download": "Herunterladen",
		"header.toggleTheme": "Farbschema wechseln",
		"footer.positioning":
			"Ein lokal-first, KI-natives Betriebssystem für deine Wissensarbeit. Deine Daten liegen auf deinem Rechner — kein Konto erforderlich.",
		"footer.updatesLabel": "Produkt-Updates erhalten",
		"footer.download": "Herunterladen",
		"footer.docs": "Doku",
		"footer.github": "GitHub",
		"footer.opensource": "Quelloffen · AGPL-3.0",
		"newsletter.cta": "Abonnieren",
		"newsletter.success": "Du bist dabei. Wir melden uns gelegentlich mit Neuigkeiten.",
		"cta.download": "Herunterladen",
		"cta.readDocs": "Zur Doku",
		"video.watch": "Tour ansehen",
		"video.title": "Brainstorm — Produkttour",
		"video.fallback": "Probleme beim Abspielen? Auf YouTube öffnen ↗",
		"video.close": "Video schließen",
		"email.label": "E-Mail-Adresse",
		"email.placeholder": "du@beispiel.de",
		"lang.label": "Sprache",
	},
} as const;

export function useTranslations(lang: Lang) {
	return function t(key: UiKey): string {
		return ui[lang][key] ?? ui[defaultLang][key];
	};
}
