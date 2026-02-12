import {
	IconCopy,
	IconDownload,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";

export default function NoteItem({
	note,
	isActive,
	onSelect,
	onNewNote,
	onDuplicate,
	onDelete,
}) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger asChild>
					<motion.button
						layout
						layoutId={`note-${note.id}`}
						initial={false}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							layout: { type: "spring", stiffness: 500, damping: 35 },
						}}
						onClick={() => onSelect(note.id)}
						className={cn(
							"w-full min-w-0 text-left px-3 py-2.5 rounded-md cursor-pointer transition-colors overflow-hidden",
							isActive
								? "bg-sidebar-accent text-sidebar-accent-foreground"
								: "text-muted-foreground hover:bg-accent/50",
						)}
					>
						<div
							className={cn(
								"text-[13px] font-medium truncate leading-tight",
								isActive ? "text-foreground" : "text-muted-foreground",
							)}
						>
							{note.title || "Untitled"}
						</div>
						<div className="text-[11px] text-muted-foreground/50 mt-0.5">
							{formatDate(note.updated_at)}
						</div>
					</motion.button>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem onClick={onNewNote}>
						<IconPlus className="size-4" />
						New Note
					</ContextMenuItem>
					<ContextMenuItem onClick={() => onDuplicate(note.id)}>
						<IconCopy className="size-4" />
						Duplicate
					</ContextMenuItem>
					<ContextMenuItem onClick={() => window.api.exportNote(note.id)}>
						<IconDownload className="size-4" />
						Export Markdown
					</ContextMenuItem>
					<ContextMenuSeparator />
					<ContextMenuItem
						variant="destructive"
						onClick={() => setShowDeleteDialog(true)}
					>
						<IconTrash className="size-4" />
						Delete
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							note.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={() => onDelete(note.id)}>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
