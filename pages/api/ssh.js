import { Client } from 'ssh2';
import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'node:http';

export default async function sshHandler(req, res) {
    
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    // If server exists already
    if (res.socket.server.io) {
        res.status(200).json({ success: true, message: "Socker server is already running.", socket: 8080 });
        return;
    }

    const app = express();
    const server = createServer(app);

    server.listen(8080, () => console.log("Listening on port 8080"));

    const io = new Server(server, { cors: { origin: 'ws://localhost:8080' } });

    //console.log('Socket.io server created');
    io.on('connection', (socket) => {
        console.log("Socket.io connection established");

        const conn = new Client();
        conn.on('ready', () => {
            console.log('Client ready');

            conn.shell((err, stream) => {
                if (err) throw err;

                stream.on('close', () => {
                    conn.end();
                    socket.disconnect();
                    //server.close();
                    console.log('SSH connection closed');
                });

                socket.on('message', (msg) => stream.write(msg));
                stream.on('data', (data) => socket.emit('message', data.toString()));
            })
        }).connect({
            hostname: socket.handshake.query.host,
            username: 'cli'
        });
    });

    res.socket.server.io = io;
    res.status(201).json({ success: true, message: "Socket server started.", socket: 8080 });
    
}