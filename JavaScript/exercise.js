const tabli = document.querySelectorAll('.tab li');
const content = document.querySelectorAll('.content');
for (let i = 0; i < tabli.length; i++) {
    tabli[i].index = i;
    tabli[i].addEventListener('click', function() {
        for (let j = 0; j < tabli.length; j++) {
            tabli[j].classList.remove('active');
            content[j].classList.add('hidden')
        }
        this.classList.add('active');
        content[this.index].classList.remove('hidden')
    })

}

// 点击切换分类

const videourl = ['../video/【全身燃脂_力量训练】20分钟自重+60分钟哑铃力量训练 - 2.60分钟力量训练(Av633725627,P2).mp4',
    '../video/每天10min，轻松get直角肩＋少女背! 消除猥琐斜方肌!圆肩驼背必看！ - 1.直角肩(Av752502257,P1).mp4',
    '../video/【无器械健身合集】在家健身这一个视频就够了（家庭居家必备） - 1.无器械合集(Av801460785,P1).mp4',
    '../video/【全身燃脂_力量训练】20分钟自重+60分钟哑铃力量训练 - 2.60分钟力量训练(Av633725627,P2).mp4'
]
const titleContent = ['【全身燃脂_力量训练】20分钟自重+60分钟哑铃力量训练', '../video/每天10min，轻松get直角肩＋少女背! 消除猥琐斜方肌!圆肩驼背必看！', '【无器械健身合集】在家健身这一个视频就够了（家庭居家必备）', '【全身燃脂_力量训练】20分钟自重+60分钟哑铃力量训练']
const label = [
    ['健身教程', '瘦身', '有氧运动'],
    ['直角肩', '斜方肌', '圆肩驼背'],
    ['无器械健身', '在家健身'],
    ['燃脂', '力量训练', '哑铃']
];
// 获取元素
const video = document.querySelector('video');
const Vtitle = document.querySelector('.left p');
const labelBox = document.querySelectorAll('.labelBox .label span');

const navtop = document.querySelectorAll('.navtop>ul>li');
for (let i = 0; i < navtop.length; i++) {
    navtop[i].index = i;
    navtop[i].addEventListener('click', function() {
        for (let j = 0; j < navtop.length; j++) {
            navtop[j].classList.remove('active');
        }
        this.classList.add('active');
        video.src = videourl[this.index];
        Vtitle.innerHTML = titleContent[this.index];
        for (let k = 0; k < label[this.index].length; k++) {
            labelBox[k].innerHTML = label[this.index][k];
        }
    })
}



// 计算
const selectBox = document.querySelector('.index');
selectBox.addEventListener('click', () => {
    selectBox.classList.toggle('click');
    for (let i = 0; i < selectli.length; i++) {
        selectli[i].addEventListener('click', function() {
            num = this.id
            selectBox.querySelector('input').value = num;
        })
    }
})

// 获取活动系数
let num;
const selectli = document.querySelectorAll('.index li')





// 获取相关数据
// let H = document.querySelector('.height input').value;


// 获取显示元素
const check = document.querySelector('.btn');

check.addEventListener('click', function() {
    // 获取相关数据
    let H = document.querySelector('.height input').value;
    let W = document.querySelector('.weight input').value;
    let A = document.querySelector('.size input').value;
    console.log(A);
    let S;

    // 获取单选按钮
    let selectBox = document.querySelectorAll('form input');
    console.log(selectBox);
    for (let i = 0; i < selectBox.length; i++) {
        if (selectBox[i].checked) {
            S = selectBox[i].value;
        }
    }

    // 获取活动系数
    for (let i = 0; i < selectli.length; i++) {
        selectli[i].addEventListener('click', function() {
            num = this.id
        })
    }

    // 获取性别
    let bmi = keepTwoDecimal(BMI(parseFloat(W), parseFloat(H)));
    let mr = keepTwoDecimal(MI(bmi, parseFloat(A), parseFloat(S)));
    let bmr = keepTwoDecimal(BMR(parseFloat(W), parseFloat(H), parseFloat(A)))
    let HRAT = keepTwoDecimal(heat(bmi, parseFloat(num)));
    console.log(HRAT);
    console.log(parseFloat(W));
    document.querySelector('.BMI b').innerHTML = bmi;
    document.querySelector('.MR b').innerHTML = mr;
    document.querySelector('.meta b').innerHTML = bmr;
    document.querySelector('.heat b').innerHTML = HRAT;
    //    这里

})






