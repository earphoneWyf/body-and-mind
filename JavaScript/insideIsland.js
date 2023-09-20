window.addEventListener('load', () => {
    //封装获取当前时间函数
    function getTime(time) {
        //动态获取时间
        let date = new Date();
        let dateYear = date.getFullYear(); //获取年 
        let dateMonth = date.getMonth(); //获取月  
        let dateDate = date.getDate(); //获取当日
        let dateDay = date.getDay(); //获取当日星期数
        const year = time.querySelector('.year');
        const month = time.querySelector('.month');
        const week = time.querySelector('.week');
        const date_count = time.querySelector('.date');
        year.innerHTML = dateYear;
        month.innerHTML = dateMonth + 1;
        if (dateDay == 0) {
            week.innerHTML = '星期天';
        } else if (dateDay == 1) {
            week.innerHTML = '星期一';
        } else if (dateDay == 2) {
            week.innerHTML = '星期二';
        } else if (dateDay == 3) {
            week.innerHTML = '星期三';
        } else if (dateDay == 4) {
            week.innerHTML = '星期四';
        } else if (dateDay == 5) {
            week.innerHTML = '星期五';
        } else if (dateDay == 6) {
            week.innerHTML = '星期六';
        }
        date_count.innerHTML = dateDate;
    }
    //获取发布动态的时间
    const publicTime = document.querySelectorAll('.time')[0];
    // 获取发布录音的时间
    const audioTime = document.querySelectorAll('.time')[1];
    //调用获取当前时间函数
    getTime(publicTime);
    getTime(audioTime)


    //选择心情选择区
    const selectStatus = document.querySelector('.selectStatus');
    const btnLeft = selectStatus.querySelector('.btnLeft'); //左侧按钮
    const btnRight = selectStatus.querySelector('.btnRight'); //右侧按钮
    const btnScroll = selectStatus.querySelector('.scroll_btn'); //滑动按钮
    const scroll_track = selectStatus.querySelector('.scroll_track'); //滑动轨道
    const ul = selectStatus.querySelector('ul'); //心情图片ul
    let condition = 0; //心情图片的序号
    //渲染心情选择图片到HTML页面
    ajax({
        url: "http://localhost:8080/team_project/island/allConditions", // url---->地址
        type: "GET", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {}, //传入id
        success: function(result) { //返回接受信息

            for (let i = 0; i < result.data.conditions.length; i++) {
                let str = '<li><img src="' + result.data.conditions[i].url + '"><div class="imgTip">' + result.data.conditions[i].describe + '</div><div class="confirm_or_cancle"><span class="cancle">取消</span><span class="confirm">确认</span></div></li>';
                ul.innerHTML += str;
            }
            //获取选择心情的确认，取消按钮
            const cancle = selectStatus.querySelectorAll('.cancle');
            const confirm = selectStatus.querySelectorAll('.confirm');
            const selectedImg = selectStatus.querySelector('.selectedImg');

            for (let i = 0; i < confirm.length; i++) {
                //点击确认按钮，获取心情图片信息
                confirm[i].addEventListener('click', () => {
                    condition = i + 1; //选中图片的序号
                    let img = document.createElement('img'); //动态生成img和div
                    let div = document.createElement('div');
                    img.src = result.data.conditions[i].url;
                    div.innerHTML = result.data.conditions[i].describe;
                    div.className = 'imgTip';
                    selectedImg.appendChild(img); //讲div和img赋值后渲染入html页面
                    selectedImg.appendChild(div);
                    for (let j = 0; j < selectStatus.children.length; j++) {
                        selectStatus.children[j].style.display = 'none'; //将selectStatus的所有子元素设置为none
                    }
                    selectStatus.children[0].style.display = 'block'; //将selectStatus的子元素selectedImg设置为block
                })
            }

        }
    });
    //点击轨道，滑块发生移动
    scroll_track.addEventListener('click', (e) => {
        //moveX为坐标相对于滚动条最左边的距离
        let moveX = e.pageX - scroll_track.getBoundingClientRect().left;
        //moveNum为应该移动多少个42
        let moveNum = Math.floor(moveX / 42);
        btnScroll.style.left = moveNum * 42 + 'px'; //滑块移动3个14
        ul.style.left = -moveNum * 390 + 'px'; //ul移动3个130（li的宽）
    });
    //点击拖拽滑块
    btnScroll.addEventListener('mousedown', () => {
        let scroll_track_left = scroll_track.getBoundingClientRect().left;
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', () => {
            //当前滑块的位置
            let btnScrollLeft = btnScroll.offsetLeft;
            //滑块应当移动多少个42
            let moveNum = Math.round(btnScrollLeft / 42);
            btnScroll.style.left = moveNum * 42 + 'px'; //滑块移动3个14
            ul.style.left = -moveNum * 390 + 'px'; //ul移动3个130（li的宽）
            document.removeEventListener('mousemove', move);
        });
        //封装鼠标拖动函数
        function move(e) {
            e.preventDefault(); //阻止默认行为
            let moveX = e.clientX - scroll_track_left;
            if (moveX < 0) { //滑块移动到最左边
                btnScroll.style.left = 0 + 'px';
                ul.style.left = 0 + 'px';
            } else if (moveX > 210) { //滑块移动到最右边
                btnScroll.style.left = 210 + 'px';
                ul.style.left = -1950 + 'px';
            } else { //滑块移动到中间
                btnScroll.style.left = moveX + 'px';
                ul.style.left = -(130 / 14) * moveX + 'px';
            }
        }
    });
    //点击左侧按钮，滑块移动42px，ul移动390px(3个li的宽度)
    btnLeft.addEventListener('click', () => {
        let btnScrollLeft = btnScroll.offsetLeft;
        let ulLeft = ul.offsetLeft;
        //如果滑块移动到最左边
        if (btnScrollLeft <= 0) {
            btnScroll.style.left = 0 + 'px';
            ul.style.left = 0 + 'px';
        } else if (btnScrollLeft > 0) {
            btnScroll.style.left = btnScrollLeft - 42 + 'px';
            ul.style.left = ulLeft + 390 + 'px';
        }
    });
    //点击右侧按钮，滑块移动42px，ul移动390px(3个li的宽度)
    btnRight.addEventListener('click', () => {
        let btnScrollLeft = btnScroll.offsetLeft;
        let ulLeft = ul.offsetLeft;
        //如果滑块移动到最右边
        if (btnScrollLeft >= 210) {
            btnScroll.style.left = 210 + 'px';
            ul.style.left = -1950 + 'px';
        } else if (btnScrollLeft < 210) {
            btnScroll.style.left = btnScrollLeft + 42 + 'px';
            ul.style.left = ulLeft - 390 + 'px';
        }
    });




    //获取发布动态的点击打开，关闭按钮
    const btn_public = document.querySelector('.btn_public');
    const public_close = document.querySelectorAll('.close')[0];
    const section = document.querySelector('section');
    //调用发布动态点击显示，隐藏函数
    Toggle(btn_public, public_close, section);


    //获取发布录音的点击打开，关闭按钮
    const btn_audio = document.querySelector('.btn_audio');
    const audio_close = document.querySelectorAll('.close')[1];
    const audio = document.querySelector('.audio');
    //调用发布录音点击显示，隐藏函数
    Toggle(btn_audio, audio_close, audio);

    //获取公开，私密按钮
    const select_types = document.querySelectorAll('.select_type');
    //调用选择公开或私密函数
    selectType(select_types);


    // 获取是否准许评论按钮
    const btn_select = document.querySelector('.btn_select');
    //调用点击选择，点击取消按钮函数
    btnSelect(btn_select, '../Images/btn_choose.png', '../Images/btn_none.png', 'btn_choose');


    //获取岛的信息
    const name = document.querySelector('.name'); //岛名
    const intro = document.querySelector('.briefIntroduction'); //简介
    const img = document.querySelector('.islandImg'); //岛图
    const people = document.querySelector('.people'); //岛民
    const islandTrends = document.querySelector('.islandTrends'); //岛的内容
    const content = islandTrends.querySelector('.content'); //置顶的内容
    const id = window.location.search.substring(1);

    const dynamicMessage = document.querySelector('.dynamicMessage');

    ajax({
        url: "http://localhost:8080/team_project/island/showIsland", // url---->地址
        type: "POST", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "islandId": id
        }, //传入id
        success: function(result) { //返回接受信息
            let iconMark_val = result.data.island.iconMark; //岛的图片索引
            let name_val = '<span>' + result.data.island.name + '</span><span>岛</span>'; //岛名
            let intro_val = '<span>简介：</span><span>' + result.data.island.intro + '</span>'; //岛的简介
            let population = '<span>岛民：</span><span>' + result.data.island.population + '位' + '</span>'; //岛民

            //渲染岛html页面
            getIconByMark(img, iconMark_val);
            name.innerHTML = name_val;
            intro.innerHTML = intro_val;
            people.innerHTML = population;
            if (result.data.topPost == null) {
                content.innerHTML = '小窝tips：点击右侧即可轻松发帖，一键开启新体验~';
                content.style.fontSize = '22px';
                content.style.textAlign = 'center';
                content.style.lineHeight = '100px';
            } else {
                content.innerHTML = result.data.topPost.body; //岛的置顶信息内容
                content.style.fontSize = '16px';
                content.style.textAlign = 'left';
                content.style.lineHeight = '20px';
            }




            //判断用户存在，即用户为岛主，才可以发动态
            ajax({
                url: "http://localhost:8080/team_project/user/userExist", // url---->地址
                type: "POST", // type ---> 请求方式
                async: true, // async----> 同步：false，异步：true 
                data: {},
                success: function(result) { //返回接受信息
                    if (result.message == 1) {
                        let userId = result.data.user.id;
                        //判断存在用户的id与进岛的id是否匹配，若匹配，则显示岛主的视角浏览岛
                        if (id == userId) {
                            //点击发布按钮发布动态
                            const btn_post = document.querySelector('.btn_post');
                            const title_input = document.querySelector('.title_input'); //发布动态标题
                            const textarea = document.querySelector('textarea'); //发布动态内容
                            //调用input输入框聚焦失焦函数
                            inputFocus(title_input.children[0]);
                            //调用防抖函数，阻止高频触发，优化性能
                            Debounce(btn_post.click(), 2000);


                            //判断是否为岛主，若为岛主则显示发布动态按钮，点击发布动态按钮发布动态
                            btn_public.style.display = 'block';
                            //判断是否为岛主，若为岛主则显示发布录音按钮，点击发布录音按钮发布录音
                            btn_audio.style.display = 'block';
                            btn_post.addEventListener('click', () => {
                                let title = title_input.children[0].value;
                                let body = textarea.value;
                                let type = judgeCheckbox(select_types);
                                let canComment = judgeSelect(btn_select, 'btn_choose');
                                console.log(title, body, condition, type, canComment);
                                ajax({
                                    url: "http://localhost:8080/team_project/island/release", // url---->地址
                                    type: "GET", // type ---> 请求方式
                                    async: true, // async----> 同步：false，异步：true 
                                    data: {
                                        "belong": userId,
                                        "title": title,
                                        "body": body,
                                        "condition": condition,
                                        "type": type,
                                        "canComment": canComment
                                    }, //传入id
                                    success: function(result) { //返回接受信息
                                        console.log(result);
                                        //判断发布动态已经成功
                                        if (result.message == 'success') {
                                            location.reload(); //页面重新加载
                                        }

                                    }
                                });
                            });
                        } else { //若非岛主进入该岛，则显示非岛主（即游客）页面

                            //获取点击关注岛主按钮
                            const concern = document.querySelector('.concern');
                            const starToConcern = concern.querySelector('.starToConcern');
                            const btn_concern = concern.querySelector('.btn_concern');
                            const people = document.querySelector('.people');
                            //调用点击切换关注函数
                            btnSelectConcern(btn_concern, starToConcern, id, people);
                            //调用判断用户是否关注函数
                            judgeSelectConcern(btn_concern, starToConcern, id);
                            concern.style.display = 'block';
                        }
                    }

                }
            });


            ajax({
                url: "http://localhost:8080/team_project/island/hasPost", // url---->地址
                type: "POST", // type ---> 请求方式
                async: true, // async----> 同步：false，异步：true 
                data: {
                    "islandId": id
                }, //传入信息
                success: function(result) { //返回接受信息
                    if (result.data.hasRelease == true) {
                        //用户进岛时，获取在岛上发布的动态
                        getIslandPublish(id, dynamicMessage);
                    } else {
                        //用户进岛但未发动态
                        const prepare = document.querySelector('.prepare');
                        prepare.style.display = 'block';
                    }
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }
    })



    //获取在岛上发布的动态
    function getIslandPublish(id, dynamicMessage) {
        ajax({
            url: "http://localhost:8080/team_project/island/getPost", // url---->地址
            type: "POST", // type ---> 请求方式
            async: true, // async----> 同步：false，异步：true 
            data: {
                "belong": id,
                "currentPage": 1,
                "count": 10
            }, //传入信息
            success: function(result) { //返回接受信息
                for (let i = 0; i < result.data.posts.length; i++) {
                    let li = document.createElement('li');
                    let str = '';
                    str += '<div class="list">';
                    str += '    <div class="list_dot"></div>';
                    str += '    <div class="list_line"></div>';
                    str += '</div>';
                    str += ' <div class="topMessage">';
                    str += '     <div class="publicTime">' + result.data.posts[i].pubTime + '</div>';
                    str += '     <div class="id">id:<span>' + result.data.posts[i].publisher + '</span></div>';
                    str += ' </div>';
                    str += '<div class="message">';
                    str += '    <h2>' + result.data.posts[i].title + '</h2>';
                    str += '    <textarea>' + result.data.posts[i].body + '</textarea>';
                    str += '    <!-- 点击查看更多按钮 -->';
                    str += '    <div class="more">';
                    str += '        <img src="../Images/more.png" alt="更多">';
                    str += '        <div class="UlCase">';
                    str += '            <ul class="btnCase">';
                    str += '                <li class="btn_top">置顶</li>';
                    str += '                <li class="btn_delete">删除</li>';
                    str += '            </ul>';
                    str += '            <div class="caseTips">';
                    str += '                <h1>提示</h1>';
                    str += '                <h2>确认删除(置顶)此动态?</h2>';
                    str += '                <div class="buttonSet">';
                    str += '                    <span class="btn_cancle">取消</span>';
                    str += '                    <span class="btn_confirm">确认</span>';
                    str += '                </div>';
                    str += '            </div>';
                    str += '        </div>';
                    str += '    </div>';
                    str += '    <!-- 左下角图标 -->';
                    str += '    <div class="icon"><img src="' + result.data.posts[i].condition.url + '" alt="图标"></div>';
                    str += '    <!-- 评论 -->';
                    str += '    <div class="btn_comment"></div>';
                    str += '    <!-- 拥抱 -->';
                    str += '    <div class="btn_hug"><img src="../Images/hug.png"><div class="countLove">0</div></div>';
                    str += '    <div class="commentArea">';
                    str += '        <div class="line"></div>';
                    str += '        <div class="send">';
                    str += '            <input type="text" class="sendValue" value="发布你的评论来回应这份心情吧~">';
                    str += '            <div class="btn_send">发送</div>';
                    str += '        </div>';
                    str += '        <div class="commentCase"></div>';
                    str += '    </div>';
                    str += '</div>';
                    li.innerHTML = str;
                    li.className = 'outsideLi';
                    dynamicMessage.appendChild(li);
                }


                const btn_delete = document.querySelectorAll('.btn_delete');
                //获取取消确定框
                const caseTips = document.querySelectorAll('.caseTips');
                const btn_cancle = document.querySelectorAll('.btn_cancle'); //取消按钮
                const btn_confirm = document.querySelectorAll('.btn_confirm'); //确认按钮
                const UlCase = document.querySelectorAll('.UlCase'); //删除置顶弹窗
                const btnCase = document.querySelectorAll('.btnCase'); //删除取消按钮外框

                //获取删除按钮
                //1.岛主点击删除按钮删除发布的动态
                for (let j = 0; j < btn_delete.length; j++) {
                    btn_delete[j].addEventListener('click', (e) => {
                        e.stopPropagation(); //阻止冒泡到父元素
                        btnCase[j].style.display = 'none'; //隐藏置顶删除按钮外框
                        caseTips[j].style.display = 'block'; //显示取消确认框
                        //若点击确认按钮，则确认删除
                        btn_confirm[j].addEventListener('click', () => {
                            let postId = result.data.posts[j].id;
                            ajax({
                                url: "http://localhost:8080/team_project/island/delete", // url---->地址
                                type: "POST", // type ---> 请求方式
                                async: true, // async----> 同步：false，异步：true 
                                data: {
                                    "postId": postId
                                }, //传入信息
                                success: function(result) { //
                                    console.log(result);
                                    if (result.message == 'success') {
                                        const li = dynamicMessage.querySelectorAll('.outsideLi');
                                        if (j == 0) {
                                            location.reload();
                                        } else {
                                            //删除动态发布的li
                                            dynamicMessage.removeChild(li[j]);
                                        }
                                    }
                                },
                                error: function(error) {
                                    console.log(error);
                                }
                            });
                            //若点击取消按钮，则关闭小弹窗与取消确认弹窗
                            UlCase[j].style.display = 'none';
                            caseTips[j].style.display = 'none';
                        });
                    })
                }


                //获取置顶动态按钮
                const btn_top = document.querySelectorAll('.btn_top');
                //2.点击置顶按钮将动态置顶
                for (let j = 0; j < btn_top.length; j++) {
                    btn_top[j].addEventListener('click', (e) => {
                        e.stopPropagation(); //阻止冒泡到父元素
                        btnCase[j].style.display = 'none'; //隐藏置顶删除按钮外框
                        caseTips[j].style.display = 'block'; //显示取消确认框
                        btn_confirm[j].addEventListener('click', () => {
                            let postId = result.data.posts[j].id;
                            ajax({
                                url: "http://localhost:8080/team_project/island/setTop", // url---->地址
                                type: "POST", // type ---> 请求方式
                                async: true, // async----> 同步：false，异步：true 
                                data: {
                                    "belong": id,
                                    "postId": postId
                                }, //传入信息
                                success: function(result) { //返回接受信息
                                    if (result.message == 'success') {
                                        content.innerHTML = result.data.topPost.body; //岛的置顶信息内容
                                        content.style.fontSize = '16px';
                                        content.style.textAlign = 'left';
                                        content.style.lineHeight = '20px';
                                        btn_top[j].parentNode.parentNode.style.display = 'none';
                                    }
                                },
                                error: function(error) {
                                    console.log(error);
                                }
                            });
                            //若点击取消按钮，则关闭小弹窗与取消确认弹窗
                            UlCase[j].style.display = 'none';
                            caseTips[j].style.display = 'none';
                        });
                    })
                }



                //获取评论按钮，以及评论区
                const btn_comment = document.querySelectorAll('.btn_comment');
                const commentArea = document.querySelectorAll('.commentArea');
                //获取点击更多按钮以及其子元素
                const btn_more = document.querySelectorAll('.more');

                //判断是否为岛主，若为岛主，则显示删除动态按钮，否之则隐藏
                ajax({
                    url: "http://localhost:8080/team_project/user/userExist", // url---->地址
                    type: "GET", // type ---> 请求方式
                    async: true, // async----> 同步：false，异步：true 
                    data: {}, //传入信息
                    success: function(result) { //返回接受信息
                        if (result.message == 1) {
                            let userId = result.data.user.id;
                            //判断存在用户的id与进岛的id是否匹配，若匹配，则显示岛主的视角浏览岛
                            if (id == userId) {
                                for (let i = 0; i < btn_more.length; i++) { //匹配，则显示岛主的视角浏览岛
                                    btn_more[i].style.display = 'block';
                                }
                            } else {
                                for (let i = 0; i < btn_more.length; i++) { //不匹配，则不显示岛主的视角浏览岛
                                    btn_more[i].style.display = 'none';
                                }
                            }
                        }
                    },
                    error: function(error) {
                        console.log(error);
                    }
                });


                //调用点击显示隐藏按钮函数
                for (let i = 0; i < btn_comment.length; i++) {
                    //点击显示隐藏评论区
                    btnClick(btn_comment[i], commentArea[i]);
                    //点击显示隐藏更多功能按钮子元素
                    btnClick(btn_more[i], UlCase[i]);
                    //点击更多按钮，显示删除置顶按钮
                    btn_more[i].addEventListener('click', () => {
                        btnCase[i].style.display = 'block';
                    });
                    //若点击取消按钮，则关闭小弹窗
                    btn_cancle[i].addEventListener('click', () => {
                        caseTips[i].style.display = 'none';
                        UlCase[i].style.display = 'none';
                    });
                }
                //3.岛主，岛民都可以发表评论
                const btn_send = document.querySelectorAll('.btn_send');
                const sendValue = document.querySelectorAll('.sendValue');
                for (let i = 0; i < btn_send.length; i++) {
                    //调用input聚焦失焦函数
                    inputFocus(sendValue[i]);
                    //点击发送评论按钮则发送评论
                    btn_send[i].addEventListener('click', (e) => {
                        e.stopPropagation();
                        let postId = result.data.posts[i].id;
                        let body = sendValue[i].value;
                        sendValue[i].value = ''; //清空value的值
                        ajax({
                            url: "http://localhost:8080/team_project/island/releaseComment", // url---->地址
                            type: "POST", // type ---> 请求方式
                            async: true, // async----> 同步：false，异步：true 
                            data: {
                                "postId": postId,
                                "body": body
                            }, //传入信息
                            success: function(result) { //返回接受信息
                                //获取评论信息
                                if (Array.isArray(result.data.comments) && result.data.comments.length) {
                                    let div = document.createElement('div');
                                    let remark = '';
                                    remark += '<div class="islandId">ID:' + result.data.comments[0].discussant + ' </div>';
                                    remark += '<div class="commentPoint">';
                                    remark += '    <span>' + result.data.comments[0].body + '</span>';
                                    remark += '    <div class="btn_reply"></div>';
                                    remark += '    <div class="nextComment">';
                                    remark += '        <div class="nextId">ID:二级评论id</div>';
                                    remark += '        <p>/获取点击回复评论按钮，以及二级评论</p>';
                                    remark += '    </div>';
                                    remark += '</div>';
                                    div.innerHTML = remark;
                                    div.className = 'comments';
                                    commentArea[i].children[2].insertBefore(div, commentArea[i].children[2].children[0]); //将评论反向输出
                                    //获取点击回复评论按钮，以及二级评论
                                    const btn_reply = document.querySelectorAll('.btn_reply');
                                    const nextComment = document.querySelectorAll('.nextComment');
                                    for (let t = 0; t < btn_reply.length; t++) {
                                        btnClick(btn_reply[t], nextComment[t]);
                                    }
                                }

                            }
                        });
                    })
                }


                //4.获取某条动态下的评论
                for (let k = 0; k < btn_send.length; k++) {
                    getComments(result.data.posts[k].id, commentArea[k]);
                }

                function getComments(postId, commentArea) {
                    ajax({
                        url: "http://localhost:8080/team_project/island/getComments", // url---->地址
                        type: "POST", // type ---> 请求方式
                        async: true, // async----> 同步：false，异步：true 
                        data: {
                            "postId": postId,
                            "currentPage": 1,
                            "count": 10
                        }, //传入信息
                        success: function(result) { //返回接受信息
                            if (Array.isArray(result.data.comments) && result.data.comments.length) {
                                for (let t = 0; t < result.data.comments.length; t++) {
                                    let div = document.createElement('div');
                                    let remark = '';
                                    remark += '<div class="islandId">ID:' + result.data.comments[t].discussant + ' </div>';
                                    remark += '<div class="commentPoint">';
                                    remark += '    <span>' + result.data.comments[t].body + '</span>';
                                    remark += '    <div class="btn_reply"></div>';
                                    remark += '    <div class="nextComment">';
                                    remark += '        <div class="nextId">ID:二级评论id</div>';
                                    remark += '        <p>/获取点击回复评论按钮，以及二级评论</p>';
                                    remark += '    </div>';
                                    remark += '</div>';
                                    div.innerHTML = remark;
                                    div.className = 'comments';
                                    commentArea.children[2].insertBefore(div, commentArea.children[2].children[0]); //将评论反向输出
                                }
                                //获取点击回复评论按钮，以及二级评论
                                const btn_reply = document.querySelectorAll('.btn_reply');
                                const nextComment = document.querySelectorAll('.nextComment');
                                for (let t = 0; t < btn_reply.length; t++) {
                                    btnClick(btn_reply[t], nextComment[t]);
                                }
                            }
                        },
                        error: function(error) {
                            console.log(error);
                        }
                    });
                }


                //5.岛主和岛民给动态点赞
                const btn_hug = document.querySelectorAll('.btn_hug');
                const countLove = document.querySelectorAll('.countLove');
                for (let j = 0; j < btn_hug.length; j++) {
                    btn_hug[j].addEventListener('click', () => {
                        let postId = result.data.posts[j].id;
                        //调用点击点赞和取消点赞函数
                        btnSelectLike(btn_hug[j], countLove[j], postId);
                    });
                    //将点赞数渲染到html页面
                    getLikeCount(btn_hug[j], countLove[j], result.data.posts[j].id);
                }

            },
            error: function(error) {
                console.log(error);
            }
        });
    }


})