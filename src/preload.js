const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
	getNotes: () => ipcRenderer.invoke("notes:getAll"),
	getNote: (id) => ipcRenderer.invoke("notes:get", id),
	createNote: () => ipcRenderer.invoke("notes:create"),
	updateNote: (id, title, content) =>
		ipcRenderer.invoke("notes:update", id, title, content),
	duplicateNote: (id) => ipcRenderer.invoke("notes:duplicate", id),
	deleteNote: (id) => ipcRenderer.invoke("notes:delete", id),
	exportNote: (id) => ipcRenderer.invoke("notes:export", id),
});
