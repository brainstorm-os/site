import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { collectTags, entriesWithTag, slugifyTag } from "~/lib/tags";

/*
 * The tag pages are generated from the tags authors write by hand, so the two
 * failure modes worth a test are structural: a tag that cannot become a URL,
 * and two different tags that collapse onto the same URL (which would silently
 * merge two topics into one page). Both are asserted against the real content.
 */

const CONTENT = new URL("../src/content", import.meta.url).pathname;

/** The `tags:` block of a frontmatter, as a YAML list of scalars. */
function readTags(file: string): string[] {
	const text = readFileSync(file, "utf-8");
	const frontmatter = text.match(/^---\n([\s\S]*?)\n---/)?.[1];
	if (!frontmatter) return [];
	const lines = frontmatter.split("\n");
	const start = lines.findIndex((line) => line.trim() === "tags:");
	if (start === -1) return [];
	const tags: string[] = [];
	for (const line of lines.slice(start + 1)) {
		const match = line.match(/^\s+-\s+(.*)$/);
		if (!match?.[1]) break;
		tags.push(match[1].trim().replace(/^["']|["']$/g, ""));
	}
	return tags;
}

function taggedFiles(collection: string): { file: string; tags: string[] }[] {
	const dir = join(CONTENT, collection);
	return readdirSync(dir)
		.filter((name) => name.endsWith(".md"))
		.map((name) => ({ file: join(collection, name), tags: readTags(join(dir, name)) }));
}

const authored = [...taggedFiles("blog"), ...taggedFiles("videos")];

describe("slugifyTag", () => {
	it("lowercases and hyphenates", () => {
		expect(slugifyTag("App Platform")).toBe("app-platform");
		expect(slugifyTag("app-platform")).toBe("app-platform");
	});

	it("folds accents to ASCII", () => {
		expect(slugifyTag("Sécurité")).toBe("securite");
	});

	it("collapses runs of separators and trims them", () => {
		expect(slugifyTag("  local //  first  ")).toBe("local-first");
		expect(slugifyTag("--agent--")).toBe("agent");
	});

	it("is idempotent", () => {
		for (const { tags } of authored) {
			for (const tag of tags) expect(slugifyTag(slugifyTag(tag))).toBe(slugifyTag(tag));
		}
	});
});

describe("authored tags", () => {
	it("every tag produces a non-empty slug", () => {
		for (const { file, tags } of authored) {
			for (const tag of tags) {
				expect(slugifyTag(tag), `${file}: "${tag}" slugifies to nothing`).not.toBe("");
			}
		}
	});

	it("no two distinct tags collapse onto one URL", () => {
		const spellings = new Map<string, Set<string>>();
		for (const { tags } of authored) {
			for (const tag of tags) {
				const slug = slugifyTag(tag);
				const seen = spellings.get(slug) ?? new Set<string>();
				seen.add(tag);
				spellings.set(slug, seen);
			}
		}
		for (const [slug, seen] of spellings) {
			expect([...seen], `/blog/tags/${slug} is claimed by ${seen.size} spellings`).toHaveLength(1);
		}
	});

	it("carries no em-dash or en-dash", () => {
		for (const { file, tags } of authored) {
			for (const tag of tags) {
				expect(/[—–]/.test(tag), `${file}: "${tag}" contains a dash character`).toBe(false);
			}
		}
	});
});

describe("collectTags", () => {
	const entries = [
		{ tags: ["agent", "capabilities"] },
		{ tags: ["agent"] },
		{ tags: [] },
		{ tags: ["Agent"] },
	];

	it("counts a tag once per entry, most-used first", () => {
		expect(collectTags(entries)).toEqual([
			{ tag: "agent", slug: "agent", count: 3 },
			{ tag: "capabilities", slug: "capabilities", count: 1 },
		]);
	});

	it("breaks count ties alphabetically", () => {
		expect(collectTags([{ tags: ["sync", "attachments"] }]).map((t) => t.tag)).toEqual([
			"attachments",
			"sync",
		]);
	});

	it("drops a tag that cannot become a URL", () => {
		expect(collectTags([{ tags: ["///"] }])).toEqual([]);
	});

	it("finds every entry a tag page must list, differing spellings included", () => {
		expect(entriesWithTag(entries, "agent")).toHaveLength(3);
		expect(entriesWithTag(entries, "nothing-here")).toHaveLength(0);
	});
});
