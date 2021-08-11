import { updateItem } from "@pastable/core";
import * as Colyseus from "colyseus.js";
import { atom, useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { useEffect, useState } from "react";

const colyseusClientAtom = atom(new Colyseus.Client("ws://localhost:1337"));
export const useColyseus = () => useAtomValue(colyseusClientAtom);

const lobbyRoomAtom = atom(null as Colyseus.Room);
export const useLobbyRoom = () => useAtomValue(lobbyRoomAtom);
export const useJoinOrCreateLobby = () => {
    const client = useColyseus();
    const setLobbyRoom = useUpdateAtom(lobbyRoomAtom);
    const setLobbyRoomsList = useUpdateAtom(roomsAtom);

    const joinOrCreate = async (name: string) => {
        const lobby = await client.create(name);

        lobby.onMessage("*", (...args) => console.log("onMessage", ...args));
        lobby.onMessage("rooms", (rooms) => {
            console.log({ rooms });
            setLobbyRoomsList(rooms);
        });

        lobby.onMessage("+", ([roomId, room]) => {
            console.log({ roomId, room });
            setLobbyRoomsList((rooms) => {
                const allRooms = [...rooms];
                const roomIndex = allRooms.findIndex((room) => room.id === roomId);
                if (roomIndex !== -1) {
                    allRooms[roomIndex] = room;
                } else {
                    allRooms.push(room);
                }

                return allRooms;
            });
        });

        lobby.onMessage("-", (roomId) => {
            console.log({ roomId });
            setLobbyRoomsList((rooms) => rooms.filter((room) => room.id !== roomId));
        });

        setLobbyRoom(lobby);

        return lobby;
    };

    return joinOrCreate;
};

const roomsAtom = atom([] as Array<Colyseus.Room>);
export const useRooms = () => useAtomValue(roomsAtom);

const availableRoomsAtom = atom([] as Array<Colyseus.RoomAvailable>);
export const useAvailableRooms = () => useAtomValue(availableRoomsAtom);
export const useAvailableRoomsRefresher = () => {
    const client = useColyseus();
    const setAvailableRooms = useUpdateAtom(availableRoomsAtom);
    const joinOrCreateLobby = useJoinOrCreateLobby();

    useEffect(() => {
        joinOrCreateLobby("lobby");
        setInterval(async () => {
            const rooms = await client.getAvailableRooms("lobby");
            console.log(rooms);
            setAvailableRooms(rooms);
        }, 1000);
    }, []);
};
