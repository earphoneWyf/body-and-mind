//封装隐藏,显示密码函数
function showAndHidden(text, password, eye, value) {
    //点击眼睛判断显示或隐藏
    eye.addEventListener('click', () => {
        if (eye.className == 'input_off') { //若为隐藏，则改为显示
            eye.className = 'input_look';
            if (text.style.display != 'block') { //判断文本密码框是否为显示
                text.value = password.value;
                text.style.display = 'block';
                password.style.display = 'none';
            }

        } else { //若为显示，则改为隐藏
            eye.className = 'input_off';
            if (text.style.display == 'block') { //判断文本密码框是否为显示
                password.value = text.value;
                text.style.display = 'none';
                password.style.display = 'block';
            }
        }
    });

    //文本密码框聚焦
    text.addEventListener('focus', () => {
        if (eye.className == 'input_off') { //若眼睛为隐藏状态
            text.style.display = 'none';
            password.style.display = 'block';
            password.focus();
        } else { //若眼睛为显示状态
            text.style.display = 'block';
            text.focus();
            text.value = '';
        }

    });
    //文本密码框失焦
    text.addEventListener('blur', () => {
        if (eye.className == 'input_look') { //若眼睛为显示状态
            if (text.value != '') {
                text.value = text.value;
                text.style.value = 'block';
                password.style.value = 'none';
            } else {
                text.value = value;
                text.style.display = 'block';
                password.style.display = 'none';
            }
        }
    });
    //加密密码框失焦
    password.addEventListener('blur', () => {
        if (eye.className == 'input_off') { //若眼睛为隐藏状态
            if (password.value == '') {
                text.value = value;
                text.style.display = 'block';
                password.style.display = 'none';
            } else {
                text.value = password.value;
                text.style.display = 'none';
                password.style.display = 'block';
            }
        } else { //若眼睛为显示状态
            text.style.display = 'block';
            password.style.display = 'none';
        }
    })


}



// 封装动画函数
function animate(obj, target, callback) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        let step = (target - obj.offsetLeft) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        if (obj.offsetLeft == target) {
            clearInterval(obj.timer);
            callback && callback();
        }
        obj.style.left = obj.offsetLeft + step + 'px';
    }, 20);
}

//封装点击显示，点击隐藏函数
function showAndHide(obj, element) { //obj为点击的元素，element为obj的子元素
    obj.addEventListener('click', (e) => {
        element.style.visibility == 'visible' ? element.style.visibility = 'hidden' : element.style.visibility = 'visible';
        element.style.opacity == 1 ? element.style.opacity = 0 : element.style.opacity = 1;
        element.onclick = function() { //阻止父元素事件传播
            window.event.cancelBubble = true;
        }
    })

}



//封装复选框点击选择函数
function checkBox(checkboxs) {
    checkboxs[0].style.fontSize = '18px';
    for (let i = 0; i < checkboxs.length; i++) {
        checkboxs[i].addEventListener('click', () => {
            for (let j = 0; j < checkboxs.length; j++) { //将所有按钮设置为空
                checkboxs[j].children[0].children[0].src = '../Images/checkbox_none.svg';
                checkboxs[j].style.fontSize = '16px';
            }
            //设置当前点中的复选框为选中状态
            checkboxs[i].children[0].children[0].src = '../Images/checkbox_selected.svg';
            checkboxs[i].style.fontSize = '18px';
        })
    }
}


//封装复选框点击选择函数
function selectType(checkboxs) {
    checkboxs[0].style.fontSize = '22px';
    for (let i = 0; i < checkboxs.length; i++) {
        checkboxs[i].addEventListener('click', () => {
            for (let j = 0; j < checkboxs.length; j++) { //将所有按钮设置为空
                checkboxs[j].children[0].children[0].src = '../Images/private.svg';
                checkboxs[j].style.fontSize = '20px';
            }
            //设置当前点中的复选框为选中状态
            checkboxs[i].children[0].children[0].src = '../Images/public.svg';
            checkboxs[i].style.fontSize = '22px';
        })
    }
}

//封装判断复选框为公开或私密
function judgeCheckbox(checkboxs) {
    if (checkboxs[0].style.fontSize == '18px' || checkboxs[0].style.fontSize == '22px') {
        return 1;
    }
    return 0;
}


//四舍五入保留2位小数（若第二位小数为0，则保留一位小数）  
function keepTwoDecimal(num) {
    var result = parseFloat(num);
    if (isNaN(result)) {
        alert('传递参数错误，请检查！');
        return false;
    }
    result = Math.round(num * 100) / 100;
    return result;
};


//封装获取个人头像函数
function getMyIconByMark(iconMark, iconImg) {
    ajax({
        url: "http://localhost:8080/team_project/icon/getIcon", // url---->地址
        type: "POST", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "iconMark": iconMark,
        }, //传入信息
        success: function(result) { //返回接受信息
            const img = document.createElement('img'); //创建img
            img.src = result.data.icon.iconUrl; //把图片地址赋值给src
            iconImg.appendChild(img);
        },
        error: function(error) {
            console.log(error);
        }
    });
}



