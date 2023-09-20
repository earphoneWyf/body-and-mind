window.addEventListener('load', () => {
    //获取男女性别复选框元素
    const sexCheckboxs = document.querySelectorAll('.sexCheckbox');
    //调用复选框点击选择函数
    checkBox(sexCheckboxs);



    //封装BMI计算器函数
    function calculator(btn, sexCheckboxs, height, weight, index, BMI_type) { //btn为计算按钮，sexCheckboxs为性别，height为身高，weight为体重，index为身体质量指数
        btn.addEventListener('click', () => {
            let sex = judgeCheckbox(sexCheckboxs); //性别，值1为男，0为女
            let h = parseInt(height.value); //身高
            let w = parseInt(weight.value); //体重
            let BMI = keepTwoDecimal(w / (h * h) * 10000); //BMI类型

            index.innerHTML = BMI;
            if (BMI < 18.5) {
                BMI_type.innerHTML = '轻体重';
            } else if (BMI >= 18.5 && BMI < 24) {
                BMI_type.innerHTML = '健康体重';
            } else if (BMI >= 24 && BMI < 28) {
                BMI_type.innerHTML = '超重';
            } else {
                BMI_type.innerHTML = '肥胖';
            }

        })
    }


    //获取点击计算按钮
    const btn_commpute = document.querySelector('.btn_compute');
    const calculate = document.querySelector('.calculator');
    // 获取身高，体重等元素
    const inputs = calculate.querySelectorAll('input');
    const Index = calculate.querySelector('.Index'); //index为身体质量指数
    const BMI_type = calculate.querySelector('.BMI_type'); //BMI_type为BMI类型
    //调用BMI计算器函数
    calculator(btn_commpute, sexCheckboxs, inputs[0], inputs[1], Index, BMI_type);


    //封装相关推荐的放大动画函数
    function scale(ul) {
        for (let i = 0; i < ul.children.length; i++) {
            ul.children[i].addEventListener('mouseover', () => {
                for (let j = 0; j < ul.children.length; j++) { //将所有li的宽高变为0
                    ul.children[j].style.width = 0;
                    ul.children[j].style.height = 0;
                }
                ul.children[i].style.width = 295 + 'px'; //将当前li的宽高变为295px
                ul.children[i].style.height = 295 + 'px';
            });
            ul.children[i].addEventListener('mouseout', () => {
                for (let j = 0; j < ul.children.length; j++) { //将所有的小li宽高变为140px
                    ul.children[j].style.width = 140 + 'px';
                    ul.children[j].style.height = 140 + 'px';
                }
            })
        }
    }
    //获取相关推荐元素
    const recommend = document.querySelector('.recommend');
    const ul = recommend.querySelector('ul');
    //调用相关推荐的放大动画函数
    scale(ul);


})