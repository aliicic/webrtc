// const socket = io("localhost:3000", {
//   rejectUnauthorized: false,
// });

// let isAlreadyCalling = false;
// let getCalled = false;

// const user = document.getElementById("username");
// const logginBtn = document.getElementById("loggin");
// const fetchBtn = document.getElementById("fetch");
// const kill = document.getElementById("kill");

// let video1 = document.getElementById("remote-video");

// async function init() {
//   const stream = await navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true,
//   });
//   // console.log(stream, "init");
//   document.getElementById("local-video").srcObject = stream;
//   const peer = createPeer();
//   stream.getTracks().forEach((track) => peer.addTrack(track, stream));
// }

// function createPeer() {
//   const peer = new RTCPeerConnection({
//     iceServers: [
//       {
//         urls: "stun:openrelay.metered.ca:80",
//       },
//       {
//         urls: "turn:openrelay.metered.ca:80",
//         username: "openrelayproject",
//         credential: "openrelayproject",
//       },
//       {
//         urls: "turn:openrelay.metered.ca:443",
//         username: "openrelayproject",
//         credential: "openrelayproject",
//       },
//       {
//         urls: "turn:openrelay.metered.ca:443?transport=tcp",
//         username: "openrelayproject",
//         credential: "openrelayproject",
//       },
//     ],
//   });
//   peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

//   return peer;
// }

// async function handleNegotiationNeededEvent(peer) {
//   const offer = await peer.createOffer();

//   // console.log(offer, "this is offer");
//   await peer.setLocalDescription(offer);
//   let ice;
//   peer.onicecandidate = async (event) => {
//     ice = await event.candidate;
//     // console.log(ice);
//   };

//   let payload = {
//     sdp: peer.localDescription,
//     ice,
//   };
//   let number = 1;
//   if (nickname == "admin") {
//     number = 1;
//   }
//   if (nickname != "admin") {
//     number = 2;
//   }

//    setTimeout(() => {
//     payload.ice = ice;
//     socket.emit(`send-stream${number}`, payload);
//    }, 5000);

//   socket.on(`broad-casting-sender${number}`, async (data) => {
//     // console.log(data.sdp);
//     const desc = new RTCSessionDescription(data.sdp);
//     peer.setRemoteDescription(desc).catch((e) => console.log(e , 'this is a message from setttremoot'));
//     peer.addIceCandidate(data.ice);

//   });
// }

// async function fetch() {
//   const peer = fetChcreatePeer();
//   peer.addTransceiver("audio");
//   peer.addTransceiver("video", { direction: "recvonly" });
// }

// function fetChcreatePeer() {
//   const peer = new RTCPeerConnection({
//     iceServers: [
//       {
//         urls: "stun:openrelay.metered.ca:80",
//       },
//       {
//         urls: "turn:openrelay.metered.ca:80",
//         username: "openrelayproject",
//         credential: "openrelayproject",
//       },
//       {
//         urls: "turn:openrelay.metered.ca:443",
//         username: "openrelayproject",
//         credential: "openrelayproject",
//       },
//       {
//         urls: "turn:openrelay.metered.ca:443?transport=tcp",
//         username: "openrelayproject",
//         credential: "openrelayproject",
//       },
//     ],
//   });
//   peer.ontrack = handleTrackEvent1;
//   // peer.onicecandidate = async (event) => {
//   //     console.log("new ICE candidate" , event.candidate)
//   // }
//   peer.onnegotiationneeded = () => fetchHandleNegotiationNeededEvent(peer);

//   return peer;
// }

// async function fetchHandleNegotiationNeededEvent(peer) {
//   const offer = await peer.createOffer();
//   await peer.setLocalDescription(offer);

//   let ice;
//   peer.onicecandidate = async (event) => {
//     ice = await event.candidate;
//     //console.log(ice);
//   };

//   let payload = {
//     sdp: peer.localDescription,
//     ice,
//   };

//   //const { data } = await axios.post('/consumer', payload);

//   setTimeout(() => {
//     payload.ice = ice;
//     socket.emit("fetch-stream", payload);
//   }, 5000);

//   socket.on("fetch-casting", async (data) => {
//     const desc = new RTCSessionDescription(data.sdp);

//     peer.setRemoteDescription(desc).catch((e) => console.log(e));
//   });
//   socket.on("fetch-ice", (data) => {
//     peer.addIceCandidate(data.ice);
//   });
// }

// async function handleTrackEvent1(e) {
//   //console.log(e.streams[0], "fetch");

//   if (e.streams[0]) {
//    // console.log("run");
//     video1.srcObject = await e.streams[0];
//   }

