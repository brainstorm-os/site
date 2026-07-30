---
date: 2026-07-21
title: When an email can start a workflow
summary: Mail arriving in your vault can now fire an automation, with an AI step that reads the message and decides what happens next — and attachments stopped being second-class blobs.
kind: retrospective
tags:
  - mailbox
  - automations
  - agent
author: Brainstorm's founder
source: brainstorm-os/shell@v0.7.0
---

Most of what an inbox costs you is not reading. It is the small deterministic work that follows reading — filing, forwarding, turning a message into a task, remembering to answer on Thursday. That work is mechanical, and it has always been stuck behind a human because the mail lived in one place and the tools lived in another.

In this release it stops being stuck. A message arriving in your vault is an event the automation engine can trigger on.

## Mail is an entity, so mail is a trigger

Brainstorm's Mailbox does not hold your mail in a private store. Sync writes each message into the vault as an `Email` entity, the same kind of typed object every other app reads and writes. That was originally just an interop convenience — it is why a message can be linked from a note, or found by the same search that finds everything else.

It turns out to also be the whole feature. Automations already had an *entity-event* trigger: run this workflow when an object of this type appears or changes. Once mail is an entity, "when a new email arrives" is not a new mechanism at all. It is the mechanism that already existed, pointed at a type it hadn't been pointed at before.

The new piece is the step that decides. An **AI triage step** reads the message and branches — this is a receipt, this is a customer, this needs a human today. Everything downstream is the ordinary workflow vocabulary: create a task, tag it, file it, notify you.

## Attachments became real files

An attachment used to be a part of a message and nothing more: visible while you were looking at the mail, invisible to everything else you own.

Now every attachment is a `File` entity. It is searchable, it is linkable, it shows up in the Files app, and a note can point at it directly. The reading pane renders attachment chips from the message metadata alone — the chip exists before the bytes do, and clicking one fetches that part on demand rather than pulling a 40 MB deck down every time the message syncs. Reply and forward also learned HTML-aware quoting, so quoting a formatted message no longer flattens it.

## The assistant hands you a draft, not a sent message

The agent can now take a reply it has written and hand it to the Mailbox composer. It arrives as a draft, in your composer, with your cursor in it. The agent does not have a send button, and this release did not give it one.

That is the same line the rest of the product draws: an assistant is allowed to do the typing and not allowed to do the committing.

## A model downloads only if you ask for one

Semantic search runs on a model that lives on your machine. Previously that model was fetched when the feature initialised. Now it is fetched when you turn the feature on, behind an explicit consent step, and never before.

The distinction matters more than the megabytes. A local-first product that quietly reaches out to a network on first run has spent trust it did not have to spend. If Brainstorm is going to download something, you should have said yes to it first.

## The libraries are on npm

The pieces underneath — the block protocol implementation, the wire types, the capability model, the app SDK, the editor — are extracted as standalone packages published under the `@brainstorm-os` scope on npm, MIT-licensed. They are early (the first versions went out with this release), but they are real packages you can install, and they are the same ones the shell itself runs on.

Brainstorm is a free beta for macOS, Windows, and Linux at [getbrainstorm.online](https://getbrainstorm.online). No account required.
