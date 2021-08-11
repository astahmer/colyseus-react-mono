import { ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import { Demo } from "./components/Demo";
import { useColyseus } from "./hooks/useColyseus";

const queryClient = new QueryClient();

const theme = extendTheme({ config: { initialColorMode: "light" } });

function App() {
    const client = useColyseus();
    console.log(client);

    useEffect(() => {
        const getRooms = async () => {
            const rooms = await client.getAvailableRooms();
            console.log(rooms);
        };
        getRooms();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <Flex direction="column" boxSize="100%">
                    <Demo />
                </Flex>
            </ChakraProvider>
        </QueryClientProvider>
    );
}

export default App;
