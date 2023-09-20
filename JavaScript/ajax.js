window.onload = function() {
    // 首页显示用户信息
    const user_id = document.querySelector('.dropnav #id p');
    const logoff = document.getElementById('logoff');
    const loginBox = document.querySelector('.loginBox');
    const island = document.querySelector('header .island');

    ajax({
        url: "http://localhost:8080/team_project/user/userExist",
        type: "GET",
        async: true,
        data: {},
        success: function(resp) {

            console.log(resp);
            //已登录 
            if (resp.message == '1') {

                loginBox.classList.add('Login');
                // 显示用户信息、
                user_id.innerHTML = "ID:" + resp.data.user.id;
                let iconMark = resp.data.user.iconMark;
                sessionStorage.setItem('id', resp.data.user.id);
                sessionStorage.setItem('password', resp.data.user.password)
                    // 用户登录头像
                    // 退出登录

                ajax({
                    url: "http://localhost:8080/team_project/icon/getIcon",
                    type: "GET",
                    async: true,
                    data: {
                        "iconMark": iconMark,
                    },
                    success: function(resp) {
                        const user_image = document.querySelector('.loginBox img');
                        user_image.src = resp.data.icon.iconUrl;
                        // 退出登录
                    },
                    error: function(error) {
                        console.log(error);
                    }
                })
            } else { //未登录
                loginBox.classList.remove('Login');
            }

        }
    });

    // 退出登录
    logoff.addEventListener('click', () => {
        loginBox.classList.remove('Login');
        ajax({
            url: "http://localhost:8080/team_project/user/logoff",
            type: "GET",
            async: true,
            success: function() {
                logoff.addEventListener('click', () => {
                    console.log("退出登录");
                    user_id.innerHTML = '';
                })
            },
            error: function(error) {
                console.log(error);
            }
        })
    });


    // 饮食数据接口
    ajax({
        url: 'http://localhost:8080/team_project/food/allGroup',
        type: 'GET',
        async: true,
        data: {},
        success: function(resp) {
            // 首页分类
            const Class = document.querySelectorAll('.part3 .page1>div');
            //    console.log(Class);
            console.log(Class.length);
            for (let i = 0; i < Class.length; i++) {
                Class[i].querySelector('p').innerHTML = resp.data.groups[i].group;
            }

        },
        error: function(error) {
            console.log(error);
        }
    })
}





//1.封装Ajax函数
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


// 退出登录