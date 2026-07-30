---
date: 2026-07-24
title: What the agent can put in your vault
summary: The assistant now drafts real notes, tasks, events, bookmarks and contacts as cards you edit and approve, which makes it safe to ask it for broad, messy work instead of one careful thing at a time.
kind: decision
tags:
  - agent
  - capabilities
  - automations
author: Brainstorm's founder
source: brainstorm-os/shell@v0.9.1
---

Ask the agent in chat and it now produces objects rather than prose. Notes, tasks, calendar events, bookmarks and contacts arrive as cards in the conversation. You edit a field it got wrong, approve the ones you want, and discard the rest. What you keep becomes a real Contact, Task or Calendar row, indistinguishable from one you typed yourself and visible to every other app that reads that type.

A useful way to feel the difference is a wide request. Say "just got off a call with a lead, set me up to follow through" and you get a contact with the name and company filled in, a task to send the proposal, and an event for the follow-up call on Thursday. That is three objects across three apps, produced in one turn from one sentence. Or point it at a long meeting note and ask for the actions, and the action items come back as tasks with owners and dates already on them.

## Why approving is the useful part

Every creating tool the model can call is a *propose* tool. When the model calls `propose-task`, the agent loop catches the call before anything reaches the vault, stages the draft into the approval tray in the conversation, and tells the model that the draft is staged rather than saved. No write has happened. If you close the conversation there, nothing exists.

Approving a card is a gesture you make in the shell's own chrome, and it performs exactly one entity create: the one on the card in front of you. Discarding writes nothing. There is no batch mode, no "approve everything from now on", and no setting that turns the tray off.

That constraint is what makes the feature comfortable to use broadly. Because the worst outcome of a bad turn is a card you delete, you can hand the agent vague work, big documents, and other people's text without first reasoning about what it might do with them. A hidden instruction buried in a PDF someone sent you can, at its absolute best, cause a card to appear in your tray, and it cannot cause a save. That turns a whole category of risk into a mild waste of your time, and it means you can ask for ten things and keep four.

The tool list is fixed on the same principle. Which tools a conversation is offered is computed before the model produces a token, from the intersection of the app's granted capabilities and the conversation's own grants. Nothing the model generates, and nothing hiding in a retrieved note, can add a tool to the set part-way through a turn.

Everything the agent proposes also carries provenance recorded on the server side: which agent produced it, in which conversation, stamped from broker-verified identity so an app cannot forge it. Objects show a back-link chip pointing at the conversation they came from, so in three weeks you can still tell where a task came from and read the exchange that produced it.

The same shape extends to your databases. Proposing a row in a database you already have, and proposing a whole new database with its properties, are built on the same tray and land in the next build.

## Getting more out of the tray

Two habits make this pay off. The first is asking for the whole outcome rather than one object, because approving four cards costs about as much attention as approving one, and the agent is better at seeing the follow-up task than you are at remembering it. The second is treating discards as free. There is no penalty for a proposal you throw away, which makes it worth asking speculatively: give it a page of notes and ask what should exist afterwards, and read the answer as a list of options rather than a plan you have to accept.

The tray also pairs well with the rest of the vault. Because an approved card creates an ordinary typed entity, anything already watching that type sees it. A task the agent proposed and you approved can start the same automation as a task you typed, and a contact it drafted is a contact the Mailbox will match against.

Alongside this, the shell and every built-in app now speak French, German, Italian and Portuguese as well as English and Spanish, Notion pages import as clean Markdown notes, files downloaded in the built-in browser save straight into the vault, and form fields can show and hide based on earlier answers. The first pieces of same-network sync landed too, the peer transport and roster admission, though that is plumbing at this stage rather than something you can switch on. Install 0.9.1 rather than 0.9.0: the first tag shipped a capability bug that left the propose tools unavailable, and the same-evening patch restores them.

Brainstorm is a free beta for macOS, Windows, and Linux at [getbrainstorm.online](https://getbrainstorm.online). No account required.
