const socket = io("localhost:3000");

let isAlreadyCalling = false;
let getCalled = false;



const user = document.getElementById('username')
const logginBtn = document.getElementById('loggin')
const fetchBtn = document.getElementById('fetch')


let videoFetch1 = false,
    videoFetch2 = false


async function init() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log(stream, 'init')
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

    let number = 1
    if (user.value === 'admin') {
        number = 1
    }
    if (user.value === 'admin2') {
        number = 2
    }

    socket.emit(`send-stream${number}`, payload);

    socket.on(`broad-casting-sender${number}`, async (data) => {

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
        await peer.setRemoteDescription(desc).catch(e => console.log(e));



    })


}

async function handleTrackEvent1(e) {
    console.log(e.streams[0], 'fetch')

    if (e.streams[0]) {
        console.log('run')
        document.getElementById("remote-video").srcObject = await e.streams[0];

    }

    // if (!document.getElementById("remote-video1").src) {
    //     console.log('fetch run again')
    //     fetch()
    // }

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

    socket.on('broad-casting22', async (data) => {

        const desc = new RTCSessionDescription(data.sdp);
        await peer.setRemoteDescription(desc).catch(e => console.log(e));

    })


}

function handleTrackEvent2(e) {
    document.getElementById("remote-video2").srcObject = e.streams[0];

};


// socket.on('user-joied', (data) => {


//     setTimeout(() => {

//         fetch()

//     }, 4000)
//     setTimeout(() => {

//         fetch2()

//     }, 8000)

// })


logginBtn.addEventListener('click', () => {

    init()

})
fetchBtn.addEventListener('click', () => {

  alert('button clicked')

    fetch()
    fetch2()

})




// if (videoFetch1) {
//     console.log('videoFetch1')
//     setTimeout(() => {

//         fetch()

//     }, 4000)
// }


// if (videoFetch2) {

//     setTimeout(() => {

//         fetch2()

//     }, 4000)
// }





socket.on('broad-casting1', data => {
    videoFetch1 = true
    // alert('admin logged in')
    // console.log('hello client')
    fetchBtn.click()
})
socket.on('broad-casting2', data => {
    videoFetch2 = true
    console.log('hello client2')
    setTimeout(() => {
        fetch2()
    }, 4000);
})
