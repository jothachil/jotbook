import {
	IconCopy,
	IconDownload,
	IconLayoutSidebar,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import React from "react";
import DeleteNoteDialog from "@/components/DeleteNoteDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

function ToolbarButton({ icon: Icon, label, onClick, destructive }) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon-xs"
					onClick={onClick}
					className={`cursor-pointer ${destructive ? "text-muted-foreground/40 hover:text-destructive" : "text-muted-foreground/40 hover:text-foreground"}`}
				>
					<Icon className="size-3.5" />
				</Button>
			</TooltipTrigger>
			<TooltipContent side="bottom">{label}</TooltipContent>
		</Tooltip>
	);
}

export default function Toolbar({
	sidebarOpen,
	onToggleSidebar,
	activeNoteId,
	onNewNote,
	onDuplicateNote,
	onDeleteNote,
}) {
	return (
		<div className="h-[45px] flex items-end px-4 pb-2 drag-region border-b border-neutral-800">
			{/* Left: sidebar toggle */}
			<motion.div
				className="no-drag flex items-center"
				animate={{ marginLeft: sidebarOpen ? 0 : 72 }}
				transition={{ type: "spring", stiffness: 400, damping: 30 }}
			>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon-xs"
							onClick={onToggleSidebar}
							className="cursor-pointer text-muted-foreground/40 hover:text-foreground"
						>
							<IconLayoutSidebar className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						{sidebarOpen ? "Hide sidebar" : "Show sidebar"}{" "}
						<span className="text-muted-foreground ml-1">⌘B</span>
					</TooltipContent>
				</Tooltip>
			</motion.div>

			{/* Right: note actions */}
			<div className="ml-auto flex items-center gap-0.5 no-drag">
				<ToolbarButton icon={IconPlus} label="New note" onClick={onNewNote} />

				{activeNoteId && (
					<>
						<ToolbarButton
							icon={IconCopy}
							label="Duplicate"
							onClick={() => onDuplicateNote(activeNoteId)}
						/>
						<ToolbarButton
							icon={IconDownload}
							label="Export markdown"
							onClick={() => window.api.exportNote(activeNoteId)}
						/>

						<Separator orientation="vertical" className="mx-1 h-4" />

						<DeleteNoteDialog onConfirm={() => onDeleteNote(activeNoteId)}>
							<Button
								variant="ghost"
								size="icon-xs"
								className="cursor-pointer text-muted-foreground/40 hover:text-destructive"
							>
								<IconTrash className="size-3.5" />
							</Button>
						</DeleteNoteDialog>
					</>
				)}
			</div>
		</div>
	);
}
