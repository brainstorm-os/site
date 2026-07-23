import type { Lang } from "~/i18n/ui";

// Long-form copy for the homepage, per locale. The German is a faithful
// translation of the English — same claims, same order — using informal "du"
// to match the product's tone. Capability card copy is duplicated here (rather
// than read from the content collection) because the collection is English-only
// for now; localised collections land with the docs pass.

interface Pillar {
	title: string;
	body: string;
}

interface RoadmapItem {
	status: string;
	state: "done" | "active" | "next";
	title: string;
	body: string;
}

interface Cap {
	title: string;
	summary: string;
}

export interface HomeCopy {
	seoTitle: string;
	seoDescription: string;
	hero: {
		eyebrow: string;
		title: string; // may contain &nbsp;
		lede: string;
		trustPre: string;
		trustLink: string;
	};
	overview: {
		eyebrow: string;
		titleHtml: string;
		lede: string;
		pillars: [Pillar, Pillar, Pillar];
	};
	inside: {
		eyebrow: string;
		titleHtml: string;
		lede: string;
		more: string;
	};
	aiNative: {
		eyebrow: string;
		title: string;
		lede: string;
		point1Html: string;
		point2Html: string;
		noteHtml: string;
	};
	capabilities: {
		eyebrow: string;
		title: string;
		items: Cap[];
	};
	roadmap: {
		eyebrow: string;
		title: string;
		lede: string;
		items: RoadmapItem[];
	};
	closer: {
		title: string;
		lede: string;
		note: string;
	};
}

