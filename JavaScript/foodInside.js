// 切换
const tabLi = document.querySelectorAll('.tab li');
const content = document.querySelectorAll('.content');
tabLi.forEach((element, index) => {
    element.index = index;
    element.addEventListener('click', function() {
        for (let i = 0; i < tabLi.length; i++) {
            tabLi[i].classList.remove('curr');
            content[i].classList.remove('active');
        }
        element.classList.add('curr');
        content[element.index].classList.add('active')
    })
})

// 榜单描述信息
const desc = [{
    type: '食物的热量：',
    content: '即食物所能提供的能量，就是“卡”，亦称卡路里。测量一份食物所提供的卡路里数，就是把这份食物放在容百器里燃烧，然后测量产生的热量。而热量近似就是人体能利用的热能，提高人体运动新陈代谢生长发育的能源。',
    suitable: '减肥人士、体重管理人士、肥胖症患者等'
}, {
    type: '食物蛋白质：',
    content: '是生命活动的主要承担者，它是与生命及与各种形式的生命活动紧密联系在一起的物质，是人体必需的营养物质。高蛋白食物会增加饱腹感，促进身体新陈代谢，提高热量消耗率，同时蛋白质为肌肉生长必需成分，摄取充足的蛋白质有助增肌。',
    suitable: '增肌人士、免疫力低下的人、骨质疏松患者等'
}, {
    type: '食物纤维素：',
    content: '是食物中不被人体胃肠消化酶所分解的、不可消化成分的总和，是人类健康减肥、降脂的天然食品。高纤维食物是指富含膳食纤维的食物，可缓解便秘，促进益生菌生长、增加饱腹感和体重调节。',
    suitable: '便秘人群、糖尿病人群、高血压人群等'

}, {
    type: '食物钙含量：',
    content: '：钙是构成人体骨骼和牙齿的主要成分，在维持人体循环、呼吸、神经、内分泌、消化、血液、肌肉、骨骼、泌尿、免疫等各系统正常生理功能中起重要调节作用。. 人体没有任何系统的功能与钙无关，钙代谢平衡对于维持生命和健康起到至关重要的作用。',
    suitable: '青少年、骨质疏松患者、孕妇、中老年等'
}];
const Desc = document.querySelector('#desc');
const tips = document.querySelector('#suitable');
//选择显示的排行榜
const rankBtn = document.querySelectorAll('.rankList li');
const rank = document.querySelectorAll('.rankUl .list>ul>div');
//当前类的id
let idArr = [sessionStorage.getItem('List1'), sessionStorage.getItem('List2'), sessionStorage.getItem('List3')];


window.addEventListener('load', function() {
    // this.setTimeout(function(){
    //     idArr.forEach((element,index) =>{
    //         getProtein(element,rank[index]);
    //     })
    // },300)
    let type = this.sessionStorage.getItem('type');
    rankBtn[type].click();
    tabLi[1].click();
});
for (let j = 0; j < rankBtn.length; j++) {
    rankBtn[j].index = j;
    rankBtn[j].addEventListener('click', function() {
        for (let i = 0; i < rankBtn.length; i++) {
            rankBtn[i].classList.remove('active')
        }
        this.classList.add('active');
        Desc.querySelector('#title').innerHTML = desc[this.index].type;
        Desc.querySelector('span').innerHTML = desc[this.index].content;
        tips.innerHTML = desc[this.index].suitable;

        // 改变分类id
        console.log(rankBtn[this.index].dataset.list1);
        console.log(rankBtn[this.index].dataset.list2);
        console.log(rankBtn[this.index].dataset.list3);
        sessionStorage.setItem('List1', rankBtn[this.index].dataset.list1);
        sessionStorage.setItem('List2', rankBtn[this.index].dataset.list2);
        sessionStorage.setItem('List3', rankBtn[this.index].dataset.list3);
        // 重新渲染榜单
        idArr.forEach((element, index) => {
            getProtein(element, rank[index]);
        })
    })
}
// 榜单按钮
rankBtn[0].addEventListener('click', () => {

    setTimeout(function() {
        idArr.forEach((element, index) => {
            rank[index].innerHTML = '';
            getREnergy(element, rank[index]);
        })
    }, 400)
})
rankBtn[1].addEventListener('click', () => {
    setTimeout(function() {
        idArr.forEach((element, index) => {
            rank[index].innerHTML = '';
            getProtein(element, rank[index]);
        })
    }, 400)
});
rankBtn[2].addEventListener('click', () => {
    setTimeout(function() {
        idArr.forEach((element, index) => {
            rank[index].innerHTML = '';
            getDietaryFiber(element, rank[index]);
        })
    }, 400)
})
rankBtn[3].addEventListener('click', () => {
    setTimeout(function() {
        idArr.forEach((element, index) => {
            rank[index].innerHTML = '';
            getCa(element, rank[index]);
        })
    }, 400)
})

