import io from 'socket.io-client';
import handleData from './handleData';

export default async function handleCommand(term, command, disposable) {
    term?.write(`\r\n`);
    switch(command[0]) {
        case "help":
            term?.write("List of commands:\
                \r\nabout - gives a small description about the application\
                \r\nclear - clears the terminal\
                \r\nhelp - displays a list of commands\
                \r\nssh {ip} - ssh into the given ip");
            break;
        case "about":
            term?.write("Welcome to the Tester2.0 application! This is a web application aimed to improve the workflow for all testers by integrating CLI, WebUI, and more.\
                \r\nDeveloped and maintained by Michael Comatas (michael.comatas@nokia.com). Please feel free to email me or message me directly on teams with any questions or concerns.");
            break;
        case "clear":
            term?.clear();
            break;
        case "ssh":
            const socket = io('ws://localhost:8080', {transports: ['websocket'], query: {host: command[1]}});
            const response = await fetch('/api/ssh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
            console.log(data);

            term?.write(`SSHing into ${command[1]}\r\n$ `);
            term?.reset();

            disposable.dispose();

            socket.on('message', (msg) => term?.write(msg));
            term?.onData((data) => socket.emit('message', data));

            socket.on('disconnect', (reason, details) => {
                socket.close();
                console.log(`Socket Disconnected. Reason: ${reason}`);
                term?.write('\r\n$ ');
                handleData(term);
            });

            break;
        default:
            term?.write("Unknown command. Type 'help' for a list of commands.");
        
    }
}