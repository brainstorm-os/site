import type { Lang } from "~/i18n/ui";

// Copy for the analytics consent banner. Plain language on purpose: the
// visitor should be able to answer without reading a policy, and the two
// answers are written to be equally easy to give.

export interface ConsentCopy {
	/** Accessible name of the dialog and the headline of the banner. */
	title: string;
	/** What we would store, why, and where it goes. */
	body: string;
	accept: string;
	decline: string;
	/** Link into the privacy page from inside the banner. */
	learnMore: string;
	/** Footer / privacy-page trigger that reopens the banner. */
	manage: string;
	close: string;
	stateGranted: string;
	stateDenied: string;
}

const consent: Record<Lang, ConsentCopy> = {
	en: {
		title: "Count this visit?",
		body:
			"We'd like to count visits and see which pages get read. That means keeping one random id on your device, so reading a second page isn't counted as a second person, and sending page names to Amplitude on servers in the EU. Nothing is kept until you choose, and you can change your mind whenever you like.",
		accept: "Yes, count my visits",
		decline: "No, don't count them",
		learnMore: "What we store",
		manage: "Privacy choices",
		close: "Close",
		stateGranted: "Right now: your visits are being counted.",
		stateDenied: "Right now: your visits are not being counted.",
	},
	de: {
		title: "Diesen Besuch zählen?",
		body:
			"Wir würden gern Besuche zählen und sehen, welche Seiten gelesen werden. Dafür bleibt eine zufällige Kennung auf deinem Gerät, damit eine zweite gelesene Seite nicht als zweite Person zählt, und Seitennamen gehen an Amplitude auf Servern in der EU. Bis du dich entscheidest, wird nichts gespeichert, und du kannst es jederzeit ändern.",
		accept: "Ja, Besuche zählen",
		decline: "Nein, nicht zählen",
		learnMore: "Was wir speichern",
		manage: "Datenschutz-Optionen",
		close: "Schließen",
		stateGranted: "Aktuell: deine Besuche werden gezählt.",
		stateDenied: "Aktuell: deine Besuche werden nicht gezählt.",
	},
	fr: {
		title: "Compter cette visite ?",
		body:
			"Nous aimerions compter les visites et voir quelles pages sont lues. Cela suppose de garder un identifiant aléatoire sur votre appareil, pour qu'une deuxième page lue ne compte pas comme une deuxième personne, et d'envoyer des noms de pages à Amplitude sur des serveurs situés dans l'UE. Rien n'est gardé tant que vous n'avez pas choisi, et vous pouvez changer d'avis à tout moment.",
		accept: "Oui, comptez mes visites",
		decline: "Non, ne comptez pas",
		learnMore: "Ce que nous gardons",
		manage: "Options de suivi",
		close: "Fermer",
		stateGranted: "Actuellement : vos visites sont comptées.",
		stateDenied: "Actuellement : vos visites ne sont pas comptées.",
	},
};

export function consentCopy(lang: Lang): ConsentCopy {
	return consent[lang];
}
