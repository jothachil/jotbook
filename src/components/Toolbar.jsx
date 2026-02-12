import {
	IconCopy,
	IconDownload,
	IconEye,
	IconLayoutSidebar,
	IconPencil,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import DeleteNoteDialog from "@/components/DeleteNoteDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDateFull } from "@/utils/formatDate";

/* ── Helpers ─────────────────────────────────────── */

function ToolbarButton({ icon: Icon, label, onClick, destructive, shortcut }) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon-xs"
					onClick={onClick}
					className={`cursor-pointer ${destructive ? "text-neutral-500 hover:text-destructive" : "text-neutral-500 hover:text-foreground"}`}
				>
					<Icon className="size-4" />
				</Button>
			</TooltipTrigger>
			<TooltipContent side="bottom">
				{label}
				{shortcut && (
					<span className="text-muted-foreground ml-1">{shortcut}</span>
				)}
			</TooltipContent>
		</Tooltip>
	);
}

function ToolbarGroup({ children }) {
	return <div className="flex items-center gap-0.5">{children}</div>;
}

function ToolbarDivider() {
	return (
		<Separator
			orientation="vertical"
			className="mx-1.5 !h-2 !w-px bg-neutral-800"
		/>
	);
}

/* ── Toolbar ─────────────────────────────────────── */

export default function Toolbar({
	sidebarOpen,
	onToggleSidebar,
	activeNoteId,
	previewMode,
	onTogglePreview,
	onNewNote,
	onDuplicateNote,
	onDeleteNote,
	updatedAt,
	wordCount,
}) {
	return (
		<div className="h-[46px] flex items-center   px-4 p-2 drag-region border-b border-neutral-800/80">
			{/* Left: navigation */}
			<motion.div
				className="no-drag flex items-center"
				animate={{ marginLeft: sidebarOpen ? 0 : 72 }}
				transition={{ type: "spring", stiffness: 400, damping: 30 }}
			>
				<ToolbarButton
					icon={IconLayoutSidebar}
					label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
					shortcut="⌘B"
					onClick={onToggleSidebar}
				/>
			</motion.div>

			{/* Center: date & word count */}
			{activeNoteId && updatedAt && (
				<div className="ml-2  flex items-center gap-1 text-[13px] text-muted-foreground/40 select-none no-drag">
					<span>{formatDateFull(updatedAt)}</span>
					<span>&middot;</span>
					<span>
						{wordCount} {wordCount === 1 ? "word" : "words"}
					</span>
				</div>
			)}

			{/* Right: actions */}
			<div className="ml-auto flex items-center gap-1 no-drag">
				{activeNoteId && (
					<>
						<ToolbarButton
							icon={previewMode ? IconPencil : IconEye}
							label={previewMode ? "Edit" : "Preview"}
							onClick={onTogglePreview}
						/>
						<ToolbarDivider />
					</>
				)}

				<ToolbarButton
					icon={IconPlus}
					label="New note"
					shortcut="⌘N"
					onClick={onNewNote}
				/>

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
						<ToolbarDivider />
						<Tooltip>
							<DeleteNoteDialog onConfirm={() => onDeleteNote(activeNoteId)}>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon-xs"
										className="cursor-pointer text-neutral-500 hover:text-destructive"
									>
										<IconTrash className="size-4" />
									</Button>
								</TooltipTrigger>
							</DeleteNoteDialog>
							<TooltipContent side="bottom">Delete</TooltipContent>
						</Tooltip>
					</>
				)}
			</div>
		</div>
	);
}
