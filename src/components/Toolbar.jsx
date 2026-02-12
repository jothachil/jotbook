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

/* ── Helpers ─────────────────────────────────────── */

function ToolbarButton({ icon: Icon, label, onClick, destructive, shortcut }) {
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
	return <Separator orientation="vertical" className="mx-1.5 h-4" />;
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
}) {
	return (
		<div className="h-[45px] flex items-end px-4 pb-2 drag-region border-b border-neutral-800">
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

			{/* Right: actions */}
			<div className="ml-auto flex items-center no-drag">
				{/* View mode toggle */}
				{activeNoteId && (
					<>
						<ToolbarGroup>
							<ToolbarButton
								icon={previewMode ? IconPencil : IconEye}
								label={previewMode ? "Edit" : "Preview"}
								onClick={onTogglePreview}
							/>
						</ToolbarGroup>
						<ToolbarDivider />
					</>
				)}

				{/* Create & manage */}
				<ToolbarGroup>
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
						</>
					)}
				</ToolbarGroup>

				{/* Destructive */}
				{activeNoteId && (
					<>
						<ToolbarDivider />
						<ToolbarGroup>
							<Tooltip>
								<DeleteNoteDialog onConfirm={() => onDeleteNote(activeNoteId)}>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon-xs"
											className="cursor-pointer text-muted-foreground/40 hover:text-destructive"
										>
											<IconTrash className="size-3.5" />
										</Button>
									</TooltipTrigger>
								</DeleteNoteDialog>
								<TooltipContent side="bottom">Delete</TooltipContent>
							</Tooltip>
						</ToolbarGroup>
					</>
				)}
			</div>
		</div>
	);
}
