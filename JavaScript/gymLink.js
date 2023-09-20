'use strict';

// join 主动加入房间
// leave 主动离开房间
// new-peer 有人加入房间，通知已经在房间的人
// peer-leave 有人离开房间，通知已经在房间的人
// offer 发送offer给对端peer
// answer发送offer给对端peer
// candidate 发送candidate给对端peer
const SIGNAL_TYPE_JOIN = "join";
const SIGNAL_TYPE_RESP_JOIN = "resp-join";  // 告知加入者对方是谁
const SIGNAL_TYPE_LEAVE = "leave";
const SIGNAL_TYPE_NEW_PEER = "new-peer";
const SIGNAL_TYPE_PEER_LEAVE = "peer-leave";
const SIGNAL_TYPE_OFFER = "offer";
const SIGNAL_TYPE_ANSWER = "answer";
const SIGNAL_TYPE_CANDIDATE = "candidate";


var localUserId; // 本地uid
var roomId = 0;
// 新人的answer发送
var remoteIdList =[];

// 对新人的offer发送
var newpeerId;
var localVideo = document.querySelector('#localVideo');
var localStream = null;
var remoteStream = null;
var pc = null;
var RTCengine;

var connections = [];//存放连接对象

var id;//candidate发送对象

// 第二次发送offer的对象 
var offerIndex = 0;






// 新人进入房间
function doJoin(roomId) {
    var jsonMsg = {
        'cmd': 'join',
        'roomId': roomId,
        'uid': localUserId,
    };
    var message = JSON.stringify(jsonMsg);
    RTCengine.sendMessage(message);
    console.info("doJoin message: " + message);
}

// 新人收到房间内的消息
function handleResponseJoin(message) {
    // 房间内用户id
    remoteIdList = message.remoteUid;
    console.log(remoteIdList);
    // 都房间内的人发送offer
    if(remoteIdList){
        pc = new RTCPeerConnection(); 
        
        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream)); // 把本地流设置给RTCPeerConnection


        sendOffer(remoteIdList[offerIndex]);
        offerIndex++;
    }   
}

function sendOffer(remoteUid){

    console.log('sendoffer');
    // 控制candidate的发送对象
    id = remoteUid;
    console.log(id);
    // 有可能是因为异步原因导致id错乱
    pc.onicecandidate = handleIceCandidate;
    pc.onconnectionstatechange = handleConnectionStateChange;
    pc.oniceconnectionstatechange = handleIceConnectionStateChange;
    // 发送offer
    // 发送第一个offer
    pc.createOffer()
    .then(function(session){//createOfferAndSendMessage方法
        console.log(session);
        pc.setLocalDescription(session)//setLocalDescription ()  这个地方可能重复set
        .then(function(){
            // console.log(remoteId);
            var jsonMsg = {
                'cmd': 'offer',
                'roomId': roomId,
                'uid': localUserId,
                'remoteUid': remoteUid,//发送对象为第一人
                'msg': JSON.stringify(session)
            };
            
            var message = JSON.stringify(jsonMsg);
            RTCengine.sendMessage(message);
                })
            }).catch(handleCreateOfferError);

}

function handleCreateOfferError(error) {
    console.error("handleCreateOfferError: " + error);
}


// 新人回应answer
//新人操作
function handleRemoteAnswer(message) {

    console.log(message);
    var desc = JSON.parse(message.msg);
    console.log(desc);
    pc.setRemoteDescription(desc);
    pc.ontrack = handleRemoteStreamAdd;

    // 第二人发offer
    // console.log();
    // 不能在这个地方发送offer
    // sendOffer(1547842);
    console.log(remoteIdList.length+"handleRemoteAnswer的数组长度");
    console.log(offerIndex);
    if(offerIndex<remoteIdList.length){

        sendOffer(remoteIdList[offerIndex]);
        offerIndex++;
    }



}


