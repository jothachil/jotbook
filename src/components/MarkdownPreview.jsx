import { useMemo } from "react";
import { marked } from "marked";

marked.setOptions({
	gfm: true,
	breaks: true,
});

export default function MarkdownPreview({ content }) {
	const html = useMemo(() => {
		if (!content) return "";
		return marked.parse(content);
	}, [content]);

	return (
		<div
			className="prose prose-invert prose-sm max-w-none px-7 py-4 text-[15px] leading-relaxed text-foreground/80 overflow-y-auto h-full
				prose-headings:text-foreground prose-headings:font-semibold
				prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-0
				prose-h2:text-xl prose-h2:mb-3
				prose-h3:text-lg prose-h3:mb-2
				prose-p:mb-3 prose-p:leading-relaxed
				prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline
				prose-strong:text-foreground prose-strong:font-semibold
				prose-code:text-brand-300 prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[13px] prose-code:before:content-none prose-code:after:content-none
				prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800 prose-pre:rounded-lg
				prose-blockquote:border-brand-500 prose-blockquote:text-muted-foreground
				prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5
				prose-hr:border-neutral-800"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