// 渲染四个排行榜
// 获取蛋白质
function getProtein(id, targer) {
    ajax({
        url: 'http://localhost:8080/team_project/food/orderedFoods',
        type: 'GET',
        async: true,
        data: {
            "groupId": id,
            "protein": true,
            "reverse": true
        },
        success: function(resp) {
            resp.data.foods.forEach((element, index) => {
                let li = document.createElement('li');
                li.innerHTML = "<div class='image'><img class='icon' src=" + "../Images/排行榜/" + index + ".png" + "></img><img src=" + element.iconUrl + "></div>" +
                    "<div class='data'>" +
                    "<p class='name'>" + element.foodName + "</p>" +
                    "<span class='type'>蛋白质：<span class='data'>" + element.protein + "克</span></span><span>/100克</span>" +
                    "</div>";
                targer.appendChild(li);
            })
        },
        error: function(error) {
            console.log(error);
        }
    })
}
// 获取热量
function getREnergy(id, targer) {
    ajax({
        url: 'http://localhost:8080/team_project/food/orderedFoods',
        type: 'GET',
        async: true,
        data: {
            "groupId": id,
            "energy": true,
        },
        success: function(resp) {
            resp.data.foods.forEach((element, index) => {
                let li = document.createElement('li');
                li.innerHTML = "<div class='image'><img class='icon' src=" + "../Images/排行榜/" + index + ".png" + "></img><img src=" + element.iconUrl + "></div>" +
                    "<div class='data'>" +
                    "<p class='name'>" + element.foodName + "</p>" +
                    "<span class='type'>能量：<span class='data'>" + element.energy + "千卡</span></span><span>/100克</span>" +
                    "</div>";
                targer.appendChild(li);
            })
        },
        error: function(error) {
            console.log(error);
        }
    })
}
// 获取纤维
function getDietaryFiber(id, targer) {
    ajax({
        url: 'http://localhost:8080/team_project/food/orderedFoods',
        type: 'GET',
        async: true,
        data: {
            "groupId": id,
            "dietaryFiber": true,
            "reverse": true
        },
        success: function(resp) {
            resp.data.foods.forEach((element, index) => {
                let li = document.createElement('li');
                li.innerHTML = "<div class='image'><img class='icon' src=" + "../Images/排行榜/" + index + ".png" + "></img><img src=" + element.iconUrl + "></div>" +
                    "<div class='data'>" +
                    "<p class='name'>" + element.foodName + "</p>" +
                    "<span class='type'>纤维：<span class='data'>" + element.dietaryFiber + "克</span></span><span>/100克</span>" +
                    "</div>";
                targer.appendChild(li);
            })
        },
        error: function(error) {
            console.log(error);
        }
    })
}
// 获取钙
function getCa(id, targer) {
    ajax({
        url: 'http://localhost:8080/team_project/food/orderedFoods',
        type: 'GET',
        async: true,
        data: {
            "groupId": id,
            "ca": true,
            "reverse": true
        },
        success: function(resp) {
            resp.data.foods.forEach((element, index) => {
                let li = document.createElement('li');
                li.innerHTML = "<div class='image'><img class='icon' src=" + "../Images/排行榜/" + index + ".png" + "></img><img src=" + element.iconUrl + "></div>" +
                    "<div class='data'>" +
                    "<p class='name'>" + element.foodName + "</p>" +
                    "<span class='type'>钙：<span class='data'>" + element.ca + "克</span></span><span>/100克</span>" +
                    "</div>";
                targer.appendChild(li);
            })
        },
        error: function(error) {
            console.log(error);
        }
    })
}


// 饮食百科书 start

//进入到饮食百科书内部
const groupList = document.querySelector('.groupList');
//获取饮食百科书视频
const videoArea = document.querySelector('.videoArea'); //视频区域
const closeVideo = document.querySelector('.closeVideo'); //关闭按钮
const videos = videoArea.querySelector('.videos'); //视频集
const scaleVideo = videoArea.querySelector('.scaleVideo'); //视频展示区
const summaryContent = document.querySelector('.summaryContent');

//获取首页传来的gid和videoUrl数据

let lastGid = window.location.search.substring(1, 2);
let lastVideoUrl = window.location.search.substring(2);

