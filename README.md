# JotBook

A minimal, fast desktop note-taking app built with Electron and React. Notes are stored locally in SQLite and auto-saved as you type.

![JotBook](https://res.cloudinary.com/drch6exvq/image/upload/v1770898129/Jotbook/Jotbook.jpg)

## Download

Grab the latest release from the [Releases page](https://github.com/jothachil/jotbook/releases/latest).

## Features

- **Auto-save** — Notes save automatically with a 600ms debounce, so nothing is lost.
- **Markdown preview** — Write in plain text with a monospace editor, toggle preview mode with syntax highlighting powered by Shiki.
- **Export to Markdown** — Export any note as a `.md` file via a native save dialog.
- **Copy markdown** — Copy the raw markdown content to clipboard with one click.
- **Duplicate notes** — Quickly duplicate a note including its content.
- **Keyboard shortcuts** — `⌘N` / `Ctrl+N` to create a new note, `⌘B` / `Ctrl+B` to toggle the sidebar.
- **Context menus** — Right-click any note for quick actions (new, duplicate, export, delete).
- **Dark theme** — A neutral palette with an orange accent, using Geist for UI and IBM Plex Mono for the editor.
- **Native feel** — macOS-style hidden title bar with traffic light controls and draggable regions.

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop | Electron 40 |
| Build | Electron Forge + Vite |
| UI | React 19 + React Compiler |
| Styling | Tailwind CSS v4 |
| Components | Radix UI / shadcn/ui |
| Animations | Framer Motion |
| Icons | Tabler Icons |
| Markdown | unified + remark + rehype + Shiki |
| Database | better-sqlite3 (SQLite, WAL mode) |
| Linting | Biome |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/jothachil/jotbook.git
cd jotbook
npm install
```

### Development

```bash
npm start
```

This launches the Electron app in development mode with hot-reload via Vite.

### Linting & Formatting

```bash
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues
npm run format        # Format all files
```

### Packaging

```bash
npm run make
```

Builds platform-specific distributables:

- **macOS** — ZIP
- **Windows** — Squirrel installer
- **Linux** — DEB / RPM

## Project Structure

```
src/
├── main.js              # Electron main process & IPC handlers
├── preload.js           # Context bridge (window.api)
├── renderer.jsx         # React entry point
├── App.jsx              # Root component & state management
├── database.js          # SQLite CRUD operations
├── index.css            # Tailwind config & theme variables
├── components/
│   ├── Editor.jsx       # Note editor with lazy-loaded preview
│   ├── EmptyState.jsx   # Placeholder when no note selected
│   ├── MarkdownPreview.jsx  # Rendered markdown with syntax highlighting
│   ├── NoteItem.jsx     # Note row with context menu
│   ├── Sidebar.jsx      # Collapsible note list
│   ├── Toolbar.jsx      # Top bar actions
│   ├── DeleteNoteDialog.jsx
│   ├── ToastHost.jsx    # Toast notifications
│   └── ui/              # shadcn/ui primitives
├── lib/
│   └── utils.js         # cn() class name helper
└── utils/
    └── formatDate.js    # Relative date formatting
docs/
└── index.html           # Landing page (GitHub Pages / Vercel)
```

## Architecture

The app follows Electron's standard three-process model:

1. **Main process** (`main.js`) — Creates the browser window, registers IPC handlers, and manages the SQLite database.
2. **Preload script** (`preload.js`) — Exposes a safe `window.api` bridge via `contextBridge` for the renderer to call database operations.
3. **Renderer** (`App.jsx`) — A React app that manages UI state, handles keyboard shortcuts, and communicates with the main process through the exposed API.

Notes are persisted in a SQLite database (`notes.db`) stored in the app's user data directory with WAL mode enabled for better performance. The markdown preview pipeline (unified + remark + rehype + Shiki) is lazy-loaded so it only impacts bundle size when preview mode is activated.

## Website

The landing page lives in `docs/` and can be deployed to [GitHub Pages](https://pages.github.com/) (serve from `/docs`) or [Vercel](https://vercel.com/) (set root directory to `docs`).

## License

MIT
