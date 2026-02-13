# JotBook

A minimal, fast desktop note-taking app. Auto-saves as you type, stores everything locally in SQLite. No cloud, no account.

![JotBook](https://res.cloudinary.com/drch6exvq/image/upload/v1770898129/Jotbook/Jotbook.jpg)

## Download

Grab the latest release from the [Releases page](https://github.com/jothachil/jotbook/releases/latest).

## Features

- **Auto-save** — 600ms debounce, nothing is ever lost
- **Markdown preview** — Toggle rendered preview with syntax highlighting
- **Export & copy** — Export as `.md` or copy raw markdown to clipboard
- **Keyboard shortcuts** — `⌘N` new note, `⌘B` toggle sidebar, `⌘P` toggle preview
- **Context menus** — Right-click for quick actions
- **Dark theme** — Native macOS title bar with orange accent

## Getting Started

```bash
git clone https://github.com/jothachil/jotbook.git
cd jotbook
npm install
npm start
```

## Build

```bash
npm run make
```

## License

MIT License

Copyright (c) 2026 John Thachil

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