function BMI(weight, height) {
    height = height / 100
        // console.log(height);
    return weight / height / height;
}

function MI(bmi, age, sex) {
    return 1.2 * bmi + 0.23 * age - 5.4 - 10.8 * sex;
}

function BMR(weight, height, age) {
    // console.log(0);
    return 655 + (9.6 * weight) + (1.8 * height / 100) - (4.7 * age);
}

function heat(bmi, index) {
    return bmi * index;
}



// 计划专区
const shiftBtn = document.querySelectorAll('.shift>div');
const taskList = document.querySelectorAll('.contentBox>div');
const blank = document.querySelector('.blank'); //空白提示
const planItem = document.querySelector('.planItem'); //任务列表
// 加载时候判断用户是否有添加计划
document.querySelectorAll('.tab>ul>li')[3].addEventListener('click', () => {
    // 更新任务栏目
    ajax({
        url: 'http://localhost:8080/team_project/sport/planList',
        type: 'GET',
        async: true,
        data: {},
        success: function(resp) {
            console.log(resp);
            if (resp.data.selectedList.length == 0) {
                blank.classList.remove('hidden');
                planItem.classList.add('hidden');
            } else {
                blank.classList.add('hidden');
                planItem.classList.remove('hidden');
                // 目前存在的计划
                showTask(resp.data.selectedList);
            }
        },
        error: function(error) {

        }
    })
})
window.addEventListener('click', function() {
    ajax({
        url: 'http://localhost:8080/team_project/sport/planList',
        type: 'GET',
        async: true,
        data: {},
        success: function(resp) {
            console.log(resp);
            if (resp.data.selectedList.length == 0) {
                blank.classList.remove('hidden');
                planItem.classList.add('hidden');
            } else {
                blank.classList.add('hidden');
                planItem.classList.remove('hidden');
                // 目前存在的计划
                showTask(resp.data.selectedList);

            }
        },
        error: function(error) {

        }
    })
})


for (let i = 0; i < shiftBtn.length; i++) {
    shiftBtn[i].index = i;
    shiftBtn[i].addEventListener('click', function() {
        for (let j = 0; j < shiftBtn.length; j++) {
            shiftBtn[j].classList.remove('curr');
            taskList[j].classList.add('hidden')
        }
        this.classList.add('curr');
        taskList[this.index].classList.remove('hidden');
    })
}

// 添加计划
const addplan = document.querySelector('.addplan');
document.querySelector('.add').addEventListener('click', function() {
        addplan.classList.remove('hidden');
        blank.classList.add('hidden');
    })
    // 选择房间类型
const themeList = document.querySelectorAll('.type li');
themeList.forEach((item, index) => {
    item.addEventListener('click', function() {})
})
for (let i = 0; i < themeList.length; i++) {
    themeList[i].addEventListener('click', function() {
        for (let j = 0; j < themeList.length; j++) {
            themeList[j].classList.remove('checked');
        }
        this.classList.add('checked')
    })
}

const checkBtn = document.querySelector('.checkBtn');
checkBtn.addEventListener('click', function() {
    let taskContent = document.querySelector('.addplan input').value;
    // 渲染未完成的任务
    addplan.classList.add('hidden');
    setTimeout(function() {
            planItem.classList.remove('hidden');
        })
        // 传任务参数
    let theme = document.querySelector('.addplan input').value; //任务主题  
    // 选择的主题房
    let mission = document.querySelector('.type li.checked').lastChild.innerHTML;
    ajax({
        url: 'http://localhost:8080/team_project/sport/addPlan',
        type: 'GET',
        async: true,
        data: {
            "theme": theme,
            "mission": mission
        },
        success: function(resp) {
            // 判断是否存在plans数组
            if (resp.message == "OK") {
                console.log(resp);
                showTask(resp.data.plans);
            }
        },
        error: function(error) {
            console.log(error);
        }
    })
})
onlineCount();

