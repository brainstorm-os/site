---
date: 2026-07-30
title: An app can be two files — and the agent can write them
summary: How Brainstorm's app model stays small enough to type by hand yet grows to full React apps, what the built-in agent actually sees of your vault, and why the capability ledger doesn't care who wrote the code.
kind: decision
tags:
  - app-platform
  - agent
  - capabilities
author: Brainstorm's founder
source: brainstorm/docs/apps/03-app-model.md
---

Brainstorm is a desktop shell that hosts sandboxed apps — Notes, Tasks, Calendar, a Database, twenty-odd others. All of them are built the same way, on the same SDK, behind the same permission system. Which raises the obvious question: can *you* build one?

Yes, and the whole platform contract fits in one sentence: **a valid app is a `manifest.json` and an entry `index.html`.**

That's the floor, not the ceiling. A bundle can ship whatever its page needs — scripts, stylesheets, images, fonts, web workers — and the first-party apps are exactly that: full React bundles with the same two load-bearing pieces, a manifest and an entry page. What the floor buys you is that *no build step is required to reach it*: no bundler, no `npm install`, no terminal. A useful app really can be two files you write inside Brainstorm's own code editor and install straight out of your vault. And since the agent can draft code files too, you can also just describe the app you want — with the same guarantees either way. This post walks through why the minimum is that small, what the agent actually sees when it works in your vault, and why "who wrote the code" turns out not to matter.

## The manifest is data, not code

Here is a real manifest from the filmed demo — a small dashboard that reads project entities:

```json
{
  "id": "studio.northbound.client-pulse",
  "name": "Client Pulse",
  "version": "1.0.0",
  "sdk": "1",
  "entry": "index.html",
  "capabilities": ["entities.read:brainstorm/Project/v1"]
}
```

Six required fields. The interesting one is `capabilities`: every capability is a string with the shape `verb.noun:scope` — this app asks to *read entities of exactly one type*. Notes asks for more (`entities.write:io.brainstorm.notes/Note/v1`, `files.write`, `intents.dispatch:open`, …), but the grammar never changes, and the list is static. There is no API to request a capability at runtime — that was ruled out early, because dynamic permission escalation makes auditing an app's reach intractable. What the manifest declares at install time is everything the app will ever be able to ask for.

At install, that list is what you consent to. The sheet shows the app id, the version, the capability strings, and — for anything that didn't come from the catalog — a plain warning that the bundle is unsigned. Approve, and the grants are written to the vault's **capability ledger**. On update, the shell diffs the lists: a new capability always re-prompts. There is no silent escalation path.

## The page talks to a broker, not to your disk

The `index.html` side is ordinary web code. The only doorway out of its sandbox is `window.brainstorm`, injected by the shell. Every call on it — list entities, read a property, dispatch an intent — becomes a structured envelope carrying the service, the method, the arguments, and the app's identity, which is stamped by the shell's preload rather than by anything the app's JavaScript can touch. The main-process broker verifies the identity, checks the ledger, and only then forwards the call.

The check fails closed, and refusals are legible. When the filmed demo app oversteps its one granted capability, the broker answers in its own words:

> refused — studio.northbound.client-pulse lacks capability for vault-entities.list

What an app *cannot* get, from any API, at any trust level: filesystem paths, network sockets, other apps' state, or the raw IPC layer. The renderer runs with Electron's full sandbox on. Dev mode doesn't loosen any of this — sideloaded, hand-written, and first-party apps all face the same broker. That's a deliberate ordering of trust: **the sandbox is the safety guarantee, not the review process.**

## Install from your own vault

Since a small app is just text files, and Brainstorm has a code editor, the shortest possible path is: write the files in your vault, then install them from there. That path shipped in the latest builds. The Marketplace's *Install from…* menu offers *From vault code files…*, which finds groups of code-file entities that contain a `manifest.json`, validates them shell-side, and runs the result through the exact same installer — same consent sheet, same ledger write, same unsigned advisory. Bundles that carry more than text — icons, images, other binary assets — install through the same menu from a local folder or a `.brainstorm` file instead; the vault path is optimised for the code-editor loop.

One design detail worth naming: the install affordance lives in the shell's dashboard, not in the code editor. The editor is just another sandboxed app; giving it an "install" button would have created a new privileged surface reachable from app code. Keeping the gesture in trusted chrome means the vault-install feature added zero new attack surface reachable by any app.

## What the agent actually sees

The other way to get the two files written is to ask the built-in agent. Before explaining how that write happens, it's worth being precise about the agent's *read* side, because "AI in your private notes" deserves suspicion by default.

The agent's context is assembled by the shell's broker — never by the app hosting the conversation — and it has three layers:

1. **A self-model.** A short static preamble describing what the agent is and how it should behave. Its `CLAUDE.md`, if you like.
2. **The platform catalog.** Which apps are installed, which entity types exist, which tools the conversation has been granted. Derived live from the registry and the capability ledger.
3. **The shape of your graph — not its contents.** Counts by type, the type catalog, recently-touched titles. The working rule is five words: *shape is context, contents are retrieval.*

Actual note bodies reach the model only through retrieval: the agent runs a capability-gated hybrid search (full-text + vector, fused) and gets a bounded top-K of results to ground its answer, citing real entity ids. The Agent app holds **no general entity-read capability at all** — its reading power is literally "what search returns," not "walk the vault." Retrieved text is injected as quoted, untrusted content, never as instructions; the tool list for a turn is fixed by the capability intersection before the model says a word, so nothing the model generates — and nothing hostile hiding in a retrieved note — can add a tool to the set.

## The agent writes by proposing

Writes are stricter. Every "create something" tool the model can call is *propose, not persist*. When the agent drafts a note, a database row, or — since the current release — a **code file**, the draft is staged into an approval tray in the conversation. The loop intercepts the proposal before any dispatch happens; the acknowledgment the model receives says, in effect, "staged, not saved until approved." Approving the card is a human gesture in trusted chrome, and it performs exactly one entity create. Discarding writes nothing.

So the agent-built-app flow is: you describe the app; the agent stages `manifest.json` and `index.html` as two code-file proposals (bounded — an oversized file is refused outright, not truncated); you approve them into your vault; and then you install through the same vault-install picker as before, reviewing the same consent sheet. Provenance is recorded server-side on everything the agent proposed — which agent, which conversation — stamped from broker-verified identity, so an app (or a prompt injection) can't forge it.

Notice what the agent never touches: the installer. There is no "agent installs an app" capability, and the propose-code-file tool is double-gated — the conversation needs both the code-file write grant and the specific propose intent, or the tool simply isn't offered.

## The punchline: the ledger doesn't care who wrote the code

Three ways to produce the same bundle — type it in the code editor, sideload it from disk, or let the agent draft it for your approval. All three converge on the same installer, the same consent sheet, the same ledger entry, the same broker standing between the running app and your data. The finished app sees what it was granted; asking for more comes back refused, whoever the author was.

That convergence is the design. I didn't build a separate "AI app builder" with its own trust rules; I made the platform contract small enough that writing an app is within reach of a person typing for ninety seconds *or* a model drafting under supervision — and put all the safety in the one place that doesn't care about authorship.

There's a 90-second video of the whole loop — both files typed, installed, running on real data, refused when overstepping, then the agent drafting a second app — on the [home page](/). The beta is free, for macOS, Windows, and Linux, at [getbrainstorm.online](https://getbrainstorm.online), and the shell is source-available (AGPL) on [GitHub](https://github.com/brainstorm-os). The design docs behind this post — the app model, the SDK surface, and the agent harness — ship in the repo, in the same Markdown the product is built from.
