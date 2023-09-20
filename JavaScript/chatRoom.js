const setRoomBtn = document.getElementById('setRoom');
const setroom = document.querySelector('.setroom');
const finished = document.getElementById('finished');
// 房间列表
const roomList = document.querySelector('.roomList');

setRoomBtn.addEventListener('click',function(){
    setroom.classList.toggle('hidden');
})

const btn = document.querySelectorAll('.btn');
// 向左

let roomContainer = document.querySelector('.roomContainer');
function moveRoom (trs){
    let step = document.querySelector('.chat').offsetWidth;
    let currValue = roomContainer.offsetLeft;
    let newValue = currValue+(trs*step)
    // 缺少右侧尽头判断
        roomContainer.style.left = 0;
        roomContainer.style.left = newValue+"px";
}
// 点击切换
btn[0].addEventListener('click',() =>{
    if( roomContainer.offsetLeft == 0){
        btn[0].onclick=null;
    }else{
        moveRoom(1);
    }
});
btn[1].addEventListener('click',() =>{
    moveRoom(-1);
});
// // 向后端传新建房间信息并连接聊天房
// function setRoom(){
//     // 获取房间信息
//     let theme = document.querySelector('#themeInput').value;
//     let roomid = document.querySelector('#roomIdInput').value; 

//     // 添加房间
//     let div = document.createElement('div');
//     div.innerHTML = "<div class='id'><span>房间编号：</span><span class='roomId'>"+roomid+"</span></div>"+
//                     "<div class='theme'><span>房间主题：</span><i class='icon'></i><h2 class='roomTheme'>“" +theme+" ”</h2></div>"+
//                     "<div class='info'>"+
//                         "<div class='inline'><span class='inline'>"+inlineCount+"</span><span>人在线</span></div>"+
//                         "<div class='enter'></div>"+
//                     "</div>";
//     div.classList.add('room');
//     div.setAttribute('id',roomid);//绑定房间id
//     div.setAttribute('theme',theme)

//     // 插入至最前
//     let first_room=document.querySelector('.roomList:nth-child(1) .room');//得到页面的第一个元素。 
//     roomList.insertBefore(div,first_room);//在得到的第一个元素之前插入。
//     setroom.classList.add('hidden');

//     // 更新数组 //这个可能不用
//     rooms = document.querySelectorAll('.room');
//     enterRooms = document.querySelectorAll('.enter');//进入按钮
// }



// 进入房间
var rooms = document.querySelectorAll('.room');
var enterRooms = document.querySelectorAll('.enter');//进入按钮
const chatView = document.querySelector('.chatView');//聊天界面
// 使用事件委托来实现元素的点击
// 进入存在的房间
roomList.onclick = function (e){
    let rooms = document.querySelectorAll('.roomList .room');
    //判断是否为enter
    let className = e.target.className;
    if (className.indexOf("enter") > -1){
        // 连接websocket
        setTimeout(function(){
            chatView.classList.remove('hidden');
        },200);
        console.log(e.target.index);
        let roomid =rooms[e.target.index].getAttribute("roomId");
        let theme = rooms[e.target.index].getAttribute("theme");
        enterRoom(roomid,theme);
            // 用户登录状态
            if(sessionStorage.getItem('id')){
                let uid = sessionStorage.getItem('id');
                let password = sessionStorage.getItem('password');
                linkUrl(roomid,uid,password,theme,2);
                // 这个地方得点击开启
                RTCengine.createWebsocket();
                // 初始化本地码流
                initLocalStream(true,false);
            }else{
                return;
            }
    
            // 渲染聊天记录

    }
}

