import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '../node_modules/@xterm/xterm/css/xterm.css';
import handleData from '../lib/handleData';

const XTerminal = ({prompt, termHeight}) => {
    const terminalRef = useRef(null);
    const [term, setTerm] = useState(null);

    useEffect(() => {
        const terminal = new Terminal({
            cursorBlink: true,
        });
        setTerm(terminal);
        return () => {
            if (terminal) {
                terminal.dispose();
            }
        };
    }, []);

    useEffect(() => {
        if (term) {
            if (terminalRef.current) {
                const fitAddon = new FitAddon();
                term.loadAddon(fitAddon);
                term.open(terminalRef.current);
                fitAddon.fit();
                setTerm(term);
                term?.write(`${prompt}`);
            }
            handleData(term);
        }
    }, [term]);

    return <div ref={terminalRef} style={{ height: termHeight }}/>
}

export default XTerminal;