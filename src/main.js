import fs from "node:fs";
import path from "node:path";
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import started from "electron-squirrel-startup";
import {
	createNote,
	deleteNote,
	duplicateNote,
	getAllNotes,
	getNote,
	initDatabase,
	updateNote,
} from "./database.js";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
	app.quit();
}

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 1100,
		height: 720,
		minWidth: 800,
		minHeight: 500,
		titleBarStyle: "hiddenInset",
		trafficLightPosition: { x: 16, y: 16 },
		backgroundColor: "#0f0f0f",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
	} else {
		mainWindow.loadFile(
			path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
		);
	}
};

app.whenReady().then(() => {
	// Initialize database
	initDatabase();

	// IPC handlers for note operations
	ipcMain.handle("notes:getAll", () => getAllNotes());
	ipcMain.handle("notes:get", (_event, id) => getNote(id));
	ipcMain.handle("notes:create", () => createNote());
	ipcMain.handle("notes:update", (_event, id, title, content) =>
		updateNote(id, title, content),
	);
	ipcMain.handle("notes:duplicate", (_event, id) => duplicateNote(id));
	ipcMain.handle("notes:delete", (_event, id) => deleteNote(id));
	ipcMain.handle("notes:export", async (_event, id) => {
		const note = getNote(id);
		if (!note) return { success: false };
		const win = BrowserWindow.getFocusedWindow();
		const { canceled, filePath } = await dialog.showSaveDialog(win, {
			defaultPath: `${note.title || "Untitled"}.md`,
			filters: [{ name: "Markdown", extensions: ["md"] }],
		});
		if (canceled || !filePath) return { success: false };
		fs.writeFileSync(filePath, note.content, "utf-8");
		return { success: true };
	});

	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
