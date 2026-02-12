import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import React from "react";
import NoteItem from "./NoteItem";

export default function Sidebar({
	notes,
	activeNoteId,
	activeContent,
	onSelectNote,
	onNewNote,
	onDuplicateNote,
	onDeleteNote,
}) {
	return (
		<motion.aside
			initial={{ width: 0, opacity: 0 }}
			animate={{ width: 256, opacity: 1 }}
			exit={{ width: 0, opacity: 0 }}
			transition={{ type: "spring", stiffness: 400, damping: 30 }}
			className="bg-sidebar  flex flex-col border-r border-neutral-800/50 overflow-hidden"
		>
			<div className="w-64 flex flex-col flex-1 overflow-hidden">
				<div className="h-[46px] shrink-0 drag-region" />
				<div className="flex-1 overflow-y-auto px-2 py-2">
					<LayoutGroup>
						<div className="space-y-0.5">
							<AnimatePresence initial={false}>
								{notes.map((note) => (
									<NoteItem
										key={note.id}
										note={note}
										isActive={note.id === activeNoteId}
										liveContent={
											note.id === activeNoteId ? activeContent : null
										}
										onSelect={onSelectNote}
										onNewNote={onNewNote}
										onDuplicate={onDuplicateNote}
										onDelete={onDeleteNote}
									/>
								))}
							</AnimatePresence>
						</div>
					</LayoutGroup>
				</div>
			</div>
		</motion.aside>
	);
}
