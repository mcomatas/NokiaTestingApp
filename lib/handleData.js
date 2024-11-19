import handleCommand from "./handleCommand";

export default function handleData(term) {
    let command = "";
    let disposable = term.onData((data) => {
        if (data === "\r") {
            if (command.length > 0) handleCommand(term, command.split(" "), disposable);
            term?.write(`\r\n$ `);
            command = "";
        } else if (data.charCodeAt(0) === 127) {
            if (command.length > 0) {
                term?.write("\b \b");
                command = command.slice(0, command.length - 1);
            }
        } else {
            term?.write(data);
            command += data;
        }
    })
}