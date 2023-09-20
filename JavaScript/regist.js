window.addEventListener('load', () => {

    //封装点击左右移动函数
    function move(left, right, element, count) { //left和right 分别为左右按钮，count为elementli移动的个数
        let num = 0;
        let width = element.children[0].offsetWidth + 20; //li的宽度加上margin值
        left.addEventListener('click', () => {
            num = num - count;
            if (num <= 0) { //element到达最左边
                num = 0;
            }
            animate(element, -num * width);
        });
        right.addEventListener('click', () => {
            num = num + count;
            if (num >= element.children.length - count) { //element到达最右边
                num = element.children.length - count;
            }
            animate(element, -num * width);
        })
    }

    //获取元素
    const headshot = document.querySelector('.headshot');
    const ul = headshot.querySelector('ul');
    const btn_left = document.querySelector('.btn_left');
    const btn_right = document.querySelector('.btn_right');

    //调用点击左右移动函数
    move(btn_left, btn_right, ul, 4);



    //获取元素
    const registRight = document.querySelector('.regist_right')
    const input = document.querySelectorAll('input');
    const i = registRight.querySelectorAll('i');
    //调用隐藏显示密码函数
    showAndHidden(input[0], input[1], i[0], '密码');
    showAndHidden(input[2], input[3], i[1], '请重复上面密码');


    //将帐号头像渲染到html页面
    ajax({
        url: "http://localhost:8080/team_project/icon/getAll", // url---->地址
        type: "GET", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {}, //传入信息
        success: function(result) { //返回接受信息
            for (let i = 0; i < ul.children.length; i++) {
                const img = document.createElement('img');
                img.src = result.data.icons[i].iconUrl;
                ul.children[i].appendChild(img);
            }
        },
        error: function(error) {
            console.log(error);
        }
    });



    //封装选中头像改变背景函数
    function changeBackground(obj) { //obj为图片li外框ul
        for (let i = 0; i < obj.children.length; i++) {
            obj.children[i].addEventListener('click', () => {
                for (let j = 0; j < obj.children.length; j++) {
                    obj.children[j].style.backgroundColor = '#FFFFFF'; //未选中的头像背景仍未空白
                    obj.children[j].children[0].style.transform = 'translate(-50%, -50%) scale(1)';
                }
                obj.children[i].style.backgroundColor = 'rgb(134, 216, 251)'; //选中的头像背景改变
                obj.children[i].children[0].style.transform = 'translate(-50%, -50%) scale(1.3)';
            });
        }

    }
    //调用选中头像改变背景函数
    changeBackground(ul);



    //封装获取用户头像索引函数
    let img_iconMark; //存储点击选中图片的索引
    function getIconMark(obj) {
        for (let i = 0; i < obj.children.length; i++) {
            if (obj.children[i].style.backgroundColor == 'rgb(134, 216, 251)') { //若头像为选中的头像
                img_iconMark = i + 1; //则索引加一
                return img_iconMark;
            }
        }
    }



    //获取一键生成账号按钮
    const btn_regist = document.querySelector('.generate_account');
    const passwordTip = document.querySelector('.passwordTip');
    //点击键生成账号按钮注册帐号
    btn_regist.addEventListener('click', () => {
        let password_value = input[0].value; //第一次输入的密码
        let password_repeat_value = input[2].value; //第二次输入的密码
        if (password_value == password_repeat_value) {
            passwordTip.innerHTML = '';
            //调用Ajax注册函数
            ajax({
                url: "http://localhost:8080/team_project/user/signIn", // url---->地址
                type: "POST", // type ---> 请求方式
                async: true, // async----> 同步：false，异步：true 
                data: {
                    "password": password_value,
                    "iconMark": getIconMark(ul),
                }, //传入信息
                success: function(result) { //返回接受信息
                    if (result.data == null) {
                        passwordTip.innerHTML = '未选择头像或密码为空';
                    } else {
                        window.location.href = '../HTML/SignIn.html?' + result.data.id + password_value; //传id和password的值到注册页面2            
                    }
                },
                error: function(error) {
                    console.log(error);
                }
            });
        } else {
            passwordTip.innerHTML = '请输入相同的密码';
        }

    })
})