/** Tags are DISPLAYED exactly as an author wrote them; only the URL is
 *  slugified. Accents fold to ASCII via NFKD, then every run of characters that
 *  is not a lowercase letter or a digit collapses to one hyphen. */
export function slugifyTag(tag: string): string {
	return (
		tag
			.normalize("NFKD")
			// NFKD splits "é" into "e" + a combining accent; the accent has to be
			// dropped, not swept into the separator run, or "sécurité" slugs as
			// "se-curite".
			.replace(/\p{Diacritic}/gu, "")
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "")
	);
}

export const tagHref = (slug: string) => `/blog/tags/${slug}`;

export interface TagSummary {
	tag: string;
	slug: string;
	count: number;
}

/** Structural shape of anything the timeline can tag. */
interface Tagged {
	tags: string[];
}

/** Every distinct tag, most-used first, then alphabetical. Frequency order puts
 *  the topics that actually have a body of writing behind them at the front of
 *  the row, where a reader looking for somewhere to start will hit them. */
export function collectTags(entries: readonly Tagged[]): TagSummary[] {
	const bySlug = new Map<string, TagSummary>();
	for (const entry of entries) {
		for (const tag of entry.tags) {
			const slug = slugifyTag(tag);
			// A tag of pure punctuation would slugify to "" and mint /blog/tags/.
			if (!slug) continue;
			const existing = bySlug.get(slug);
			// Two spellings of one tag ("Agent" and "agent") share one page. The
			// first spelling seen wins the label, so no page can advertise a name
			// its own URL disagrees with.
			if (existing) existing.count += 1;
			else bySlug.set(slug, { tag, slug, count: 1 });
		}
	}
	return [...bySlug.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function entriesWithTag<T extends Tagged>(entries: readonly T[], slug: string): T[] {
	return entries.filter((entry) => entry.tags.some((tag) => slugifyTag(tag) === slug));
}
