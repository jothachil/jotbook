import { IconFileText } from "@tabler/icons-react";
import React from "react";

export default function EmptyState() {
	return (
		<div className="absolute inset-0 flex flex-col items-center justify-center ">
			<IconFileText className="size-12 mb-4 text-neutral-600" strokeWidth={1} />
			<p className="text-sm font-medium text-neutral-600">No note selected</p>
			<p className="text-xs mt-1 text-neutral-600">
				Create a new note or select one from the sidebar
			</p>
		</div>
	);
}
