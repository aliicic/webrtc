"use strict";

const { createServer } = require("http");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

const webrtc = require("wrtc");

const port = process.env.PORT || 3000;

app.use(express.static("public"));

let activeUsers = [];





let serverOptions = {
  listenPort: 3000,
  useHttps: true,

};

server.listen(serverOptions.listenPort);

let peers = new Map();
let consumers = new Map();

function handleTrackEvent(e, peer, socket) {
  if (e.streams && e.streams[0]) {
    peers.get(peer).stream = e.streams[0];

    const payload = {
      type: "newProducer",
      id: peer,
      username: peers.get(peer).username,
    };
    socket.broadcast.emit("message", payload);
  }
}

function createPeer() {
  let peer = new webrtc.RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.stunprotocol.org:3478" },
      { urls: "stun:stun.l.google.com:19302" },
      {
        urls: ["turn:13.250.13.83:3478?transport=udp"],
        username: "YzYNCouZM1mhqhmseWk6",
        credential: "YzYNCouZM1mhqhmseWk6",
      },
    ],
  });

  return peer;
}

// Create a server for handling websocket calls
// const wss = new WebSocketServer({ server: webServer });

io.on("connection", (socket) =>{
  let peerId = uuidv4();
  socket.id = peerId;
  socket.on("disconnect", (event) => {
    peers.delete(socket.id);
    consumers.delete(socket.id);

    activeUsers.map((item, index) => {
        if (item.id === socket.id) activeUsers.splice(index, 1);
      });
      //console.log(activeUsers);
    io.sockets.emit("online-users", activeUsers);

    socket.broadcast.emit("message",
       {
        type: "user_left",
        id: socket.id,
      }
    );
  });

  socket.emit("message", { type: "welcome", id: peerId });
  
  // socket.on("login", (data) => {
  //       //activeUsers[socket.id] = data;
  //       //console.log(socket.id)
      

  //       //console.log(activeUsers);
  //       io.emit("online-users", activeUsers);
  //     });

  socket.on("message", async function (message) {
    const body = message;
  
    switch (body.type) {
      case "connect":
    
        peers.set(body.uqid , {socket});
       // console.log(x)
        console.log(peers.get(body.uqid), "this is body");
        const peer = createPeer();
        activeUsers.push({
          name: body.username,
          id: body.uqid,
        });
        socket.broadcast.emit("userList", activeUsers);
        peers.get(body.uqid).username = body.username;
        peers.get(body.uqid).peer = peer;
        peer.ontrack = (e) => {
          handleTrackEvent(e, body.uqid , socket);
        };
        const desc = new webrtc.RTCSessionDescription(body.sdp);
        await peer.setRemoteDescription(desc);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        const payload = {
          type: "answer",
          sdp: peer.localDescription,
        };
        
        socket.emit("message", payload);
        break;
      case "getPeers":
        let uuid = body.uqid;
        const list = [];
        peers.forEach((peer, key) => {
          if (key != uuid) {
            const peerInfo = {
              id: key,
              username: peer.username,
            };
            list.push(peerInfo);
          }
        });

        const peersPayload = {
          type: "peers",
          peers: list,
        };

        socket.emit("message", peersPayload );
        break;
      case "ice":
        const user = peers.get(body.uqid);
        if (user.peer)
          user.peer
            .addIceCandidate(new webrtc.RTCIceCandidate(body.ice))
            .catch((e) => console.log(e));
        break;
      case "consume":
        try {
          let { id, sdp, consumerId } = body;
          const remoteUser = peers.get(id);
          const newPeer = createPeer();
          consumers.set(consumerId, newPeer);
          const _desc = new webrtc.RTCSessionDescription(sdp);
          await consumers.get(consumerId).setRemoteDescription(_desc);

          remoteUser.stream.getTracks().forEach((track) => {
            consumers.get(consumerId).addTrack(track, remoteUser.stream);
          });
          const _answer = await consumers.get(consumerId).createAnswer();
          await consumers.get(consumerId).setLocalDescription(_answer);

          const _payload = {
            type: "consume",
            sdp: consumers.get(consumerId).localDescription,
            username: remoteUser.username,
            id,
            consumerId,
          };

          socket.emit("message" , _payload);
        } catch (error) {
          console.log(error);
        }

        break;
      case "consumer_ice":
        if (consumers.has(body.consumerId)) {
          consumers
            .get(body.consumerId)
            .addIceCandidate(new webrtc.RTCIceCandidate(body.ice))
            .catch((e) => console.log(e));
        }
        break;
      default:
        socket.broadcast.emit(message);
    }
  });

  io.on("error", () => io.terminate());
});

// wss.broadcast = function (data) {
//   peers.forEach(function (peer) {
//     if (peer.socket.readyState === WebSocket.OPEN) {
//       peer.socket.send(data);
//     }
//   });
// };

console.log(`Server running on ${serverOptions.listenPort}`);
