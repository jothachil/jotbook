import IconClipboard from "@tabler/icons-react/dist/esm/icons/IconClipboard.mjs";
import IconDownload from "@tabler/icons-react/dist/esm/icons/IconDownload.mjs";
import IconEye from "@tabler/icons-react/dist/esm/icons/IconEye.mjs";
import IconLayoutSidebar from "@tabler/icons-react/dist/esm/icons/IconLayoutSidebar.mjs";
import IconPencil from "@tabler/icons-react/dist/esm/icons/IconPencil.mjs";
import IconPlus from "@tabler/icons-react/dist/esm/icons/IconPlus.mjs";
import IconTrash from "@tabler/icons-react/dist/esm/icons/IconTrash.mjs";
import { motion } from "framer-motion";
import DeleteNoteDialog from "@/components/DeleteNoteDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/utils/formatDate";

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

function ToolbarDivider() {
	return (
		<Separator
			orientation="vertical"
			className="mx-1.5 h-2! w-px! bg-neutral-800"
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
	onCopyMarkdown,
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

			{/* Center: date & word count (rendering-conditional-render: explicit null check) */}
			{activeNoteId != null && updatedAt ? (
				<div className="ml-2  flex items-center gap-1 text-[13px] text-muted-foreground/40 select-none no-drag">
					<span>{formatDate(updatedAt)}</span>
					<span>&middot;</span>
					<span>
						{wordCount} {wordCount === 1 ? "word" : "words"}
					</span>
				</div>
			) : null}

			{/* Right: actions */}
			<div className="ml-auto flex items-center gap-1 no-drag">
				{activeNoteId != null ? (
					<>
						<ToolbarButton
							icon={previewMode ? IconPencil : IconEye}
							label={previewMode ? "Edit" : "Preview"}
							onClick={onTogglePreview}
						/>
						<ToolbarDivider />
					</>
				) : null}

				<ToolbarButton
					icon={IconPlus}
					label="New note"
					shortcut="⌘N"
					onClick={onNewNote}
				/>

				{activeNoteId != null ? (
					<>
						<ToolbarButton
							icon={IconClipboard}
							label="Copy markdown"
							onClick={onCopyMarkdown}
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
				) : null}
			</div>
		</div>
	);
}
