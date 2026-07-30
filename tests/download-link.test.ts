import { describe, expect, it } from "vitest";
import { Platform } from "~/content/releases";
import { DownloadSurface, assetSlug, campaignHref } from "~/lib/download-link";

const ASSET =
	"https://github.com/brainstorm-os/shell/releases/download/v0.11.0/Brainstorm-0.11.0-arm64.dmg";

describe("assetSlug", () => {
	it("flattens an asset label into a report-safe token", () => {
		expect(assetSlug("Apple silicon")).toBe("apple-silicon");
		expect(assetSlug("Installer (.exe)")).toBe("installer-exe");
		expect(assetSlug("AppImage (x86_64)")).toBe("appimage-x86-64");
	});
});

describe("campaignHref", () => {
	const link = {
		platform: Platform.Mac,
		label: "Apple silicon",
		version: "0.11.0",
		surface: DownloadSurface.Latest,
	};

	it("stamps the campaign without touching the asset path", () => {
		const url = new URL(campaignHref(ASSET, link));
		expect(url.origin + url.pathname).toBe(ASSET);
		expect(url.searchParams.get("utm_source")).toBe("getbrainstorm.online");
		expect(url.searchParams.get("utm_medium")).toBe("site");
		expect(url.searchParams.get("utm_campaign")).toBe("downloads");
		expect(url.searchParams.get("utm_content")).toBe("mac-apple-silicon");
		expect(url.searchParams.get("bs_release")).toBe("0.11.0");
	});

	it("is idempotent, so a re-stamped href gains no duplicate params", () => {
		expect(campaignHref(campaignHref(ASSET, link), link)).toBe(campaignHref(ASSET, link));
	});

	it("returns an unparseable href untouched rather than breaking the download", () => {
		expect(campaignHref("/not-a-url", link)).toBe("/not-a-url");
	});
});
