window.addEventListener('load', () => {
    const thead = document.querySelector('.tabHead');
    const tbody = document.querySelector('.tabBody');
    const currentClick = document.querySelector('.currentClick');
    //公共岛左侧tab选项卡
    for (let i = 0; i < tbody.children.length; i++) {
        thead.children[1].children[i].addEventListener('click', () => {
            for (let j = 0; j < tbody.children.length; j++) { //隐藏所有
                tbody.children[j].style.visibility = 'hidden';
                tbody.children[j].style.opacity = 0;
            }
            currentClick.style.top = thead.children[1].children[i].offsetTop + 15 + 'px';
            tbody.children[i].style.visibility = 'visible'; //显示当前点击的
            tbody.children[i].style.opacity = 1; //显示当前点击的
        })
    }


    //获取信封
    const envelope = document.querySelector('.letterSet');
    const envelopeClose = envelope.querySelectorAll('img');
    const envelopeOpen = envelope.querySelectorAll('.envelopeOpen');
    const envelopeLetter = envelope.querySelectorAll('.envelopeLetter');
    //点击信封按钮
    for (let i = 0; i < envelope.children.length; i++) {
        envelope.children[i].addEventListener('click', () => {
            //让所有未被点到的信封闭合
            for (let j = 0; j < envelope.children.length; j++) {
                envelopeClose[j].style.visibility = 'visible';
                envelopeOpen[j].style.visibility = 'hidden';
                envelopeClose[j].style.zIndex = 1;
                envelopeOpen[j].style.zIndex = 0;
                envelopeLetter[j].style.bottom = -80 + 'px';
            }
            //当前所点击的信封展开
            envelopeClose[i].style.visibility = 'hidden';
            envelopeOpen[i].style.visibility = 'visible';
            envelopeClose[i].style.zIndex = 0;
            envelopeOpen[i].style.zIndex = 1;
            envelopeLetter[i].style.bottom = -20 + 'px';
        })
    }


    //获取信纸
    const getLetter = document.querySelector('.getLetter');
    const mailsContent = document.querySelector('.mailsContent');
    const insideCase = document.querySelector('.insideCase');
    //回复随机信件
    const replyRandomLetter = document.querySelector('.replyRandomLetter');
    const replyClose = document.querySelector('.replyClose'); //关闭回复
    const startData = replyRandomLetter.querySelector('.startData'); //初始提示文字
    const replyArticle = replyRandomLetter.querySelector('.replyArticle'); //回复区
    const replySend = replyRandomLetter.querySelector('.btn_send'); //寄信
    const head = replyRandomLetter.querySelector('.head');
    const sendTip = document.querySelector('.sendTip');
    //1.随机获取信件
    RandomLetter(); //调用获取随机信件函数
    //获取刷新按钮
    const btn_flush = document.querySelector('.btn_flush');
    const flushTip = document.querySelector('.flushTip');
    //点击刷新按钮，更新随机信件
    btn_flush.addEventListener('click', () => {
        //点击刷新，添加动画
        btn_flush.style.animation = 'rotate 0.3s linear infinite backwards';
        envelope.style.display = 'none'; //隐藏信件
        setTimeout(function() {
            btn_flush.style.animation = '';
        }, 300);
        setTimeout(function() {
            envelope.style.display = 'block'; //50ms后显示信件
        }, 50);
        RandomLetter(); //调用获取随机信件函数
    });
    //调用鼠标经过显示隐藏元素
    hover(btn_flush, flushTip);

    //封装获取随机信函数
    function RandomLetter() {
        ajax({
            url: "http://localhost:8080/team_project/mail/randomMails", // url---->地址
            type: "POST", // type ---> 请求方式
            async: true, // async----> 同步：false，异步：true 
            data: {
                "count": 4
            }, //传入信息
            success: function(result) { //返回接受信息
                for (let i = 0; i < result.data.mails.length; i++) {
                    let length = result.data.mails.length; //获取随机信的件数
                    //点击信封随机获取信件
                    envelope.children[i].addEventListener('click', (e) => {
                        e.stopPropagation(); //阻止冒泡
                        getLetter.style.visibility = 'visible'; //将随机获取信件的弹窗显示出来
                        getLetter.style.opacity = 1;
                        getLetter.style.transition = 'all 0.4s ease-out';
                        getLetter.style.transitionDelay = '0.4s';
                        //调用获取随机信函数
                        getRandomLetter(insideCase, result, i);

                        //调用回复随机信函数
                        replyLetter(getLetter, head, replyArticle, replySend, sendTip, result, i);

                        //点击按钮关闭信件弹窗
                        replyClose.addEventListener('click', (e) => {
                            e.stopPropagation();
                            replyRandomLetter.style.display = 'none'; //隐藏回信区
                            getLetter.style.visibility = 'hidden';
                            getLetter.style.opacity = 0;
                            getLetter.style.transition = 'none';
                            getLetter.style.transitionDelay = '0s';
                            //让当前点击的信封闭合
                            envelopeClose[i].style.visibility = 'visible';
                            envelopeOpen[i].style.visibility = 'hidden';
                            envelopeClose[i].style.zIndex = 1;
                            envelopeOpen[i].style.zIndex = 0;
                            envelopeLetter[i].style.bottom = -80 + 'px';
                        });
                    });
                }

            },
            error: function(error) {
                console.log(error);
            }
        });

    }



    //2.获取下一封随机信的按钮
    const btn_next = document.querySelector('.next');
    //点击按钮获取下一封随机信
    btn_next.addEventListener('click', (e) => {
        e.stopPropagation();
        ajax({
            url: "http://localhost:8080/team_project/mail/randomMails", // url---->地址
            type: "POST", // type ---> 请求方式
            async: true, // async----> 同步：false，异步：true 
            data: {
                "count": 1
            }, //传入信息
            success: function(result) { //返回接受信息
                //调用获取随机信函数
                getRandomLetter(insideCase, result, 0);

                //调用回复随机信函数
                replyLetter(getLetter, head, replyArticle, replySend, sendTip, result, 0);

            }
        });
    })



    //获取回信与写信按钮
    const write = document.querySelector('.write');
    const receipt = document.querySelector('.receipt');
    const top = document.querySelector('.right').querySelector('.top'); //顶部文字
    const bottom = document.querySelector('.right').querySelector('.bottom'); //底部区域
    const articleStart = bottom.querySelector('.articleStart'); //初始提示文字
    const receiptArticle = bottom.querySelector('.receiptArticle'); //收信文字
    const writeArticle = bottom.querySelector('.writeArticle'); //写信文字
    const btn_send = bottom.querySelector('.btn_left'); //寄出按钮
    const nextOne = bottom.querySelector('.nextOne'); //查看下一封按钮
    const successTip = bottom.querySelector('.successTip'); //信寄出提示
    const know = bottom.querySelector('.know'); //知道了按钮
    const articleTop = bottom.querySelector('.articleTop');
    const currentUnderline = articleTop.querySelector('.currentUnderline');
    const tabReply = bottom.querySelectorAll('.tabReply');
    const replied = document.querySelector('.replied');
    const notReply = document.querySelector('.notReply');
    const btnLast = document.querySelector('.lastOne');
    const btnNext = document.querySelector('.nextOne');
    const rightLetter = document.querySelector('.rightLetter');

    //3.点击左侧收到的回信,右侧变化
    receipt.addEventListener('click', () => {
        top.children[0].innerHTML = '信件往来';
        articleStart.style.display = 'none'; //隐藏提示信息
        writeArticle.style.display = 'none'; //隐藏写信的内容
        receiptArticle.style.display = 'block'; //显示收信的内容
        btn_send.style.display = 'none'; //隐藏寄出按钮
        btnLast.style.display = 'block'; //显示查看上一封按钮
        btnNext.style.display = 'block'; //显示查看下一封按钮

        rightLetter.style.display = 'none'; //隐藏右侧小信件

        ajax({
            url: "http://localhost:8080/team_project/mail/historyMail", // url---->地址
            type: "GET", // type ---> 请求方式
            async: true, // async----> 同步：false，异步：true 
            data: {}, //传入信息
            success: function(result) { //返回接受信息
                const repliedData = []; //定义已回信的信件
                const noReplyData = []; //定义未回信的信件
                //将全部信件分为两个信件，一个已回信，一个未回信
                for (let i = 0; i < result.data.mails.length; i++) {
                    if (result.data.mails[i].replies.length != 0) { //已回信
                        repliedData.push(result.data.mails[i]);
                    }
                    if (result.data.mails[i].replies.length == 0) { //未回信
                        noReplyData.push(result.data.mails[i]);
                    }
                }

                //判断是否收到回信
                if (repliedData.length == 0) {
                    tabReply[1].style.visibility = 'visible'; //显示当前点击的
                    tabReply[1].style.opacity = 1;
                    currentUnderline.style.left = 110 + 'px';
                    articleTop.children[1].style.color = 'rgba(132, 178, 246, 1)';
                    articleTop.children[0].style.color = '#A8C8E1';
                    articleTop.children[0].onclick = function() {
                        alert('暂未收到回信');
                        return false;
                    }
                } else {
                    tabReply[0].style.visibility = 'visible'; //显示寄出已回的ul
                    tabReply[0].style.opacity = 1;
                    currentUnderline.style.left = 10 + 'px';
                    articleTop.children[0].style.color = 'rgba(132, 178, 246, 1)';
                    articleTop.children[1].style.color = '#A8C8E1';
                    //点击已寄有回按钮
                    articleTop.children[0].addEventListener('click', () => {
                        currentUnderline.style.left = 10 + 'px';
                        tabReply[0].style.visibility = 'visible'; //显示当前点击的
                        tabReply[0].style.opacity = 1;
                        tabReply[1].style.visibility = 'hidden'; //隐藏另一个未点击
                        tabReply[1].style.opacity = 0;
                        articleTop.children[0].style.color = 'rgba(132, 178, 246, 1)';
                        articleTop.children[1].style.color = '#A8C8E1';
                    });
                }

                // 点击已寄未回按钮
                articleTop.children[1].addEventListener('click', () => {
                    currentUnderline.style.left = 110 + 'px';
                    tabReply[1].style.visibility = 'visible'; //显示当前点击的
                    tabReply[1].style.opacity = 1;
                    tabReply[0].style.visibility = 'hidden'; //隐藏另一个未点击
                    tabReply[0].style.opacity = 0;
                    articleTop.children[1].style.color = 'rgba(132, 178, 246, 1)';
                    articleTop.children[0].style.color = '#A8C8E1';
                });



                //将已寄未收到回信的数据渲染(当有收到回信时)
                if (repliedData.length != 0) {
                    let string = '';
                    for (let i = 0; i < repliedData.length; i++) {
                        string += '<li>';
                        string += '    <h3>写下的信</h3>';
                        string += '    <textarea class="historyLetter">' + repliedData[i].body + '</textarea>';
                        string += '    <div class="replyArea">';
                        string += '        <h3>收到回信（' + repliedData[i].replies.length + '封）</h3>';
                        string += '        <ul class="repliedMore"></ul>';
                        string += '    </div>';
                        string += '</li>';
                    }
                    //渲染已回信的信件
                    replied.innerHTML = string;
                    for (let i = 0; i < repliedData.length; i++) {
                        const repliedMores = document.querySelectorAll('.repliedMore');
                        let childStr = ''
                        for (let j = 0; j < repliedData[i].replies.length; j++) {
                            childStr += '<li>';
                            childStr += '    <h4><span>回信来自：</span><span>' + repliedData[i].replies[j].replier + '</span></h4>';
                            childStr += '    <textarea class="replyContent">' + repliedData[i].replies[j].content + '</textarea>';
                            childStr += '</li>';
                        }
                        repliedMores[i].innerHTML = childStr;
                    }
                    //调用点击切换回信区域函数（是否有回信）
                    tabReplyBody(btnLast, btnNext, replied);
                }

                //将已寄未收到回信的数据渲染
                let str = '';
                for (let i = 0; i < noReplyData.length; i++) {
                    str += '<li>';
                    str += '    <h3>写下的信</h3>';
                    str += '    <textarea class="historyLetter">' + noReplyData[i].body + '</textarea>';
                    str += '    <div class="replyArea">';
                    str += '        <div class="noReplySnail">';
                    str += '            <div class="noReplyTip">暂时还没收到回信呢请耐心等待有缘人~</div>';
                    str += '        </div>';
                    str += '    </div>';
                    str += '</li>';
                }
                notReply.innerHTML = str;
                //调用点击切换回信区域函数（是否有回信）
                tabReplyBody(btnLast, btnNext, notReply);
            },
            error: function(error) {
                console.log(error);
            }
        });

    });



    //4.点击左侧写信按钮，右侧变化
    write.addEventListener('click', () => {
        top.children[0].innerHTML = '写下此刻的忧愁';
        top.children[1].innerHTML = '';
        let str = ''; //写信提示文字
        str += '<div class="snailTip"></div>';
        str += '<p style="text-align: center;">小窝tips：</p>';
        str += '<p>1.清晰详细的描述烦恼，更能获得有益的帮助噢~</p>';
        str += '<p>2.请注意文明礼仪，每一份善意都应被温暖以待</p>';
        str += '<p>&nbsp;&nbsp;&nbsp;最后,小窝衷心祝每一位小主都能生活无忧!</p>';
        articleStart.innerHTML = str; //修改提示的内容

        articleStart.className = 'articleStartWrite';
        const snailTip = document.querySelector('.snailTip');
        snailTip.className = 'snailTipWrite';
        articleStart.style.display = 'block'; //显示提示信息
        receiptArticle.style.display = 'none'; //隐藏收信的内容
        writeArticle.children[0].value = ''; //清除上封信的内容
        writeArticle.style.display = 'block'; //显示写信的内容
        btnLast.style.display = 'none'; //隐藏查看下一封按钮
        btnNext.style.display = 'none'; //隐藏查看下一封按钮
        btn_send.style.display = 'block'; //显示寄出按钮
        rightLetter.style.display = 'block'; //显示右侧小信封
        //点击写信区域隐藏提示文字
        writeArticle.addEventListener('click', () => {
            articleStart.style.display = 'none'; //隐藏提示信息
        })

    });


    //5.写信,点击寄出按钮寄信
    btn_send.addEventListener('click', () => {
        //获取写信的内容
        let body = writeArticle.children[0].value;
        if (body != '') { //当发信内容不为空则发送信件
            ajax({
                url: "http://localhost:8080/team_project/mail/writeMail", // url---->地址
                type: "POST", // type ---> 请求方式
                async: true, // async----> 同步：false，异步：true 
                data: {
                    "body": body
                }, //传入信息
                success: function(result) { //返回接受信息
                    successTip.style.display = 'block'; //显示已寄信
                    writeArticle.style.display = 'none'; //隐藏写的信
                    btn_send.style.display = 'none'; //隐藏寄出按钮
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }
    });


    //点击知道了按钮 
    know.addEventListener('click', () => {
        successTip.style.display = 'none'; //隐藏已寄信
        receipt.click();
        notReply.style.visibility = 'visible';
        notReply.style.opacity = 1;
        replied.style.visibility = 'hidden';
        replied.style.opacity = 0;
        currentUnderline.style.left = 110 + 'px';
        articleTop.children[1].style.color = 'rgba(132, 178, 246, 1)';
        articleTop.children[0].style.color = '#A8C8E1';
    })


    //封装点击切换ul的li函数
    function tabReplyBody(btnLast, btnNext, ul) {
        let index = 0;
        if (ul.children.length != 0) {
            ul.children[0].style.display = 'block';
        }
        //点击左侧按钮切换
        btnLast.addEventListener('click', () => {
            for (let j = 0; j < ul.children.length; j++) {
                ul.children[j].style.display = 'none'; //将全部li隐藏
            }
            index--;
            if (index <= 0) { //到达最左侧
                index = 0;
            }
            //显示当前的li
            ul.children[index].style.display = 'block';
        });
        //点击右侧按钮切换
        btnNext.addEventListener('click', () => {
            for (let j = 0; j < ul.children.length; j++) {
                ul.children[j].style.display = 'none'; //将全部li隐藏
            }
            index++;
            if (index >= ul.children.length - 1) { //到达最右侧
                index = ul.children.length - 1
            }
            //显示当前的li
            ul.children[index].style.display = 'block';

        });

    }


    //封装获取随机信件函数
    function getRandomLetter(insideCase, result, i) {
        let str = '';
        str += '<h1>亲爱的陌生人：</h1>';
        str += '<article>' + result.data.mails[i].body + '</article>';
        str += '<div class="wish">感谢你的倾听<br>祝君顺遂</div>';
        str += '<div class="reply">给Ta回信</div>';
        str += '<div class="sender"><span>ID:</span><span>' + result.data.mails[i].sender + '</span></div>';
        str += '<div class="date">' + result.data.mails[i].time + '</div>';
        insideCase.innerHTML = str;
        insideCase.style.display = 'block'; //显示随机信
    }

    //回复随机信
    function replyLetter(getLetter, head, replyArticle, replySend, sendTip, result, i) {
        const reply = getLetter.querySelector('.reply'); //获取回信按钮
        //点击回复随机信
        reply.addEventListener('click', (e) => {
            e.stopPropagation();
            insideCase.style.display = 'none'; //隐藏随机信
            replyRandomLetter.style.display = 'block'; //点击回信显示回信区域
            startData.style.display = 'block'; //显示初始化文字
            replySend.style.display = 'block'; //显示寄出按钮
            let sender = result.data.mails[i].sender;
            head.children[1].innerHTML = sender;
            // 点击回信文本框，初始文字隐藏，文本框聚焦
            replyArticle.addEventListener('click', (e) => {
                e.stopPropagation();
                startData.style.display = 'none'; //隐藏初始化文字
                replyArticle.children[0].focus();
            });

            //如果回信文本框失焦之后内容为空，则显示初始化文字
            replyArticle.children[0].addEventListener('blur', () => {
                replyArticle.children[0].value == '' ? startData.style.display = 'block' : startData.style.display = 'none';
            });

            //点击寄出按钮，把回信寄出
            replySend.addEventListener('click', (e) => {
                e.stopPropagation(); //阻止冒泡
                let mid = result.data.mails[i].mid;
                let content = replyArticle.children[0].value;
                ajax({
                    url: "http://localhost:8080/team_project/mail/reply", // url---->地址
                    type: "POST", // type ---> 请求方式
                    async: true, // async----> 同步：false，异步：true 
                    data: {
                        "mid": mid,
                        "content": content
                    }, //传入信息
                    success: function(results) { //返回接受信息
                        replyArticle.children[0].value = ''; //寄出信之后隐藏回信内容
                        replySend.style.display = 'none'; //隐藏寄信按钮
                        sendTip.style.display = 'block'; //显示提示已寄出
                    }
                });
            });
            //获取知道了按钮，点击关闭弹窗
            const know = sendTip.querySelector('.know');
            know.addEventListener('click', () => {
                sendTip.style.display = 'none'; //隐藏已寄出提示框
                head.parentNode.style.display = 'none'; //隐藏寄信区域
                getLetter.style.visibility = 'hidden';
                getLetter.style.opacity = 0;
                getLetter.style.transition = 'none';
                getLetter.style.transitionDelay = '0s';
            })

        });

    }





    //随机激励旋转卡
    //获取随机激励卡片
    const inspirt = document.querySelector('.inspirt');
    const liCase = inspirt.querySelector('ul');
    const title = inspirt.querySelector('h1');
    //获取随机激励展示区
    const showArea = inspirt.querySelector('.showArea');
    const btn_agree = showArea.querySelector('.btn_agree'); //有意思按钮
    const btn_disagree = showArea.querySelector('.btn_disagree'); //不满意按钮
    const inspirtTip = showArea.querySelector('.inspirtTip'); //反馈结果
    for (let i = 0; i < liCase.children.length; i++) {
        //鼠标在卡牌上移动，卡牌随之移动
        liCase.children[i].addEventListener('mousemove', function(e) {
            let x = e.clientX - liCase.children[i].getBoundingClientRect().left;
            let left = liCase.children[i].offsetWidth / 2;
            let rotateY = -(left - x) / 5;
            let y = e.clientY - liCase.children[i].getBoundingClientRect().top;
            let top = liCase.children[i].offsetHeight / 2;
            let rotateX = (top - y) / 5;
            liCase.children[i].children[0].style.cssText = `
               transform: rotateX(${rotateX}deg) rotateY(${rotateY}deg); `
        });

        //鼠标离开卡牌，卡牌恢复原状
        liCase.children[i].addEventListener('mouseout', function(e) {
            liCase.children[i].children[0].style.cssText = `
               transform: rotateY(0) scale(1.0); `
        });

        //点击卡牌，卡牌放大旋转并显示随机激励的内容
        liCase.children[i].addEventListener('click', () => {
            title.style.display = 'none'; //隐藏标题
            for (let j = 0; j < liCase.children.length; j++) {
                liCase.children[j].style.display = 'none'; //将全部卡牌隐藏
            }
            //将当前点击的卡牌显示且放大旋转
            liCase.children[i].style.display = 'block';
            liCase.children[i].style.transform = 'rotateY(360deg) scale(1.4)';
            setTimeout(function() {
                liCase.children[i].style.transform = 'rotateY(0) scale(1.4)'; //让卡牌旋转回到原状
            }, 600);
            setTimeout(function() {
                liCase.style.display = 'none'; //隐藏卡牌外框
                showArea.style.display = 'block'; //显示随机激励展示区
            }, 1000);

            //点击卡牌获取随即激励的内容
            ajax({
                url: "http://localhost:8080/team_project/card/oneCard", // url---->地址
                type: "GET", // type ---> 请求方式
                async: true, // async----> 同步：false，异步：true 
                data: {}, //传入信息
                success: function(result) { //返回接受信息
                    let str = '';
                    str += '<h1>' + result.data.card.theme + '</h1>';
                    str += '<h2>' + result.data.card.desc + '</h2>';
                    str += '<p>' + result.data.card.body + '</p>';
                    showArea.querySelector('.content').innerHTML = str;
                }
            });
        })
    };
    //点击空白处关闭弹窗

    //点击有意思按钮，显示反馈
    btn_agree.addEventListener('click', () => {
        inspirtTip.style.display = 'block'; //显示反馈区
        inspirtTip.children[0].innerHTML = '趣味翻翻，翻出趣味。恭喜解锁新秘籍！！';
        closeArea();
    });
    //点击不满意按钮显示反馈
    btn_disagree.addEventListener('click', () => {
        inspirtTip.style.display = 'block'; //显示反馈区
        inspirtTip.children[0].innerHTML = '咦，好像不太合您口味。没关系，再试一次吧~';
        closeArea();
    });

    //封装1s后关闭随机激励函数
    function closeArea() {
        setTimeout(function() {
            showArea.style.display = 'none'; //隐藏随机激励展示区
            liCase.style.display = 'flex'; //显示卡牌外框
            inspirtTip.style.display = 'none'; //隐藏反馈区
            title.style.display = 'block'; //显示标题
            for (let j = 0; j < liCase.children.length; j++) {
                liCase.children[j].style.display = 'block'; //显示所有卡牌
                liCase.children[j].style.transform = 'rotateY(0) scale(1.0)'; //恢复卡牌原状
            }
        }, 600);
    }


    //解压小游戏
    const game = document.querySelector('.game');
    const chooseGame = document.querySelector('.chooseGame');
    const gameArea = game.querySelector('.gameArea');
    const mouseArea = game.querySelector('.mouseArea');
    const fireworkArea = game.querySelector('.fireworkArea');
    const balloonArea = game.querySelector('.balloonArea');
    const mouseLists = game.querySelectorAll('.mouse');
    const boomLists = game.querySelectorAll('.boom');
    const gameBtn = game.querySelector('.gameBtn');



    //打地鼠小游戏 start
    let randomMouse; //定义定时器
    const beforeData = ['../Images/mouseBefore_one.png', '../Images/mouseBefore_two.png', '../Images/mouseBefore_three.png', '../Images/mouseBefore_four.png']; //定义输出存储地鼠被打之前的图片
    const afterData = ['../Images/mouseAfter_one.png', '../Images/mouseAfter_two.png', '../Images/mouseAfter_three.png', '../Images/mouseAfter_four.png']; //定义输出存储地鼠被打之后的图片
    //点击开始按钮，生成地鼠，开始游戏
    gameBtn.children[0].addEventListener('click', () => {
        let appear;
        //随机生成地鼠
        randomMouse = setInterval(() => {
            let i = Math.floor(Math.random() * 9); //地鼠随机位置出现
            appear = Math.floor(Math.random() * 4); //产生一个随机地鼠的图片 
            mouseLists[i].src = beforeData[appear];
            mouseLists[i].style.top = 100 + 'px';
        }, 1000);

        for (let i = 0; i < mouseLists.length; i++) {
            mouseLists[i].addEventListener('click', () => {
                mouseLists[i].src = afterData[appear];
                boomLists[i].style.display = 'block';
                let timer = setTimeout(() => {
                    clearInterval(timer);
                    timer = null;
                    boomLists[i].style.display = 'none'; //隐藏boom
                }, 260);

                let time = setTimeout(() => {
                    clearInterval(time);
                    time = null;
                    mouseLists[i].style.top = 210 + 'px'; //隐藏地鼠
                }, 1000);
                //打地鼠出现声音
                const mouseAudio = document.createElement('audio');
                mouseAudio.src = '../audio/mouse.wav';
                mouseAudio.play();
                mouseArea.appendChild(mouseAudio);
                setTimeout(() => { //一秒后关闭打地鼠的声音
                    mouseArea.removeChild(mouseAudio);
                }, 1000);

            })
        }

    });
    //点击结束按钮，结束游戏，清空
    gameBtn.children[1].addEventListener('click', () => {
        clearInterval(randomMouse);
        randomMouse = null;
        for (let i = 0; i < mouseLists.length; i++) {
            mouseLists[i].style.top = 210 + 'px'; //隐藏地鼠
        }
    });

    //打地鼠小游戏 end



    //放烟花小游戏 start
    //创建canvas画布
    let canvas = document.createElement('canvas');
    fireworkArea.append(canvas);
    let context = canvas.getContext("2d");
    let width = 720;
    let height = 380;
    //设定画布的大小
    function resizeCanvas() {
        canvas.width = width;
        canvas.height = height;
        clearCanvas();
    }

    function clearCanvas() {
        context.fillStyle = 'transparent';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    //页面缩放改变画布的大小
    fireworkArea.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
    //获取鼠标点击的位置
    function mouseDownHander(e) {
        //获取当前鼠标的坐标
        let x = e.clientX - canvas.getBoundingClientRect().left;
        let y = e.clientY - canvas.getBoundingClientRect().top;
        createFireworks(x, y);
        fireworkAudio(); //烟花的声音
    }
    canvas.addEventListener('mousedown', mouseDownHander);
    let particles = [];
    //实现鼠标点击产生烟花的初级形态
    function createFireworks(x, y) {
        //初始半径，以及粒子的数量
        let count = 100;
        let radius = 0;
        let hue = Math.floor(Math.random() * 51) + 150;
        let hueVariance = 30;

        for (let i = 0; i < count; i++) {
            let angle = 360 / count * i;
            let radians = angle * Math.PI / 180;

            let p = {};
            p.x = x;
            p.y = y;
            p.radians = radians;

            p.size = 2;
            p.speed = (Math.random() * 5) + 0.4;
            p.radius = p.speed;

            p.hue = Math.floor(Math.random() * ((hue + hueVariance) - (hue - hueVariance))) + (hue - hueVariance);
            p.brightness = Math.floor(Math.random() * 31) + 50;
            p.alpha = (Math.floor(Math.random() * 61) + 40) / 100;
            particles.push(p);
        }
    }
    //实现鼠标点击产生烟花的初级状态
    function drawFireworks() {
        clearCanvas();
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            let moveX = Math.cos(p.radians) * p.radius;
            let moveY = Math.sin(p.radians) * p.radius + 0.4;
            p.x += moveX;
            p.y += moveY;
            p.radius *= 1 - p.speed / 100;
            p.alpha -= 0.005;

            if (p.alpha <= 0) {
                particles.splice(i, 1);
                continue;
            }
            //开始路径
            context.beginPath();
            context.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
            //结束
            context.closePath();
            //随机颜色，hsla()使用色相，饱和度，亮度，透明度来定义颜色
            context.fillStyle = 'hsla(' + p.hue + ',100%,' + p.brightness + '%,' + p.alpha + ')';
            context.fill();
        }

    }
    //渲染，更新粒子的信息
    function tick() {
        context.globalCompositeOperation = 'destination-out';
        context.fillStyle = 'rgba(0,0,0,' + 10 / 100 + ')';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'lighter';
        //更新画布
        drawFireworks();
        requestAnimationFrame(tick);
    }
    tick();

    const button = fireworkArea.querySelector('button');
    let autoplay = false; //判断是否点击自动播放按钮
    let auto; //设置定时器
    const fireworksAudio = document.querySelector('.fireworksAudio');
    //点击自动播放按钮判断是否自动放烟花
    button.addEventListener('click', () => {
        if (autoplay == false) { //若为false,自动放烟花
            button.innerHTML = '取消播放';
            auto = setInterval(function() {
                createFireworks(Math.random() * canvas.width, Math.random() * canvas.height);
            }, 1500);
            fireworksAudio.play();
            autoplay = true;
        } else { //若为true，关闭自动放烟花
            button.innerHTML = '自动播放';
            clearInterval(auto);
            auto = null;
            fireworksAudio.pause();
            autoplay = false;
        }
    });
    //自动播放烟花
    function fireworkAudio() {
        const audio = document.createElement('audio');
        audio.src = '../audio/firework.wav';
        fireworkArea.appendChild(audio);
        audio.play();
        setTimeout(function() {
            fireworkArea.removeChild(audio);
        }, 2000);
    }

    //放烟花小游戏 end


    //充气球小游戏 start

    //获取元素
    const inflatable = balloonArea.querySelector('.inflatable');
    const inflatablePress = inflatable.querySelector('.inflatablePress');
    const inflatableBody = inflatable.querySelector('.inflatableBody');
    const balloon = balloonArea.querySelector('.balloon');
    let change = 1;
    let count = 0; //按压的次数
    const data = ['../Images/balloon_blue.svg', '../Images/balloon_green.svg', '../Images/balloon_orange.svg', '../Images/balloon_pink.svg', '../Images/balloon_yellow.svg', '../Images/balloon_red.svg', '../Images/balloon_purple.svg']; //数组存储气球的图片
    const balloon_boom = document.querySelector('.balloon_boom');
    inflatablePress.addEventListener('click', () => {
        change += 0.4;
        count++;
        inflatablePress.style.top = -80 + 'px';
        balloon.style.transform = 'scale(' + change + ')';
        let pressAudio = document.createElement('audio');
        pressAudio.src = '../audio/press.wav';
        pressAudio.play();
        inflatablePress.appendChild(pressAudio);
        setTimeout(() => {
            inflatablePress.style.top = -100 + 'px';
            inflatablePress.removeChild(pressAudio);
        }, 800);
        let num = 10 - Math.floor(Math.random() * 5); //产生一个随机数
        if (count >= num) { //当气球按压次数达到随机数的大小则爆破
            count = 0; //重新将count赋值为0
            change = 1; //放大值恢复为1
            balloon.style.transform = 'scale(1.0)';
            balloon.style.display = 'none'; //隐藏气球
            balloon_boom.style.display = 'block'; //显示爆破
            let boomAudio = document.createElement('audio');
            boomAudio.src = '../audio/boom.wav';
            boomAudio.play(); //播放气球爆破的声音
            balloon_boom.appendChild(boomAudio);
            setTimeout(() => {
                balloon.style.display = 'block'; //显示气球
                balloon_boom.style.display = 'none'; //隐藏爆破
                balloon.children[0].src = data[Math.floor(Math.random() * data.length)];
                balloon_boom.removeChild(boomAudio);
            }, 1000);

        }
    });

    //充气球小游戏 end

    //点击选择游戏，进入游戏区域
    for (let i = 1; i < chooseGame.children.length; i++) {
        chooseGame.children[i].addEventListener('click', (e) => {
            e.stopPropagation();
            gameArea.style.display = 'block'; //点击选择进入游戏区域
            if (i == 3) { //选择的是放烟花游戏
                fireworkArea.style.display = 'block';
                chooseGame.style.display = 'none'; //隐藏选择游戏入口区域
            }
            if (i == 2) { //选择的是打地鼠游戏
                mouseArea.style.display = 'grid';
                chooseGame.style.display = 'none'; //隐藏选择游戏入口区域
            }
            if (i == 1) { //选择的是充气球游戏
                balloonArea.style.display = 'block';
                chooseGame.style.display = 'none'; //隐藏选择游戏入口区域
            }
        });
    }
    //点击空白处，关闭游戏区域
    document.addEventListener('click', () => {
        gameArea.style.display = 'none'; //关闭游戏区域
        for (let j = 0; j < gameArea.children.length; j++) {
            gameArea.children[j].style.display = 'none'; //关闭游戏区域
        }
        chooseGame.style.display = 'flex'; //显示选择游戏入口区域
        //关闭自动播放烟花，清楚定时器
        button.innerHTML = '自动播放';
        clearInterval(auto);
        auto = null;
        fireworksAudio.pause();
        autoplay = false;

        gameArea.onclick = function(e) {
            e.stopPropagation();
            window.event.cancelBubble = true;
        }
    })

    let chooseImg = ['../Images/game_two.png', '../Images/game_three.png', '../Images/game_four.png'];
    let choosePic = ['../Images/gameHoverTwo.png', '../Images/gameHoverThree.png', '../Images/gameHoverFour.png'];
    let chooseSmallPic = ['../Images/gameSmallTwo.png', '../Images/gameSmallThree.png', '../Images/gameSmallFour.png'];
    //调用手风琴效果函数
    accordion(chooseGame);

    //封装手风琴效果
    function accordion(ul) {
        for (let i = 1; i < ul.children.length; i++) {
            let width = ul.children[0].offsetWidth / 2;
            //鼠标经过li改变宽度
            ul.children[i].addEventListener('mouseover', () => {
                for (let j = 1; j < ul.children.length; j++) {
                    ul.children[j].style.width = width + 'px';
                    ul.children[j].children[0].src = chooseSmallPic[j - 1]
                }
                ul.children[i].style.width = 5 * width + 'px';
                ul.children[i].children[0].src = choosePic[i - 1]
            });
            //鼠标离开li改变宽度
            ul.children[i].addEventListener('mouseout', () => {
                for (let j = 1; j < ul.children.length; j++) {
                    ul.children[j].style.width = 2 * width + 'px';
                    ul.children[j].children[0].src = chooseImg[j - 1];
                }
            })
        }

    }
})