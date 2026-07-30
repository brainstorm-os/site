---
date: 2026-07-28
title: Attachments that follow your vault
summary: Files attached to your notes and entities now travel between your devices, with thumbnails always synced and full files fetched when you open them, and the encryption nests so sharing and revoking access come along for free.
kind: decision
tags:
  - sync
  - encryption
  - attachments
author: Brainstorm's founder
source: brainstorm/docs/data/70-encrypted-attachment-sync.md
---

Drop an image into a note on your laptop, open the note on your desktop, and the image is there. That is new. Until now sync moved your notes and left your files behind: the note arrived, the entity arrived, the file reference arrived, and the bytes stayed on the machine you added them to.

What you get is one behaviour with two speeds. Previews are always synced, so a gallery of photos or a folder of attachments looks right the moment a new device finishes its first sync. The full file downloads when you open it, which takes a second or two and happens once. Nothing needs managing, and a device does not quietly fill its disk with every attachment you have ever added.

Below that behaviour are three decisions worth explaining, because they determine what you can do with a synced attachment afterwards.

## Bytes move on their own plane

Brainstorm syncs by replicating Y.Docs. Every entity is a CRDT document, and the relay routes encrypted per-entity update envelopes without understanding anything else. That substrate is right for small, frequent, conflicting edits arriving from several devices, and wrong for a 2 GB video. Updates are chatty and kept in a tail, and the merge semantics that make concurrent text editing work are pure overhead on an opaque blob nobody will ever merge.

So the bytes got a second plane with a different shape:

| | Carries | Unit | Transport | Size |
|---|---|---|---|---|
| **Metadata plane** | the entity, including the file reference and its blob key | Y.Doc | relay, publish/subscribe | KB |
| **Blob plane** | the bytes | sealed chunk | content store, fetch-by-hash | MB to GB |

The `File` entity travels on the metadata plane as it always did, and points at a blob. The blob travels on the blob plane, and only when a device actually needs it. The blob plane is not a new service to run: it is the existing sync node with a content-addressed store behind the same storage seam, sharing the same admission handshake and the same blindness guarantee.

Bytes move as fixed 4 MiB chunks, each sealed and addressed independently. That is what makes a large upload resumable, a large download parallel, and an edit to a big file re-upload only the parts that changed.

## The keys nest, so sharing an attachment is just sharing the entity

Locally, every asset was already sealed under its own fresh key, wrapped under the vault master key. That is correct at rest and useless for sync, because the master key never leaves your device, so a second machine could fetch the ciphertext and still not open it.

What changed is where the per-asset key lives. For a synced attachment it moves into the referencing entity's Y.Doc, wrapped under the entity's own key, which is already wrapped per member:

```
member wrap    E_alice(entityDEK)          per device, on the metadata plane
  entity DEK   Enc(entityDEK, ydoc)        the entity document, synced via relay
    blob key   { assetId, blobKey, hash }  a field inside that document
      blob     Enc(blobKey, bytes)         the blob plane; the node sees only this
```

Two capabilities fall out of that nesting with no extra machinery. Sharing a note shares its attachments: the recipient can decrypt the blob reference, fetch the bytes and open them, and there is no separate attachment permission list to set or to get wrong. Removing someone from a shared entity takes their attachments with them, because removal rotates the entity key exactly as it does for the entity's text.

The blob store needs no concept of membership at all. It holds ciphertext keyed by the hash of that ciphertext, and authorises by key. It never sees a plaintext, a decryption key, or an access list.

## Identical files deliberately do not dedupe

Every asset gets a random key rather than a key derived from its contents. That gives up cross-user deduplication on purpose.

Convergent encryption, where the key comes from the plaintext so identical files produce identical ciphertext, is how content stores dedupe across users. It also leaks file equality: anyone who can see the store can test whether you hold a specific file by encrypting a copy and looking for the address. That is a real attack against a store whose whole promise is knowing nothing about you.

So identical plaintext produces different ciphertext here, and the store cannot tell that two people hold the same document. A plaintext hash still exists for local dedup and integrity checking. It never leaves the device, it is not the on-disk filename, and it is never sent over the wire.

## Moving bytes between your own machines

There is a second way to get files onto another device now, which is to skip the relay entirely. Sync over your local network is a switch under Settings → Sync, and two devices on the same Wi-Fi sync directly with no server in between, end-to-end encrypted with a device-bound handshake. It is early and opt-in, and it suits the case where both machines are yours and sitting in the same room. Sharing over a self-hosted relay on a private address also works properly now; it used to accept the share and silently never deliver the keys to the other person.

Elsewhere in the same build: the Browser learned a reader mode (Cmd/Ctrl+Shift+R) that strips a page down to the article, and *Save to vault* captures that readable content rather than only the link. Apps badge their own icons, so Chat counts unread messages, Agent counts approvals waiting for you, Automations counts failed runs, and the dock shows one combined number. Anytype imports route tasks and bookmarks to their native types, and a full vault export runs in the background. Notes and Tasks moved onto the shared properties panel, so an object's properties behave the same wherever you open it. All twenty apps now speak Spanish, German, French, Italian and Portuguese.

Brainstorm is a free beta for macOS, Windows, and Linux at [getbrainstorm.online](https://getbrainstorm.online). No account required.
