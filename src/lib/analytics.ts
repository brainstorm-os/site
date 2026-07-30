/*
 * Analytics, gated on consent.
 *
 * The Amplitude SDK is behind a dynamic `import()` on purpose: until someone
 * says yes, the bundle is never fetched, never parsed, and never runs. That is
 * the difference between an opt-in gate and a checkbox that only stops events
 * being sent — the SDK writes an identifier the moment it initialises, so
 * "loaded but idle" would already be storage we had no permission for.
 */

const AMPLITUDE_API_KEY = "cca1e2687dc8b1388f4b33372a97fdaa";

/** Every key the SDK writes is prefixed this way (`AMP_<key suffix>`,
 *  `AMP_MKTG_<key suffix>` for attribution). Withdrawal has to remove all of
 *  them, not just the one we happen to know the name of. */
const AMPLITUDE_STORAGE_PREFIX = "AMP_";

type AmplitudeModule = typeof import("@amplitude/analytics-browser");

let ready: Promise<AmplitudeModule> | null = null;

/** Load and initialise Amplitude. Idempotent — repeated calls share one load. */
export function startAnalytics(): Promise<void> {
	ready ??= import("@amplitude/analytics-browser").then((amplitude) => {
		amplitude.init(AMPLITUDE_API_KEY, {
			serverZone: "EU",
			// Persistent identity is the whole point of asking: without it every
			// page load in a classic MPA mints a new device id, so one visitor
			// reading three pages reports as three people who each bounced.
			identityStorage: "localStorage",
			trackingOptions: { ipAddress: true },
			autocapture: {
				attribution: true,
				pageViews: true,
				sessions: true,
				formInteractions: true,
				fileDownloads: true,
				elementInteractions: true,
			},
		});
		return amplitude;
	});
	return ready.then(() => undefined);
}

function purgeIdentifiers(): void {
	try {
		for (const store of [window.localStorage, window.sessionStorage]) {
			const doomed: string[] = [];
			for (let i = 0; i < store.length; i++) {
				const key = store.key(i);
				if (key?.startsWith(AMPLITUDE_STORAGE_PREFIX)) doomed.push(key);
			}
			for (const key of doomed) store.removeItem(key);
		}
	} catch {
		// Storage unavailable: there is nothing stored to remove.
	}
	for (const pair of document.cookie.split(";")) {
		const name = pair.split("=")[0]?.trim();
		if (!name?.startsWith(AMPLITUDE_STORAGE_PREFIX)) continue;
		document.cookie = `${name}=; Max-Age=0; path=/`;
	}
}

/**
 * Stop collecting and remove the identifier. Safe to call when analytics were
 * never started — that is the boot path for a visitor who declined, and it
 * sweeps up anything a previous "yes" left behind.
 *
 * Returns true when a running SDK had to be torn down. A live SDK keeps its own
 * copy of the identity in memory and writes it back after its next tick, so
 * purging underneath it is a race the purge loses; the caller reloads the page
 * on a true, which is the only way to guarantee the identifier is really gone.
 */
export function stopAnalytics(): boolean {
	const loaded = ready;
	ready = null;
	if (loaded) {
		void loaded.then((amplitude) => amplitude.setOptOut(true)).catch(() => undefined);
	}
	purgeIdentifiers();
	return loaded !== null;
}

/** Record a named event. A no-op — never a throw — when consent is absent. */
export function track(eventName: string, properties?: Record<string, unknown>): void {
	if (!ready) return;
	void ready.then((amplitude) => amplitude.track(eventName, properties)).catch(() => undefined);
}
