---
date: 2026-07-24
title: The agent proposes, you commit — and the eight hours it didn't
summary: How Brainstorm's assistant writes into your vault without ever being able to save anything, and the capability bug I shipped that silently turned the whole feature back into a chat box on the day it launched.
kind: retrospective
tags:
  - agent
  - capabilities
  - releases
author: Brainstorm's founder
source: brainstorm-os/shell@v0.9.1
---

The interesting question about an AI in your notes is not what it can read. It is what it can write, and who decides.

This release is my answer: the agent drafts real objects into your vault — a contact, a follow-up task, a calendar event, a bookmark, a note — and every one of them arrives as a card you approve or throw away. You say *"just got off a call with a lead, set me up to follow through"*, and you get three cards. Fix a field it got wrong. Keep two. Bin the third. The ones you keep become real Contacts, Tasks and Calendar rows, indistinguishable from the ones you typed yourself.

It also shipped with a bug that broke exactly that, for about eight hours. Both halves are below, because the second half is the more useful one.

## Propose is a different verb from persist

Every creating tool the model can call is a *propose* tool, not a *create* tool. That is not a naming convention — it is where the code forks.

When the model calls `propose-task`, the agent loop intercepts the call before anything is dispatched to the vault. The draft is staged into an approval tray inside the conversation, and the acknowledgement handed back to the model says, in effect, *staged, not saved*. No write has occurred. If the conversation ends there, nothing exists.

Approving a card is a human gesture in trusted chrome, and it performs exactly one entity create — the one on the card in front of you. Discarding writes nothing at all. There is no batch mode, no "approve all future proposals", no setting that turns the tray off.

The consequence is the property I actually wanted: **a hidden instruction buried in a document you pasted can, at absolute best, cause a card to appear.** It cannot cause a save. Prompt injection against this agent is not a privilege escalation, it is a way to waste your time.

The tool list is fixed the same way. Which tools a conversation is offered is computed *before* the model produces a token, from the intersection of the app's granted capabilities and the conversation's own grants. Nothing the model generates — and nothing hiding in a retrieved note — can add a tool to the set mid-turn.

## And then the tool list came back empty

0.9.0 was tagged at 11:09 UTC. By early afternoon I was filming the demo against a packaged build, and the agent would not propose anything. Asked to draft a contact, it wrote a nice paragraph *about* drafting a contact. It had quietly degraded into a chat box — which is to say, into the exact product I had just spent a release not shipping.

The cause was one dropped field. Capabilities in Brainstorm are strings of the form `service.verb:scope`, and the agent's propose tools are gated on scoped grants like `intents.dispatch:propose-task`. When the shell launches an app it hands that app's grants to the renderer — and the launch orchestrator was rebuilding each grant as `service.verb`, discarding `scope`. Every scoped grant arrived as a bare verb. The comparison that decides which propose tools to offer therefore matched nothing, so nothing was offered, so the model had no way to propose and did the only thing left available to it: talk.

Three things about that failure are worth naming.

It was not a security hole — the check that lost information was the one deciding what to *offer*, and it failed in the safe direction, toward fewer capabilities rather than more. It was invisible, because a fail-closed system fails **quietly**: there was no error, no refusal, no log line, just an absence. And it only bit in a packaged build, on the launch path that development mode does not exercise the same way, which is precisely why my tests were green while the product was broken.

0.9.1 went out the same evening, at 19:03 UTC. It restores the scope on launch, and carries two other things the same session turned up: video and audio in the editor were being blocked because every app's content-security policy declared `img-src` and not `media-src`, and `/columns` in the slash menu was inserting a table.

The lesson I wrote down: test capability **scopes**, not just capability grants. An assertion that an app "has `intents.dispatch`" would have passed happily through the entire outage.

## Also in this release

The shell and every built-in app now speak French, German, Italian and Portuguese alongside English and Spanish. Notion pages import as clean Markdown notes. Files downloaded in the built-in browser save straight into the vault. The first pieces of same-network sync landed too — the peer transport and roster admission — though it is plumbing at this point, not yet a switch you can flip.

If you installed 0.9.0, the in-app updater moves you to 0.9.1. Sorry about the afternoon.

Brainstorm is a free beta for macOS, Windows, and Linux at [getbrainstorm.online](https://getbrainstorm.online). No account required.
