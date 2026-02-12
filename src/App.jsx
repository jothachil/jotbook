import React, { useCallback, useEffect, useRef, useState } from "react";
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

	// Load all notes on mount
	useEffect(() => {
		loadNotes();
	}, []);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "n") {
				e.preventDefault();
				handleNewNote();
			}
			if ((e.metaKey || e.ctrlKey) && e.key === "b") {
				e.preventDefault();
				setSidebarOpen((prev) => !prev);
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [activeNoteId, content]);

	const loadNotes = async () => {
		const data = await window.api.getNotes();
		setNotes(data);
		return data;
	};

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
			if (activeNoteId) {
				await flushSave(activeNoteId, content);
			}
			hasBumpedRef.current = false;
			setActiveNoteId(id);
			const note = await window.api.getNote(id);
			if (note) {
				setContent(note.content || "");
				setTimeout(() => editorRef.current?.focus(), 0);
			}
		},
		[activeNoteId, content, flushSave],
	);

	const handleNewNote = useCallback(async () => {
		if (activeNoteId) {
			await flushSave(activeNoteId, content);
		}
		const note = await window.api.createNote();
		await loadNotes();
		hasBumpedRef.current = true;
		setActiveNoteId(note.id);
		setContent("");
		setTimeout(() => editorRef.current?.focus(), 0);
	}, [activeNoteId, content, flushSave]);

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
	}, []);

	const handleDeleteNote = useCallback(async (id) => {
		const noteId = id || activeNoteId;
		if (!noteId) return;
		await window.api.deleteNote(noteId);
		const updatedNotes = await loadNotes();

		if (noteId === activeNoteId) {
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
	}, [activeNoteId]);

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

				<main className="flex-1 flex flex-col min-w-0">
					<Toolbar
						sidebarOpen={sidebarOpen}
						onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
						activeNoteId={activeNoteId}
						previewMode={previewMode}
						onTogglePreview={() => setPreviewMode((prev) => !prev)}
						onNewNote={handleNewNote}
						onDuplicateNote={handleDuplicateNote}
						onDeleteNote={handleDeleteNote}
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
								updatedAt={notes.find((n) => n.id === activeNoteId)?.updated_at}
								previewMode={previewMode}
							/>
						)}
					</div>
				</main>
			</div>
		</TooltipProvider>
	);
}