const en: HomeCopy = {
	seoTitle:
		"Brainstorm — a local-first, AI-native operating system for knowledge management, with end-to-end encrypted sync",
	seoDescription:
		"Brainstorm is a local-first, AI-native operating system for knowledge management. Your apps, your data, and your AI all run on your machine, with optional end-to-end encrypted sync — and every app and every agent only touches what you allow.",
	hero: {
		eyebrow: "Local-first · AI-native",
		title: "A desktop OS for you and your&nbsp;AI.",
		lede:
			"Brainstorm runs your apps, your data, and your AI on your own machine. Install what you need, keep every file on your disk, and let AI help — only with the parts you hand it.",
		trustPre: "Local-first · No account required ·",
		trustLink: "See it in action ↓",
	},
	overview: {
		eyebrow: "What it is",
		titleHtml: "It's not a notes app.<br />It's an operating system for everything you know",
		lede:
			"The screen is a real desktop — a wallpaper, app icons, windows. Each icon is its own app, sandboxed, all working from one set of data that lives with you: knowledge management without someone else's cloud in the middle.",
		pillars: [
			{
				title: "Apps, not features",
				body:
					"The shell only hosts apps. Notes, Database, Files, Graph, a calendar, a code editor — add the ones you want, drop the rest, and update each on its own.",
			},
			{
				title: "Your data, your disk",
				body:
					"Every document is a plain file in a folder you own. Sync is optional and end-to-end encrypted — the relay only ever sees scrambled bytes. There's no account to sign up for.",
			},
			{
				title: "AI you can govern",
				body:
					"The shell sits between your apps and any AI. Use your own API key or a model that runs locally, and decide exactly what each app and agent is allowed to touch.",
			},
		],
	},
	inside: {
		eyebrow: "A look inside",
		titleHtml: "One set of objects.<br />A different app for each way of seeing it",
		lede:
			"Each app reads and writes the same vault, so a note you write here is a row there and a node in the graph — never a copy, never an export.",
		more: "Every app, fully described — capabilities and screenshots →",
	},
	aiNative: {
		eyebrow: "AI-native",
		title: "You and your agents, working from one place",
		lede:
			"Most tools bolt AI on top: a button in someone else's cloud, working on data you don't own, with no record of what it did. Brainstorm starts somewhere else.",
		point1Html:
			"The same ledger that decides what an app can reach decides what an <strong>agent</strong> can reach. Every grant is specific, logged, and easy to take back — and if the system can't verify a request, it simply says no.",
		point2Html:
			"Your data and your keys stay on your machine, so you can hand work to AI you'd never send to a stranger's server. That's the part no cloud tool can offer: <strong>your data encrypted, models on your hardware, and a trail of who did what.</strong>",
		noteHtml:
			'Here today: the AI broker, provenance, and budgets. Agents with their own identity and history are on the <a href="#roadmap">roadmap</a> below — not dressed up as if they\'ve already shipped.',
	},
	capabilities: {
		eyebrow: "How it works",
		title: "A handful of decisions, kept everywhere",
		// Order matches the `capabilities` content collection (by `order` 1..6).
		items: [
			{
				title: "Apps you choose, not features bundled in.",
				summary:
					"Install Notes, Database, Files, Graph from us. Install third-party apps from the catalog or a URL. Uninstall what you don't use. The shell stays small.",
			},
			{
				title: "Your data, your disk.",
				summary:
					"Every document is a file on your machine. Sync is optional and uses Yjs CRDTs. Export to standard formats anytime. No account required, ever.",
			},
			{
				title: "AI when you want it, never when you don't.",
				summary:
					"The shell brokers every AI call. Bring your own provider key, or run the local model that ships with the shell. Per-app budgets cap runaway cost.",
			},
			{
				title: "Customise without polluting the shared workspace.",
				summary:
					'Database views, dashboard layouts, shortcut bindings, theme — all personal by default. Explicit "share with team" elevates to org scope when you want it.',
			},
			{
				title: "A real app SDK.",
				summary:
					"Sandboxed, capability-gated, with a stable contract. Build an app from inside Brainstorm with the Code app, and install it from a local package or a URL.",
			},
			{
				title: "Designed in the open.",
				summary:
					"Every decision, trade-off and open question gets written down and argued through before it ships. The product is the result of those notes, not a marketing layer on top.",
			},
		],
	},
	roadmap: {
		eyebrow: "Roadmap",
		title: "Where it's headed",
		lede:
			"We build in the open — the plan and the open questions are all in the repo. Here's what's in the current build, what we're on now, and where it goes.",
		items: [
			{
				status: "In the build",
				state: "done",
				title: "The shell and twenty apps",
				body:
					"A sandboxed host with a capability ledger, the vault, and twenty first-party apps that all share one object space.",
			},
			{
				status: "In the build",
				state: "done",
				title: "Local data, encrypted sync",
				body:
					"Every document is a CRDT on your disk. Multi-device sync is optional and end-to-end encrypted — your keys never leave your devices.",
			},
			{
				status: "Shipped",
				state: "done",
				title: "The AI broker",
				body:
					"One path for every AI call — your key or a local model — with a record on every object and a budget on every app.",
			},
			{
				status: "Out now",
				state: "done",
				title: "Public beta",
				body:
					"A free, encrypted, multi-device core you can actually live in — available now for macOS, Windows, and Linux, with a one-click way to bring your existing notes across.",
			},
			{
				status: "On it now",
				state: "active",
				title: "Agents as teammates",
				body:
					"AI that has its own identity, its own permissions, and a history of what it did — an operating system for a team that runs on agents.",
			},
			{
				status: "On the roadmap",
				state: "next",
				title: "A mobile companion",
				body:
					"Your vault in your pocket — a read-and-capture app for iOS and Android that syncs over the same end-to-end encrypted channel, so notes you take on the go land in the same object space.",
			},
			{
				status: "On the roadmap",
				state: "next",
				title: "An app marketplace",
				body:
					"Build on the open SDK today, then discover, install, and publish third-party apps — each running in the same sandbox, under the same capability grants you control.",
			},
		],
	},
	closer: {
		title: "Own your tools again",
		lede: "Free, local-first, and yours. Download the public beta for macOS, Windows, or Linux.",
		note:
			"No account required · Your vault is a folder you control · Free and open source under AGPL-3.0",
	},
};

