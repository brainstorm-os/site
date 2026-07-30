---
date: 2026-07-22
title: Reaching out — real mail accounts, webhooks, and a release I had to cut twice
summary: Connecting Gmail, Microsoft 365 and Fastmail properly, giving automations three new ways to start, and the packaging mistake that made me re-cut the whole release a few hours later.
kind: retrospective
tags:
  - mailbox
  - automations
  - releases
author: Brainstorm's founder
source: brainstorm-os/shell@v0.8.1
---

A local-first notes app has an obvious failure mode: it becomes an island. Everything inside it is yours, private, fast — and completely disconnected from the systems where your actual work arrives. This release is about the bridges, and about what happened when I tried to ship them.

## Mail accounts, over the protocols the providers actually speak

Brainstorm could already talk IMAP. IMAP is the lowest common denominator, and it shows: no reliable send path, weak sync semantics, and a shape that fits none of the three services most people actually use.

So the Mailbox learned the transports each provider really speaks. **Gmail** and **Microsoft 365** connect over their own APIs — Graph for M365 — and **Fastmail** and anything else modern connects over **JMAP**. All three are full two-way: mail syncs in, and mail sends out from inside your vault.

Structurally nothing else changed. Each transport is an adapter behind the same connector seam; messages still land as `Email` entities in the vault, which is what lets them trigger automations and be linked from notes. Adding a provider does not add a concept — it adds a driver.

## Three new ways for an automation to start

Until now a workflow ran because you ran it, on a schedule, or because something changed inside the vault. This release lets the outside world start one.

- **Webhooks.** A workflow can be given its own URL, and runs whenever something POSTs to it. Locally that is a loopback listener; reachable-from-anywhere ingress goes through a relay client, so the workflow does not require you to open a port on your machine.
- **Watched files.** Point a workflow at a path and it runs when the file changes. The watch is a *persistent grant* — you consent to a specific location once, and it is recorded like every other capability, revocable in the same place.
- **Startup.** Run once each time the app launches. Unglamorous and, it turns out, the trigger people reach for first.

Together they cover the shape most personal automation actually has: something outside changes, so something inside should update.

## And then I shipped it broken on Windows

0.8.0 went out that afternoon with no working Windows installer.

The cause was not in the code. The release pipeline builds each platform on its own runner, and I published the GitHub release before every leg of that matrix had finished. Once a release is published, the packaging tool treats the missing asset as done rather than pending, and re-running the job does not backfill it. The result is a release page that looks complete and is not.

There is no elegant repair for that. The fix is to cut a new tag, so a few hours later 0.8.1 went out: the same "Reach out" release, re-cut cleanly so every platform publishes, and carrying a dependency bump for a CVE in the image library used for thumbnails.

Two things I took from it, both boring and both now enforced. Never publish a release draft before the last matrix leg reports in. And treat the packaging pipeline as part of the product — it is the only component every single user runs before they run anything else, and it was the one I had been testing least.

If you downloaded 0.8.0, the in-app updater moves you to 0.8.1 on its own.

Brainstorm is a free beta for macOS, Windows, and Linux at [getbrainstorm.online](https://getbrainstorm.online). No account required.
