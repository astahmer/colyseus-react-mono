import {
    useAvailableRooms,
    useAvailableRoomsRefresher,
    useColyseus,
    useJoinOrCreateLobby,
    useLobbyRoom,
    useRooms,
} from "@/hooks/useColyseus";
import { Center, Box, Button, Input, Stack } from "@chakra-ui/react";
import { getRandomString, useSelection } from "@pastable/core";
import { Room } from "colyseus.js";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai/utils";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";

export const Demo = () => {
    const client = useColyseus();
    const inputRef = useRef<HTMLInputElement>();
    const joinOrCreateLobby = useJoinOrCreateLobby();
    const lobbyRoom = useLobbyRoom();
    const createRoom = async () => {
        joinOrCreateLobby("lobby");
        // const room = await client.create("lobby");
        // room.onMessage("*", (...args) => console.log("onMessage", ...args));
        // console.log(room);
        // setRooms((rooms) => [...rooms, room]);
    };
    const leaveRoom = (room: Room) => room.leave();
    const joinLobbyRoom = () => {
        client.join(inputRef.current.value);
        console.log(lobbyRoom);
    };
    // useAvailableRoomsRefresher();
    const rooms = useRooms();
    console.log(lobbyRoom);

    return (
        <Center h="100%">
            <div>
                <Button onClick={createRoom}>Create</Button>
                <Button onClick={async () => console.log(await client.getAvailableRooms("lobby"))}>
                    Log available rooms
                </Button>
                <Input ref={inputRef} defaultValue="lobby" />
                <Button onClick={joinLobbyRoom}>Join room</Button>
                <Stack direction="row">
                    {rooms.map((room) => (
                        <Stack key={room.id} onClick={() => leaveRoom(room)} border="1px solid teal">
                            <span>id: {room.id}</span>
                            <span>name: {room.name}</span>
                            <span>sessionId: {room.sessionId}</span>
                        </Stack>
                    ))}
                </Stack>
            </div>
        </Center>
    );
};
