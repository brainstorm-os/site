---
date: 2026-07-28
title: Attachments that follow your vault
summary: Why syncing bytes needed a second transport plane rather than a bigger CRDT, how the encryption nests so sharing and revocation come for free, and why identical files deliberately never dedupe.
kind: decision
tags:
  - sync
  - encryption
  - attachments
author: Brainstorm's founder
source: brainstorm/docs/data/70-encrypted-attachment-sync.md
---

Until this release, an image you dropped into a note lived on exactly one machine: the one you dropped it on. Open the same note on your desktop and the note was there, the entity was there, the file *reference* was there — and the bytes were not. Sync moved your notes. It did not move your files.

That gap was not an oversight. It was a design decision I had been deferring, and this release is where it got paid off.

## A 2 GB video is not a CRDT

Brainstorm syncs by replicating Y.Docs. Every entity is a CRDT document; the relay routes encrypted per-entity update envelopes and understands nothing else. This is a good substrate for the thing it was built for — small, frequent, conflicting edits from several devices — and a terrible one for a video file. Updates are chatty and kept in a tail; the merge semantics that make concurrent text editing work are pure overhead on an opaque blob you will never merge.

So the answer was not "make the CRDT plane handle bigger payloads". It was a second plane with a different shape:

| | Carries | Unit | Transport | Size |
|---|---|---|---|---|
| **Metadata plane** | the entity, including the file reference and its blob key | Y.Doc | relay, publish/subscribe | KB |
| **Blob plane** | the bytes | sealed chunk | content store, fetch-by-hash | MB–GB |

The `File` entity travels on the metadata plane, as it always did, and points at a blob. The blob travels on the blob plane, and only when a device actually needs it. One is chatty and small; the other is rare and large. Trying to serve both with one transport is how you get a sync engine that is bad at both.

The blob plane is not a new service, either — it is the existing sync node with a content-addressed store bolted on behind the same storage seam, sharing the same admission handshake and the same blindness guarantee.

## The keys nest, so sharing and revocation are already solved

Locally, every asset was already sealed under its own fresh key, wrapped under the vault master key. That is correct at rest and useless for sync: the master key never leaves your device, so a second machine could fetch the ciphertext and still not open it.

The change is where that per-asset key lives. For a synced attachment it is re-homed into the referencing entity's Y.Doc, wrapped under the entity's own key — which is already wrapped per member. The hierarchy nests:

```
member wrap    E_alice(entityDEK)          per device, on the metadata plane
  entity DEK   Enc(entityDEK, ydoc)        the entity document, synced via relay
    blob key   { assetId, blobKey, hash }  a field inside that document
      blob     Enc(blobKey, bytes)         the blob plane; the node sees only this
```

Two consequences fall out of that nesting without any additional machinery. **Sharing works already**: share the entity and the recipient can decrypt the blob reference, then fetch and open the bytes — there is no separate attachment ACL to get wrong. **Revocation works already**: removing a member rotates the entity key, exactly as it does for the entity's text. The blob store needs no concept of membership at all. It stores ciphertext keyed by the hash of that ciphertext, and authorises by key. It never holds a plaintext, a decryption key, or an access list.

## Identical files deliberately do not dedupe

Every asset gets a random key, not a key derived from its contents. That costs cross-user deduplication, and it is a deliberate trade.

Convergent encryption — deriving the key from the plaintext, so identical files produce identical ciphertext — is how content stores dedupe across users. It also leaks file equality: anyone who can see the store can test whether you hold a specific file by encrypting a copy and looking for the address. That is a confirmation-of-file attack, and it is a real one against a store that is supposed to know nothing about you.

So identical plaintext produces different ciphertext here, and the store cannot tell that two users hold the same document. A plaintext hash still exists for local dedup and integrity checking, and it never leaves the device — it is not the on-disk filename and it is never sent over the wire.

Bytes move as fixed 4 MiB chunks, each sealed and addressed independently, which is what makes a large upload resumable, a large download parallel, and an edit to a big file re-upload only the parts that changed.

## Eager where you look, lazy where you don't

The last decision is the one you actually feel. Full files are fetched **on access** — a cold device shows every file immediately, because the entities synced, and materialises the bytes the moment you open something. But a gallery of lazily-fetched files is a wall of grey rectangles, so there is one eager tier: **thumbnails always sync.** Previews are assets in their own right, with their own keys, riding the same machinery.

Add an image on your laptop, open the note on your desktop, and the preview is already there. Click it and the full file arrives. Nothing to manage, nothing quietly filling your disk.

## Also in this release

Same-network sync is now a switch you can actually flip, under Settings → Sync — early and opt-in, end-to-end encrypted with a device-bound handshake, no server in the middle. Something embarrassing next door to it also got fixed: sharing through a self-hosted relay on a private address silently never delivered the keys to the other person. It does now.

Elsewhere: the Browser learned a reader mode, and *Save to vault* keeps the readable article rather than just the URL. Apps badge their own icons — unread chats, agent proposals waiting for you, failed automation runs — with one combined count on the dock. And all twenty apps now speak Spanish, German, French, Italian and Portuguese.

Brainstorm is a free beta for macOS, Windows, and Linux at [getbrainstorm.online](https://getbrainstorm.online). No account required.
