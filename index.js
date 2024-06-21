const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let urlMenuItem;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false, // Permite la integración del contexto para IPC
      // Permitir el control de nuevas ventanas emergentes
      webviewTag: true
    },
    icon: path.join(__dirname, 'icon.ico')
  });

  // Cargar el archivo index.html
  win.loadURL('https://www3.animeflv.net/');

  // Crear un menú con la URL
  const template = [
    {
      label: 'Custom Menu',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        {
          label: 'URL Actual: N/A',
          id: 'current-url',
          enabled: false // Deshabilitar para que no sea interactivo
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Guardar la referencia del menú de URL
  urlMenuItem = menu.getMenuItemById('current-url');

  // Manejar cambios de URL
  ipcMain.on('url-changed', (event, url) => {
    if (urlMenuItem) {
      urlMenuItem.label = `URL Actual: ${url}`;
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
