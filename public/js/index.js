const socket = io("https://webinar.runflare.run", {
  rejectUnauthorized: false,
});

let isAlreadyCalling = false;
let getCalled = false;

const user = document.getElementById("username");
const logginBtn = document.getElementById("loggin");
const fetchBtn = document.getElementById("fetch");
const kill = document.getElementById("kill");

let video1 = document.getElementById("remote-video");

async function init() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  console.log(stream, "init");
  document.getElementById("local-video").srcObject = stream;
  const peer = createPeer();
  stream.getTracks().forEach((track) => peer.addTrack(track, stream));
}

function createPeer() {
  const peer = new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:openrelay.metered.ca:80",
      },
      {
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443?transport=tcp",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
    ],
  });
  //  peer.onicecandidate = async (event) => {
  //      console.log("new ICE candidate", event.candidate);
  //      socket.emit(`send-stream${number}`, {
  //          type: "candidate",
  //          'candidate': event.candidate,
  //      });
  //        };
  peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

  return peer;
}

async function handleNegotiationNeededEvent(peer) {
  const offer = await peer.createOffer();

  console.log(offer, "this is offer");
  await peer.setLocalDescription(offer);
  let ice;
  peer.onicecandidate = async (event) => {
    ice = await event.candidate;
    console.log(ice);
  };

  let payload = {
    sdp: peer.localDescription,
    ice,
  };
  let number = 1;
  if (nickname == "admin") {
    number = 1;
  }
  if (nickname != "admin") {
    alert("heey it workssss");
    number = 2;
  }

  setTimeout(() => {
    payload.ice = ice;
    socket.emit(`send-stream${number}`, payload);
  }, 5000);

  socket.on(`broad-casting-sender${number}`, async (data) => {
    console.log(data.sdp);
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch((e) => console.log(e));
  });
}

async function fetch() {
  const peer = fetChcreatePeer();
  peer.addTransceiver("audio");
  peer.addTransceiver("video", { direction: "recvonly" });
}

function fetChcreatePeer() {
  const peer = new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:openrelay.metered.ca:80",
      },
      {
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443?transport=tcp",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
    ],
  });
  peer.ontrack = handleTrackEvent1;
  // peer.onicecandidate = async (event) => {
  //     console.log("new ICE candidate" , event.candidate)
  // }
  peer.onnegotiationneeded = () => fetchHandleNegotiationNeededEvent(peer);

  return peer;
}

async function fetchHandleNegotiationNeededEvent(peer) {
  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);

  let ice;
  peer.onicecandidate = async (event) => {
    ice = await event.candidate;
    console.log(ice);
  };

  let payload = {
    sdp: peer.localDescription,
    ice,
  };

  //const { data } = await axios.post('/consumer', payload);

  setTimeout(() => {
    payload.ice = ice;
    socket.emit("fetch-stream", payload);
  }, 5000);

  socket.on("fetch-casting", async (data) => {
      const desc = new RTCSessionDescription(data.sdp);
     
    peer.setRemoteDescription(desc).catch((e) => console.log(e));
  });
 socket.on("fetch-ice", data => {
     peer.addIceCandidate(data);
})
}

async function handleTrackEvent1(e) {
  console.log(e.streams[0], "fetch");

  if (e.streams[0]) {
    console.log("run");
    video1.srcObject = await e.streams[0];
  }

  // if (!document.getElementById("remote-video1").src) {
  //     console.log('fetch run again')
  //     fetch()
  // }
}

async function fetch2() {
  const peer = fetchCreatePeer1();
  peer.addTransceiver("video", { direction: "recvonly" });
}

function fetchCreatePeer1() {
  const peer = new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:openrelay.metered.ca:80",
      },
      {
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443?transport=tcp",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
    ],
  });
  peer.ontrack = handleTrackEvent2;
  peer.onnegotiationneeded = () => fetchHandleNegotiationNeededEvent1(peer);

  return peer;
}

async function fetchHandleNegotiationNeededEvent1(peer) {
  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);

  let ice;
  peer.onicecandidate = async (event) => {
    ice = await event.candidate;
    console.log(ice);
  };

  let payload = {
    sdp: peer.localDescription,
    ice,
  };

  //const { data } = await axios.post('/consumer', payload);

  setTimeout(() => {
    payload.ice = ice;
    socket.emit("fetch-stream2", payload);
  }, 5000);

    socket.on("broad-casting22", async (data) => {
  
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch((e) => console.log(e));
    });
     socket.on("fetch-ice2", (data) => {
       peer.addIceCandidate(data);
     });
}

function handleTrackEvent2(e) {
  document.getElementById("remote-video2").srcObject = e.streams[0];
}

// socket.on('user-joied', (data) => {

//     setTimeout(() => {

//         fetch()

//     }, 4000)
//     setTimeout(() => {

//         fetch2()

//     }, 8000)

// })

const nickname = localStorage.getItem("nickname");

socket.emit("login", nickname);

socket.on("online-users", (data) => {
  // console.log(data);

  let li;
  const ul = document.getElementById("active-users-list");
  ul.innerHTML = "";
  data.map((item) => {
    console.log(item);
    li = document.createElement("li");
    li.innerHTML = item.data;
    li.addEventListener("click", () => {
      if (nickname != "admin") return;
      let payload = {
        name: item.data,
        id: item.id,
      };
      socket.emit("choose-user", payload);
    });
    ul.appendChild(li);
  });
});

socket.on("choosed-to-call", (data) => {
  // const accept =  confirm('َدرخواست شما پذیرفته شد شروع به صحبت میکنید؟')
  // console.log(accept)
  //   if (accept) {
  init();
  //    } else {
  // alert('شما درخواست را لغو کردید')
  //    }
});

if (nickname == "admin") {
  logginBtn.disabled = false;
}

logginBtn.addEventListener("click", () => {
  if (nickname == "admin") {
    init();
  }
});

fetchBtn.addEventListener("click", () => {
  fetch();
  fetch2();
});

// kill.addEventListener('click', () => {
//     socket.emit('kill-stream')
// })

// if (videoFetch1) {
//     console.log('videoFetch1')

document.addEventListener("DOMContentLoaded", (event) => {
  //? sender stream 1 and 2 flags in app.js(server side) check check if no one doesn't stream video , prevent fetch stream fire
  //? if delete flags and their condition in server side ... we would have some errors is server side but app works anyway
  fetch();
  fetch2();
});

// }

// check3 = new Proxy({}, {
//     set: function (target, property, value) {
//         alert('heeey')
//         // setTimeout(() => {
//         //     fetch()
//         // }, 4000)
//         target[property] = value;
//     }
// });

// socket.emit('disconnect', {
//     user: user.value
// })

// check3.property = 100

socket.on("broad-casting1", (data) => {
  videoFetch1 = true;

  setTimeout(() => {
    fetch();
  });
});
socket.on("broad-casting2", (data) => {
  setTimeout(() => {
    fetch2();
  });
});
