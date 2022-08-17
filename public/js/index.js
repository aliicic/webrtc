const socket = io("localhost:3000");

let isAlreadyCalling = false;
let getCalled = false;

// const { RTCPeerConnection, RTCSessionDescription } = window;

// const peerConnection = new RTCPeerConnection({
//     iceServers: [
//         {
//             urls: "stun:stun.stunprotocol.org"
//         }
//     ]
// });

// async function callUser(socketId) {
//     const offer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(offer);

//     socket.emit("send-stream", {
//         offer,
//         to: socketId,
//     });
// }

// callUser('oo oo oo')


// async function fetch(socketId) {
//     console.log('hey')
//     const offer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

//     socket.emit("fetch-stream", {
//         offer,
//         to: socketId,
//     });
// }
// fetch('oo oo oo')

// socket.on('broad-casting', async (data) => {

//     await peerConnection.setRemoteDescription(
//         new RTCSessionDescription(data.sdp)
//     );

//     navigator.getUserMedia(
//         { video: true, audio: true },
//         (stream) => {
//             const localVideo = document.getElementById("local-video");

//             if (localVideo) {
//                 localVideo.srcObject = stream;
//             }

//             stream
//                 .getTracks()
//                 .forEach((track) => peerConnection.addTrack(track, stream));
//         },
//         (error) => {
//             console.log(error.message);
//         }
//     );


// })
// socket.on('fetch-casting', async (data) => {
//     console.log(data.sdp, 'fetch')

//     await peerConnection.setRemoteDescription(
//         new RTCSessionDescription(data.sdp)
//     );

//     // const answer = await peerConnection.createAnswer();

//     // await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));

// })

const user = document.getElementById('username')
const logginBtn = document.getElementById('loggin')



async function init() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById("local-video").srcObject = stream;
    const peer = createPeer();
    stream.getTracks().forEach(track => peer.addTrack(track, stream));
}


function createPeer() {
    const peer = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
}

async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription
    };

    // const { data } = await axios.post('/broadcast', payload);

    socket.emit("send-stream", payload);

    socket.on('broad-casting', async (data) => {

        console.log(data.sdp)
        const desc = new RTCSessionDescription(data.sdp);
        peer.setRemoteDescription(desc).catch(e => console.log(e));

    })


}





async function init1() {
    const peer = createPeer1();
    peer.addTransceiver("video", { direction: "recvonly" })
}

function createPeer1() {
    const peer = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    peer.ontrack = handleTrackEvent1;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent1(peer);

    return peer;
}

async function handleNegotiationNeededEvent1(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription
    };

    //const { data } = await axios.post('/consumer', payload);

    socket.emit("fetch-stream", payload);

    socket.on('fetch-casting', async (data) => {

        const desc = new RTCSessionDescription(data.sdp);
        peer.setRemoteDescription(desc).catch(e => console.log(e));

    })


}

function handleTrackEvent1(e) {
    document.getElementById("remote-video").srcObject = e.streams[0];
};

logginBtn.addEventListener('click', () => {

    if (user.value == 'admin') {
        init()
    } else {

        setTimeout(() => {
            init1()

        }, 4000)

    }

})





// peerConnection.ontrack = function ({ streams: [stream] }) {
//     const remoteVideo = document.getElementById("remote-video");

//     if (remoteVideo) {
//         remoteVideo.srcObject = stream;
//     }
// };