//   // if (!document.getElementById("remote-video1").src) {
//   //     console.log('fetch run again')
//   //     fetch()
//   // }
// }

// async function fetch2() {
//   const peer = fetchCreatePeer1();
//   peer.addTransceiver("video", { direction: "recvonly" });
// }

// function fetchCreatePeer1() {
//   const peer = new RTCPeerConnection({
//     iceServers: [
//       {
//         urls: "stun:openrelay.metered.ca:80",
//       },
//       {
//         urls: "turn:openrelay.metered.ca:80",
//         username: "openrelayproject",
//         credential: "openrelayproject",
//       },
//       {
//         urls: "turn:openrelay.metered.ca:443",
//         username: "openrelayproject",
//         credential: "openrelayproject",
//       },
//       {
//         urls: "turn:openrelay.metered.ca:443?transport=tcp",
//         username: "openrelayproject",
//         credential: "openrelayproject",
//       },
//     ],
//   });
//   peer.ontrack = handleTrackEvent2;
//   peer.onnegotiationneeded = () => fetchHandleNegotiationNeededEvent1(peer);

//   return peer;
// }

// async function fetchHandleNegotiationNeededEvent1(peer) {
//   const offer = await peer.createOffer();
//   await peer.setLocalDescription(offer);

//   let ice;
//   peer.onicecandidate = async (event) => {
//     ice = await event.candidate;
//     //console.log(ice);
//   };

//   let payload = {
//     sdp: peer.localDescription,
//     ice,
//   };

//   //const { data } = await axios.post('/consumer', payload);

//   setTimeout(() => {
//     payload.ice = ice;
//     socket.emit("fetch-stream2", payload);
//   }, 5000);

//   socket.on("broad-casting22", async (data) => {
//     const desc = new RTCSessionDescription(data.sdp);
//     peer.setRemoteDescription(desc).catch((e) => console.log(e));
//   });
//   socket.on("fetch-ice2", (data) => {
//     peer.addIceCandidate(data);
//   });
// }

// function handleTrackEvent2(e) {
//   document.getElementById("remote-video2").srcObject = e.streams[0];
// }

// // socket.on('user-joied', (data) => {

// //     setTimeout(() => {

// //         fetch()

// //     }, 4000)
// //     setTimeout(() => {

// //         fetch2()

// //     }, 8000)

// // })

// const nickname = localStorage.getItem("nickname");

// socket.emit("login", nickname);

// socket.on("online-users", (data) => {
//   // console.log(data);

//   let li;
//   const ul = document.getElementById("active-users-list");
//   ul.innerHTML = "";
//   data.map((item) => {
//     //console.log(item);
//     li = document.createElement("li");
//     li.innerHTML = item.data;
//     li.addEventListener("click", () => {
//       if (nickname != "admin") return;
//       let payload = {
//         name: item.data,
//         id: item.id,
//       };
//       socket.emit("choose-user", payload);
//     });
//     ul.appendChild(li);
//   });
// });

// socket.on("choosed-to-call", (data) => {
//   // const accept =  confirm('َدرخواست شما پذیرفته شد شروع به صحبت میکنید؟')
//   // console.log(accept)
//   //   if (accept) {
//   init();
//   //    } else {
//   // alert('شما درخواست را لغو کردید')
//   //    }
// });

// if (nickname == "admin") {
//   logginBtn.disabled = false;
// }

// logginBtn.addEventListener("click", () => {
//   if (nickname == "admin") {
//     init();
//   }
// });

// fetchBtn.addEventListener("click", () => {
//   fetch();
//   fetch2();
// });

// // kill.addEventListener('click', () => {
// //     socket.emit('kill-stream')
// // })

// // if (videoFetch1) {
// //     console.log('videoFetch1')

// document.addEventListener("DOMContentLoaded", (event) => {
//   //? sender stream 1 and 2 flags in app.js(server side) check check if no one doesn't stream video , prevent fetch stream fire
//   //? if delete flags and their condition in server side ... we would have some errors is server side but app works anyway
//   fetch();
//   fetch2();
// });

// // }

// // check3 = new Proxy({}, {
// //     set: function (target, property, value) {
// //         alert('heeey')
// //         // setTimeout(() => {
// //         //     fetch()
// //         // }, 4000)
// //         target[property] = value;
// //     }
// // });

// // socket.emit('disconnect', {
// //     user: user.value
// // })

// // check3.property = 100

// socket.on("broad-casting1", (data) => {
//   videoFetch1 = true;