const de: HomeCopy = {
	seoTitle:
		"Brainstorm — ein lokal-first, KI-natives Betriebssystem für Wissensmanagement, mit Ende-zu-Ende-verschlüsselter Synchronisierung",
	seoDescription:
		"Brainstorm ist ein lokal-first, KI-natives Betriebssystem für Wissensmanagement. Deine Apps, deine Daten und deine KI laufen alle auf deinem Rechner, mit optionaler Ende-zu-Ende-verschlüsselter Synchronisierung — und jede App und jeder Agent berührt nur, was du erlaubst.",
	hero: {
		eyebrow: "Lokal-first · KI-nativ",
		title: "Ein Desktop-OS für dich und deine&nbsp;KI.",
		lede:
			"Brainstorm betreibt deine Apps, deine Daten und deine KI auf deinem eigenen Rechner. Installiere, was du brauchst, behalte jede Datei auf deiner Festplatte und lass die KI helfen — nur mit dem, was du ihr gibst.",
		trustPre: "Lokal-first · Kein Konto erforderlich ·",
		trustLink: "In Aktion sehen ↓",
	},
	overview: {
		eyebrow: "Was es ist",
		titleHtml: "Es ist keine Notiz-App.<br />Es ist ein Betriebssystem für alles, was du weißt",
		lede:
			"Der Bildschirm ist ein echter Desktop — ein Hintergrundbild, App-Symbole, Fenster. Jedes Symbol ist seine eigene App, in einer Sandbox, und alle arbeiten mit einem Datenbestand, der bei dir bleibt: Wissensmanagement ohne die Cloud eines anderen dazwischen.",
		pillars: [
			{
				title: "Apps statt Funktionen",
				body:
					"Die Shell hostet nur Apps. Notizen, Datenbank, Dateien, Graph, ein Kalender, ein Code-Editor — nimm die, die du willst, lass den Rest weg und aktualisiere jede für sich.",
			},
			{
				title: "Deine Daten, deine Festplatte",
				body:
					"Jedes Dokument ist eine einfache Datei in einem Ordner, der dir gehört. Die Synchronisierung ist optional und Ende-zu-Ende-verschlüsselt — das Relay sieht immer nur verschlüsselte Bytes. Es gibt kein Konto, für das du dich anmelden musst.",
			},
			{
				title: "KI, die du steuerst",
				body:
					"Die Shell sitzt zwischen deinen Apps und jeder KI. Nutze deinen eigenen API-Schlüssel oder ein lokal laufendes Modell und entscheide genau, worauf jede App und jeder Agent zugreifen darf.",
			},
		],
	},
	inside: {
		eyebrow: "Ein Blick ins Innere",
		titleHtml: "Ein Satz Objekte.<br />Für jede Sichtweise eine eigene App",
		lede:
			"Jede App liest und schreibt denselben Vault, also ist eine Notiz, die du hier schreibst, dort eine Zeile und im Graphen ein Knoten — nie eine Kopie, nie ein Export.",
		more: "Jede App, vollständig beschrieben — Fähigkeiten und Screenshots →",
	},
	aiNative: {
		eyebrow: "KI-nativ",
		title: "Du und deine Agenten, an einem Ort",
		lede:
			"Die meisten Tools setzen KI obendrauf: ein Button in der Cloud eines anderen, der mit Daten arbeitet, die dir nicht gehören, ohne Aufzeichnung dessen, was er getan hat. Brainstorm fängt woanders an.",
		point1Html:
			"Dasselbe Hauptbuch, das entscheidet, worauf eine App zugreifen kann, entscheidet, worauf ein <strong>Agent</strong> zugreifen kann. Jede Erlaubnis ist konkret, protokolliert und leicht zurückzunehmen — und wenn das System eine Anfrage nicht verifizieren kann, sagt es einfach nein.",
		point2Html:
			"Deine Daten und deine Schlüssel bleiben auf deinem Rechner, sodass du Arbeit an eine KI übergeben kannst, die du nie an den Server eines Fremden schicken würdest. Das ist der Teil, den kein Cloud-Tool bieten kann: <strong>deine Daten verschlüsselt, Modelle auf deiner Hardware und eine Spur, wer was getan hat.</strong>",
		noteHtml:
			'Heute schon da: der KI-Broker, die Herkunftsnachweise und die Budgets. Agenten mit eigener Identität und eigener Historie stehen weiter unten auf der <a href="#roadmap">Roadmap</a> — nicht so dargestellt, als wären sie bereits fertig.',
	},
	capabilities: {
		eyebrow: "So funktioniert's",
		title: "Eine Handvoll Entscheidungen, überall eingehalten",
		// Reihenfolge folgt der englischen `capabilities`-Collection (order 1..6).
		items: [
			{
				title: "Apps, die du wählst — keine aufgezwungenen Funktionen.",
				summary:
					"Installiere Notizen, Datenbank, Dateien, Graph von uns. Installiere Drittanbieter-Apps aus dem Katalog oder per URL. Deinstalliere, was du nicht nutzt. Die Shell bleibt klein.",
			},
			{
				title: "Deine Daten, deine Festplatte.",
				summary:
					"Jedes Dokument ist eine Datei auf deinem Rechner. Die Synchronisierung ist optional und nutzt Yjs-CRDTs. Exportiere jederzeit in Standardformate. Kein Konto erforderlich, niemals.",
			},
			{
				title: "KI, wenn du sie willst — nie, wenn nicht.",
				summary:
					"Die Shell vermittelt jeden KI-Aufruf. Bring deinen eigenen Anbieter-Schlüssel mit oder betreibe das lokale Modell, das mit der Shell kommt. Budgets pro App begrenzen ausufernde Kosten.",
			},
			{
				title: "Anpassen, ohne den gemeinsamen Arbeitsbereich zu verschmutzen.",
				summary:
					"Datenbank-Ansichten, Dashboard-Layouts, Tastenkürzel, Theme — alles standardmäßig persönlich. Ein ausdrückliches „mit Team teilen“ hebt es auf Organisationsebene, wenn du es willst.",
			},
			{
				title: "Ein echtes App-SDK.",
				summary:
					"In einer Sandbox, fähigkeitsgesteuert, mit einem stabilen Vertrag. Baue eine App direkt aus Brainstorm heraus mit der Code-App und installiere sie aus einem lokalen Paket oder per URL.",
			},
			{
				title: "Im Offenen entworfen.",
				summary:
					"Jede Entscheidung, jeder Kompromiss und jede offene Frage wird aufgeschrieben und durchdacht, bevor sie ausgeliefert wird. Das Produkt ist das Ergebnis dieser Notizen, keine Marketing-Schicht obendrauf.",
			},
		],
	},
	roadmap: {
		eyebrow: "Roadmap",
		title: "Wohin es sich entwickelt",
		lede:
			"Wir entwickeln offen — der Plan und die offenen Fragen liegen alle im Repository. Hier ist, was im aktuellen Build steckt, woran wir gerade arbeiten und wohin es geht.",
		items: [
			{
				status: "Im Build",
				state: "done",
				title: "Die Shell und zwanzig Apps",
				body:
					"Ein Sandbox-Host mit einem Fähigkeiten-Hauptbuch, dem Vault und zwanzig Erstanbieter-Apps, die sich alle einen Objektraum teilen.",
			},
			{
				status: "Im Build",
				state: "done",
				title: "Lokale Daten, verschlüsselte Synchronisierung",
				body:
					"Jedes Dokument ist ein CRDT auf deiner Festplatte. Die Synchronisierung über mehrere Geräte ist optional und Ende-zu-Ende-verschlüsselt — deine Schlüssel verlassen nie deine Geräte.",
			},
			{
				status: "Fertig",
				state: "done",
				title: "Der KI-Broker",
				body:
					"Ein Weg für jeden KI-Aufruf — dein Schlüssel oder ein lokales Modell — mit einer Aufzeichnung bei jedem Objekt und einem Budget für jede App.",
			},
			{
				status: "Jetzt verfügbar",
				state: "done",
				title: "Öffentliche Beta",
				body:
					"Ein kostenloser, verschlüsselter Kern für mehrere Geräte, in dem du wirklich leben kannst — jetzt verfügbar für macOS, Windows und Linux, mit einem Ein-Klick-Weg, deine vorhandenen Notizen mitzunehmen.",
			},
			{
				status: "Gerade dran",
				state: "active",
				title: "Agenten als Teammitglieder",
				body:
					"KI, die eine eigene Identität, eigene Berechtigungen und eine Historie dessen hat, was sie getan hat — ein Betriebssystem für ein Team, das auf Agenten läuft.",
			},
			{
				status: "Auf der Roadmap",
				state: "next",
				title: "Ein mobiler Begleiter",
				body:
					"Dein Vault in deiner Tasche — eine Lese-und-Erfassungs-App für iOS und Android, die über denselben Ende-zu-Ende-verschlüsselten Kanal synchronisiert, sodass unterwegs erfasste Notizen im selben Objektraum landen.",
			},
			{
				status: "Auf der Roadmap",
				state: "next",
				title: "Ein App-Marktplatz",
				body:
					"Bau heute auf dem offenen SDK, dann entdecke, installiere und veröffentliche Apps von Drittanbietern — jede in derselben Sandbox, unter denselben Fähigkeiten-Erlaubnissen, die du steuerst.",
			},
		],
	},
	closer: {
		title: "Besitze deine Werkzeuge wieder",
		lede:
			"Kostenlos, lokal-first und deins. Lade die öffentliche Beta für macOS, Windows oder Linux herunter.",
		note:
			"Kein Konto erforderlich · Dein Vault ist ein Ordner, den du kontrollierst · Frei und quelloffen unter AGPL-3.0",
	},
};

