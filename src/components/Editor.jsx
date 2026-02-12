import React, { forwardRef, useCallback, useMemo } from "react";
import { formatDateFull } from "@/utils/formatDate";

const Editor = forwardRef(function Editor(
	{ content, onChange, onScheduleSave, activeNoteId, updatedAt },
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

	const wordCount = useMemo(() => {
		const words = content.trim().split(/\s+/).filter(Boolean);
		return words.length;
	}, [content]);

	return (
		<div className="absolute inset-0 flex flex-col">
			{updatedAt && (
				<div className="px-7 pt-5 pb-0 flex items-center gap-1 text-[13px] text-muted-foreground/40 select-none">
					<span>{formatDateFull(updatedAt)}</span>
					<span>&middot;</span>
					<span>
						{wordCount} {wordCount === 1 ? "word" : "words"}
					</span>
				</div>
			)}
			<textarea
				ref={ref}
				value={content}
				onChange={handleChange}
				onKeyDown={handleTabKey}
				className="flex-1 w-full bg-transparent resize-none outline-none px-7 py-4 text-[15px] leading-relaxed text-foreground/80 placeholder-muted-foreground/25 editor-textarea"
				placeholder="Start writing..."
				spellCheck={false}
			/>
		</div>
	);
});

export default Editor;
