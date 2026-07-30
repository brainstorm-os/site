import { describe, expect, it } from "vitest";
import {
	CONSENT_MAX_AGE_MS,
	CONSENT_RECORD_VERSION,
	ConsentDecision,
	isCurrent,
	makeRecord,
	parseConsent,
	resolveConsent,
	signalsOptOut,
} from "~/lib/consent";

const NOW = Date.parse("2026-07-30T12:00:00.000Z");

describe("parseConsent", () => {
	it("round-trips a record it wrote", () => {
		const record = makeRecord(ConsentDecision.Granted, NOW);
		expect(parseConsent(JSON.stringify(record))).toEqual(record);
	});

	it("treats missing, malformed and foreign records as no answer", () => {
		for (const raw of [
			null,
			"",
			"not json",
			"[]",
			'"granted"',
			JSON.stringify({ v: CONSENT_RECORD_VERSION, decision: "maybe", at: "2026-07-30" }),
			JSON.stringify({ v: CONSENT_RECORD_VERSION + 1, decision: "granted", at: "2026-07-30" }),
			JSON.stringify({ v: CONSENT_RECORD_VERSION, decision: "granted", at: "whenever" }),
			JSON.stringify({ v: CONSENT_RECORD_VERSION, decision: "granted" }),
		]) {
			expect(parseConsent(raw), `raw: ${raw}`).toBeNull();
		}
	});
});

describe("isCurrent", () => {
	it("holds an answer for the retention window and no longer", () => {
		const record = makeRecord(ConsentDecision.Granted, NOW);
		expect(isCurrent(record, NOW)).toBe(true);
		expect(isCurrent(record, NOW + CONSENT_MAX_AGE_MS - 1)).toBe(true);
		expect(isCurrent(record, NOW + CONSENT_MAX_AGE_MS)).toBe(false);
	});

	it("rejects a record dated in the future (clock moved)", () => {
		expect(isCurrent(makeRecord(ConsentDecision.Granted, NOW + 1000), NOW)).toBe(false);
	});
});

describe("signalsOptOut", () => {
	it("reads Global Privacy Control and Do Not Track", () => {
		expect(signalsOptOut({ globalPrivacyControl: true } as unknown as Navigator)).toBe(true);
		expect(signalsOptOut({ doNotTrack: "1" } as unknown as Navigator)).toBe(true);
		expect(signalsOptOut({ doNotTrack: "0" } as unknown as Navigator)).toBe(false);
		expect(signalsOptOut({} as unknown as Navigator)).toBe(false);
	});
});

describe("resolveConsent", () => {
	it("defaults to denied and asks when there is no answer", () => {
		expect(resolveConsent(null, NOW, false)).toEqual({
			decision: ConsentDecision.Denied,
			prompt: true,
		});
	});

	it("never tracks and never asks when the browser signals an opt-out", () => {
		expect(resolveConsent(null, NOW, true)).toEqual({
			decision: ConsentDecision.Denied,
			prompt: false,
		});
	});

	it("honours a current answer either way, without re-asking", () => {
		expect(resolveConsent(makeRecord(ConsentDecision.Granted, NOW), NOW, false)).toEqual({
			decision: ConsentDecision.Granted,
			prompt: false,
		});
		expect(resolveConsent(makeRecord(ConsentDecision.Denied, NOW), NOW, false)).toEqual({
			decision: ConsentDecision.Denied,
			prompt: false,
		});
	});

	it("lets an explicit answer override a browser opt-out signal", () => {
		expect(resolveConsent(makeRecord(ConsentDecision.Granted, NOW), NOW, true)).toEqual({
			decision: ConsentDecision.Granted,
			prompt: false,
		});
	});

	it("re-asks once the answer has aged out, defaulting to denied meanwhile", () => {
		const stale = makeRecord(ConsentDecision.Granted, NOW - CONSENT_MAX_AGE_MS - 1);
		expect(resolveConsent(stale, NOW, false)).toEqual({
			decision: ConsentDecision.Denied,
			prompt: true,
		});
	});
});
