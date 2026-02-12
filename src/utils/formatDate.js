export function formatDate(dateStr) {
	if (!dateStr) return "";
	const d = new Date(dateStr + "Z");
	const now = new Date();
	const time = d.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});

	if (d.toDateString() === now.toDateString()) {
		return `Today, ${time}`;
	}

	const yesterday = new Date(now);
	yesterday.setDate(yesterday.getDate() - 1);
	if (d.toDateString() === yesterday.toDateString()) {
		return `Yesterday, ${time}`;
	}

	const date = d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
	});
	return `${date}, ${time}`;
}

export function formatDateFull(dateStr) {
	if (!dateStr) return "";
	const d = new Date(dateStr + "Z");
	const now = new Date();
	const isToday = d.toDateString() === now.toDateString();
	const time = d.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});

	if (isToday) {
		return `Today, ${time}`;
	}

	const yesterday = new Date(now);
	yesterday.setDate(yesterday.getDate() - 1);
	if (d.toDateString() === yesterday.toDateString()) {
		return `Yesterday, ${time}`;
	}

	const date = d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
	});
	return `${date}, ${time}`;
}
