import XTerminal from "../components/terminal"
import WebUI from "../components/webui";
import {
    Box,
    Stack,
    Text,
    Button,
    SimpleGrid,
    CloseButton,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightElement,
} from '@chakra-ui/react';
import { useState } from 'react';

const prompt = "$ Welcome to the Nokia Testing App!\r\n$ Type 'help' to get started\r\n\n$ ";
let initialTerms = [{id: 0, prompt: prompt}];
let termId = 1;

let initialIps = [];
let webId = 0;

export default function Page() {
    const [terms, setTerms] = useState(initialTerms);
    const [ips, setIps] = useState(initialIps);
    const [input, setInput] = useState('');

    function addTerminal() {
        setTerms([...terms, {id: termId++, prompt: '$ '}]);
    }
    
    function removeTerminal(id) {
        setTerms(
            terms.filter(term => term.id !== id)
        );
    }

    function addWebUI() {
        setIps([...ips, { id: webId++, ip: `http://${input}`}]);
        setInput('');
    }

    function removeWebUI(id) {
        setIps(
            ips.filter(ip => ip.id !== id)
        );
    }

    function handleInputChange(e) {
        setInput(e.target.value);
    }
    
    return (
        <Box>
            <Text fontSize={38} padding={1}>Nokia Testing App</Text>
            <Box padding={3} width={400}>
                <Stack spacing={3}>
                    <Button size="md" colorScheme="green" onClick={addTerminal}>Add Terminal</Button>
                    <InputGroup>
                        <InputLeftAddon>http://</InputLeftAddon>
                        <Input value={input} onChange={handleInputChange} placeholder="Enter NE IP" />
                        <InputRightElement width={110}>
                            <Button size="sm" colorScheme="green" onClick={addWebUI}>
                                Add WebUI
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </Stack>
            </Box>

            {/*CLI Grid*/}
            <SimpleGrid columns={2} spacing={5} padding={4}>
                {terms.map((term) => (
                    <Box key={term.id}>
                        <Box display="flex" justifyContent="flex-end"><CloseButton onClick={() => removeTerminal(term.id)} /></Box>
                        <XTerminal prompt={term.prompt} />
                    </Box>
                ))}
            </SimpleGrid>

            {/*WebUI Grid*/}
            <SimpleGrid columns={2} spacing={5} padding={4}>
                {ips.map((ip) => (
                    <Box key={ip.id}>
                        <Box display="flex" justifyContent="flex-end"><CloseButton onClick={() => removeWebUI(ip.id)} value={ip.id} /></Box>
                        <WebUI src={ip.ip} />
                    </Box>
                ))}
            </SimpleGrid>

        </Box>
    )
}