// 进入房间开始连接
const rooms = document.querySelectorAll('.gymList li');
const planBox = document.querySelector('.planBox');
const gymBox = document.querySelector('.gymBox');
const gymView = document.querySelector('.gymView ');
const gymTheme = document.querySelector('#gymTheme');//房间主题
let themeArr = ["燃脂减肥房","体态训练房","塑形训练房","主题不限房"];
let roomid = [1,2,3,4];
rooms.forEach((element,i) =>{
    element.setAttribute('data-theme',themeArr[i]);
    element.setAttribute('data-roomId',roomid[i]);
    element.addEventListener('click',function(){
        // 隐藏底层
        planBox.classList.add('hidden');
        gymBox.classList.add('hidden');
        // 显示房间界面
        setTimeout(function(){
            gymView.classList.remove('hidden');
        },300);
        gymTheme.innerHTML = element.getAttribute('data-theme');

        // 从这里开始通信
        // 连接websocket
        if(sessionStorage.getItem('id')){
            let roomid = element.getAttribute('data-roomId');
            let uid = sessionStorage.getItem('id');
            let password = sessionStorage.getItem('password');
            enterRoom(roomid,uid,password);
        }

    })
});

function enterRoom(roomId,uId,password){
    linkUrl(roomId,uId,password,null,false);
    RTCengine.createWebsocket();
    // 初始化本地码流
    initLocalStream();
}

function initLocalStream() {
    // 获取媒体流
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    })
    .then(openLocalStream)
    .catch(function (e) {
        alert("getUserMedia() error: " + e.name);
    });
}


// 添加远程的媒体流
var videos = document.querySelector('.gymRoomList')
function handleRemoteStreamAdd(event,remote) {//需要传入远程id
    remoteStream = event.streams[0];
    var video = document.createElement('video');
        video.id = remote;//绑定用户对应的video标签
        // video.id = 需要标识id
    document.getElementById(remote).srcObject = event.streams[0];
    // video.srcObject = event.streams[0];
    video.autoplay = true
    videos.appendChild(document.getElementById(remote));
    console.log('添加video完成');
}

// 挂断
const leave = document.querySelector('.leave');
leave.addEventListener('click',function(){
    // 关闭RTCConnection
    hangup();
    // 关闭界面
    setTimeout(function(){
        gymView.classList.add('hidden');
        planBox.classList.remove('hidden');
        gymBox.classList.remove('hidden');
    },300)
})


function hangup() {
    let allAudio = document.querySelectorAll('audio');
    // 关闭远程媒体流
    allAudio.forEach(element =>{
        element.srcObject = null;
    })
    closeLocalStream(); // 2. 关闭本地流
    if(pc != null) {
        pc.close(); // 3.关闭RTCPeerConnection
        pc = null;
    }
}
// 关闭自己的本地流
function closeLocalStream() {
    if(localStream != null) {
        localStream.getTracks().forEach((track) => {
                track.stop();
        });
    }
}