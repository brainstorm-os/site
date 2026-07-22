import type { APIRoute } from "astro";
import { SITE_URL } from "~/content/site";
import { type Lang, languages, localizePath } from "~/i18n/ui";

// A single sitemap.xml for the marketing site, generated off SITE_URL so the
// domain never drifts. Only indexable routes belong here — /joined is the
// waitlist confirmation page (noindex), so it is deliberately omitted. Add a
// route below when a new public, crawlable page ships.
//
// Each route is emitted once per locale, and every entry carries xhtml:link
// alternates for all locales (+ x-default) so Google clusters the language
// versions instead of treating them as duplicates.
const routes = ["/", "/apps", "/downloads"];
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

export const GET: APIRoute = () => {
	const urls = routes
		.flatMap((route) =>
			langs.map((lang) => {
				const loc = `${SITE_URL}${localizePath(route, lang)}`;
				return `\t<url>\n\t\t<loc>${loc}</loc>\n${alternatesXml(route)}\n\t</url>`;
			}),
		)
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
