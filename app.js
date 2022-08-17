const { createServer } = require("http");

const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

const webrtc = require("wrtc");
const { Console } = require("console");

const port = process.env.PORT || 3000;

app.use(express.static("public"));

let activeUsers = [];

let senderStream;

io.on("connection", (socket) => {

    const socketExist = activeUsers.find(
        (socketExist) => socketExist === socket.id
    );

    if (!socketExist) {
        activeUsers.push(socket.id);

        socket.emit("update-user-list", {
            users: activeUsers.filter(
                (socketExist) => socketExist !== socket.id
            ),
        });

        socket.broadcast.emit("update-user-list", { users: [socket.id] });


    }

    socket.on("send-stream", async (data) => {
        // console.log(data.offer, 'send-stream')
        const peer = new webrtc.RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                }
            ]
        });

        peer.ontrack = (e) => handleTrackEvent(e, peer);
        const desc = new webrtc.RTCSessionDescription(data.sdp);
        await peer.setRemoteDescription(desc);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        const payload = {
            sdp: peer.localDescription,
        }
        socket.emit('broad-casting', payload)
    });

    socket.on("fetch-stream", async (data) => {
        //console.log(senderStream)
        const peer = new webrtc.RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                }
            ]
        });
        const desc = new webrtc.RTCSessionDescription(data.sdp);
        await peer.setRemoteDescription(desc);
        senderStream.getTracks().forEach(track => peer.addTrack(track, senderStream));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        const payload = {
            sdp: peer.localDescription
        }

        // res.json(payload);
        socket.emit('fetch-casting', payload)
    })

 


    function handleTrackEvent(e, peer) {

        senderStream = e.streams[0];
    };


    socket.on("make-answer", (data) => {
        socket.to(data.to).emit("answer-made", {
            socket: socket.id,
            answer: data.answer,
        });
    });

    socket.on("reject-call", (data) => {
        socket.to(data.from).emit("call-rejected", {
            socket: socket.id,
        });
    });

    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter(
            (socketExist) => socketExist !== socket.id
        );

        socket.broadcast.emit("remove-user", {
            socketId: socket.id,
        });
    });
});


server.listen(port, () => console.log(`Server is running on port ${port}`));
