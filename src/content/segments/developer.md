---
order: 2
audience: Developers and power users
headline: An Electron shell, an IPC broker, a capability ledger, and a real SDK.
summary: If you read CHANGELOG before INSTALL.md and have opinions about CRDTs vs OT, here are the design docs. Here is the SDK. Build an app this weekend.
proof: The Code app lets you write Brainstorm apps from inside Brainstorm. Sandboxed, capability-gated, with a stable contract.
channels:
  - GitHub
  - HackerNews
  - Lobsters
  - Engineering podcasts
source: brainstorm/docs/platform/46-marketing-and-promotion.md §Audience — Segment 2
---

The short version: the shell is an **Electron + IPC + capability-ledger host**. Apps are **sandboxed renderers** with declared capabilities and a fixed-depth per-app pending queue. **Yjs** is the CRDT. **SQLite + FTS5** is the store. **Block Protocol** is the interop. **Lexical** powers rich text. The full architecture is in [What is Brainstorm](https://docs.getbrainstorm.online/start-here/what-is-brainstorm).

## Why you might care

- **The IPC envelope is a real contract.** Every host-service call goes through `{v, msg, app, service, method, args, caps}`. The broker validates structure, verifies the preload-stamped app id, checks capabilities against the per-vault ledger, and forwards to a service handler. Fail-closed; capability misses return `Unavailable`, not approval.

- **The SDK is real.** Manifest, capabilities, host services, versioning — all in the [SDK reference](https://docs.getbrainstorm.online/build/the-sdk). The Code app lets you write a Brainstorm app from inside Brainstorm. Build, install, debug — all in-product. The capability surface is documented.

- **Storage is local-first, repo-pattern, and runtime-agnostic.** `bun:sqlite` under tests, `better-sqlite3` in production. No inline SQL outside repos. Yjs persistence is snapshot+tail with per-update CRC32; compaction at 256 KiB tail.

- **Workers everywhere.** `utilityProcess.fork`-based workers handle storage and Yjs. The Broker hands envelopes to a `WorkerBridge`. App authors get Web Worker / SharedWorker patterns with a Worker SDK shim.

## The hooks

- [SDK reference](https://docs.getbrainstorm.online/build/the-sdk)
- [Capability model](https://docs.getbrainstorm.online/build/capabilities)
- [Shell-as-framework](https://docs.getbrainstorm.online/build/overview)
- [Roadmap](https://gitlab.com/brainstorm-os/shell/-/blob/main/ROADMAP.md) — what's done, what's in progress

## Build an app this weekend

[20-minute tutorial](/tutorials/build-your-first-app) · [Source](https://gitlab.com/brainstorm-os) · [Download](/download/mac)
