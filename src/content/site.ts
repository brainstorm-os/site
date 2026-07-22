import { type Lang, defaultLang } from "~/i18n/ui";

export const POSITIONING =
	"Brainstorm is a local-first, AI-native operating system for knowledge work. Your apps, your data, and your AI all run on your machine, with optional end-to-end encrypted sync — and every app and every agent only touches what you allow.";

// Homepage <meta name="description"> — the POSITIONING sentence widened with the
// phrases people actually search for ("knowledge management", "operating system",
// "end-to-end encrypted"). Keep all three present whenever this is reworded.
export const SEO_DESCRIPTION =
	"Brainstorm is a local-first, AI-native operating system for knowledge management. Your apps, your data, and your AI all run on your machine, with optional end-to-end encrypted sync — and every app and every agent only touches what you allow.";

export const TAGLINE_PRIMARY = "an AI-native operating system for your knowledge work";
export const TAGLINE_SUB =
	"Your apps, your data, your AI — all on your machine, under permissions you grant.";

export const SITE_NAME = "Brainstorm";
export const SITE_URL = "https://getbrainstorm.online";

// The 84s product tour on YouTube (channel "Brainstorm OS", @th3-br41n). The
// on-site player embeds by id via youtube-nocookie; `watch` is the canonical
// share/fallback link.
export const YOUTUBE_VIDEO_ID = "kkjVrnwmZT4";

export const links = {
	github: "https://github.com/brainstorm-os",
	repo: "https://github.com/brainstorm-os/shell",
	docs: "https://docs.getbrainstorm.online",
	// The downloads page lists every release with per-platform builds.
	downloads: "/downloads",
	youtube: "https://www.youtube.com/@th3-br41n",
	watch: `https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}`,
} as const;

// The docs portal (a separate Starlight site) mirrors this site's locales:
// English at the root, German under /de/. Link the matching locale so a German
// visitor lands on the German docs, not the English root.
export function docsUrl(lang: Lang): string {
	return lang === defaultLang ? links.docs : `${links.docs}/${lang}`;
}

// Hrefs are root-absolute (`/#…`) so the nav works from any page, not just the
// homepage — a bare `#overview` does nothing on /downloads, /blog, etc. The
// scroll-spy keys off `section` (the target element id), not the href.
export const nav = [
	{ label: "Overview", href: "/#overview", section: "overview" },
	{ label: "Apps", href: "/apps", section: "apps" },
	{ label: "How it works", href: "/#capabilities", section: "capabilities" },
	{ label: "Roadmap", href: "/#roadmap", section: "roadmap" },
] as const;
