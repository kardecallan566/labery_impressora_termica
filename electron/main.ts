/**
 * Electron Main Process
 * Handles window creation and app lifecycle
 */

import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';

let mainWindow: BrowserWindow | null = null;

/**
 * Create application window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.ts'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * App event handlers
 */
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

/**
 * Create application menu
 */
function createMenu() {
  const template: any[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow?.webContents.send('menu:new');
          },
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow?.webContents.send('menu:open');
          },
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow?.webContents.send('menu:save');
          },
        },
        { type: 'separator' },
        {
          label: 'Export',
          submenu: [
            {
              label: 'PDF',
              click: () => {
                mainWindow?.webContents.send('menu:export-pdf');
              },
            },
            {
              label: 'PNG',
              click: () => {
                mainWindow?.webContents.send('menu:export-png');
              },
            },
            {
              label: 'SVG',
              click: () => {
                mainWindow?.webContents.send('menu:export-svg');
              },
            },
            {
              label: 'ZPL',
              click: () => {
                mainWindow?.webContents.send('menu:export-zpl');
              },
            },
          ],
        },
        { type: 'separator' },
        {
          label: 'Print',
          accelerator: 'CmdOrCtrl+P',
          click: () => {
            mainWindow?.webContents.send('menu:print');
          },
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          click: () => {
            mainWindow?.webContents.send('menu:undo');
          },
        },
        {
          label: 'Redo',
          accelerator: 'CmdOrCtrl+Y',
          click: () => {
            mainWindow?.webContents.send('menu:redo');
          },
        },
        { type: 'separator' },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          click: () => {
            mainWindow?.webContents.send('menu:cut');
          },
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          click: () => {
            mainWindow?.webContents.send('menu:copy');
          },
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          click: () => {
            mainWindow?.webContents.send('menu:paste');
          },
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow?.reload();
          },
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => {
            mainWindow?.webContents.toggleDevTools();
          },
        },
        { type: 'separator' },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            mainWindow?.webContents.send('menu:zoom-in');
          },
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+Minus',
          click: () => {
            mainWindow?.webContents.send('menu:zoom-out');
          },
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            mainWindow?.webContents.send('menu:zoom-reset');
          },
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            mainWindow?.webContents.send('menu:about');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Create menu when app is ready
app.on('ready', createMenu);

/**
 * IPC Handlers
 */

// Handle file operations
ipcMain.on('file:save', (event, data) => {
  console.log('Save file:', data);
  event.reply('file:save-response', { success: true });
});

ipcMain.on('file:open', (event) => {
  console.log('Open file');
  event.reply('file:open-response', { success: true });
});

// Handle print operations
ipcMain.on('print:preview', (event, data) => {
  console.log('Print preview:', data);
  event.reply('print:preview-response', { success: true });
});

ipcMain.on('print:send', (event, data) => {
  console.log('Send to printer:', data);
  event.reply('print:send-response', { success: true });
});

// Handle export operations
ipcMain.on('export:pdf', (event, data) => {
  console.log('Export PDF:', data);
  event.reply('export:pdf-response', { success: true });
});

ipcMain.on('export:png', (event, data) => {
  console.log('Export PNG:', data);
  event.reply('export:png-response', { success: true });
});

export default app;
