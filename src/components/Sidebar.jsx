import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import NoteItem from './NoteItem';

export default function Sidebar({
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
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="bg-sidebar border-sidebar-border flex flex-col border-r border-r-neutral-800 overflow-hidden"
    >
      <div className="w-64 min-w-[256px] flex flex-col flex-1">
        {/* Notes list */}
        <ScrollArea className="flex-1 mt-10">
          <LayoutGroup>
            <div className="px-2 py-2 space-y-0.5">
              <AnimatePresence initial={false}>
                {notes.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    isActive={note.id === activeNoteId}
                    onSelect={onSelectNote}
                    onNewNote={onNewNote}
                    onDuplicate={onDuplicateNote}
                    onDelete={onDeleteNote}
                  />
                ))}
              </AnimatePresence>
            </div>
          </LayoutGroup>
        </ScrollArea>
      </div>
    </motion.aside>
  );
}
