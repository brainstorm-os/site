---
date: 2026-07-30
title: An app can be two files
summary: The whole platform contract is a manifest and an entry page, so you can extend your own workspace with a tool nobody else would ever build, typed by hand in the code editor or described to the agent and approved into your vault.
kind: decision
tags:
  - app-platform
  - agent
  - capabilities
author: Brainstorm's founder
source: brainstorm/docs/apps/03-app-model.md
---

Brainstorm is a desktop shell that hosts sandboxed apps. Notes, Tasks, Calendar, a Database and about twenty others are all built on the same SDK, and they all stand behind the same permission system. You can build one too, and the platform contract fits in a sentence: a valid app is a `manifest.json` and an entry `index.html`.

That is the floor rather than the ceiling. A bundle can ship whatever its page needs, including scripts, stylesheets, images, fonts and web workers, and the first-party apps are exactly that, full React bundles with the same two load-bearing pieces. What the low floor buys you is that no build step is required to reach it. You need no bundler and no terminal. A useful app really can be two files you write inside Brainstorm's own code editor and install straight out of your vault.

The reason that matters is the class of tool it makes worth building. A dashboard that reads your project entities and shows exactly the four numbers you care about is a twenty-minute job at this size and an unthinkable one if it needs a toolchain. Nobody is ever going to ship that app to a marketplace, because it is yours. This post walks through why the minimum is that small, what the agent sees when it works in your vault, and how the same install path handles code you wrote and code you approved.

## The manifest is data, not code

Here is a real manifest from the filmed demo, a small dashboard that reads project entities:

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

There are six required fields, and the load-bearing one is `capabilities`. Every capability is a string of the form `verb.noun:scope`, so this app is asking to read entities of exactly one type. Notes asks for more, including `entities.write:io.brainstorm.notes/Note/v1`, `files.write` and `intents.dispatch:open`, but the grammar never changes and the list is static. There is no API for requesting a capability at runtime. That was ruled out early, because dynamic permission escalation makes an app's reach impossible to audit. What the manifest declares at install time is everything the app will ever be able to ask for, which is also what makes the install sheet worth reading.

At install, that list is what you consent to. The sheet shows the app id, the version, the capability strings, and, for anything that did not come from the catalog, a plain warning that the bundle is unsigned. Approve, and the grants are written to the vault's capability ledger. On update, the shell diffs the lists, and a new capability always re-prompts.

## The page talks to a broker

The `index.html` side is ordinary web code. The only doorway out of its sandbox is `window.brainstorm`, injected by the shell. Every call on it, whether listing entities, reading a property or dispatching an intent, becomes a structured envelope carrying the service, the method, the arguments, and the app's identity. That identity is stamped by the shell's preload rather than by anything the app's JavaScript can touch. The main-process broker verifies it, checks the ledger, and only then forwards the call.

The check fails closed, and refusals are legible. When the demo app calls `vault-entities.list`, which it never asked for, the answer names the app and the method it lacks the capability for, so you can read the refusal and know exactly which line of the manifest would have permitted it.

An app cannot obtain filesystem paths, network sockets, other apps' state, or the raw IPC layer through any API at any trust level. The renderer runs with Electron's full sandbox on, and dev mode loosens none of it. Sideloaded, hand-written and first-party apps all face the same broker, which is why a hand-written app is a reasonable thing to run at all: the safety comes from the sandbox, and no review process has to stand in for it.

## Install from your own vault

Since a small app is just text files, and Brainstorm has a code editor, the shortest path runs entirely inside the product. Write the files in your vault, then install them from there. The Marketplace's *Install from…* menu offers *From vault code files…*, which finds groups of code-file entities containing a `manifest.json`, validates them shell-side, and runs the result through the same installer everything else uses, with the same consent sheet, the same ledger write and the same unsigned advisory. Bundles carrying more than text, such as icons and images, install from a local folder or a `.brainstorm` file through the same menu; the vault path is tuned for the code-editor loop.

The install affordance lives in the shell's dashboard rather than in the code editor, deliberately. The editor is another sandboxed app, and giving it an install button would have created a privileged surface reachable from app code. Keeping the gesture in trusted chrome meant the vault-install feature added no new attack surface any app can reach.

## What the agent sees

The other way to get the two files written is to ask the agent. Before the writing, it is worth being precise about the reading, because an AI with access to your private notes deserves suspicion by default.

The agent's context is assembled by the shell's broker rather than by the app hosting the conversation, and it has three layers. There is a short static preamble describing what the agent is and how it should behave. There is the platform catalog: which apps are installed, which entity types exist, which tools this conversation has been granted, all derived live from the registry and the capability ledger. And there is the shape of your graph rather than its contents, meaning counts by type, the type catalog, and recently touched titles.

Note bodies reach the model only through retrieval. The agent runs a capability-gated hybrid search, full-text and vector fused, and gets a bounded top-K of results to ground its answer, citing real entity ids. The Agent app holds no general entity-read capability at all, so its reading power is what search returns rather than a walk of your vault. Retrieved text is injected as quoted, untrusted content, never as instructions, and the tool list for a turn is fixed by the capability intersection before the model produces a token.

## The agent writes by proposing

Writes are stricter. Every creating tool the model can call stages a draft instead of persisting one. When the agent drafts a note, a database row, or, since the current release, a code file, the draft goes into an approval tray in the conversation. The loop intercepts the proposal before any dispatch happens, and the acknowledgement the model receives says the draft is staged and not saved. Approving the card is a gesture you make in trusted chrome, and it performs exactly one entity create. Discarding writes nothing.

So the agent-built-app flow runs like this. You describe the app. The agent stages `manifest.json` and `index.html` as two code-file proposals, bounded in size, with an oversized file refused outright rather than truncated. You read them, approve them into your vault, and install through the same vault-install picker, reviewing the same consent sheet. Provenance is recorded server-side on everything the agent proposed, covering which agent and which conversation, stamped from broker-verified identity so neither an app nor a prompt injection can forge it.

The agent never touches the installer. There is no capability for installing an app, and the propose-code-file tool is double-gated: the conversation needs both the code-file write grant and the specific propose intent, or the tool is not offered at all.

## Three routes, one installer

You can type a bundle in the code editor, sideload it from disk, or have the agent draft it for your approval. All three arrive at the same installer, the same consent sheet, the same ledger entry, and the same broker sitting between the running app and your data. The finished app gets what it was granted, and asking for more comes back refused whoever wrote it.

Practically, that means the cost of extending your own workspace is now the cost of describing what you want. If you have wanted a view of your own data that no product ships, you can have it this afternoon, and you do not have to trust it any further than the capabilities you approved.

There is a 90-second video of the whole loop on the [home page](/): both files typed, installed, running on real data, refused when overstepping, then the agent drafting a second app. The beta is free for macOS, Windows and Linux at [getbrainstorm.online](https://getbrainstorm.online), and the shell is source-available (AGPL) on [GitHub](https://github.com/brainstorm-os). The design docs behind this post ship in the repo, in the same Markdown the product is built from.
