import { LobbyRoom, Server, updateLobby } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";

import { monitor } from "@colyseus/monitor";
import express from "express";
import cors from "cors";
import http from "http";

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const port = parseInt(process.env.port, 10) || 1337;

class AppRoom extends LobbyRoom {
    async onCreate() {
        // this.broadcast("new")
        // updateLobby(this);
        this.onMessage("*", console.log);
    }
}

const gameServer = new Server({ transport: new WebSocketTransport({ server }) });
gameServer
    .define("lobby", AppRoom)
    .enableRealtimeListing()
    .on("create", (room: AppRoom) =>
        console.log("room created:", room.roomId, room.listing.unlisted, room.listing.locked, room.listing.private)
    )
    .on("dispose", (room: AppRoom) => console.log("room disposed:", room.roomId))
    .on("join", (room: AppRoom, client) => console.log(client.id, "joined", room.roomId))
    .on("leave", (room: AppRoom, client) => console.log(client.id, "left", room.roomId));
gameServer.listen(port);
console.log(`[GameServer] Listening on Port: ${port}`);

app.use("/colyseus", monitor());