function onlineCount() {
    const roomList = document.querySelectorAll('.gymList li');
    for (let i = 0; i < roomList.length; i++) {
        ajax({
            url: 'http://localhost:8080/team_project/sport/gymOnlineCount',
            type: 'GET',
            async: true,
            data: {
                "roomId": i + 1
            },
            success: function(resp) {
                console.log(resp);
                roomList[i].querySelector('.online').innerHTML = resp.data.onlineNum;
            },
            error: function(error) {
                console.log(error);
            }
        })
    }
}

function showTask(arr) {
    // 隐藏提示页面
    // 清除原有计划
    let unfinished = document.querySelector('.contentBox .unfinishedList ul');
    let finished = document.querySelector('.contentBox .finishedList ul');
    unfinished.innerHTML = '';
    finished.innerHTML = '';
    // 渲染任务
    arr.forEach(element => {
        if (element.successTime == 0) {
            let li = document.createElement('li');
            li.innerHTML = "<div class='leftPart'>" +
                "<p class='task'>" + element.aim + "</p>" +
                "<p class='theme'>" + element.mission + "</p>" +
                "</div>" +
                "<div class='state'></div>"; //未完成标志
            unfinished.appendChild(li);
        } else {
            let li = document.createElement('li');
            li.innerHTML = "<div class='leftPart'>" +
                "<p class='task'>" + element.aim + "</p>" +
                "<p class='theme'>" + element.mission + "</p>" +
                "</div>" +
                "<div class='duration'>" +
                "<span>运动时长：</span><span class='time'>" + element.successTime + "</span>" +
                "</div>"; //未完成标志
            finished.appendChild(li);
        }
    })
}

// 渲染房间的数据






// 健身板块 问答专区 start
//获取元素
const myself = document.querySelector('.myself');
const iconImg = myself.querySelector('.img'); //登录者的头像
const inputCase = myself.querySelector('.inputCase');
const ask_title = myself.querySelector('input'); //提问问题输入框
const ask_content = myself.querySelector('textarea'); //提问内容输入框
const btnPublic = myself.querySelector('.btnPublic'); //发布提问
//发布提问页面
const userQuestion = document.querySelector('.userQuestion'); //用户的提问
const questionCase = userQuestion.querySelector('.questionCase');
const moreQuestion = userQuestion.querySelector('.moreQuestion'); //点击展开更多评论
const userImg = userQuestion.querySelector('.userImg'); //用户头像
//回答问题区域
const answerTheQuestion = document.querySelector('.answerTheQuestion'); //回答问题区域
const questionTitle = answerTheQuestion.querySelector('.questionTitle'); //回答区域的提问标题
const questionBody = answerTheQuestion.querySelector('.questionBody'); //回答区域的提问内容
const writeArea = answerTheQuestion.querySelector('.writeArea'); //回答输入框
const publicYourAnswer = answerTheQuestion.querySelector('.publicYourAnswer'); //发布回答按钮
const btnClose = answerTheQuestion.querySelector('.close'); //关闭回答区域按钮
//随机提问回答区域
const replyRandomQuestion = document.querySelector('.replyRandomQuestion'); //随机提问的回答区域
const btnBack = replyRandomQuestion.querySelector('.btnBack'); //点击返回到发提问页面的按钮
const writeAnswer = replyRandomQuestion.querySelector('.writeAnswer'); //点击写答案
const randomQuestionTitle = replyRandomQuestion.querySelector('.randomQuestionTitle'); //随机提问的标题
const randomQuestionBody = replyRandomQuestion.querySelector('.randomQuestionBody'); //随机提问的内容
const randomReplyArea = replyRandomQuestion.querySelector('.randomReplyArea'); //一个提问对应多条回答区域


