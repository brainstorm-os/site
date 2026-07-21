---
date: 2026-07-21T00:00:00Z
version: "0.7.0"
channel: beta
status: published
summary: "Your inbox starts working for you: email triggers automations with an AI-triage step, attachments become real files you can search and link, and the assistant drafts replies straight into your composer."
highlights:
  - "Mailbox — a new email can fire an automation, with an AI-triage step that reads the message and decides what to do."
  - "Mailbox — attachments become first-class File entities you can search, link, and reuse; the reading pane shows attachment chips you open in place."
  - "Mailbox — reply and forward preserve the original's formatting with HTML-aware quoting."
  - "Agent — hand an assistant reply straight to the Mailbox composer as a ready-to-send draft."
  - "Search — the on-device semantic-search model downloads only when you opt in, never silently."
  - "For developers — the Brainstorm SDK is now on npm under @brainstorm-os: design tokens, types, React-Yjs hooks, Block Protocol, the SDK, and the editor (MIT)."
assets:
  - platform: mac
    label: Apple silicon
    href: https://github.com/brainstorm-os/shell/releases/download/v0.7.0/Brainstorm-0.7.0-arm64.dmg
  - platform: mac
    label: Intel
    href: https://github.com/brainstorm-os/shell/releases/download/v0.7.0/Brainstorm-0.7.0.dmg
  - platform: windows
    label: Installer (.exe)
    href: https://github.com/brainstorm-os/shell/releases/download/v0.7.0/Brainstorm-Setup-0.7.0.exe
  - platform: linux
    label: AppImage (x86_64)
    href: https://github.com/brainstorm-os/shell/releases/download/v0.7.0/Brainstorm-0.7.0-x86_64.AppImage
  - platform: linux
    label: AppImage (arm64)
    href: https://github.com/brainstorm-os/shell/releases/download/v0.7.0/Brainstorm-0.7.0-arm64.AppImage
  - platform: linux
    label: Debian (.deb)
    href: https://github.com/brainstorm-os/shell/releases/download/v0.7.0/Brainstorm-0.7.0-amd64.deb
---

The release where your inbox starts doing the work. A new message can now
**trigger an automation** — an AI-triage step reads the mail and decides what
happens next, so sorting, labelling, and routing run without you. Every
**attachment becomes a real File** you can search, link, and reuse, and the
reading pane surfaces attachment chips you open in place. Replies and forwards
keep the original's formatting with HTML-aware quoting.

Your **assistant** joins the loop too: draft a reply and hand it straight to
the Mailbox composer, ready to send. **Semantic search** stays on your terms —
the on-device model downloads only when you opt in, never silently.

And for people building on Brainstorm: the SDK is now on **npm** under
`@brainstorm-os` — design tokens, types, the React-Yjs hooks, Block Protocol,
the SDK, and the editor, all MIT-licensed.
