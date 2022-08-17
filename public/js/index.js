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
    const peer = createPeerr();
    stream.getTracks().forEach(track => peer.addTrack(track, stream));
}


function createPeerr() {
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



async function init2() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById("local-video").srcObject = stream;

    const peer = createPeerrr();

    stream.getTracks().forEach(track => peer.addTrack(track, stream));
}


function createPeerrr() {
    console.log('create peer2 runed')
    const peer = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent2(peer);

    return peer;
}

async function handleNegotiationNeededEvent2(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription
    };

    // const { data } = await axios.post('/broadcast', payload);

    socket.emit("send-stream2", payload);

    socket.on('broad-casting2', async (data) => {

        console.log(data.sdp)
        const desc = new RTCSessionDescription(data.sdp);
        peer.setRemoteDescription(desc).catch(e => console.log(e));

    })


}







async function fetch() {
    const peer = fetChcreatePeer();
    peer.addTransceiver("video", { direction: "recvonly" })
}

function fetChcreatePeer() {
    const peer = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    peer.ontrack = handleTrackEvent1;
    peer.onnegotiationneeded = () => fetchHandleNegotiationNeededEvent(peer);

    return peer;
}

async function fetchHandleNegotiationNeededEvent(peer) {
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




async function fetch2() {
    const peer = fetchCreatePeer1();
    peer.addTransceiver("video", { direction: "recvonly" })
}

function fetchCreatePeer1() {
    const peer = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    peer.ontrack = handleTrackEvent2;
    peer.onnegotiationneeded = () => fetchHandleNegotiationNeededEvent1(peer);

    return peer;
}

async function fetchHandleNegotiationNeededEvent1(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription
    };

    //const { data } = await axios.post('/consumer', payload);

    socket.emit("fetch-stream2", payload);

    socket.on('broad-casting2', async (data) => {

        const desc = new RTCSessionDescription(data.sdp);
        peer.setRemoteDescription(desc).catch(e => console.log(e));

    })


}

function handleTrackEvent2(e) {
    document.getElementById("remote-video2").srcObject = e.streams[0];
};



logginBtn.addEventListener('click', () => {

   // init2()

    if (user.value == 'admin') {
        init()
    } else if (user.value == 'admin2') {
        init2()
    }
    else {


        setTimeout(() => {

            fetch()

        }, 4000)
        setTimeout(() => {

            fetch2()

        }, 8000)

    }

})





// peerConnection.ontrack = function ({ streams: [stream] }) {
//     const remoteVideo = document.getElementById("remote-video");

//     if (remoteVideo) {
//         remoteVideo.srcObject = stream;
//     }
// };