//渲染所有饮食分组
ajax({
    url: "http://localhost:8080/team_project/food/videoGroup", // url---->地址
    type: "GET", // type ---> 请求方式
    async: true, // async----> 同步：false，异步：true 
    data: {}, //传入信息
    success: function(result) { //返回接受信息
        for (let i = 0; i < result.data.groups.length; i++) {
            let li = document.createElement('li');
            li.innerHTML = result.data.groups[i].groupName;
            groupList.appendChild(li);
        }

        //点击groupList选项表选择饮食类
        for (let i = 0; i < groupList.children.length; i++) {
            groupList.children[i].addEventListener('click', () => {
                for (let j = 0; j < groupList.children.length; j++) {
                    groupList.children[j].className = '';
                }
                groupList.children[i].className = 'current';
                let gid = result.data.groups[i].gid;

                //渲染专题概要内容
                getSummary(gid, summaryContent);

                //调用渲染页面视频函数
                getVideos(gid, videos);
                //点击选择类别时,隐藏视频
                videos.style.visibility = 'visible';
                videos.style.opacity = 1;
                scaleVideo.style.visibility = 'hidden';
                scaleVideo.style.opacity = 0;

            })
        }

        //进入饮食百科书,先显示默认第一个类
        if (lastGid == '') {
            groupList.children[0].click();
        } else {
            groupList.children[lastGid].click();
            //渲染上一个页面点击的视频所属专题概括
            getSummary(lastGid, summaryContent);
            getVideos(lastGid, videos);
            videos.style.visibility = 'hidden';
            videos.style.opacity = 0;
            scaleVideo.style.visibility = 'visible';
            scaleVideo.style.opacity = 1;
        }

    },
    error: function(error) {
        console.log(error);
    }
});



//封装获取专题摘要函数
function getSummary(gid, summaryContent) {
    ajax({
        url: "http://localhost:8080/team_project/food/getVideoGroup", // url---->地址
        type: "GET", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "gid": gid
        }, //传入信息
        success: function(result) { //返回接受信息
            //渲染填入专题概要的内容
            summaryContent.innerHTML = result.data.group.desc;
        },
        error: function(error) {
            console.log(error);
        }
    });
}

//封装获取视频合集函数
function getVideos(gid, videos) {
    let size = 8;
    //调用获取视频接口
    ajax({
        url: "http://localhost:8080/team_project/food/groupRandomVideo", // url---->地址
        type: "GET", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "size": size,
            "gid": gid
        }, //传入信息
        success: function(result) { //返回接受信息
            videos.innerHTML = ''; //清空上一次的内容
            for (let i = 0; i < result.data.videos.length; i++) {
                let str = '';
                str += '<li>';
                str += '    <img src="' + result.data.videos[i].imgUrl + '">';
                str += '    <div class="videoTitle">' + result.data.videos[i].title + '</div>';
                str += '    <div class="action"></div>';
                str += '</li>';
                videos.innerHTML += str;
            }

            //点击进入视频展示区
            for (let i = 0; i < videos.children.length; i++) {
                videos.children[i].addEventListener('click', () => {
                    videos.style.visibility = 'hidden';
                    videos.style.opacity = 0;
                    scaleVideo.style.visibility = 'visible';
                    scaleVideo.style.opacity = 1;
                    let videoUrl = result.data.videos[i].videoUrl;
                    showVideo(gid, videoUrl, scaleVideo);

                });
            }

            //若首页传了视频的链接,则打开视频展示区
            if (lastVideoUrl) {
                showVideo(lastGid, lastVideoUrl, scaleVideo);
                scaleVideo.children[0].children[0].pause();
            }

            //关闭视频展示区
            closeVideo.addEventListener('click', () => {
                videos.style.visibility = 'visible';
                videos.style.opacity = 1;
                scaleVideo.style.visibility = 'hidden';
                scaleVideo.style.opacity = 0;
                //关闭视频，暂停播放，清楚视频
                scaleVideo.children[0].children[0].src = '';
                scaleVideo.children[0].children[0].pause();
            });
        },
        error: function(error) {
            console.log(error);
        }
    });
}

//封装展示视频函数
function showVideo(gid, videoUrl, scaleVideo) {
    //渲染播放视频
    let str = '<video src="' + videoUrl + '" controls autoplay loop"></video>';
    scaleVideo.children[0].innerHTML = str;

    //渲染右侧视频列表
    const videoList = scaleVideo.querySelector('.videoList');
    ajax({
        url: "http://localhost:8080/team_project/food/groupRandomVideo", // url---->地址
        type: "GET", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "size": 8,
            "gid": gid
        }, //传入信息
        success: function(result) { //返回接受信息
            videoList.innerHTML = ''; //清空上一次的内容
            for (let i = 0; i < result.data.videos.length; i++) {
                let str = '';
                str += '<li>';
                str += '    <div class="img"><img src="' + result.data.videos[i].imgUrl + '"><div class="action"></div></div>';
                str += '    <div class="videoTitle">' + result.data.videos[i].title + '</div>';
                str += '</li>';
                videoList.innerHTML += str;
            }
            //点击右侧列表选择视频
            for (let i = 0; i < videoList.children.length; i++) {
                videoList.children[i].addEventListener('click', () => {
                    let videoUrl = result.data.videos[i].videoUrl;
                    //渲染播放视频
                    let str = '<video src="' + videoUrl + '" controls autoplay loop></video>';
                    scaleVideo.children[0].innerHTML = str;

                })
            }
        },
        error: function(error) {
            console.log(error);
        }
    });

}

// 饮食百科书 end