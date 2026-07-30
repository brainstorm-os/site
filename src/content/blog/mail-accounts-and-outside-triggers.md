---
date: 2026-07-22
title: Your mail accounts, and workflows that start from outside
summary: "Connect Gmail, Microsoft 365 or Fastmail over the protocol each provider actually speaks, then give a workflow three new ways to start: an incoming webhook, a file changing on disk, or the app launching."
kind: tutorial
tags:
  - mailbox
  - automations
  - connectors
author: Brainstorm's founder
source: brainstorm-os/shell@v0.8.1
---

You can now add a Gmail, Microsoft 365 or Fastmail account to the Mailbox and get a full two-way connection: mail syncs in, and mail sends out from inside your vault.

Brainstorm could already speak IMAP. It is supported nearly everywhere and it is thin: there is no reliable send path over it, the sync semantics are weak, and it fits none of the three services most people actually use. So the Mailbox learned the transports the providers really speak. Gmail and Microsoft 365 connect over their own APIs, Graph in the M365 case, and Fastmail (along with anything else modern) connects over JMAP. You add an account, sign in, and it syncs.

Structurally nothing else moved. Each transport is an adapter behind the same connector seam, and messages still land as `Email` entities in the vault. That is what keeps the rest of the product working on them: a message from your real work account can be linked from a note, found by the same search that finds everything else, and used as the trigger for an automation exactly as described in [the previous post](/blog/when-an-email-can-start-a-workflow).

## Three new ways a workflow can start

Until now a workflow ran because you ran it, because a schedule came round, or because something changed inside the vault. Now things outside the vault can start one too.

**Webhooks.** A workflow can be given its own URL and runs whenever something POSTs to it. That is a loopback listener locally; ingress you can reach from elsewhere goes through a relay client, so you do not have to open a port on your own machine. This is the hook for anything that can already POST somewhere when something happens, such as a form provider, a CI job, a payment processor, or a script on a server you own.

**Watched files.** Point a workflow at a path and it runs when the file changes. The watch is a persistent grant, so you consent to one specific location once and it is recorded like every other capability, revocable in the same place. It suits the folders other software writes into: a scanner's output directory, an export a tool drops nightly, a spreadsheet a colleague keeps updating in a shared folder.

**Startup.** Run once each time the app launches. It is the least glamorous of the three and the one people reach for first, because it is where the small catch-up jobs go that you would otherwise forget to run.

Between them they cover the shape most personal automation has, which is that something outside changed and something inside should follow.

All of this arrived in 0.8.1; install that rather than 0.8.0, which published without a working Windows installer. Existing installs update themselves from Settings → Updates.

Brainstorm is a free beta for macOS, Windows, and Linux at [getbrainstorm.online](https://getbrainstorm.online). No account required.
