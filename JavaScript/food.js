window.addEventListener('load', () => {
    //获取元素
    const mainContent = document.querySelector('.mainContent');
    const topContent = mainContent.querySelector('.topContent');
    const bottomContent = mainContent.querySelector('.bottomContent');
    const btn_flush = document.querySelector('.flush');
    const btn_more = document.querySelector('.more');
    //点击刷新按钮，更新随机信件
    btn_flush.addEventListener('click', () => {
        //点击刷新，添加动画
        btn_flush.style.animation = 'rotate 0.3s linear infinite backwards';
        setTimeout(function() {
            btn_flush.style.animation = '';
        }, 300);
        //调用渲染视频相关内容函数
        getVideo(topContent, bottomContent);
    });


    //调用渲染视频相关内容函数
    getVideo(topContent, bottomContent);
    //封装渲染视频相关内容函数
    function getVideo(topContent, bottomContent) {
        const topGroup = topContent.querySelector('h1');
        const bottomGroup = bottomContent.querySelector('h1');
        //调用获取视频分组接口
        ajax({
            url: "http://localhost:8080/team_project/food/randomGroupWithVideo", // url---->地址
            type: "GET", // type ---> 请求方式
            async: true, // async----> 同步：false，异步：true 
            data: {
                "gsize": 2,
                "vsize": 3
            }, //传入信息
            success: function(result) { //返回接受信息
                topContent.innerHTML = '';
                bottomContent.innerHTML = '';
                topGroup.innerHTML = result.data.groupWithRandomVideos[0].group.groupName;
                bottomGroup.innerHTML = result.data.groupWithRandomVideos[1].group.groupName;
                topContent.appendChild(topGroup);
                bottomContent.appendChild(bottomGroup);
                let topUl = document.createElement('ul');
                //渲染顶部的视频
                for (let i = 0; i < result.data.groupWithRandomVideos[0].videos.length; i++) {
                    let li = document.createElement('li');
                    let str = '';
                    str += '<img src="' + result.data.groupWithRandomVideos[0].videos[i].imgUrl + '">';
                    str += '<div class="actionLogo"></div>';
                    str += '<div class="title">' + result.data.groupWithRandomVideos[0].videos[i].title + '</div>';
                    li.innerHTML = str;
                    topUl.appendChild(li);
                }
                topContent.appendChild(topUl);

                //渲染底部的视频
                let bottomUl = document.createElement('ul');
                for (let i = 0; i < result.data.groupWithRandomVideos[1].videos.length; i++) {
                    let li = document.createElement('li');
                    let str = '';
                    str += '<img src="' + result.data.groupWithRandomVideos[1].videos[i].imgUrl + '">';
                    str += '<div class="actionLogo"></div>';
                    str += '<div class="title">' + result.data.groupWithRandomVideos[1].videos[i].title + '</div>';
                    li.innerHTML = str;
                    bottomUl.appendChild(li);
                }
                bottomContent.appendChild(bottomUl);

                //选择视频点击跳转到饮食百科书内部页面
                gotoInside(topUl, result, 0);
                gotoInside(bottomUl, result, 1);

            },
            error: function(error) {
                console.log(error);
            }
        });
    }


    //封装点击跳转页面函数
    function gotoInside(ul, result, i) {
        for (let j = 0; j < ul.children.length; j++) {
            ul.children[j].addEventListener('click', (e) => {
                e.stopPropagation();
                let gid = result.data.groupWithRandomVideos[i].videos[j].gid;
                let videoUrl = result.data.groupWithRandomVideos[i].videos[j].videoUrl;
                console.log(gid, videoUrl);
                window.location.href = '../HTML/foodInside.html?' + gid + videoUrl; //传gid和videoUrl
            })
        }

    }


})