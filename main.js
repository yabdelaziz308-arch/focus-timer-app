const { app, BrowserWindow, tray, Menu, Tray, Notification, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let appTray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.setMenu(null);

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Minimize to tray instead of closing when user clicks 'X'
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

// Create the System Tray Menu
function createTray() {
  // Creating a simple tray placeholder icon (uses a default terminal icon if image is missing)
  appTray = new Tray(path.join(__dirname, 'src/renderer/index.html')); 
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow.show() },
    { label: 'Quit', click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  appTray.setToolTip('Focus Timer');
  appTray.setContextMenu(contextMenu);

  // Show app when clicking the tray icon
  appTray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

// IPC Listener to trigger Native Desktop Notifications from React
ipcMain.on('notify-session-ended', (event, message) => {
  if (Notification.isSupported()) {
    new Notification({
      title: '🎯 Focus Timer',
      body: message,
    }).show();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});