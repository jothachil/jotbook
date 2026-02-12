import { useEffect, useState } from "react";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const processor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkBreaks)
	.use(remarkRehype)
	.use(rehypePrettyCode, {
		theme: "github-dark-default",
		keepBackground: true,
	})
	.use(rehypeStringify);

async function renderMarkdown(content) {
	if (!content) return "";
	const result = await processor.process(content);
	return String(result);
}

export default function MarkdownPreview({ content }) {
	const [html, setHtml] = useState("");

	useEffect(() => {
		renderMarkdown(content).then(setHtml);
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
				[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:rounded-none [&_pre_code]:text-inherit
				[&_pre]:bg-neutral-900 [&_pre]:border [&_pre]:border-neutral-800 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:text-[13px] [&_pre]:leading-relaxed
				[&_pre_code_span]:text-(--shiki-default)
				prose-blockquote:border-brand-500 prose-blockquote:text-muted-foreground
				prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5
				prose-hr:border-neutral-800"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