//建岛之后将个人专属岛渲染到海域
function getIconByMark(island, iconMark) {
    ajax({
        url: "http://localhost:8080/team_project/island/getIconByMark", // url---->地址
        type: "POST", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "iconMark": iconMark,
        }, //传入信息
        success: function(result) { //返回接受信息
            const img = document.createElement('img'); //创建img
            img.src = result.data.icon.iconUrl; //把图片地址赋值给src
            island.appendChild(img);
        },
        error: function(error) {
            console.log(error);
        }
    });

}


//封装点击input框出现聚焦,回车失焦函数
function inputFocus(element) {
    let start; //存储input初始值
    element.addEventListener('focus', () => {
        start = element.value;
        element.value = '';
    });
    //input失焦，若value为空，则赋初始值，否之赋value的值
    element.addEventListener('blur', () => {
        element.value == '' ? element.value = start : element.value = element.value;
    });
    //按下回车键，若value为空，则赋初始值，否之赋value的值
    element.addEventListener('keydown', (e) => {
        if (e.keyCode == 13) {
            element.value == '' ? element.value = start : element.value = element.value;
            element.blur();
        }
    })
}


//封装点击选择，点击取消按钮函数
function btnSelect(btn, src1, src2, matching) {
    btn.addEventListener('click', () => {
        if (btn.children[0].src.match(matching)) { //判断图片是否选择
            btn.children[0].src = src2; //若已选，则改为未选
        } else {
            btn.children[0].src = src1; //若未选，则改为已选
        }
    })
}

//封装判断按钮是否选择函数
function judgeSelect(btn, matching) {
    if (btn.children[0].src.match(matching)) {
        return true; //选择返回1
    } else {
        return false; //未选返回0
    }

}


//封装点击下拉，上拉函数
function Toggle(btn_open, btn_close, element) {
    btn_open.addEventListener('click', () => {
        element.style.height = 100 + 'vh';
    });
    btn_close.addEventListener('click', () => {
        element.style.height = 0;
    })

}


//封装点击显示点击隐藏函数
function btnClick(element, another) {
    element.addEventListener('click', (e) => {
        e.stopPropagation();
        another.style.display == 'block' ? another.style.display = 'none' : another.style.display = 'block';
        another.onclick = function() { //阻止父元素事件传播
            window.event.cancelBubble = true;
        };
        //点击空白出关闭选择按钮
        document.addEventListener('click', () => {
            another.style.display = 'none';
        })
    });

}


//封装鼠标经过显示隐藏函数
function hover(btn, content) {
    btn.addEventListener('mouseover', () => {
        content.style.display = 'block'; //鼠标经过显示
    });
    btn.addEventListener('mouseout', () => {
        content.style.display = 'none'; //鼠标离开隐藏
    })

}

//封装判断按钮是否选择函数
function judgeSelect(btn) {
    if (btn.children[0].src.match('btn_choose')) {
        return true; //选择返回1
    } else {
        return false; //未选返回0
    }

}