// 远程视频流
var videos = document.querySelector('#videos')
function handleRemoteStreamAdd(event) {
    remoteStream = event.streams[0];
    var video = document.createElement('audio');
    // video.id = 需要标识id
    video.srcObject = event.streams[0];
    video.autoplay = true
    videos.appendChild(video);
    console.log('添加video完成');
}

function handleIceCandidate(event) {
    console.info("handleIceCandidate");
    console.log(event);
    if (event.candidate) {
        var candidateJson = {
            'label': event.candidate.sdpMLineIndex,
            'id': event.candidate.sdpMid,
            'candidate': event.candidate.candidate
        };
        var jsonMsg = {
            'cmd': SIGNAL_TYPE_CANDIDATE,
            'roomId': roomId,
            'uid': localUserId,
            'remoteUid':id,
            'msg': JSON.stringify(candidateJson) 
        };
        var message = JSON.stringify(jsonMsg);
        console.log(id);
        console.log(message);
        RTCengine.sendMessage(message);
    } else {
        console.warn("End of candidates");
    }
}

// 监听连接状态
function handleConnectionStateChange() {
    if(pc != null) {
        console.info("ConnectionState -> " + pc.connectionState);
    }
}

function handleIceConnectionStateChange() {
    if(pc != null) {
        console.info("IceConnectionState -> " + pc.iceConnectionState);
    }
}

function handleRemoteCandidate(message) {
    console.log('handleRemoteCandidate');
    var jsonMsg = JSON.parse(message.msg);
    var candidateMsg = {
        'sdpMLineIndex': jsonMsg.label,
        'sdpMid': jsonMsg.id,
        'candidate': jsonMsg.candidate
    };
    var candidate = new RTCIceCandidate(candidateMsg);
    console.log(candidate);
    pc.addIceCandidate(candidate).catch(e => {
        console.error("addIceCandidate failed:" + e.name);
    });






}

// 远程端

// 服务器返回新人信息
function handleRemoteNewPeer(message) {
    console.info("handleRemoteNewPeer, remoteUid: " + message.remoteUid);
    // 新人id
    newpeerId = message.remoteUid;
    console.log(newpeerId);
}

// 房间内的人回应offer
function handleRemoteOffer(message) {
    pc = new RTCPeerConnection(); 
    id = newpeerId
    // pc.onicecandidate = handleIceCandidate;
    pc.ontrack = handleRemoteStreamAdd;
    pc.onicecandidate = handleIceCandidate;
    pc.onconnectionstatechange = handleConnectionStateChange;
    pc.oniceconnectionstatechange = handleIceConnectionStateChange;
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream)); // 把本地流设置给RTCPeerConnection    // 收到对方的spd
    // 设置远程sdp
    var desc = JSON.parse(message.msg);
    console.log(desc);
    pc.setRemoteDescription(desc);

    // 发送answer
    // 对新人发送answer
    pc.createAnswer()
    .then(function(session){
        pc.setLocalDescription(session)
        .then(function(){
            console.log(session);
                console.log(newpeerId);
                var jsonMsg = {
                    'cmd': 'answer',
                    'roomId': roomId,
                    'uid': localUserId,
                    'remoteUid': newpeerId,
                    'msg': JSON.stringify(session)
                };
                var message = JSON.stringify(jsonMsg);
                console.log(message);
    
                RTCengine.sendMessage(message);
            })
            .catch(function (error) {
                console.error("answer setLocalDescription failed: " + error);
            });
    });
    // 
}


function openLocalStream(stream) {
    doJoin(roomId);
    // var localVideo = document.getElementById('localVideo');
    console.log(localVideo);
    localVideo.srcObject = stream;      // 显示画面
    console.log(localVideo.srcObject);
    localStream = stream;   // 保存本地流的句柄
}

// 开麦开视频
// function openLocalStream(stream) {
//     doJoin(roomId);
//     // var localVideo = document.getElementById('localVideo');
//     console.log(localVideo);
//     localVideo.srcObject = stream;      // 显示画面
//     console.log(localVideo.srcObject);
//     localStream = stream;   // 保存本地流的句柄
// }

