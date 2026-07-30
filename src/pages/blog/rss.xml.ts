import type { APIRoute } from "astro";
import { SITE_NAME, SITE_URL } from "~/content/site";
import { FEED_KIND_LABEL, buildFeed } from "~/lib/feed";

// Hand-rolled like sitemap.xml.ts: the site's whole dependency budget is spent
// on the hero scene, and one XML template does not justify @astrojs/rss.
const escapeXml = (value: string) =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");

const absolute = (href: string) => (href.startsWith("http") ? href : `${SITE_URL}${href}`);

export const GET: APIRoute = async () => {
	const entries = await buildFeed();
	const items = entries
		.map((entry) => {
			const link = absolute(entry.href);
			const description = [entry.summary, ...entry.points].join("\n\n");
			return [
				"\t\t<item>",
				`\t\t\t<title>${escapeXml(entry.title)}</title>`,
				`\t\t\t<link>${escapeXml(link)}</link>`,
				`\t\t\t<guid isPermaLink="false">${escapeXml(absolute(entry.key))}</guid>`,
				`\t\t\t<category>${escapeXml(FEED_KIND_LABEL[entry.kind])}</category>`,
				`\t\t\t<pubDate>${entry.date.toUTCString()}</pubDate>`,
				`\t\t\t<description>${escapeXml(description)}</description>`,
				"\t\t</item>",
			].join("\n");
		})
		.join("\n");

	const latest = entries[0]?.date ?? new Date();

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${SITE_NAME}</title>
		<link>${SITE_URL}/blog</link>
		<description>Design decisions, retrospectives, every release, and the demo videos — one timeline.</description>
		<language>en</language>
		<lastBuildDate>${latest.toUTCString()}</lastBuildDate>
		<atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
	</channel>
</rss>
`;

	return new Response(body, {
		headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
	});
};
