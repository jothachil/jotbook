import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import { createHighlighter } from "shiki";

marked.setOptions({
	gfm: true,
	breaks: true,
});

let highlighterPromise = null;

function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ["github-dark-default"],
			langs: [
				"javascript",
				"typescript",
				"jsx",
				"tsx",
				"html",
				"css",
				"json",
				"markdown",
				"python",
				"bash",
				"shell",
				"sql",
				"yaml",
				"rust",
				"go",
				"java",
				"c",
				"cpp",
			],
		});
	}
	return highlighterPromise;
}

function escapeHtml(text) {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

async function renderMarkdown(content, highlighter) {
	if (!content) return "";

	const renderer = new marked.Renderer();

	renderer.code = ({ text, lang }) => {
		const language = lang || "";
		try {
			if (highlighter) {
				const loadedLangs = highlighter.getLoadedLanguages();
				const resolvedLang =
					language && loadedLangs.includes(language) ? language : "text";
				return highlighter.codeToHtml(text, {
					lang: resolvedLang,
					theme: "github-dark-default",
				});
			}
		} catch {
			// Fall back to plain rendering
		}
		return `<pre><code class="language-${language}">${escapeHtml(text)}</code></pre>`;
	};

	return marked.parse(content, { renderer });
}

export default function MarkdownPreview({ content }) {
	const [html, setHtml] = useState("");
	const highlighterRef = useRef(null);

	useEffect(() => {
		getHighlighter().then((hl) => {
			highlighterRef.current = hl;
			renderMarkdown(content, hl).then(setHtml);
		});
	}, [content]);

	useEffect(() => {
		renderMarkdown(content, highlighterRef.current).then(setHtml);
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
				prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:text-[13px] prose-pre:leading-relaxed
				[&_pre.shiki]:bg-neutral-900 [&_pre.shiki]:border [&_pre.shiki]:border-neutral-800 [&_pre.shiki]:rounded-lg [&_pre.shiki]:p-4 [&_pre.shiki]:overflow-x-auto [&_pre.shiki]:text-[13px] [&_pre.shiki]:leading-relaxed
				[&_pre.shiki_span]:text-[var(--shiki-default)]
				prose-blockquote:border-brand-500 prose-blockquote:text-muted-foreground
				prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5
				prose-hr:border-neutral-800"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
