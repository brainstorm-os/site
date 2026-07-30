---
date: 2026-05-20
title: Why Brainstorm is a shell, not an editor
summary: The shell knows how to host apps and nothing about what they mean, which is what lets you install only the tools you want, remove them without migrations, and run two apps over the same data without either of them owning it.
kind: decision
tags:
  - architecture
  - design-decision
author: Brainstorm's founder
source: brainstorm/docs/foundations/01-vision.md
---

Most knowledge tools grow the same way. They start with one strong primitive, usually a document or a block, and add features to it as people ask. The block editor accumulates databases, the databases accumulate a query language, and by the third year every concept in the product is a concept the core has to know about. Users feel that as a tool which keeps getting heavier whether or not they use the parts being added.

Brainstorm starts from the other end: the shell is responsible for hosting apps, and knows nothing about what any of them mean.

## What the shell knows

It knows how to launch an app, give it a window, broker its access to shared services, persist its state, sync it across devices, and uninstall it cleanly. It does not know what an app does. There is no `Page`, `Task` or `Note` concept anywhere in the shell.

Apps own the concepts. They interoperate by speaking a common language of typed entities, embeddable blocks and host-mediated intents, and never by reaching into each other.

## What that gives you

**A workspace with only the parts you use.** Adding a feature to Brainstorm means installing an app. If you have no use for the whiteboard, you do not have a whiteboard, and its absence costs you nothing anywhere else. The shell does not get bigger when the product does.

**Removal without consequences.** Uninstall the PDF editor and the rest of the system keeps working. A document that used to embed a PDF falls back to a default block view rather than showing an error, because the block was always a typed thing the shell could render generically. There is no migration to run and nothing to repair, so trying an app is cheap in both directions.

**Two apps over the same data.** Several apps can read and write entities of the same type, and no app is the owner of a type. Schema belongs to the data. That is what makes it reasonable to use the built-in Tasks app and a task view you wrote yourself on the same tasks, or to swap one out later without exporting anything. It is also why a third-party app can be genuinely useful rather than a silo with an import button.

**Your own tools are first-class.** Because there is no privileged core, an app you write faces the same shell, the same SDK and the same permission system as Notes does. It is made of the same parts the product is made of, which is why [a useful app can be two files](/blog/an-app-can-be-two-files).

## The trade

A monolithic editor with a single document model does a few things a host of apps cannot do easily, such as instant transformations across every block, or one undo stack covering the whole product. Brainstorm gives those up in exchange for a system where adding a feature next year does not mean editing six existing ones, and where you can throw a feature away without the rest noticing.

For a product meant to still be maintainable in ten years, that is the trade worth making. The full case is in `docs/foundations/01-vision.md`, which ships with the source on [GitHub](https://github.com/brainstorm-os).
