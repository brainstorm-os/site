import type { Platform } from "~/content/releases";

/*
 * Provenance for outbound release-asset links.
 *
 * The site can only see the click; the install happens inside a binary that
 * never learns which page sent it. Stamping the campaign on the asset URL is
 * what makes the two halves joinable later — the click event carries the same
 * fields, so "clicks on the macOS arm64 build of 0.11.0" lines up against the
 * app's own first-run count for that version.
 */

export const DownloadSurface = {
	/** The three per-platform cards for the newest release. */
	Latest: "latest",
	/** The flat asset list under a previous release. */
	Archive: "archive",
} as const;
export type DownloadSurface = (typeof DownloadSurface)[keyof typeof DownloadSurface];

export const DOWNLOAD_EVENT = "Download Clicked";

const UTM_SOURCE = "getbrainstorm.online";
const UTM_MEDIUM = "site";
const UTM_CAMPAIGN = "downloads";

/** `Apple silicon` → `apple-silicon`; keeps `utm_content` readable in a report. */
export function assetSlug(label: string): string {
	return label
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

export interface DownloadLink {
	platform: Platform;
	label: string;
	version: string;
	surface: DownloadSurface;
}

/** The asset URL with campaign parameters appended. Anything unparseable is
 *  returned untouched — a download that works beats a download that is tagged. */
export function campaignHref(href: string, link: DownloadLink): string {
	let url: URL;
	try {
		url = new URL(href);
	} catch {
		return href;
	}
	url.searchParams.set("utm_source", UTM_SOURCE);
	url.searchParams.set("utm_medium", UTM_MEDIUM);
	url.searchParams.set("utm_campaign", UTM_CAMPAIGN);
	url.searchParams.set("utm_content", `${link.platform}-${assetSlug(link.label)}`);
	url.searchParams.set("bs_release", link.version);
	return url.toString();
}
