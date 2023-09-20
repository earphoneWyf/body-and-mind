window.addEventListener('load', () => {
    //获取建岛按钮与关于建岛细节元素
    const buildIsland = document.querySelector('.buildIsland');
    const aboutBuild = buildIsland.querySelector('.aboutBuild');
    //调用显示与隐藏函数
    showAndHide(buildIsland, aboutBuild);



    //获取岛图外框元素
    const islandImg = document.querySelector('.islandImg');
    const picture = islandImg.querySelector('.picture');
    //将岛的选择图片渲染到html页面
    ajax({
        url: "http://localhost:8080/team_project/island/getAllIcons", // url---->地址
        type: "GET", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {}, //传入信息
        success: function(result) { //返回接受信息
            for (let i = 0; i < result.data.icons.length; i++) {
                const img = document.createElement('img');
                img.src = result.data.icons[i].iconUrl;
                picture.appendChild(img);
            }
            for (let j = 0; j < picture.children.length; j++) { //将所有图片隐藏
                picture.children[j].style.display = 'none';
            }
            picture.children[0].style.display = 'block'; //显示第一个图片
        },
        error: function(error) {
            console.log(error);
        }
    });



    //封装点击选择岛图函数
    function chooseIslandImg(islandImg, picture) {
        let index = 0; //图片索引
        islandImg.addEventListener('click', () => {
            for (let i = 0; i < picture.children.length; i++) { //将所有图片设置隐藏
                picture.children[i].style.display = 'none';
            }
            picture.children[index].style.display = 'block'; //当前点击的图片显示
            if (index == picture.children.length - 1) { //当图片选择到最后一张，跳转到第一张
                index = 0;
            } else {
                index++; //索引从小到大排序
            }

        })


    }
    //调用点击选择岛图函数
    chooseIslandImg(islandImg, picture);


    //封装获取岛的索引函数
    function getIconMark(picture) {
        for (let i = 0; i < picture.children.length; i++) {
            if (picture.children[i].style.display == 'block') {
                return i + 1;
            }
        }
    }



    //获取公开，私密复选框元素
    const checkboxs = document.querySelectorAll('.checkbox');
    //调用复选框点击选择函数
    checkBox(checkboxs);


    //封装点击专属岛跳转到岛内函数
    function jump(island, id) {
        island.addEventListener('click', () => {
            location.href = '../HTML/insideIsland.html?' + id;
        })
    }


    //渲染岛名，id，简介等等
    function IslandTip(belong, name, intro, island) {
        let tip = '';
        tip += '<div class ="ID"><span>ID:</span><span>' + belong + '</span></div>'; //岛的id
        tip += '<div class = "name"><span>岛名:</span><span>' + name + '</span></div>'; //岛名
        tip += '<div class = "intro"><span>简介:</span><span>' + intro + '</span></div>'; //简介
        let div = document.createElement('div');
        div.innerHTML = tip;
        div.className = 'islandTips';
        island.appendChild(div);
    }


    //获取完成建岛按钮
    const finishBuild = document.querySelector('.finishBuild');
    const inputs = aboutBuild.querySelectorAll('input'); //获取岛名与简介
    const exclusiveIsland = document.querySelector('.exclusiveIsland'); //获取个人专属岛
    // 点击input框出现聚焦,回车失焦函数
    inputFocus(inputs[0]);
    inputFocus(inputs[1]);
    //进入岛的页面判断岛主是否存在
    ajax({
        url: "http://localhost:8080/team_project/user/userExist", // url---->地址
        type: "GET", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {}, //传入信息
        success: function(result) { //返回接受信息
            if (result.message == 1) {
                id = result.data.user.id;
                //点击完成建岛按钮，将参数上传
                finishBuild.addEventListener('click', () => {
                    let name = inputs[0].value;
                    let intro = inputs[1].value;
                    let iconMark = getIconMark(picture); //调用获取岛的索引函数
                    let type = judgeCheckbox(checkboxs); //获取类型为私密或公开

                    ajax({
                        url: "http://localhost:8080/team_project/island/createIsland", // url---->地址
                        type: "POST", // type ---> 请求方式
                        async: true, // async----> 同步：false，异步：true 
                        data: {
                            "belong": id,
                            "name": name,
                            "intro": intro,
                            "type": type,
                            "iconMark": iconMark
                        }, //传入信息
                        success: function(result) { //返回接受信息
                            //显示个人专属岛的相关信息
                            ajax({
                                url: "http://localhost:8080/team_project/island/hasIsland", // url---->地址
                                type: "GET", // type ---> 请求方式
                                async: true, // async----> 同步：false，异步：true 
                                data: {}, //传入信息
                                success: function(result) { //返回接受信息
                                    if (result.message == 'yes') {
                                        let iconMark = result.data.island.iconMark; //岛的图
                                        getIconByMark(exclusiveIsland, iconMark); //将个人专属岛渲染入html页面
                                        buildIsland.style.display = 'none'; //建岛区域隐藏
                                        exclusiveIsland.style.display = 'block'; //显示个人专属岛
                                        exclusiveIsland.className = 'exclusiveIsland'; //为专属岛添加类名，使其可以漂流进入

                                        //渲染岛名，id，简介等等
                                        IslandTip(result.data.island.belong, result.data.island.name, result.data.island.intro, exclusiveIsland);

                                        //调用点击专属岛跳转到岛内函数
                                        jump(exclusiveIsland, id);
                                    }

                                },
                                error: function(error) {
                                    console.log(error);
                                }
                            })
                        },
                        error: function(error) {
                            console.log(error);
                        }
                    })
                });


                //显示个人专属岛的相关信息
                ajax({
                    url: "http://localhost:8080/team_project/island/hasIsland", // url---->地址
                    type: "GET", // type ---> 请求方式
                    async: true, // async----> 同步：false，异步：true 
                    data: {}, //传入信息
                    success: function(result) { //返回接受信息
                        if (result.message == 'yes') {
                            let iconMark = result.data.island.iconMark; //岛的图
                            getIconByMark(exclusiveIsland, iconMark); //将个人专属岛渲染入html页面
                            buildIsland.style.display = 'none'; //建岛区域隐藏
                            exclusiveIsland.style.display = 'block'; //显示个人专属岛
                            exclusiveIsland.className = 'exclusiveIsland'; //为专属岛添加类名，使其可以漂流进入

                            //渲染岛名，id，简介等等
                            IslandTip(result.data.island.belong, result.data.island.name, result.data.island.intro, exclusiveIsland);

                            //调用点击专属岛跳转到岛内函数
                            jump(exclusiveIsland, id);
                        }

                    },
                    error: function(error) {
                        console.log(error);
                    }
                })
            }
            if (result.message == 0) {
                buildIsland.addEventListener('click', () => {
                    aboutBuild.style.visibility = 'none';
                    aboutBuild.style.opacity = 0;
                    alert('您未登录，请登录帐号');

                })
            }
        },
        error: function(error) {
            console.log(error);
        }
    });



    //获取岛屿
    const islands = document.querySelectorAll('.island');
    const loading = document.querySelector('.loading');



    for (let i = 0, length = islands.length; i < length; i++) {
        //获取随机岛的id
        ajax({
            url: "http://localhost:8080/team_project/island/getIslandsRandom", // url---->地址
            type: "POST", // type ---> 请求方式
            async: true, // async----> 同步：false，异步：true 
            data: {
                "count": 1
            }, //传入信息
            success: function(result) { //返回接受信息
                let tip = '';
                tip += '<div class ="ID"><span>ID:</span><span>' + result.data.islands[0].belong + '</span></div>';
                tip += '<div class = "name"><span>岛名:</span><span>' + result.data.islands[0].name + '</span></div>';
                tip += '<div class = "intro"><span>简介:</span><span>' + result.data.islands[0].intro + '</span></div>';
                let div = document.createElement('div');
                div.innerHTML = tip;
                div.className = 'islandTips';
                islands[i].appendChild(div);
            }
        })

    }





    //船移动
    function move(boat, island, loading) {
        clearInterval(timer);
        //获取岛和船的left,top变量
        let boat_x = boat.offsetLeft;
        let boat_y = boat.offsetTop;
        let island_x = island.offsetLeft;
        let island_y = island.offsetTop;
        //获取岛的宽，高
        const islandWidth = island.offsetWidth;
        const islandHeight = island.offsetHeight;
        //控制每隔20毫秒，执行一个函数
        var timer = setInterval(function() {
            if (boat_x < island_x + islandWidth / 2) { //船未到岛的水平中心
                boat.style.transform = 'rotateY(0)';
                boat_x++;
            } else if (boat_x > island_x + islandWidth / 2) { //船超过到岛的水平中心
                boat.style.transform = 'rotateY(180deg)';
                boat_x--;
            }
            if (boat_y < island_y + islandHeight / 2) { //船未到岛的竖直中心
                boat_y++;
            } else if (boat_y > +islandHeight / 2) { //船超过到岛的竖直中心
                boat_y--;
            }
            if (boat_x >= island_x && boat_x <= island_x + islandWidth &&
                boat_y >= island_y && boat_y <= island_y + islandHeight) {
                boat.style.display = 'none';
                const id = island.querySelector('.ID').children[1].innerHTML;
                loading.style.display = 'block';
                setInterval(function() {
                    loading.style.display = 'none';
                    location.href = '../HTML/insideIsland.html?' + id; //船漂流到岛的区域即跳转页面
                }, 2000);
                clearInterval(timer);
            }
            //这里是设置小船的位置
            boat.style.left = boat_x + "px";
            boat.style.top = boat_y + "px";

        }, 6)
    }


    //随机漂流
    const btn_random = document.querySelector('.random');
    const boat = document.querySelector('.boat');

    function randomChoose(obj, islands, boat, loading) {
        obj.addEventListener('click', () => {
            let index = Math.floor((Math.random() * islands.length)); //随机获取一个岛的索引
            move(boat, islands[index], loading); //调用船只移动函数
        })
    }
    randomChoose(btn_random, islands, boat, loading);


    //手动漂流
    function manualChoose(islands) {
        for (let i = 0; i < islands.length; i++) {
            islands[i].addEventListener('click', () => {
                const id = islands[i].children[1].children[0].children[1].innerHTML;
                location.href = '../HTML/insideIsland.html?' + id; //点击要去的岛即跳转页面
            })
        }
    }
    manualChoose(islands);



    //获取岛主的关注数以及漂流记录
    const scroll = document.querySelector('.scroll'); //右上角卷轴
    const paper = document.querySelector('.paper');
    const area = document.querySelector('.area');
    const back = area.querySelector('.backToFront');
    const islandArea = area.querySelector('.islandArea');
    const concernCount = paper.querySelector('.concernCount');
    const floatCount = paper.querySelector('.floatCount');

    //鼠标经过卷轴卷出来
    scroll.addEventListener('mouseover', () => {
        paper.style.right = -10 + 'px';
    });
    //鼠标离开卷轴卷进去
    scroll.addEventListener('mouseout', () => {
        paper.style.right = -264 + 'px';
    });
    //调用点击关注数，漂流数切换区域
    change(concernCount, paper, area, back);
    change(floatCount, paper, area, back);
    //点击关注数，漂流数切换区域
    function change(btn, paper, area, back) {
        btn.addEventListener('click', () => {
            paper.style.display = 'none'; //隐藏关注，漂流数
            area.style.display = 'block'; //显示岛的id，名字区域
            scroll.style.transform = 'scale(1.4)';
            islandArea.style.transform = 'translate(-50%,-50%) scale(0.7)';
        });
        back.addEventListener('click', () => {
            paper.style.display = 'block'; //显示关注，漂流数
            area.style.display = 'none'; //隐藏岛的id，名字区域
            scroll.style.transform = 'scale(1)';

        })
    }


    //渲染岛主的关注数
    ajax({
        url: "http://localhost:8080/team_project/island/markIslandsInfo", // url---->地址
        type: "GET", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {}, //传入信息
        success: function(result) { //返回接受信息
            if (result.message == "all") {
                concernCount.innerHTML = result.data.markCount;
            }
        },
        error: function(error) {
            console.log(error);
        }
    });

    const islandUl = islandArea.querySelector('ul'); //岛的相关信息外边框
    //点击关注数，获取岛的相关数据
    getIslandMessage(concernCount, 'http://localhost:8080/team_project/island/markIslandsInfo');
    //点击漂流数，获取岛的相关数据
    getIslandMessage(floatCount, 'http://localhost:8080/team_project/island/getHasBeen', 5);

    //封装点击关注数、漂流数渲染数据
    function getIslandMessage(btn, url, size) {
        btn.addEventListener('click', () => {
            ajax({
                url: url, // url---->地址
                type: "GET", // type ---> 请求方式
                async: true, // async----> 同步：false，异步：true 
                data: {
                    "size": size
                }, //传入信息
                success: function(result) { //返回接受信息
                    if (result.message == "all" || result.message == "OK") {
                        islandUl.innerHTML = ''; //先清空ul里面原有的内容
                        for (let i = 0; i < result.data.islands.length; i = i + 2) {
                            let j = i + 1; //定义当页第二个id，name
                            let str = '';
                            str += '<li>';
                            if (j == result.data.islands.length) { //如果j的值为result.data.islands.length，则不添加j的值
                                str += '    <div class="islandId">' + result.data.islands[i].belong + '</div>';
                                str += '    <div class="islandName">' + result.data.islands[i].name + '</div>';
                            } else {
                                str += '    <div class="islandId">' + result.data.islands[i].belong + '</div>';
                                str += '    <div class="islandName">' + result.data.islands[i].name + '</div>';
                                str += '    <div class="islandId">' + result.data.islands[j].belong + '</div>';
                                str += '    <div class="islandName">' + result.data.islands[j].name + '</div>';
                            }
                            str += '</li>';
                            islandUl.innerHTML += str;
                        }

                        const btnLeft = islandArea.querySelector('.btnLeft'); //左侧按钮
                        const btnRight = islandArea.querySelector('.btnRight'); //右侧按钮
                        islandUl.children[0].style.display = 'block';
                        let index = 0;
                        //点击左侧按钮切换
                        btnLeft.addEventListener('click', () => {
                            for (let j = 0; j < islandUl.children.length; j++) {
                                islandUl.children[j].style.display = 'none'; //将全部li隐藏
                            }
                            index--;
                            if (index <= 0) { //到达最左侧
                                index = 0;
                            }
                            //显示当前的li
                            islandUl.children[index].style.display = 'block';

                        });
                        //点击右侧按钮切换
                        btnRight.addEventListener('click', () => {
                            for (let j = 0; j < islandUl.children.length; j++) {
                                islandUl.children[j].style.display = 'none'; //将全部li隐藏
                            }
                            index++;
                            if (index >= islandUl.children.length - 1) { //到达最右侧
                                index = islandUl.children.length - 1
                            }
                            //显示当前的li
                            islandUl.children[index].style.display = 'block';

                        });

                        //获取岛的id
                        const islandId = document.querySelectorAll('.islandId');
                        //点击岛的id则跳转到岛内的页面
                        for (let i = 0; i < islandId.length; i++) {
                            islandId[i].addEventListener('click', () => {
                                let id = islandId[i].innerHTML;
                                location.href = '../HTML/insideIsland.html?' + id;
                            })
                        }



                    }
                },
                error: function(error) {
                    console.log(error);
                }
            });
        });
    }


    //获取岛的背景音乐
    const islandAudio = document.querySelector('.islandAudio');
    const seaAudio = document.querySelector('.seaAudio');
    islandAudio.style.display = 'none'; //隐藏播放audio
    //点击播放声音按钮切换声音以及图片
    seaAudio.addEventListener('click', () => {
        if (seaAudio.children[0].src.match('play')) { //播放音乐，让播放按钮旋转
            seaAudio.children[0].src = '../Images/pause.png';
            islandAudio.pause();
            seaAudio.style.animation = 'none';
        } else { //暂停音乐，让播放按钮停止
            seaAudio.children[0].src = '../Images/play.png';
            islandAudio.play();
            seaAudio.style.animation = 'rotateAudio 4s infinite linear';
        }
    })



})