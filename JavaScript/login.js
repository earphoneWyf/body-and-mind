window.addEventListener('load', () => {

    //封装点击帐号输入框判断函数
    function account_judge(input_account) {
        input_account.addEventListener('click', () => {
            if (input_account.value == '') { //输入帐号为空
                input_account.focus();
            } else { //输入帐号不为空
                if (input_account.value != '帐号') { //如果值为"帐号"
                    input_account.value = input_account.value;
                } else if (input_account.value == '帐号') { //如果不值为"帐号"
                    input_account.value = '';
                }
                input_account.focus();
            }
        });
        //帐号输入框失焦
        input_account.addEventListener('blur', () => {
            if (input_account.value == '') { //若值为空,则赋值为"帐号"
                input_account.value = '帐号';
            } else { //若值不为空,则将值赋值到输入框中
                input_account.value = input_account.value;
            }
        });
    }
    //获取帐号文本框元素
    const input_account = document.querySelector('.input_account');
    //调用点击帐号输入框判断函数
    account_judge(input_account);



    //获取元素
    const input_case = document.querySelector('.password');
    const input = input_case.querySelector('.input');
    const input_password = input_case.querySelector('.input_password');
    const eye = input_case.querySelector('i');
    //获取注册页面传递过来的帐号和密码
    let id = window.location.search.substring(1, 8);
    let password = window.location.search.substring(8);
    if (id != '' && password != '') {
        input_account.value = id;
        input_password.value = password;
        input.value = password;
        input_password.style.display = 'block';
        input.style.display = 'none';

    }
    //调用隐藏,显示密码函数
    showAndHidden(input, input_password, eye, '密码');

    //获取点击登录按钮
    //获取自动登录元素
    const auto_login = document.querySelector('.autoLogin');
    const checkBox = auto_login.querySelector('input');
    const btn_login = document.querySelector('.btn_login');
    const loginTip = document.querySelector('.loginTip');
    //点击按钮登录
    btn_login.addEventListener('click', () => {
        goToIndex();
    });
    //回车登录
    document.addEventListener('keyup', (event) => {
        if (event.key == 'Enter') {
            goToIndex();
        }
    })

    function goToIndex() {
        let id_value = input_account.value; //帐号
        let password_value = input.value; //密码
        let login_judge = loginJudge(checkBox); //是否允许自动登录
        //调用Ajax登录函数
        ajax({
            url: "http://localhost:8080/team_project/user/login", // url---->地址
            type: "POST", // type ---> 请求方式
            async: true, // async----> 同步：false，异步：true 
            data: {
                "id": id_value,
                "password": password_value,
                "autoLogin": login_judge
            }, //传入信息
            success: function(result) { //返回接受信息
                if (result.message == 'error') {
                    loginTip.innerHTML = '用户名或密码为空';
                }
                if (result.message == 'loginError') {
                    loginTip.innerHTML = '用户名或密码错误';
                }
                if (result.message == 'OK') {
                    loginTip.innerHTML = '';
                    location.href = '../HTML/index.html';
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    //封装点击勾选、取消自动登录函数
    function autoLogin(obj, input) { //input为复选框,obj为自动登录按钮
        obj.addEventListener('click', () => {
            input.checked == true ? input.checked = false : input.checked = true;
        });
        input.addEventListener('click', () => {
            input.checked == true ? input.checked = false : input.checked = true;
        })
    }
    //调用点击勾选、取消自动登录函数
    autoLogin(auto_login, checkBox);

    function loginJudge(input) { //input为自动登录复选框
        if (input.checked == true) {
            return true; //勾选自动登录
        } else {
            return false; //取消自动登录
        }
    }



    //封装忘记密码函数
    function forgetPassword(element) { //element为忘记密码？按钮
        element.addEventListener('click', () => {
            alert('忘记密码');
        })

    }
    //获取忘记密码按钮元素
    const forget_password = document.querySelector('.forgetPassword');
    //调用忘记密码函数
    forgetPassword(forget_password);



})