// function initLocalStream(audio,video) {
//     // 获取媒体流
//     navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: false
//     })
//     .then(openLocalStream)
//     .catch(function (e) {
//         alert("getUserMedia() error: " + e.name);
//     });
// }


// websocket信息
var RTCEngine = function (wsUrl) {
    this.init(wsUrl);
    RTCengine = this;
    console.log(this);
    return this;
}
// 初始化传地址
RTCEngine.prototype.init = function (wsUrl) {
    // 设置websocket  url
    this.wsUrl = wsUrl;
    /** websocket对象 */
    this.signaling = null;
}

// 这里进行后端交互
RTCEngine.prototype.createWebsocket = function () {
    RTCengine = this;
    RTCengine.signaling = new WebSocket(this.wsUrl);

    RTCengine.signaling.onopen = function () {
        RTCengine.onOpen();
    }

    RTCengine.signaling.onmessage = function (ev) {
        RTCengine.onMessage(ev);
        // 这个地方渲染聊天记录？
        console.log(ev);
        // console.log(JSON.parse(ev.data));
        let msg = JSON.parse(ev.data);
        console.log(msg);
        // console.log(msg.sender);
        // 发送按钮需要绑定发送消息事件
        // chatRecode(msg.system,msg.sender.id,msg.body,msg.iconUrl)
        // chatRecode(msg);
        
    }

    RTCengine.signaling.onerror = function (ev) {
        RTCengine.onError(ev);
    }

    RTCengine.signaling.onclose = function (ev) {
        RTCengine.onClose(ev);
    }
}

// open
RTCEngine.prototype.onOpen = function () {
    console.log(" 语音通话websocket open");
}
RTCEngine.prototype.onMessage = function (event) {

    var jsonMsg = null;
    try {
         jsonMsg = JSON.parse(event.data);

    } catch(e) {
        console.warn("onMessage parse Json failed:" + e);
        return;
    }
    switch (jsonMsg.cmd) {
        case SIGNAL_TYPE_NEW_PEER:
            handleRemoteNewPeer(jsonMsg);
            break;
        case SIGNAL_TYPE_RESP_JOIN:
            handleResponseJoin(jsonMsg);
            break;
        case SIGNAL_TYPE_OFFER:
            handleRemoteOffer(jsonMsg);
            break;
        case SIGNAL_TYPE_ANSWER:
            handleRemoteAnswer(jsonMsg);
            break;
        case SIGNAL_TYPE_CANDIDATE:
            handleRemoteCandidate(jsonMsg);
            break;
    }
}

RTCEngine.prototype.onError = function (event) {
    console.log("onError: " + event.data);
}

RTCEngine.prototype.onClose = function (event) {
    console.log("onClose -> code: " + event.code + ", reason:" + EventTarget.reason);
}
// 向服务器发送信息
RTCEngine.prototype.sendMessage = function (message) {
    const dendIpt = document.querySelector('#sendIpt');//发送消息input框
    const SendBtn = document.querySelector('#send');//发送按钮
    // 发送消息
    var obj = this.signaling;
    console.log(message);
    // SendBtn.addEventListener('click',function(){
    //     console.log('click');
    //     var chatMsg = dendIpt.value;
    //     obj.send(chatMsg);
    //         // 清空input框
    //     dendIpt.value='';
    // });

}


function linkUrl(roomId,uId,password,theme,type){
    if(type){
        // 聊天房
        RTCengine = new RTCEngine("ws://localhost:8080/team_project/chat/"+roomId+"/"+uId+"/"+password+"?desc="+theme+"&type=2");
    }else{
        // 健身房
        RTCengine = new RTCEngine("ws://localhost:8080/team_project/sportRoom/"+roomId+"/"+uId+"/"+password);
    }
    localUserId = uId;
}
