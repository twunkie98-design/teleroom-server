const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
	width: 1400,
	height: 900,
	minWidth: 800,
	minHeight: 600,
	webPreferences: {
	  preload: path.join(__dirname, 'preload.js'),
	  nodeIntegration: false,
	  contextIsolation: true,
	  enableRemoteModule: false,
	  sandbox: true
	}
  });

  const startUrl = isDev 
	? 'http://localhost:3000' 
	: `file://${path.join(__dirname, '..', 'INDEX65C.HTM')}`;

  mainWindow.loadFile(path.join(__dirname, '..', 'INDEX65C.HTM'));

  mainWindow.on('closed', () => {
	mainWindow = null;
  });

  // Dev tools
  if (isDev) {
	mainWindow.webContents.openDevTools();
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
	app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
	createWindow();
  }
});

// Modern menu
const createMenu = () => {
  const template = [
	{
	  label: 'File',
	  submenu: [
		{ role: 'quit', label: 'Exit' }
	  ]
	},
	{
	  label: 'View',
	  submenu: [
		{ role: 'reload' },
		{ role: 'forceReload' },
		{ role: 'toggleDevTools' },
		{ type: 'separator' },
		{ role: 'togglefullscreen' }
	  ]
	},
	{
	  label: 'Help',
	  submenu: [
		{
		  label: 'About',
		  click: () => {
			const { dialog } = require('electron');
			dialog.showMessageBox(mainWindow, {
			  type: 'info',
			  title: 'About Teleroom',
			  message: 'Teleroom v1.0.0',
			  detail: 'Video meetings, webinars and live rooms inside Telegram.'
			});
		  }
		}
	  ]
	}
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

// IPC Handlers
ipcMain.handle('app-version', () => app.getVersion());

app.whenReady().then(() => {
  createMenu();
});