//封装点击关注函数
function btnSelectConcern(btn, icon, id, people) {
    btn.addEventListener('click', () => {
        //调用判断是否关注函数
        ajax({
            url: "http://localhost:8080/team_project/island/hasMark", // url---->地址
            type: "POST", // type ---> 请求方式
            async: true, // async----> 同步：false，异步：true 
            data: {
                "islandId": id
            }, //传入信息
            success: function(result) { //返回接受信息
                console.log(result);
                if (result.data.hasMark == true) { //如果已经关注，则取消关注
                    ajax({
                        url: "http://localhost:8080/team_project/island/delMark", // url---->地址
                        type: "POST", // type ---> 请求方式
                        async: true, // async----> 同步：false，异步：true 
                        data: {
                            "islandId": id
                        }, //传入信息
                        success: function(result) { //返回接受信息
                            if (result.message == 'success') {
                                icon.children[0].src = '../Images/starToConcern.png';
                                btn.innerHTML = '+ 关注';
                                people.children[1].innerHTML = result.data.markCount;
                            }
                        }
                    });
                }
                if (result.data.hasMark == false) { //如果未关注，则关注
                    ajax({
                        url: "http://localhost:8080/team_project/island/mark", // url---->地址
                        type: "POST", // type ---> 请求方式
                        async: true, // async----> 同步：false，异步：true 
                        data: {
                            "islandId": id
                        }, //传入信息
                        success: function(result) { //返回接受信息
                            if (result.message == 'success') {
                                icon.children[0].src = '../Images/starToConcerned.png';
                                btn.innerHTML = '已关注';
                                people.children[1].innerHTML = result.data.markCount;
                            }
                        }
                    });
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    })
}



//封装判断是否关注函数
function judgeSelectConcern(btn, icon, id) {
    //调用判断是否关注岛主
    ajax({
        url: "http://localhost:8080/team_project/island/hasMark", // url---->地址
        type: "POST", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "islandId": id
        }, //传入信息
        success: function(result) { //返回接受信息
            console.log(result);
            if (result.data.hasMark == true) {
                icon.children[0].src = '../Images/starToConcerned.png';
                btn.innerHTML = '已关注';
            }
            if (result.data.hasMark == false) {
                icon.children[0].src = '../Images/starToConcern.png';
                btn.innerHTML = '+ 关注';
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
}



//封装点击点赞和取消点赞函数
function btnSelectLike(btn, icon, postId) {
    //调用判断是否点赞函数
    ajax({
        url: "http://localhost:8080/team_project/island/alreadyLikeOne", // url---->地址
        type: "POST", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "postId": postId
        }, //传入信息
        success: function(results) { //返回接受信息
            if (results.message == 'OK') {
                if (results.data.result == true) { //如果已经点赞，则取消点赞
                    ajax({
                        url: "http://localhost:8080/team_project/island/deleteLike", // url---->地址
                        type: "POST", // type ---> 请求方式
                        async: true, // async----> 同步：false，异步：true 
                        data: {
                            "postId": postId
                        }, //传入信息
                        success: function(results) { //返回接受信息
                            if (results.message == 'success') {
                                icon.innerHTML = results.data.likeCount;
                                btn.children[0].src = '../Images/hug.png';
                            }
                        }
                    });
                }
                if (results.data.result == false) { //如果未点赞，则点赞
                    ajax({
                        url: "http://localhost:8080/team_project/island/like", // url---->地址
                        type: "POST", // type ---> 请求方式
                        async: true, // async----> 同步：false，异步：true 
                        data: {
                            "postId": postId
                        }, //传入信息
                        success: function(results) { //返回接受信息
                            if (results.message == 'success') {
                                icon.innerHTML = results.data.likeCount;
                                btn.children[0].src = '../Images/btn_hugged.png';
                            }
                        }
                    });
                }
            }
        },
        error: function(error) {
            console.log(error);
        }
    });

}




//封装获取点赞数动态函数
function getLikeCount(btn, icon, postId) {
    //调用判断点赞该动态
    ajax({
        url: "http://localhost:8080/team_project/island/alreadyLikeOne", // url---->地址
        type: "POST", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "postId": postId
        }, //传入信息
        success: function(results) { //返回接受信息
            if (results.message == 'OK') {
                icon.innerHTML = results.data.likeCount;
                if (results.data.result == true) {
                    btn.children[0].src = '../Images/btn_hugged.png';
                }
                if (results.data.result == false) {
                    btn.children[0].src = '../Images/hug.png';
                }
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
}



//封装防抖函数
function Debounce(fn, delay, rightAway = false) { //rightAway 不传时 ，默认为非立即执行函数
    // 维护一个 timer
    let timer = null;
    return function() {
        // 获取函数的作用域和变量
        let context = this;
        let args = arguments;
        if (timer) clearTimeout(timer);
        if (rightAway) {
            var now = !timer;
            timer = setTimeout(() => {
                timer = null;
            }, delay);
            if (now) {
                fn.apply(context, args);
            }
        } else {
            timer = setTimeout(() => {
                fn.apply(context.args);
            }, delay);
        }
    }
}



//获取不重复随机数
function getRandom(count) {
    //原始数组
    let arr = new Array();
    //给原始数组original赋值
    for (let i = 0; i < count; i++) {
        arr[i] = i + 1;
    }
    //排序
    arr.sort(function() {
        return 0.5 - Math.random();
    });
    //输出
    for (let i = 0; i < count; i++) {
        document.write(arr[i] + " , ");
    }
}


//封装Ajax函数

function ajax(options) {
    let xhr = null;
    let params = formsParams(options.data);
    //创建对象
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // 连接
    if (options.type == "GET") {
        xhr.open(options.type, options.url + "?" + params, options.async);
        xhr.send(null)
    } else if (options.type == "POST") {
        xhr.open(options.type, options.url, options.async);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);
    }
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            options.success(JSON.parse(xhr.responseText));
        } else if (xhr.status !== 1 && xhr.status !== 200) {
            options.error(xhr.status);
        }
    }

    function formsParams(data) {
        let arr = [];
        for (let prop in data) {
            arr.push(prop + "=" + data[prop]);
        }
        return arr.join("&");
    }

}

let operator = "=";

function getCookieValue(keyStr) {
    let value = null;
    let s = window.document.cookie;
    let arr = s.split("; ");
    for (let i = 0; i < arr.length; i++) {
        let str = arr[i];
        let k = str.split(operator)[0];
        let v = str.split(operator)[1];
        if (k == keyStr) {
            value = v;
            break;
        }
    }
    return value;
}

function setCookieValue(key, value) {
    document.cookie = key + operator + value;

}