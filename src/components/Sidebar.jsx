import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import NoteItem from "./NoteItem";

function Sidebar({
	notes,
	activeNoteId,
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
				<div className="h-[40px] shrink-0 drag-region" />
				<div className="flex-1 overflow-y-auto px-2 py-2">
					<LayoutGroup>
						<div className="space-y-0.5">
							<AnimatePresence initial={false}>
								{notes.map((note, index) => (
									<div key={note.id}>
										{index > 0 && (
											<div className="mx-3 my-0.5 h-px bg-neutral-800/50" />
										)}
										<NoteItem
											note={note}
											isActive={note.id === activeNoteId}
											onSelect={onSelectNote}
											onNewNote={onNewNote}
											onDuplicate={onDuplicateNote}
											onDelete={onDeleteNote}
										/>
									</div>
								))}
							</AnimatePresence>
						</div>
					</LayoutGroup>
				</div>
			</div>
		</motion.aside>
	);
}

export default Sidebar;
