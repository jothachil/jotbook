import { Toast } from "@base-ui/react/toast";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Editor from "@/components/Editor";
import EmptyState from "@/components/EmptyState";
import Sidebar from "@/components/Sidebar";
import ToastHost from "@/components/ToastHost";
import Toolbar from "@/components/Toolbar";
import { TooltipProvider } from "@/components/ui/tooltip";

const toastManager = Toast.createToastManager();

/* ── Hoisted constants & RegExp (js-hoist-regexp) ── */
const AUTO_SIDEBAR_CLOSE_WIDTH = 900;
const TITLE_HEADING_RE = /^#+\s*/;
const WHITESPACE_RE = /\s+/;

export default function App() {
	const [notes, setNotes] = useState([]);
	const [activeNoteId, setActiveNoteId] = useState(null);
	const [content, setContent] = useState("");
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [previewMode, setPreviewMode] = useState(false);
	const editorRef = useRef(null);
	const saveTimeoutRef = useRef(null);
	const hasBumpedRef = useRef(false);
	const isDirtyRef = useRef(false);
	const contentRef = useRef("");
	const activeNoteIdRef = useRef(null);
	const handleNewNoteRef = useRef(null);
	const lastWindowWidthRef = useRef(window.innerWidth);

	const loadNotes = async () => {
		const data = await window.api.getNotes();
		setNotes(data);
		return data;
	};

	// Load all notes on mount — loadNotes only depends on stable setNotes,
	// so intentionally omitting it to run only once on mount.
	// biome-ignore lint/correctness/useExhaustiveDependencies: mount-only effect
	useEffect(() => {
		loadNotes();
	}, []);

	useEffect(() => {
		const handleResize = () => {
			const currentWidth = window.innerWidth;
			const wasLarge = lastWindowWidthRef.current >= AUTO_SIDEBAR_CLOSE_WIDTH;
			const isNowSmall = currentWidth < AUTO_SIDEBAR_CLOSE_WIDTH;
			if (wasLarge && isNowSmall) {
				setSidebarOpen(false);
			}
			lastWindowWidthRef.current = currentWidth;
		};
		if (lastWindowWidthRef.current < AUTO_SIDEBAR_CLOSE_WIDTH) {
			setSidebarOpen(false);
		}
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		contentRef.current = content;
	}, [content]);

	useEffect(() => {
		activeNoteIdRef.current = activeNoteId;
	}, [activeNoteId]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "n") {
				e.preventDefault();
				handleNewNoteRef.current?.();
			}
			if ((e.metaKey || e.ctrlKey) && e.key === "b") {
				e.preventDefault();
				setSidebarOpen((prev) => !prev);
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	/** Extract title from the first line of markdown content. */
	const extractTitle = (text) => {
		const firstLine = text.split("\n")[0] || "";
		return firstLine.replace(TITLE_HEADING_RE, "").trim() || "Untitled";
	};

	// Auto-save with debounce — bumps note to top once per editing session
	const scheduleSave = (noteId, newContent) => {
		isDirtyRef.current = true;
		if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

		if (!hasBumpedRef.current) {
			hasBumpedRef.current = true;
			setNotes((prev) => {
				const idx = prev.findIndex((n) => n.id === noteId);
				if (idx <= 0) return prev;
				const note = prev[idx];
				return [note, ...prev.slice(0, idx), ...prev.slice(idx + 1)];
			});
		}

		saveTimeoutRef.current = setTimeout(async () => {
			const title = extractTitle(newContent);
			await window.api.updateNote(noteId, title, newContent);
			const now = new Date().toISOString().replace("Z", "").replace("T", " ");
			setNotes((prev) =>
				prev.map((n) =>
					n.id === noteId ? { ...n, title, updated_at: now } : n,
				),
			);
		}, 600);
	};

	const flushSave = async (noteId, currentContent) => {
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
			saveTimeoutRef.current = null;
		}
		if (!noteId || !isDirtyRef.current) return;
		isDirtyRef.current = false;
		const title = extractTitle(currentContent);
		await window.api.updateNote(noteId, title, currentContent);
	};

	// async-parallel: flush save & fetch next note in parallel
	const handleSelectNote = async (id) => {
		const currentActiveId = activeNoteIdRef.current;
		const currentContent = contentRef.current;

		hasBumpedRef.current = false;
		isDirtyRef.current = false;
		setActiveNoteId(id);

		const [, note] = await Promise.all([
			currentActiveId
				? flushSave(currentActiveId, currentContent)
				: Promise.resolve(),
			window.api.getNote(id),
		]);

		if (note) {
			setContent(note.content || "");
			setTimeout(() => editorRef.current?.focus(), 0);
		}
	};

	const handleNewNote = async () => {
		const currentActiveId = activeNoteIdRef.current;
		const currentContent = contentRef.current;
		if (currentActiveId) {
			await flushSave(currentActiveId, currentContent);
		}
		const note = await window.api.createNote();
		await loadNotes();
		hasBumpedRef.current = true;
		setActiveNoteId(note.id);
		setContent("");
		setTimeout(() => editorRef.current?.focus(), 0);
	};
	handleNewNoteRef.current = handleNewNote;

	const handleDuplicateNote = async (id) => {
		if (!id) return;
		const note = await window.api.duplicateNote(id);
		if (note) {
			await loadNotes();
			hasBumpedRef.current = true;
			setActiveNoteId(note.id);
			setContent(note.content || "");
			setTimeout(() => editorRef.current?.focus(), 0);
		}
	};

	const handleCopyMarkdown = async () => {
		const currentActiveId = activeNoteIdRef.current;
		const currentContent = contentRef.current;
		if (!currentActiveId) return;
		if (!navigator?.clipboard?.writeText) return;
		try {
			await navigator.clipboard.writeText(currentContent || "");
			toastManager.add({
				description: "Markdown copied",
				timeout: 1500,
			});
		} catch {
			// Ignore clipboard failures to avoid blocking UI
		}
	};

	const activeNote = notes.find((n) => n.id === activeNoteId);
	const words = content.trim().split(WHITESPACE_RE).filter(Boolean);
	const wordCount = words.length;

	const handleDeleteNote = async (id) => {
		const currentActiveId = activeNoteIdRef.current;
		const noteId = id || currentActiveId;
		if (!noteId) return;
		await window.api.deleteNote(noteId);
		const updatedNotes = await loadNotes();

		if (noteId === currentActiveId) {
			if (updatedNotes.length > 0) {
				const first = updatedNotes[0];
				setActiveNoteId(first.id);
				const note = await window.api.getNote(first.id);
				setContent(note?.content || "");
			} else {
				setActiveNoteId(null);
				setContent("");
			}
		}
	};

	return (
		<Toast.Provider toastManager={toastManager}>
			<TooltipProvider>
				<div className="flex h-screen overflow-hidden">
					<AnimatePresence initial={false}>
						{sidebarOpen && (
							<Sidebar
								notes={notes}
								activeNoteId={activeNoteId}
								onSelectNote={handleSelectNote}
								onNewNote={handleNewNote}
								onDuplicateNote={handleDuplicateNote}
								onDeleteNote={handleDeleteNote}
							/>
						)}
					</AnimatePresence>

					<main className="flex-1 flex flex-col min-w-0 bg-background">
						<Toolbar
							sidebarOpen={sidebarOpen}
							onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
							activeNoteId={activeNoteId}
							previewMode={previewMode}
							onTogglePreview={() => setPreviewMode((prev) => !prev)}
							onNewNote={handleNewNote}
							onCopyMarkdown={handleCopyMarkdown}
							onDeleteNote={handleDeleteNote}
							updatedAt={activeNote?.updated_at}
							wordCount={wordCount}
						/>

						<div className="flex-1 overflow-hidden relative">
							{activeNoteId == null ? (
								<EmptyState />
							) : (
								<Editor
									ref={editorRef}
									content={content}
									onChange={setContent}
									onScheduleSave={scheduleSave}
									activeNoteId={activeNoteId}
									previewMode={previewMode}
								/>
							)}
						</div>
					</main>
				</div>
			</TooltipProvider>
			<ToastHost />
		</Toast.Provider>
	);
}
