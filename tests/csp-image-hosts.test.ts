import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/*
 * The footer badges are remote images from a dozen launch directories, and the
 * CSP `img-src` allowlist that admits them is hand-maintained in vercel.json.
 * Adding a badge without its host produces no build error and no test failure —
 * the browser just refuses to paint it in production, which is how the
 * LaunchNest badge shipped invisible. Assert the two lists agree.
 */

const SRC = new URL("../src", import.meta.url).pathname;
const VERCEL_JSON = new URL("../vercel.json", import.meta.url).pathname;

function astroFiles(dir: string): string[] {
	const out: string[] = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) out.push(...astroFiles(path));
		else if (entry.name.endsWith(".astro")) out.push(path);
	}
	return out;
}

/** Origins of every literal remote `<img src="https://…">` in the components. */
function remoteImageOrigins(): Map<string, string[]> {
	const origins = new Map<string, string[]>();
	for (const file of astroFiles(SRC)) {
		const text = readFileSync(file, "utf-8");
		for (const tag of text.match(/<img\b[^>]*>/g) ?? []) {
			const src = tag.match(/\bsrc="(https:\/\/[^"]+)"/)?.[1];
			if (!src) continue;
			const origin = new URL(src).origin;
			origins.set(origin, [...(origins.get(origin) ?? []), file.slice(SRC.length + 1)]);
		}
	}
	return origins;
}

function imgSrcAllowlist(): string[] {
	const config = JSON.parse(readFileSync(VERCEL_JSON, "utf-8"));
	const policy = config.headers
		.flatMap((h: { headers: { key: string; value: string }[] }) => h.headers)
		.find((h: { key: string }) => h.key === "Content-Security-Policy")?.value;
	expect(policy, "vercel.json declares a Content-Security-Policy").toBeTruthy();
	const directive = policy
		.split(";")
		.map((d: string) => d.trim())
		.find((d: string) => d.startsWith("img-src "));
	expect(directive, "the CSP declares an img-src directive").toBeTruthy();
	return directive.slice("img-src ".length).split(/\s+/);
}

describe("CSP img-src covers every remote image the site renders", () => {
	it("finds the badge images it is meant to be guarding", () => {
		expect(remoteImageOrigins().size).toBeGreaterThan(5);
	});

	it("allows every host referenced by an <img> in src/", () => {
		const allowed = new Set(imgSrcAllowlist());
		const missing = [...remoteImageOrigins()]
			.filter(([origin]) => !allowed.has(origin))
			.map(([origin, files]) => `${origin} (referenced by ${files.join(", ")})`);
		expect(missing, "add these origins to img-src in vercel.json").toEqual([]);
	});
});
