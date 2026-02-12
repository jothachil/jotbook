# Jotbook

A minimal, fast desktop note-taking app built with Electron and React. Notes are stored locally in SQLite and auto-saved as you type.

## Features

- **Auto-save** — Notes save automatically with a 600ms debounce, so nothing is lost.
- **Markdown-friendly editor** — Write in plain text with a monospace font. The first line becomes the note title (Markdown headings are stripped).
- **Export to Markdown** — Export any note as a `.md` file via a native save dialog.
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
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Components | Radix UI / shadcn/ui |
| Animations | Framer Motion |
| Icons | Tabler Icons |
| Database | better-sqlite3 (SQLite, WAL mode) |
| Linting | Biome |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/jothachil/my-app.git
cd my-app
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
│   ├── Editor.jsx       # Note editor with word count
│   ├── EmptyState.jsx   # Placeholder when no note selected
│   ├── NoteItem.jsx     # Note row with context menu
│   ├── Sidebar.jsx      # Collapsible note list
│   ├── Toolbar.jsx      # Top bar actions
│   ├── DeleteNoteDialog.jsx
│   └── ui/              # shadcn/ui primitives
└── utils/
    └── formatDate.js
```

## Architecture

The app follows Electron's standard three-process model:

1. **Main process** (`main.js`) — Creates the browser window, registers IPC handlers, and manages the SQLite database.
2. **Preload script** (`preload.js`) — Exposes a safe `window.api` bridge via `contextBridge` for the renderer to call database operations.
3. **Renderer** (`App.jsx`) — A React app that manages UI state, handles keyboard shortcuts, and communicates with the main process through the exposed API.

Notes are persisted in a SQLite database (`notes.db`) stored in the app's user data directory with WAL mode enabled for better performance.

## License

MIT
