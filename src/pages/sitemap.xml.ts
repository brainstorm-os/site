import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { SITE_URL } from "~/content/site";
import { type Lang, languages, localizePath } from "~/i18n/ui";
import { buildFeed } from "~/lib/feed";
import { collectTags, tagHref } from "~/lib/tags";

// A single sitemap.xml for the marketing site, generated off SITE_URL so the
// domain never drifts. Only indexable routes belong here — /joined is the
// waitlist confirmation page (noindex), so it is deliberately omitted. Add a
// route below when a new public, crawlable page ships.
//
// Each route is emitted once per locale, and every entry carries xhtml:link
// alternates for all locales (+ x-default) so Google clusters the language
// versions instead of treating them as duplicates.
const routes = ["/", "/apps", "/downloads", "/privacy"];
// English-only routes (legal pages + the blog) — emitted once, with no locale
// alternates. Blog post slugs and tag pages are appended from the content
// collections below, off the same helpers the pages are generated from, so a
// listed URL is always a URL the build produced.
// The RSS feed is a subscription endpoint, not a page, so it stays out.
const enOnlyRoutes = ["/terms", "/imprint", "/blog", "/blog/tags"];
const langs = Object.keys(languages) as Lang[];

function alternatesXml(route: string): string {
	const links = langs.map(
		(lang) =>
			`\t\t<xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL}${localizePath(route, lang)}" />`,
	);
	links.push(
		`\t\t<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${localizePath(route, "en")}" />`,
	);
	return links.join("\n");
}

export const GET: APIRoute = async () => {
	const posts = await getCollection("blog");
	const tags = collectTags(await buildFeed());
	const enOnly = enOnlyRoutes
		.concat(posts.map((post) => `/blog/${post.id}`))
		.concat(tags.map((tag) => tagHref(tag.slug)));
	const urls = routes
		.flatMap((route) =>
			langs.map((lang) => {
				const loc = `${SITE_URL}${localizePath(route, lang)}`;
				return `\t<url>\n\t\t<loc>${loc}</loc>\n${alternatesXml(route)}\n\t</url>`;
			}),
		)
		.concat(enOnly.map((route) => `\t<url>\n\t\t<loc>${SITE_URL}${route}</loc>\n\t</url>`))
		.join("\n");

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

	return new Response(body, {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	});
};
