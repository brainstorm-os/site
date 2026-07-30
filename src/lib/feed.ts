import { getCollection } from "astro:content";

/** The streams the /blog timeline merges. One badge, one destination each. */
export const FeedKind = {
	Article: "article",
	Release: "release",
	Video: "video",
} as const;
export type FeedKind = (typeof FeedKind)[keyof typeof FeedKind];

export const FEED_KIND_LABEL: Record<FeedKind, string> = {
	[FeedKind.Article]: "Article",
	[FeedKind.Release]: "Release",
	[FeedKind.Video]: "Video",
};

/** Plural nouns for the "N articles · N releases · N videos" count line. */
export const FEED_KIND_PLURAL: Record<FeedKind, string> = {
	[FeedKind.Article]: "articles",
	[FeedKind.Release]: "releases",
	[FeedKind.Video]: "videos",
};

export interface FeedEntry {
	kind: FeedKind;
	/** Stable per-entry key — also the RSS <guid>. */
	key: string;
	date: Date;
	title: string;
	summary: string;
	/** Site-relative for articles and releases; absolute for videos. */
	href: string;
	/** Secondary line next to the date (channel, run time). */
	meta: string;
	/** Topics this entry is filed under. Each one links to its own tag page.
	 *  Articles and demo videos carry tags; releases never do — see below. */
	tags: string[];
	/** Short bullets — release highlights. Empty for everything else. */
	points: string[];
	/** YouTube id, present only on video entries (drives the on-page lightbox). */
	videoId?: string;
	external: boolean;
}

const MAX_POINTS = 3;

/** Highlights are worth the vertical space on the entries people came for: the
 *  newest build, and every feature release (`x.y.0`). Patch releases in the
 *  archive carry their one-line summary only, or the timeline becomes a wall. */
function showsHighlights(version: string, isLatest: boolean): boolean {
	return isLatest || version.split(".")[2] === "0";
}

export async function buildFeed(): Promise<FeedEntry[]> {
	const articles = (await getCollection("blog")).map(
		(post): FeedEntry => ({
			kind: FeedKind.Article,
			key: `/blog/${post.id}`,
			date: post.data.date,
			title: post.data.title,
			summary: post.data.summary,
			href: `/blog/${post.id}`,
			meta: "",
			tags: post.data.tags,
			points: [],
			external: false,
		}),
	);

	const releaseEntries = (await getCollection("releases"))
		.filter((release) => release.data.status === "published")
		.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

	const releases = releaseEntries.map((release, index): FeedEntry => {
		const { version, channel, date, summary, highlights } = release.data;
		return {
			kind: FeedKind.Release,
			key: `/downloads#v${version}`,
			date,
			title: `Brainstorm ${version}`,
			summary,
			href: `/downloads#v${version}`,
			meta: channel,
			// Releases carry no tags. A build is a point in time, not a topic, and
			// the honest alternative — inventing a subject for each of ~30 archived
			// versions — would fill the tag pages with entries nobody filed there.
			// The version archive on /downloads is how you browse releases.
			tags: [],
			points: showsHighlights(version, index === 0) ? highlights.slice(0, MAX_POINTS) : [],
			external: false,
		};
	});

	const videos = (await getCollection("videos")).map(
		(entry): FeedEntry => ({
			kind: FeedKind.Video,
			key: `https://www.youtube.com/watch?v=${entry.data.video}`,
			date: entry.data.date,
			title: entry.data.title,
			summary: entry.data.summary,
			href: `https://www.youtube.com/watch?v=${entry.data.video}`,
			meta: entry.data.duration,
			tags: entry.data.tags,
			points: [],
			videoId: entry.data.video,
			external: true,
		}),
	);

	// One timeline, newest first. Entries published at the exact same instant
	// keep their input order (Array#sort is stable), which puts articles above
	// releases above videos — a deterministic tiebreak, not an accident.
	return [...articles, ...releases, ...videos].sort((a, b) => b.date.getTime() - a.date.getTime());
}

export interface FeedMonth {
	/** "2026-07" — stable id for the group heading. */
	id: string;
	label: string;
	entries: FeedEntry[];
}

// UTC so the bucket label can never disagree with the UTC key computed below.
const monthFmt = new Intl.DateTimeFormat("en", {
	year: "numeric",
	month: "long",
	timeZone: "UTC",
});

/** Reverse-chronological entries, bucketed into the month they were published.
 *  Input must already be sorted newest-first. */
export function groupByMonth(entries: FeedEntry[]): FeedMonth[] {
	const months: FeedMonth[] = [];
	for (const entry of entries) {
		const id = `${entry.date.getUTCFullYear()}-${String(entry.date.getUTCMonth() + 1).padStart(2, "0")}`;
		const last = months[months.length - 1];
		if (last?.id === id) last.entries.push(entry);
		else months.push({ id, label: monthFmt.format(entry.date), entries: [entry] });
	}
	return months;
}

export function countByKind(entries: FeedEntry[]): Record<FeedKind, number> {
	const counts: Record<FeedKind, number> = {
		[FeedKind.Article]: 0,
		[FeedKind.Release]: 0,
		[FeedKind.Video]: 0,
	};
	for (const entry of entries) counts[entry.kind] += 1;
	return counts;
}
