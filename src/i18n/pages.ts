import type { Platform } from "~/content/releases";
import type { Lang } from "~/i18n/ui";

// Chrome copy for the /apps and /downloads pages. The data these pages render
// (per-app descriptions, release highlights) comes from the content
// collections, which are English-only for now — only the surrounding chrome is
// localised here. Localised collections are the next content pass.

export interface AppsCopy {
	seoTitle: string; // e.g. "Apps"
	description: (count: number) => string;
	eyebrow: string;
	title: (count: number) => string;
	lede: string;
	indexAria: string;
	docsLabel: string;
	/** Trigger label for an app's demo-video lightbox (apps with a `video`). */
	watchDemo: string;
	closerTitle: string;
	closerLede: string;
}

export interface DownloadsCopy {
	seoTitle: string;
	description: string;
	eyebrow: string;
	title: string;
	lede: string;
	latestLabel: string;
	betaLabel: string;
	platformAria: string;
	noBuild: string;
	notesAria: string;
	allReleases: string;
	emptyLine: string;
	emptySub: string;
	emptyCta: string;
	archiveAria: string;
	archiveTitle: string;
	/** Overrides for the per-platform requirement line; falls back to English. */
	platformReq: Partial<Record<Platform, string>>;
	/** BCP-47 tag for Intl date formatting. */
	dateLocale: string;
}

const apps: Record<Lang, AppsCopy> = {
	en: {
		seoTitle: "Apps",
		description: (n) =>
			`The ${n} first-party knowledge-management apps that ship with Brainstorm — every one sandboxed, every one reading and writing the same end-to-end encrypted vault.`,
		eyebrow: "The apps",
		title: (n) => `${n} apps. One object space.`,
		lede:
			"Every product surface in Brainstorm is its own sandboxed app — installed, updated, and removed on its own. They all read and write the same vault, so a note here is a row there and a node in the graph, never a copy. Here is each one, in full.",
		indexAria: "Jump to an app",
		docsLabel: "Docs ↗",
		watchDemo: "Watch the demo",
		closerTitle: "All of them, in one download",
		closerLede:
			"Every app above ships with the public beta — free, local-first, for macOS, Windows, and Linux.",
	},
	de: {
		seoTitle: "Apps",
		description: (n) =>
			`Die ${n} Erstanbieter-Apps für Wissensmanagement, die mit Brainstorm kommen — jede in einer Sandbox, jede liest und schreibt denselben Ende-zu-Ende-verschlüsselten Vault.`,
		eyebrow: "Die Apps",
		title: (n) => `${n} Apps. Ein Objektraum.`,
		lede:
			"Jede Produktoberfläche in Brainstorm ist ihre eigene Sandbox-App — installiert, aktualisiert und entfernt für sich. Sie alle lesen und schreiben denselben Vault, sodass eine Notiz hier dort eine Zeile und im Graphen ein Knoten ist, nie eine Kopie. Hier ist jede einzelne, vollständig.",
		indexAria: "Zu einer App springen",
		docsLabel: "Doku ↗",
		watchDemo: "Demo ansehen",
		closerTitle: "Alle zusammen, in einem Download",
		closerLede:
			"Jede App oben kommt mit der öffentlichen Beta — kostenlos, lokal-first, für macOS, Windows und Linux.",
	},
};

const downloads: Record<Lang, DownloadsCopy> = {
	en: {
		seoTitle: "Downloads",
		description:
			"Download Brainstorm — the local-first, end-to-end encrypted operating system for knowledge management — for macOS, Windows, and Linux. Every release is posted here.",
		eyebrow: "Downloads",
		title: "Get Brainstorm",
		lede:
			"A desktop app for macOS, Windows, and Linux. Free, forever — your data stays on your machine, and there's no account to sign up for.",
		latestLabel: "Latest",
		betaLabel: "Beta",
		platformAria: "Download by platform",
		noBuild: "No build for this platform yet.",
		notesAria: "Release notes",
		allReleases: "All releases on GitHub",
		emptyLine: "No public builds yet.",
		emptySub: "Brainstorm builds are published on GitHub — check the releases page for the latest.",
		emptyCta: "View releases",
		archiveAria: "Previous releases",
		archiveTitle: "Previous releases",
		platformReq: {},
		dateLocale: "en",
	},
	de: {
		seoTitle: "Downloads",
		description:
			"Lade Brainstorm herunter — das lokal-first, Ende-zu-Ende-verschlüsselte Betriebssystem für Wissensmanagement — für macOS, Windows und Linux. Jede Version wird hier veröffentlicht.",
		eyebrow: "Downloads",
		title: "Hol dir Brainstorm",
		lede:
			"Eine Desktop-App für macOS, Windows und Linux. Kostenlos, für immer — deine Daten bleiben auf deinem Rechner, und es gibt kein Konto, für das du dich anmelden musst.",
		latestLabel: "Neueste",
		betaLabel: "Beta",
		platformAria: "Nach Plattform herunterladen",
		noBuild: "Noch kein Build für diese Plattform.",
		notesAria: "Release-Notes",
		allReleases: "Alle Versionen auf GitHub",
		emptyLine: "Noch keine öffentlichen Builds.",
		emptySub:
			"Brainstorm-Builds werden auf GitHub veröffentlicht — die neueste findest du auf der Releases-Seite.",
		emptyCta: "Versionen ansehen",
		archiveAria: "Frühere Versionen",
		archiveTitle: "Frühere Versionen",
		platformReq: {
			mac: "macOS 12 Monterey oder neuer",
			windows: "Windows 10 oder neuer",
		},
		dateLocale: "de",
	},
};

export function appsCopy(lang: Lang): AppsCopy {
	return apps[lang];
}

export function downloadsCopy(lang: Lang): DownloadsCopy {
	return downloads[lang];
}