//点击输入框,输入框拉伸
inputCase.addEventListener('click', (e) => {
    e.stopPropagation(); //阻止冒泡 
    inputCase.style.height = 144 + 'px'
});
//点击空白处缩小输入框
document.addEventListener('click', (e) => {
    inputCase.style.height = 50 + 'px';
})

//调用输入框点击清空，回车填入函数
inputFocus(ask_title);

//调用接口获取用户信息
ajax({
    url: "http://localhost:8080/team_project/user/userExist", // url---->地址
    type: "GET", // type ---> 请求方式
    async: true, // async----> 同步：false，异步：true 
    data: {}, //传入信息
    success: function(result) { //返回接受信息
        if (result.message == 1) {
            let iconMark = result.data.user.iconMark;
            //调用获取个人头像函数
            getMyIconByMark(iconMark, iconImg);
            getMyIconByMark(iconMark, userImg);
        }
    },
    error: function(error) {
        console.log(error);
    }
});



//获取用户发过的所有问题
getUserMessage();

function getUserMessage() {
    ajax({
        url: "http://localhost:8080/team_project/sport/userQuestions", // url---->地址
        type: "GET", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {}, //传入信息
        success: function(result) { //返回接受信息
            questionCase.innerHTML = ''; //清楚上一次的内容
            for (let i = 0; i < result.data.questionsWithAnswers.length; i++) {
                //调用获取用户提问内容函数
                getUserAll(result.data.questionsWithAnswers[i].question.title, result.data.questionsWithAnswers[i].question.body, questionCase, result.data.questionsWithAnswers[i].answers.length);
            }
            //调用判断是否显示用户问答区函数
            judgeShowUserQuestion(questionCase, result.data.questionsWithAnswers.length);

            //获取点击回答按钮
            const userQuestionCount = document.querySelectorAll('.userQuestionCount');
            for (let i = 0; i < userQuestionCount.length; i++) {
                userQuestionCount[i].addEventListener('click', () => {
                    let index = result.data.questionsWithAnswers.length - i - 1;
                    //点击回答按钮显示回答区域
                    replyRandomQuestion.style.visibility = 'visible';
                    replyRandomQuestion.style.opacity = 1;
                    writeAnswer.style.display = 'none'; //隐藏写回答按钮
                    let question = result.data.questionsWithAnswers[index].question.question; //问题的id,唯一标识
                    //调用根据提问的id来获取该提问的相关内容函数
                    getAllReply(question, randomQuestionTitle, randomQuestionBody, randomReplyArea);
                })
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
}


//点击发布按钮，发布你的问题
btnPublic.addEventListener('click', () => {
    let title = ask_title.value;
    let body;
    if (ask_content.value != '') {
        body = ask_content.value;
    } else {
        body = '';
    }
    inputCase.style.height = 50 + 'px';
    //清楚提问和提问更多说明的内容
    ask_title.value = '';
    ask_content.value = '';
    //调用发布提问接口
    ajax({
        url: "http://localhost:8080/team_project/sport/releaseQuestion", // url---->地址
        type: "POST", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "title": title,
            "body": body
        }, //传入信息
        success: function(result) { //返回接受信息
            //调用获取用户提问内容函数
            getUserAll(result.data.question.title, result.data.question.body, questionCase, 0);

            getUserMessage();

        },
        error: function(error) {
            console.log(error);
        }
    });
})

//封装获取用户提问内容函数
function getUserAll(title, body, questionCase, length) {
    let div = document.createElement('div');
    let str = '';
    str += '<div class="question">' + title + '</div>';
    str += '<div class="describeQuestion"><p>' + body + '</p></div>';
    str += '<div class="userQuestionCount">';
    str += '    <span>回答</span><span>(' + length + ')</span>';
    str += '</div>';
    div.innerHTML = str;
    div.className = 'questionArea';
    questionCase.insertBefore(div, questionCase.children[0]);
}


//判断是否显示用户问答区
function judgeShowUserQuestion(questionCase, length) {
    if (length == 0) {
        userQuestion.style.display = 'none'; //隐藏用户问答区
    } else {
        userQuestion.style.display = 'block'; //显示用户问答区
        for (let i = 0; i < questionCase.children.length; i++) {
            questionCase.children[i].style.display = 'none';
        }
        questionCase.children[0].style.display = 'block';

        let flag = false;
        //点击更多提问,显示当前登录用户的全部问答
        moreQuestion.addEventListener('click', () => {
            if (!flag) { //如果关闭,则打开
                for (let i = 0; i < questionCase.children.length; i++) {
                    questionCase.children[i].style.display = 'block';
                }
                flag = true;
            } else { //如果打开,则关闭
                for (let i = 0; i < questionCase.children.length; i++) {
                    questionCase.children[i].style.display = 'none';
                }
                questionCase.children[0].style.display = 'block';
                flag = false;
            }
        });
    }
}


//获取随机问答
const getRandomQuestion = document.querySelector('.getRandomQuestion');
getAllRandomQuestions();

function getAllRandomQuestions() {
    //调用获取随机问答接口
    ajax({
        url: "http://localhost:8080/team_project/sport/getQuestions", // url---->地址
        type: "POST", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "size": 6
        }, //传入信息
        success: function(result) { //返回接受信息
            getRandomQuestion.innerHTML = ''; //清空里面原先所以随即问答
            console.log(result);
            for (let i = 0; i < result.data.questionsWithAnswers.length; i++) {
                let str = '';
                str += '<div class="randomQuestion">';
                str += '    <div class="userImg"><img src="' + result.data.questionsWithAnswers[i].question.quizzer.iconUrl + '"/></div>';
                str += '    <h4><span>id:' + result.data.questionsWithAnswers[i].question.quizzer.id + '</span><span>的提问</span></h4>';
                str += '    <h5>期待着你的回答</h5>';
                str += '    <div class="questionCount">';
                str += '        <span>回答</span><span>(' + result.data.questionsWithAnswers[i].answers.length + ')</span>';
                str += '    </div>';
                str += '    <div class="writeAnAnswer">写回答</div>';
                str += '    <div class="question">' + result.data.questionsWithAnswers[i].question.title + '</div>';
                str += '    <div class="describeQuestion">';
                str += '        <p>' + result.data.questionsWithAnswers[i].question.body + '</p>';
                str += '    </div>';
                str += '    <div class="ask_underline"></div>';
                str += '</div>';
                getRandomQuestion.innerHTML += str;
            }

            const writeAnAnswer = document.querySelectorAll('.writeAnAnswer');
            for (let i = 0; i < writeAnAnswer.length; i++) {
                writeAnAnswer[i].addEventListener('click', () => {
                    //点击回答按钮显示回答区域
                    answerTheQuestion.style.visibility = 'visible';
                    answerTheQuestion.style.opacity = 1;
                    let question = result.data.questionsWithAnswers[i].question.question; //问题的id,唯一标识
                    //调用根据提问的id来获取该提问的相关内容函数
                    getQuestionById(question, questionTitle, questionBody, publicYourAnswer);

                })
            }


            const questionCount = document.querySelectorAll('.questionCount');
            for (let i = 0; i < questionCount.length; i++) {
                questionCount[i].addEventListener('click', () => {
                    //点击回答数按钮，显示随机提问的回答区域
                    replyRandomQuestion.style.visibility = 'visible';
                    replyRandomQuestion.style.opacity = 1;
                    writeAnswer.style.display = 'block'; //显示写回答按钮
                    let question = result.data.questionsWithAnswers[i].question.question; //问题的id,唯一标识
                    //调用根据用户提问的id来获取提问的相关内容函数
                    getAllReply(question, randomQuestionTitle, randomQuestionBody, randomReplyArea);

                    //在随机提问区域点击写回答则跳转到回答问题区域
                    writeAnswer.addEventListener('click', () => {
                        //显示回答问题区域
                        answerTheQuestion.style.visibility = 'visible';
                        answerTheQuestion.style.opacity = 1;
                        //隐藏获取随机问答区域
                        replyRandomQuestion.style.visibility = 'hidden';
                        replyRandomQuestion.style.opacity = 0;
                        //调用根据提问的id来获取该提问的相关内容函数
                        getQuestionById(question, questionTitle, questionBody, publicYourAnswer);
                    })
                })
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
}

//封装根据提问的id来获取该提问的相关内容函数
function getQuestionById(question, questionTitle, questionBody, publicYourAnswer) {
    //根据提问的id来获取该提问的相关内容
    ajax({
        url: "http://localhost:8080/team_project/sport/getQuestionById", // url---->地址
        type: "POST", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "question": question,
        }, //传入信息
        success: function(result) { //返回接受信息
            let title = result.data.question.title; //提问的标题
            let body = result.data.question.body; //提问的内容
            //将提问的相关数据渲染入html页面
            questionTitle.innerHTML = title;
            if (body != '') {
                questionBody.children[0].innerHTML = body;
            } else {
                questionBody.children[0].innerHTML = '暂时没有更多对上述提问的补充哦~';
            }

            //点击发布回答按钮,发布回答
            publicYourAnswer.addEventListener('click', (e) => {
                e.stopPropagation(); //阻止冒泡
                let content = writeArea.children[0].value;
                //调用发布回答接口
                replyQuestion(question, content);
                writeArea.children[0].value = ''; //清空内容输入框
                //关闭发布回答区域
                answerTheQuestion.style.visibility = 'hidden';
                answerTheQuestion.style.opacity = 0;
                //显示随机获取提问回答区域
                replyRandomQuestion.style.visibility = 'visible';
                replyRandomQuestion.style.opacity = 1;



            })
        },
        error: function(error) {
            console.log(error);
        }
    });

}

//封装发布回答的函数
function replyQuestion(question, body) {
    if (body != '') { //判断发布回答的内容不为空后发布回答
        //调用发布回答接口
        ajax({
            url: "http://localhost:8080/team_project/sport/replyQuestion", // url---->地址
            type: "POST", // type ---> 请求方式
            async: true, // async----> 同步：false，异步：true 
            data: {
                "question": question,
                "body": body
            }, //传入信息
            success: function(result) { //返回接受信息
                //调用根据用户提问的id来获取提问的相关内容函数
                getAllReply(question, randomQuestionTitle, randomQuestionBody, randomReplyArea);

            },
            error: function(error) {
                console.log(error);
            }
        });
    }

}


//封装根据提问的id来获取用户的提问以及多个回答函数
function getAllReply(question, randomQuestionTitle, randomQuestionBody, randomReplyArea) {
    ajax({
        url: "http://localhost:8080/team_project/sport/getQuestionById", // url---->地址
        type: "POST", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "question": question
        }, //传入信息
        success: function(result) { //返回接受信息
            let title = result.data.question.title; //提问的标题
            let body = result.data.question.body; //提问的内容
            //将提问的相关数据渲染入html页面
            randomQuestionTitle.innerHTML = title;
            if (body != '') {
                randomQuestionBody.innerHTML = body;
                randomReplyArea.style.top = 155 + 'px';
                randomReplyArea.style.maxHeight = 435 + 'px';
            } else {
                randomQuestionBody.innerHTML = '暂时没有更多对上述提问的补充哦~';
                randomReplyArea.style.top = 90 + 'px';
                randomReplyArea.style.maxHeight = 495 + 'px';
            }

            if (result.data.answers.length == 0) { //提问未收到回答
                let str = '<div class="noReplySnail"><div class="noReplyTip">暂时还没收到回答呢请耐心等待有缘人回答吧~</div></div>';
                randomReplyArea.innerHTML = str;
            } else { //提问已经收到回答，展示回答
                randomReplyArea.innerHTML = ''; //清空之前回信的全部内容
                for (let j = 0; j < result.data.answers.length; j++) {
                    let div = document.createElement('div');
                    let str = '';
                    str += '    <div class="pic"><img src="' + result.data.answers[j].replier.iconUrl + '"/></div>';
                    str += '    <h3><span>id:' + result.data.answers[j].replier.id + '</span><span>回答了这个问题</span></h3>';
                    str += '    <div class="replyContent">';
                    str += '        <p>' + result.data.answers[j].answer + '</p>';
                    str += '    </div>';
                    str += '    <div class="btnLike"><span>赞同</span><span>' + result.data.answers[j].likeCount + '</span></div>';
                    str += '    <div class="underline"></div>';
                    div.innerHTML = str;
                    div.className = 'randomReplyInsideCase';
                    randomReplyArea.insertBefore(div, randomReplyArea.children[0]);
                }
            }


            //获取点赞按钮
            const btnLike = document.querySelectorAll('.btnLike');
            for (let i = 0; i < btnLike.length; i++) {
                btnLike[i].addEventListener('click', () => {
                    let uuid = result.data.answers[i].uuid;
                    //调用添加，取消点赞回复接口
                    likeCount(uuid, btnLike[i]);

                })
            }
            //渲染点赞数到页面
            for (let i = 0; i < btnLike.length; i++) {
                let uuid = result.data.answers[i].uuid;
                //调用渲染点赞数接口
                judgeLike(uuid, btnLike[i]);
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
}

//封装点击添加、取消点赞函数
function likeCount(uuid, btnLike) {
    //判断是否点赞过评论
    ajax({
        url: "http://localhost:8080/team_project/sport/areLike", // url---->地址
        type: "POST", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "uuid": uuid
        }, //传入信息
        success: function(result) { //返回接受信息
            if (result.data.haveLike[0] == true) { //若已经点赞，则取消点赞
                //调用点赞回复函数
                removeLike(uuid, btnLike)
            }
            if (result.data.haveLike[0] == false) { //若没有点赞，则添加点赞
                //调用点赞回复函数
                addLike(uuid, btnLike)
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
}

//封装点赞函数
function addLike(uuid, btnLike) {
    ajax({
        url: "http://localhost:8080/team_project/sport/like", // url---->地址
        type: "POST", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "uuid": uuid
        }, //传入信息
        success: function(result) { //返回接受信息
            console.log(result);
            btnLike.children[1].innerHTML = result.data.likeCount;
        },
        error: function(error) {
            console.log(error);
        }
    });
}

//封装取消点赞函数
function removeLike(uuid, btnLike) {
    ajax({
        url: "http://localhost:8080/team_project/sport/removeLike", // url---->地址
        type: "POST", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "uuid": uuid
        }, //传入信息
        success: function(result) { //返回接受信息
            btnLike.children[1].innerHTML = result.data.likeCount;
        },
        error: function(error) {
            console.log(error);
        }
    });
}

//判断是否给回复点赞，渲染点赞的数据
function judgeLike(uuid, btnLike) {
    //判断是否点赞过评论
    ajax({
        url: "http://localhost:8080/team_project/sport/likeCount", // url---->地址
        type: "POST", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "uuid": uuid
        }, //传入信息
        success: function(result) { //返回接受信息
            btnLike.children[1].innerHTML = result.data.likeCount[0];
        },
        error: function(error) {
            console.log(error);
        }
    });

}


//点击关闭按钮,关闭回答区域
btnClose.addEventListener('click', () => {
    answerTheQuestion.style.visibility = 'hidden';
    answerTheQuestion.style.opacity = 0;
    getAllRandomQuestions();
});

//点击返回按钮，返回到发布提问区域
btnBack.addEventListener('click', () => {
    replyRandomQuestion.style.visibility = 'hidden';
    replyRandomQuestion.style.opacity = 0;
    getAllRandomQuestions();
});

// 健身板块 问答专区 end