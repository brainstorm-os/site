/*
 * Analytics consent state.
 *
 * The rules live in pure functions so they can be unit-tested without a DOM;
 * the thin wrappers below are the only place that touches `localStorage`.
 *
 * Invariant: nothing is written to the visitor's device until they make a
 * choice. The record we do write is the record OF that choice — what was
 * decided and when — which is what makes the decision auditable and
 * withdrawable. A visitor who never answers, or who is auto-declined by a
 * browser opt-out signal, leaves no trace at all.
 */

export const ConsentDecision = {
	Granted: "granted",
	Denied: "denied",
} as const;
export type ConsentDecision = (typeof ConsentDecision)[keyof typeof ConsentDecision];

export const CONSENT_STORAGE_KEY = "bs-consent";

export const CONSENT_RECORD_VERSION = 1;

/** Re-ask a year after the answer. Long enough not to nag someone who said no,
 *  short enough that a stored "yes" still reflects a current choice — the EDPB
 *  expects consent to be refreshed, and 6–12 months is the usual reading. */
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export interface ConsentRecord {
	v: number;
	decision: ConsentDecision;
	/** ISO-8601 timestamp of the decision. */
	at: string;
}

export interface ConsentState {
	decision: ConsentDecision;
	/** True when we have no current answer and should ask for one. */
	prompt: boolean;
}

function isDecision(value: unknown): value is ConsentDecision {
	return value === ConsentDecision.Granted || value === ConsentDecision.Denied;
}

export function makeRecord(decision: ConsentDecision, now: number): ConsentRecord {
	return { v: CONSENT_RECORD_VERSION, decision, at: new Date(now).toISOString() };
}

/** Parse a stored record. Anything malformed, from a future schema, or with an
 *  unreadable timestamp is treated as "no record" — we re-ask rather than guess. */
export function parseConsent(raw: string | null): ConsentRecord | null {
	if (!raw) return null;
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return null;
	}
	if (typeof parsed !== "object" || parsed === null) return null;
	const { v, decision, at } = parsed as Partial<ConsentRecord>;
	if (v !== CONSENT_RECORD_VERSION) return null;
	if (!isDecision(decision)) return null;
	if (typeof at !== "string" || Number.isNaN(Date.parse(at))) return null;
	return { v, decision, at };
}

export function isCurrent(record: ConsentRecord, now: number): boolean {
	const age = now - Date.parse(record.at);
	return age >= 0 && age < CONSENT_MAX_AGE_MS;
}

/** Browser-level opt-out signals. Global Privacy Control is a legally
 *  recognised objection in several jurisdictions and Do Not Track expresses the
 *  same wish; either one is an answer, so we take it and never ask. */
export function signalsOptOut(nav: Navigator): boolean {
	const gpc = (nav as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
	if (gpc === true) return true;
	return nav.doNotTrack === "1";
}

/** The decision in force right now, and whether we still owe the visitor a
 *  question. An explicit stored choice always wins over a browser signal — the
 *  visitor may have opened the banner and said yes in spite of it. */
export function resolveConsent(
	record: ConsentRecord | null,
	now: number,
	optOutSignal: boolean,
): ConsentState {
	if (record && isCurrent(record, now)) {
		return { decision: record.decision, prompt: false };
	}
	if (optOutSignal) return { decision: ConsentDecision.Denied, prompt: false };
	return { decision: ConsentDecision.Denied, prompt: true };
}

function storage(): Storage | null {
	try {
		return window.localStorage;
	} catch {
		return null;
	}
}

export function readStoredConsent(): ConsentRecord | null {
	const store = storage();
	if (!store) return null;
	try {
		return parseConsent(store.getItem(CONSENT_STORAGE_KEY));
	} catch {
		return null;
	}
}

export function storeConsent(decision: ConsentDecision, now = Date.now()): ConsentRecord {
	const record = makeRecord(decision, now);
	try {
		storage()?.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
	} catch {
		// Private mode / storage disabled: the choice still applies to this page,
		// it just cannot be remembered. Asking again next visit is the honest
		// failure mode.
	}
	return record;
}

export function clearStoredConsent(): void {
	try {
		storage()?.removeItem(CONSENT_STORAGE_KEY);
	} catch {
		// Nothing to clear if storage is unavailable.
	}
}
