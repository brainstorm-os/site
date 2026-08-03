---
date: 2026-08-03
title: An agent is a member, not a feature
summary: Most products bolt an assistant onto the side, a box in the corner with no standing in the thing it is helping you with. Brainstorm makes an agent a member of your vault instead, with a name, permissions from the same list a person holds, and a record of everything it did.
kind: decision
tags:
  - agent
  - capabilities
  - app-platform
author: Brainstorm's founder
source: brainstorm/docs/agents
---

Almost every product that added AI in the last two years added it the same way. A panel on the right. A box in the corner. Something you talk to, which then reaches into your data through a door nobody can see, with permissions nobody wrote down.

That shape has a problem I could not get past. The assistant has no standing in the thing it is helping you with. It is not a participant in your workspace, it is a visitor with a master key.

So in 0.13.0 an agent in Brainstorm is a member of your vault.

## What that actually means

It has a name and a face, and it appears in Settings then Team, next to the people. Not in a separate AI section. In the member list, because it is a member.

It holds permissions from the same list a person holds. Not a vaguer parallel set that means "AI stuff", which is how most products handle this and which is exactly how you end up unable to answer what the assistant can reach. Read this type, write that type. You grant them, you can see them, and you can take them away.

Everything else follows from that one decision.

You mention it in a channel by typing @ and its name, and it answers in the thread with the vault as context. You can make one the assignee of an automation, and it does the work when the automation fires. One agent can hand work to another, and the second runs with the permissions both of them hold, never more. That last rule matters more than it sounds: delegation is where most permission systems quietly leak, because the easy implementation gives the delegate whatever the delegator had.

It proposes, you approve. An agent does not write to your vault behind your back. Changes arrive as cards you read first, and nothing is saved until you say so.

## Being able to check

Granting permission is only half of it. The other half is finding out afterwards what was done with it.

Settings then AI now has an Agent activity panel: every run, every tool call, every refusal, filterable. Including the refusals, which is the part I care about most. "It did something" is not an answer, and neither is a clean log that only records successes. If an agent tried to reach something it was not allowed to reach, you should be able to see that it tried.

## Apps talking to each other

The other half of this release is smaller to describe and larger in consequence.

Until now each app was an island. Files knew about files. Tasks knew about tasks. If you wanted something from one while working in another, you went there yourself.

An app can now publish typed actions that other apps discover and call. In practice that means an action defined by one app turns up where you already are: in any object's overflow menu, in the editor's slash menu, as a step in an automation, and as something your agent can call for you.

You are asked before the first one runs, and asked again if the app later changes what that action does. An app cannot quietly widen its own reach by editing its own description, which is the obvious attack and the reason the re-prompt exists.

Those two things are the same idea from two directions. An agent is a member with permissions. An app is a member with permissions. Neither gets a hidden door.

## The rest

Two new themes: Porcelain, a flat paper white light theme with no gradients and no glass, and Graphite, its charcoal dark twin.

All twenty apps went through a design pass, so the same thing looks the same everywhere. One control height, one chip, one empty state.

And one fix I want to name properly rather than bury. In Journal, if you opened a new day and started typing immediately, the first words could be dropped. Once that happened, that day's body stayed blank on every later visit, even though the word count still showed the text, which is a genuinely horrible way to lose writing because the product keeps telling you it is there.

That is fixed. But the repair does not reach backwards, and I would rather say so here than let you discover it. It stops new entries from being lost. It cannot recover text that was already lost this way, because those words never reached the disk. If a day from before 0.13.0 still shows an empty body, that content is gone. We found two such days in our own vault.

0.13.0 is available now for macOS, Windows and Linux. Existing installs update from Settings then Updates. It is still a beta, so keep backups of anything important. Your vault is a plain folder you control completely.
