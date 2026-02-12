import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Editor from "@/components/Editor";
import EmptyState from "@/components/EmptyState";
import Sidebar from "@/components/Sidebar";
import Toolbar from "@/components/Toolbar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function App() {
	const [notes, setNotes] = useState([]);
	const [activeNoteId, setActiveNoteId] = useState(null);
	const [content, setContent] = useState("");
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [previewMode, setPreviewMode] = useState(false);
	const editorRef = useRef(null);
	const saveTimeoutRef = useRef(null);
	const hasBumpedRef = useRef(false);
	const contentRef = useRef("");
	const activeNoteIdRef = useRef(null);
	const handleNewNoteRef = useRef(null);

	const loadNotes = useCallback(async () => {
		const data = await window.api.getNotes();
		setNotes(data);
		return data;
	}, []);

	// Load all notes on mount
	useEffect(() => {
		loadNotes();
	}, [loadNotes]);

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

	// Auto-save with debounce — bumps note to top once per editing session
	const scheduleSave = useCallback((noteId, newContent) => {
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
			const firstLine = newContent.split("\n")[0] || "";
			const title = firstLine.replace(/^#+\s*/, "").trim() || "Untitled";
			await window.api.updateNote(noteId, title, newContent);
			const now = new Date().toISOString().replace("Z", "").replace("T", " ");
			setNotes((prev) =>
				prev.map((n) => (n.id === noteId ? { ...n, title, updated_at: now } : n)),
			);
		}, 600);
	}, []);

	const flushSave = useCallback(async (noteId, currentContent) => {
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
			saveTimeoutRef.current = null;
		}
		if (!noteId) return;
		const firstLine = currentContent.split("\n")[0] || "";
		const title = firstLine.replace(/^#+\s*/, "").trim() || "Untitled";
		await window.api.updateNote(noteId, title, currentContent);
	}, []);

	const handleSelectNote = useCallback(
		async (id) => {
			const currentActiveId = activeNoteIdRef.current;
			const currentContent = contentRef.current;
			if (currentActiveId) {
				await flushSave(currentActiveId, currentContent);
			}
			hasBumpedRef.current = false;
			setActiveNoteId(id);
			const note = await window.api.getNote(id);
			if (note) {
				setContent(note.content || "");
				setTimeout(() => editorRef.current?.focus(), 0);
			}
		},
		[flushSave],
	);

	const handleNewNote = useCallback(async () => {
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
	}, [flushSave, loadNotes]);
	handleNewNoteRef.current = handleNewNote;

	const handleDuplicateNote = useCallback(async (id) => {
		if (!id) return;
		const note = await window.api.duplicateNote(id);
		if (note) {
			await loadNotes();
			hasBumpedRef.current = true;
			setActiveNoteId(note.id);
			setContent(note.content || "");
			setTimeout(() => editorRef.current?.focus(), 0);
		}
	}, [loadNotes]);

	const activeNote = notes.find((n) => n.id === activeNoteId);
	const wordCount = useMemo(() => {
		const words = content.trim().split(/\s+/).filter(Boolean);
		return words.length;
	}, [content]);

	const handleDeleteNote = useCallback(async (id) => {
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
	}, [loadNotes]);

	return (
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
						onDuplicateNote={handleDuplicateNote}
						onDeleteNote={handleDeleteNote}
						updatedAt={activeNote?.updated_at}
						wordCount={wordCount}
					/>

					<div className="flex-1 overflow-hidden relative">
						{!activeNoteId ? (
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
	);
}
