import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const manifestPath = resolve(import.meta.dirname, "../public/funding.json");
const wellKnownPath = resolve(import.meta.dirname, "../public/.well-known/funding-manifest-urls");

describe("funding.json", () => {
	it("is valid JSON with required fundingjson.org fields", () => {
		const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
			$schema: string;
			entity: { name: string; email: string };
			projects: { guid: string; licenses: string[] }[];
			funding: { channels: { guid: string }[]; plans: { guid: string; status: string }[] };
		};

		expect(manifest.$schema).toBe("https://fundingjson.org/schema/v1.1.0.json");
		expect(manifest.entity.name).toBe("Brainstorm");
		expect(manifest.entity.email).toContain("@");
		expect(manifest.projects.length).toBeGreaterThan(0);
		expect(manifest.projects[0]?.licenses[0]).toMatch(/^spdx:/);
		expect(manifest.funding.channels.length).toBeGreaterThan(0);
		expect(manifest.funding.plans.some((p) => p.status === "active")).toBe(true);
	});

	it("well-known file points at the public manifest URL", () => {
		const lines = readFileSync(wellKnownPath, "utf8")
			.split("\n")
			.map((l) => l.trim())
			.filter(Boolean);
		expect(lines).toContain("https://getbrainstorm.online/funding.json");
	});
});