// 退出房间
const leave = document.querySelector('.return');
leave.addEventListener('click',function(){
    // 关闭界面
    chatView.classList.add('hidden');
    // 关闭RTCConnection
    hangup();
    setroom.classList.add('hidden');
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


// 随机获取可用房间号
const randomBtn = document.querySelector('.randomBtn');
randomBtn.addEventListener('click',() => {
    ajax({
        url: 'http://localhost:8080/team_project/room/getAvailable',
        type: 'GET',
        async: true,
        data: {},
        success: function(resp) {
            roomid = document.querySelector('#roomIdInput').value=resp.data.roomNum
        },
        error: function(error) {
            console.log(error);
        }
    })
});

// 创建房间
var inlineCount;//在线人数
// 房主连接websocket
finished.addEventListener('click',() => {
    // 显示聊天页面
    setTimeout(() => {
        chatView.classList.remove('hidden');
    }, 300);

    // 获取输入的房间信息
    let theme = document.querySelector('#themeInput').value;
    let roomid = document.querySelector('#roomIdInput').value;
    let uid = sessionStorage.getItem('id');
    let password = sessionStorage.getItem('password');
    
    //    若不输入id则创建失败
    if (roomid == "") {
        alert("请输入房间ID");
        return;
    }
    enterRoom(roomid,theme);
    linkUrl(roomid,uid,password,theme,true);//2为房间类型
    // linkUrl(roomid,1547842,"7110eda4d09e062aa5e4a390b0a572ac0d2c0220",theme,2);//2为房间类型
    
    // 这个地方得点击开启
    RTCengine.createWebsocket();
    // 初始化本地码流
    initLocalStream();

})

// 只开麦
function initLocalStream() {
    // 获取媒体流
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    })
    .then(openLocalStream)
    .catch(function (e) {
        alert("getUserMedia() error: " + e.name);
    });
}

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



// 进房
function enterRoom(roomId,roomTheme){
    // 渲染聊天界面的信息
    document.querySelector('#rID').innerHTML = roomId;
    document.querySelector('#chatTheme').innerHTML = roomTheme;
}
function chatRecode (msg){
        // 本地用户的聊天信息
        const view = document.querySelector('.view');
        let div = document.createElement('div');
        // 判断为发送者是当前用户
        // 发送的消息会及时的渲染出来
        if(msg.system){//系统消息
            div.innerHTML = "<p>"+msg.body+"</p>"
            div.classList.add('system')
        }else{
            if(msg.sender.id==localUserId){//本地用户信息
                div.innerHTML = "<div class='text'><p>"+msg.body+"</p></div>"+
                "<div class='photo'><img src="+msg.sender.iconUrl+"></div>";
                div.classList.add('currU');
            }else{// 远程用户的信息
                div.innerHTML = " <div class='photo'><img src="+msg.sender.iconUrl+"></div>"+
                "<div class='text'><p id='Uid'>"+msg.sender.id+"</p><p>"+msg.body+"</p></div>";
                div.classList.add('remoteU')
            }
        }
        view.appendChild(div);
}



// 建房的人也要在退出的时候渲染房间页面

// 渲染当前存在的房间
function currRoom (){
    ajax({
        url: 'http://localhost:8080/team_project/room/chatRoom',
        type: 'GET',
        async: true,
        data: {},
        success: function(resp) {
            console.log(resp);
            const roomList = document.querySelector('.roomList')
            resp.forEach((Element,index) => {
                    let div = document.createElement('div');
                        div.innerHTML = "<div class='id'><span>房间编号：</span><span class='roomId'>"+Element.room.roomNum+"</span></div>"+
                                        "<div class='theme'><span>房间主题：</span><i class='icon'></i><h2 class='roomTheme'>“" +Element.room.desc+" ”</h2></div>"+
                                        "<div class='info'>"+
                                            "<div class='inline'><span class='inline'>"+Element.onlineCount+"</span><span>人在线</span></div>"+
                                            "<div class='enter'></div>"+
                                        "</div>";
                        div.classList.add('room');
                        div.setAttribute('roomId',Element.room.roomNum);//绑定房间id
                        div.setAttribute('theme',Element.room.desc);
                        roomList.append(div);
                        // 绑定序号
                        div.querySelector('.enter').index = index;
            });

        },
        error: function(error) {
            console.log(error);
        }
    })
}
currRoom();