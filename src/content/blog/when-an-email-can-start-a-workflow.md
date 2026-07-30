---
date: 2026-07-21
title: When an email can start a workflow
summary: Mail lands in your vault as a typed object, so an automation can trigger on it, an AI step can read it and branch, and every attachment becomes a file you can search, link and reuse anywhere else.
kind: tutorial
tags:
  - mailbox
  - automations
  - agent
author: Brainstorm's founder
source: brainstorm-os/shell@v0.7.0
---

A message that arrives in your vault can now start an automation. In the Automations app you pick the entity-event trigger, point it at `Email`, and the workflow runs on each new message: read it, classify it, create a task from it, tag it, file it away, link it to a project, or notify you.

This works because the Mailbox does not keep your mail in a private store of its own. Sync writes each message into the vault as an `Email` entity, the same kind of typed object the rest of the product reads and writes. Automations already had a trigger that fires when an object of a given type appears or changes, so mail became automatable by pointing an existing mechanism at a type it had not been pointed at before.

The genuinely new piece is a step called AI triage. It reads a message and branches on what it found, so a receipt takes one path and a customer asking a question takes another. Each branch then continues in the ordinary workflow vocabulary. A receipt can become a row in an expenses database with the amount pulled out of the body. A customer question can become a task with a due date, assigned to you, linked back to the original message so the thread stays one click away.

The practical effect is that the mechanical half of an inbox stops needing you. Filing, forwarding, turning a message into a task, remembering to answer on Thursday: those are rules, and now they can live somewhere that runs them.

## Attachments you can use somewhere else

Every attachment becomes a `File` entity when the message syncs. It shows up in the Files app, search finds it, and a note can link straight to it. The deck a client sent you in March becomes something you reference from a project page instead of something you go hunting for in a thread.

The reading pane builds its attachment chips out of message metadata alone, so the chip exists before the bytes do. Clicking one fetches that part on demand, which is why a 40 MB slide deck does not come down on every sync just because it is sitting in a message you have not opened.

Reply and forward also learned HTML-aware quoting, so quoting a formatted message keeps the formatting instead of flattening it.

## A reply the agent drafts and you send

The agent can take a reply it has written and hand it to the Mailbox composer. It arrives as a draft, in your composer, with your cursor in it. The agent has no send button, and this release did not add one. It does the typing; you do the committing.

## Semantic search downloads its model when you ask for it

Semantic search runs on a model that lives on your machine. That model is now fetched when you switch the feature on, behind an explicit consent step, instead of when the feature initialises. If Brainstorm is going to pull something down over the network, you should have said yes to it first.

## The libraries are on npm

The pieces underneath the product are now standalone packages under the `@brainstorm-os` scope on npm, MIT-licensed: the Block Protocol implementation, the wire types, the capability model, the app SDK, and the editor. The first versions went out with this release, so they are early, but they are real packages you can install and they are the same ones the shell itself runs on. If you want to work with the entity model without building on top of the shell, that path exists now.

Brainstorm is a free beta for macOS, Windows, and Linux at [getbrainstorm.online](https://getbrainstorm.online). No account required.