//   setTimeout(() => {
//     fetch();
//   });
// });
// socket.on("broad-casting2", (data) => {
//   setTimeout(() => {
//     fetch2();
//   });
// });

let peer = null;
let configuration = {
  iceServers: [
    { urls: "stun:stun.stunprotocol.org:3478" },
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: ["turn:13.250.13.83:3478?transport=udp"],
      username: "YzYNCouZM1mhqhmseWk6",
      credential: "YzYNCouZM1mhqhmseWk6",
    },
  ],
};
let WS_PORT = 3000;
let username = document.querySelector("#username");
let connectBtn = document.querySelector("#connect");
let remoteContainer = document.querySelector("#remote_videos");
let userList = document.getElementById("user-list");
connectBtn.addEventListener("click", connect);

let localUUID = null;
let localStream = null;
let connection = null;
let consumers = new Map();
let clients = new Map();

const socket = io("localhost:3000", {
  rejectUnauthorized: false,
});

// const socket = io("localhost:3000");

const nickname = localStorage.getItem("nickname");
username.value = nickname;
window.onload = () => {
  init();
};

async function init() {
  console.log("window loaded");

  socket.on("connect", (e) => {
    console.log("socket connected");
    console.log(socket.id, "socket");
    connectBtn.disabled = false;
    socket.emit("login", { name: nickname, id: socket.id });
  });
  socket.on("disconnect", (e) => {
    console.log("socket desconnected");
    handleClose;
  });
  socket.on("message", (e) => {
    console.log("socket message");
    handleMessage(e);
  });
  let liUser;
  socket.on("userList", (data) => {
    console.log('renew user list');
    userList.innerHTML = "";
    data.map((item) => {
      liUser = document.createElement("li");
      liUser.innerHTML = item.name;
      liUser.addEventListener("click", () => {
        if (nickname != "admin") return;
        let payload = {
          name: item.name,
          id: item.id,
        };
        socket.emit("choose-user", payload);
      });
      userList.appendChild(liUser);
    });

    console.log(data);
  });
}

