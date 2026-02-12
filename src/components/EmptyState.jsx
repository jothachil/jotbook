import { IconFileText } from "@tabler/icons-react";
import React from "react";

export default function EmptyState() {
	return (
		<div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/30">
			<IconFileText className="size-12 mb-4" strokeWidth={1} />
			<p className="text-sm font-medium">No note selected</p>
			<p className="text-xs mt-1 text-muted-foreground/20">
				Create a new note or select one from the sidebar
			</p>
		</div>
	);
}
