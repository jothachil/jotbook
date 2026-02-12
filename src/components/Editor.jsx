import React, { forwardRef, useCallback } from "react";
import MarkdownPreview from "@/components/MarkdownPreview";

const Editor = forwardRef(function Editor(
	{ content, onChange, onScheduleSave, activeNoteId, previewMode },
	ref,
) {
	const handleTabKey = useCallback(
		(e) => {
			if (e.key === "Tab") {
				e.preventDefault();
				const textarea = ref.current;
				const start = textarea.selectionStart;
				const end = textarea.selectionEnd;
				const newValue =
					content.substring(0, start) + "  " + content.substring(end);
				onChange(newValue);
				onScheduleSave(activeNoteId, newValue);
				setTimeout(() => {
					textarea.selectionStart = textarea.selectionEnd = start + 2;
				}, 0);
			}
		},
		[content, activeNoteId, onChange, onScheduleSave, ref],
	);

	const handleChange = useCallback(
		(e) => {
			const newContent = e.target.value;
			onChange(newContent);
			onScheduleSave(activeNoteId, newContent);
		},
		[activeNoteId, onChange, onScheduleSave],
	);

	return (
		<div className="absolute inset-0 flex flex-col">
			{previewMode ? (
				<MarkdownPreview content={content} />
			) : (
				<textarea
					ref={ref}
					value={content}
					onChange={handleChange}
					onKeyDown={handleTabKey}
					className="flex-1 w-full bg-transparent resize-none outline-none px-7 py-4 text-[15px] leading-relaxed text-foreground/80 placeholder-muted-foreground/25 editor-textarea"
					placeholder="Start writing..."
					spellCheck={false}
				/>
			)}
		</div>
	);
});

export default Editor;