function recalculateLayout() {
  let container = remoteContainer;
  let videoContainer = document.querySelector(".videos-inner");
  let videoCount = container.querySelectorAll(".videoWrap").length;

  if (videoCount >= 3) {
    videoContainer.style.setProperty("--grow", 0 + "");
  } else {
    videoContainer.style.setProperty("--grow", 1 + "");
  }
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function findUserVideo(username) {
  return document.querySelector(`#remote_${username}`);
}

async function handleRemoteTrack(stream, username) {
  let userVideo = findUserVideo(username);
  if (userVideo) {
    userVideo.srcObject.addTrack(stream.getTracks()[0]);
  } else {
    let video = document.createElement("video");
    video.id = `remote_${username}`;
    video.srcObject = stream;
    video.autoplay = true;
    video.muted = username == username.value;

    let div = document.createElement("div");
    div.id = `user_${username}`;
    div.classList.add("videoWrap");

    let nameContainer = document.createElement("div");
    nameContainer.classList.add("display_name");
    let textNode = document.createTextNode(username);
    nameContainer.appendChild(textNode);
    div.appendChild(nameContainer);
    div.appendChild(video);
    document.querySelector(".videos-inner").appendChild(div);
  }

  recalculateLayout();
}

async function handleIceCandidate({ candidate }) {
  if (candidate && candidate.candidate && candidate.candidate.length > 0) {
    let payload = {
      type: "ice",
      ice: candidate,
      uqid: localUUID,
    };
    socket.emit("message", payload);
  }
}

async function checkPeerConnection(e) {
  var state = peer.iceConnectionState;
  if (state === "failed" || state === "closed" || state === "disconnected") {
  }
}

function handleConsumerIceCandidate(e, id, consumerId) {
  let { candidate } = e;
  if (candidate && candidate.candidate && candidate.candidate.length > 0) {
    let payload = {
      type: "consumer_ice",
      ice: candidate,
      uqid: id,
      consumerId,
    };
    socket.emit("message", payload);
  }
}

function handleConsume({ sdp, id, consumerId }) {
  let desc = new RTCSessionDescription(sdp);
  consumers
    .get(consumerId)
    .setRemoteDescription(desc)
    .catch((e) => console.log(e));
}

async function createConsumeTransport(peer) {
  let consumerId = uuidv4();
  console.log(peer.id, "peer id");
  console.log(consumerId, "peer id");
  let consumerTransport = new RTCPeerConnection(configuration);
  clients.get(peer.id).consumerId = consumerId;
  consumerTransport.id = consumerId;
  consumerTransport.peer = peer;
  consumers.set(consumerId, consumerTransport);
  consumers.get(consumerId).addTransceiver("video", { direction: "recvonly" });
  consumers.get(consumerId).addTransceiver("audio", { direction: "recvonly" });
  let offer = await consumers.get(consumerId).createOffer();
  await consumers.get(consumerId).setLocalDescription(offer);

  consumers.get(consumerId).onicecandidate = (e) =>
    handleConsumerIceCandidate(e, peer.id, consumerId);

  consumers.get(consumerId).ontrack = (e) => {
    handleRemoteTrack(e.streams[0], peer.username);
  };

  return consumerTransport;
}

async function consumeOnce(peer) {
  let transport = await createConsumeTransport(peer);
  let payload = {
    type: "consume",
    id: peer.id,
    consumerId: transport.id,
    sdp: await transport.localDescription,
  };

  socket.emit("message", payload);
}

async function handlePeers({ peers }) {
  if (peers.length > 0) {
    for (let peer in peers) {
      clients.set(peers[peer].id, peers[peer]);
      console.log("are ejra mishe");
      await consumeOnce(peers[peer]);
    }
  }
}

function handleAnswer({ sdp }) {
  let desc = new RTCSessionDescription(sdp);
  peer.setRemoteDescription(desc).catch((e) => console.log(e));
}

async function handleNewProducer({ id, username }) {
  if (id === localUUID) return;

  console.log("consuming", id);
  clients.set(id, { id, username });

  await consumeOnce({ id, username });
}

function handleMessage(data) {
  let message = data;
  //console.log(message);
  switch (message.type) {
    case "welcome":
      localUUID = message.id;
      break;
    case "answer":
      handleAnswer(message);
      break;
    case "peers":
      handlePeers(message);
      break;
    case "consume":
      handleConsume(message);
      break;
    case "newProducer":
      handleNewProducer(message);
      break;
    case "user_left":
      removeUser(message);
      break;
  }
}

function removeUser({ id }) {
  if (clients.get(id)) {
    console.log(clients.get(id));
    let { username, consumerId } = clients.get(id);
    consumers.delete(consumerId);
    clients.delete(id);
    document
      .querySelector(`#remote_${username}`)
      .srcObject.getTracks()
      .forEach((track) => track.stop());
    document.querySelector(`#user_${username}`).remove();

    recalculateLayout();
  }
}
socket.on("choosed-to-call", async (data) => {
  // alert('heyyyy')
  let constraint = {
    audio: true,
    video: {
      mandatory: {
        width: { min: 320 },
        height: { min: 180 },
      },
      optional: [
        { width: { max: 1280 } },
        { frameRate: 30 },
        { facingMode: "user" },
      ],
    },
  };
  let stream = await navigator.mediaDevices.getUserMedia(constraint);
  handleRemoteTrack(stream, username.value);
  localStream = stream;

  peer = createPeer();
  localStream.getTracks().forEach((track) => peer.addTrack(track, localStream));
  //  await subscribe();
});

async function connect() {
  //Produce media
  if (username.value == "admin" || username.value == "admin2") {
    let constraint = {
      audio: true,
      video: {
        mandatory: {
          width: { min: 320 },
          height: { min: 180 },
        },
        optional: [
          { width: { max: 1280 } },
          { frameRate: 30 },
          { facingMode: "user" },
        ],
      },
    };
    let stream = await navigator.mediaDevices.getUserMedia(constraint);
    handleRemoteTrack(stream, username.value);
    localStream = stream;

    peer = createPeer();
    localStream
      .getTracks()
      .forEach((track) => peer.addTrack(track, localStream));
    await subscribe();
  } else {
    //createPeer();
    await subscribe();
  }
}

function handleClose() {
  connection = null;
  localStream.getTracks().forEach((track) => track.stop());
  clients = null;
  consumers = null;
}

function createPeer() {
  peer = new RTCPeerConnection(configuration);
  console.log(peer);
  peer.onicecandidate = handleIceCandidate;

  peer.onnegotiationneeded = () => handleNegotiation(peer);
  return peer;
}

async function handleNegotiation(peer, type) {
  console.log("*** negoitating ***");
  let offer = await peer.createOffer();
  await peer.setLocalDescription(offer);

  socket.emit("message", {
    type: "connect",
    sdp: peer.localDescription,
    uqid: localUUID,
    username: username.value,
  });
}

async function subscribe() {
  // Consume media
  await consumeAll();
}

async function consumeAll() {

  let payload = {
    type: "getPeers",
    uqid: localUUID,
  };

  socket.emit("message", payload);
}
