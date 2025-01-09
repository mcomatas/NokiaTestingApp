import { app, BrowserWindow } from 'electron';
//import { ChildProcess } from 'node:child_process';
//import serve from 'electron-serve';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import find from 'find-process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1900,
        height: 1000,
        webPreferences: {
            webviewTag: true
        },
        title: "Nokia Testing App",
        icon: 'C:/Users/comatas/Desktop/Code/NokiaTestingApp/public/NokiaIcon.png'
    });

    // For dev testing
    exec('npm run next:dev');
    // For finished build
    //exec('npm run start');

    win.loadURL('http://localhost:3000');
    let portOpen = true;
    win.on('close', (e) => {
        if (portOpen) {
            e.preventDefault();
            find('port', 3000).then((list) => {
                console.log(list[0].pid);
                process.kill(list[0].pid);
            });
            portOpen = false;
        }
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
});

app.on('window-all-closed', () => {
    app.quit();
});