const fr: HomeCopy = {
	seoTitle:
		"Brainstorm — un système d'exploitation local-first et natif de l'IA pour la gestion des connaissances, avec synchronisation chiffrée de bout en bout",
	seoDescription:
		"Brainstorm est un système d'exploitation local-first et natif de l'IA pour la gestion des connaissances. Vos applications, vos données et votre IA tournent toutes sur votre machine, avec une synchronisation chiffrée de bout en bout en option — et chaque application et chaque agent ne touche que ce que vous autorisez.",
	hero: {
		eyebrow: "Local-first · Natif de l'IA",
		title: "Un OS de bureau pour vous et votre&nbsp;IA.",
		lede:
			"Brainstorm exécute vos applications, vos données et votre IA sur votre propre machine. Installez ce dont vous avez besoin, gardez chaque fichier sur votre disque, et laissez l'IA vous aider — uniquement avec ce que vous lui confiez.",
		trustPre: "Local-first · Aucun compte requis ·",
		trustLink: "Voir en action ↓",
	},
	overview: {
		eyebrow: "Ce que c'est",
		titleHtml:
			"Ce n'est pas une appli de notes.<br />C'est un système d'exploitation pour tout ce que vous savez",
		lede:
			"L'écran est un vrai bureau — un fond d'écran, des icônes d'applications, des fenêtres. Chaque icône est sa propre application, isolée, toutes travaillant à partir d'un même ensemble de données qui reste chez vous : la gestion des connaissances sans le cloud d'un autre au milieu.",
		pillars: [
			{
				title: "Des applications, pas des fonctionnalités",
				body:
					"Le shell n'héberge que des applications. Notes, Base de données, Fichiers, Graphe, un calendrier, un éditeur de code — ajoutez celles que vous voulez, laissez le reste, et mettez chacune à jour séparément.",
			},
			{
				title: "Vos données, votre disque",
				body:
					"Chaque document est un simple fichier dans un dossier qui vous appartient. La synchronisation est optionnelle et chiffrée de bout en bout — le relais ne voit jamais que des octets brouillés. Il n'y a aucun compte à créer.",
			},
			{
				title: "Une IA que vous gouvernez",
				body:
					"Le shell se place entre vos applications et n'importe quelle IA. Utilisez votre propre clé d'API ou un modèle qui tourne localement, et décidez précisément ce que chaque application et chaque agent a le droit de toucher.",
			},
		],
	},
	inside: {
		eyebrow: "Un regard à l'intérieur",
		titleHtml:
			"Un seul ensemble d'objets.<br />Une application différente pour chaque façon de le voir",
		lede:
			"Chaque application lit et écrit le même coffre, si bien qu'une note que vous écrivez ici est une ligne là-bas et un nœud dans le graphe — jamais une copie, jamais un export.",
		more: "Chaque application, décrite en détail — capacités et captures d'écran →",
	},
	aiNative: {
		eyebrow: "Natif de l'IA",
		title: "Vous et vos agents, à partir d'un seul endroit",
		lede:
			"La plupart des outils greffent l'IA par-dessus : un bouton dans le cloud d'un autre, travaillant sur des données qui ne vous appartiennent pas, sans trace de ce qu'il a fait. Brainstorm part d'ailleurs.",
		point1Html:
			"Le même registre qui décide ce qu'une application peut atteindre décide ce qu'un <strong>agent</strong> peut atteindre. Chaque autorisation est précise, journalisée et facile à révoquer — et si le système ne peut pas vérifier une demande, il répond simplement non.",
		point2Html:
			"Vos données et vos clés restent sur votre machine, si bien que vous pouvez confier à l'IA un travail que vous n'enverriez jamais au serveur d'un inconnu. C'est ce qu'aucun outil cloud ne peut offrir : <strong>vos données chiffrées, des modèles sur votre matériel, et une trace de qui a fait quoi.</strong>",
		noteHtml:
			"Présents aujourd'hui : le courtier d'IA, la provenance et les budgets. Les agents dotés de leur propre identité et de leur propre historique sont sur la <a href=\"#roadmap\">feuille de route</a> ci-dessous — pas présentés comme s'ils étaient déjà livrés.",
	},
	capabilities: {
		eyebrow: "Comment ça marche",
		title: "Une poignée de décisions, tenues partout",
		// L'ordre suit la collection de contenu `capabilities` (order 1..6).
		items: [
			{
				title: "Des applications que vous choisissez, pas des fonctionnalités imposées.",
				summary:
					"Installez Notes, Base de données, Fichiers, Graphe de notre part. Installez des applications tierces depuis le catalogue ou une URL. Désinstallez ce que vous n'utilisez pas. Le shell reste léger.",
			},
			{
				title: "Vos données, votre disque.",
				summary:
					"Chaque document est un fichier sur votre machine. La synchronisation est optionnelle et utilise des CRDT Yjs. Exportez vers des formats standards à tout moment. Aucun compte requis, jamais.",
			},
			{
				title: "L'IA quand vous la voulez, jamais quand vous ne la voulez pas.",
				summary:
					"Le shell arbitre chaque appel d'IA. Apportez la clé de votre propre fournisseur, ou faites tourner le modèle local livré avec le shell. Des budgets par application plafonnent les coûts qui s'emballent.",
			},
			{
				title: "Personnalisez sans polluer l'espace de travail partagé.",
				summary:
					"Vues de base de données, dispositions du tableau de bord, raccourcis clavier, thème — tout est personnel par défaut. Un « partager avec l'équipe » explicite l'élève au niveau de l'organisation quand vous le souhaitez.",
			},
			{
				title: "Un vrai SDK d'applications.",
				summary:
					"Isolé, régi par les capacités, avec un contrat stable. Construisez une application depuis Brainstorm avec l'application Code, et installez-la depuis un paquet local ou une URL.",
			},
			{
				title: "Conçu au grand jour.",
				summary:
					"Chaque décision, chaque compromis et chaque question ouverte est écrit et débattu avant d'être livré. Le produit est le résultat de ces notes, pas une couche marketing par-dessus.",
			},
		],
	},
	roadmap: {
		eyebrow: "Feuille de route",
		title: "Où cela se dirige",
		lede:
			"Nous construisons au grand jour — le plan et les questions ouvertes sont tous dans le dépôt. Voici ce qui est dans le build actuel, ce sur quoi nous travaillons, et où cela va.",
		items: [
			{
				status: "Dans le build",
				state: "done",
				title: "Le shell et vingt applications",
				body:
					"Un hôte isolé avec un registre de capacités, le coffre, et vingt applications maison qui partagent toutes un même espace d'objets.",
			},
			{
				status: "Dans le build",
				state: "done",
				title: "Données locales, synchronisation chiffrée",
				body:
					"Chaque document est un CRDT sur votre disque. La synchronisation multi-appareils est optionnelle et chiffrée de bout en bout — vos clés ne quittent jamais vos appareils.",
			},
			{
				status: "Livré",
				state: "done",
				title: "Le courtier d'IA",
				body:
					"Un seul chemin pour chaque appel d'IA — votre clé ou un modèle local — avec une trace sur chaque objet et un budget sur chaque application.",
			},
			{
				status: "Disponible",
				state: "done",
				title: "Bêta publique",
				body:
					"Un cœur multi-appareils gratuit et chiffré dans lequel vous pouvez vraiment vivre — disponible dès maintenant pour macOS, Windows et Linux, avec un moyen en un clic d'y amener vos notes existantes.",
			},
			{
				status: "En cours",
				state: "active",
				title: "Les agents comme coéquipiers",
				body:
					"Une IA qui a sa propre identité, ses propres permissions et un historique de ce qu'elle a fait — un système d'exploitation pour une équipe qui tourne sur des agents.",
			},
			{
				status: "Sur la feuille de route",
				state: "next",
				title: "Un compagnon mobile",
				body:
					"Votre coffre dans votre poche — une application de lecture et de capture pour iOS et Android qui se synchronise par le même canal chiffré de bout en bout, si bien que les notes prises en déplacement atterrissent dans le même espace d'objets.",
			},
			{
				status: "Sur la feuille de route",
				state: "next",
				title: "Une place de marché d'applications",
				body:
					"Construisez dès aujourd'hui sur le SDK ouvert, puis découvrez, installez et publiez des applications tierces — chacune tournant dans la même sandbox, sous les mêmes autorisations de capacités que vous contrôlez.",
			},
		],
	},
	closer: {
		title: "Redevenez maître de vos outils",
		lede:
			"Gratuit, local-first et à vous. Téléchargez la bêta publique pour macOS, Windows ou Linux.",
		note:
			"Aucun compte requis · Votre coffre est un dossier que vous contrôlez · Libre et open source sous AGPL-3.0",
	},
};

const HOME: Record<Lang, HomeCopy> = { en, de, fr };

export function homeCopy(lang: Lang): HomeCopy {
	return HOME[lang];
}
