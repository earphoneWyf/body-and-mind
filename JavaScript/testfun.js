// 封装请求数据函数
// 需要使用的变量
var tabUL = document.querySelector('.tab>ul')
var foodUL = document.querySelector('.content .diet-frame ul .list1');
var detail = document.querySelector('.details .inner');
var value = document.querySelectorAll('#value span');
var flag = true;
var nav;
window.addEventListener('load', function() {
    ajax({
        url: 'http://localhost:8080/team_project/food/getOneType',
        type: 'GET',
        async: true,
        data: {},
        success: function(resp) {
            // console.log(resp.data.foods);
            for (let i = 0; i < resp.data.foods.length; i++) {
                let li = document.createElement('li');
                li.innerHTML = "<div class='img'>" +
                    "<img src='../Images/food/米饭.jpg'>" +
                    '</div><div class="brief">' +
                    '<h5 class="name">' + resp.data.foods[i].foodName + '</h5>' +
                    '<p>热量: <b>' + parseInt(resp.data.foods[i].energy) + '</b>千卡/100克</p>' +
                    '<p>脂肪: <span class="petname">' + resp.data.foods[i].fat + '</span></p></div>';
                foodUL.style.width = 232 * resp.data.foods.length + 'px';
                foodUL.appendChild(li);


            }

            // 默认显示
            // 详情介绍
            detail.querySelector('.name span').innerHTML = resp.data.foods[0].foodName
            detail.querySelector('.heat span').innerHTML = +parseInt(resp.data.foods[0].energy) + '千卡 （ 每[100g]可食部）';
            //营养项目
            value[0].innerHTML = resp.data.foods[0].energy;
            value[1].innerHTML = resp.data.foods[0].fat;
            value[2].innerHTML = resp.data.foods[0].protein;
            value[3].innerHTML = resp.data.foods[0].cho
            value[4].innerHTML = resp.data.foods[0].dietaryFiber
                // 显示具体详情
                // showDetail()
            let dataLI = document.querySelectorAll('.diet-frame ul .list1 li');
            showDetail(dataLI, resp.data.foods)

        },
        error: function(error) {
            console.log(error);
        }
    })



    firstNav();
    // 渲染一级大类与二级类并获取二级类ID
    function firstNav() {

        ajax({
            url: 'http://localhost:8080/team_project/food/allGroup',
            type: 'GET',
            async: true,
            data: {},
            success: function(resp) {
                for (let i = 0; i < resp.data.groups.length; i++) {
                    var Li = document.createElement('li');

                    // 大分类名称
                    Li.innerHTML = '<span>' + resp.data.groups[i].group + '</span>';
                    tabUL.appendChild(Li);
                    Li.classList.remove('active')
                    let ul = document.createElement('ul');
                    ul.classList.add('dropnav');
                    Li.appendChild(ul);
                    // nav[0].click();
                    Li.addEventListener('click', function(event) {
                            event = event || window.event;
                            window.event.cancelBubbl = true
                                // 显示大类名称
                                // nav[0].click();
                            ClassName = resp.data.groups[i].group;
                            const title = document.querySelector('.content h1');
                            const classify = document.querySelector('.classify span');
                            title.innerHTML = ClassName
                            classify.innerHTML = ClassName;
                            // nav[0].click();
                        })
                        // 渲染二级分类
                    for (let j = 0; j < resp.data.groups[i].detailed.length; j++) {
                        let li = document.createElement('li');
                        li.innerHTML = '<span>' + resp.data.groups[i].detailed[j].typeName + '</span>';
                        ul.appendChild(li);
                        li.setAttribute("data-id", resp.data.groups[i].detailed[j].id)
                        li.index = resp.data.groups[i].detailed[j].id
                    }
                }
                secondNav(Li.querySelectorAll('li')[0])
                nav = document.querySelectorAll('.tab>ul>li');
                for (let i = 0; i < nav.length; i++) {
                    nav[i].index = i;
                    // document.addEventListener('click',(event)=>{
                    nav[i].addEventListener('click', function(event) {
                        console.log('ooo');
                        event = event || window.event;
                        window.event.cancelBubbl = true
                            // for(let j=0;j<nav.length;j++){
                            //     nav[j].classList.remove('active')
                            // }
                            //默认调用第一类
                        this.querySelectorAll('li')[0].click();
                        this.classList.add('active')
                        window.event.stopPropagation();
                        nav[i].cancelBubble = true;
                    })

                    // })
                }
                // console.log(jjj);
                // 这个地方可以获取

                var dropli = document.querySelectorAll('.dropnav li')
                for (let i = 0; i < dropli.length; i++) {
                    secondNav(dropli[i])
                }
                // 点击绑定

            },
            error: function(error) {
                console.log(error);
            }
        })

    }

})

document.body.addEventListener('click', (event) => {
    event = event || window.event;
    event.cancelBubble = true;
})


// 一级导航添加交互样式


// .addEventListener('click',function(event){
// event = event || window.event;
// event=event||window.event;
// event.cancelBubbl=true
// })
document.body.addEventListener('click', () => {
    for (let j = 0; j < nav.length; j++) {
        nav[j].classList.remove('active')
    }
})


// 二级导航发送请求
function secondNav(list) {
    // for(let i=0;i<list.length;i++){
    list.addEventListener('click', function(event) {
            // 防止冒泡
            // window.event.stopPropagation();
            // list.cancelBubble=true;

            foodUL.style.left = 0;
            // event=event||window.event;
            // event.cancelBubbl=true
            ajax({
                url: 'http://localhost:8080/team_project/food/getFoods',
                type: 'GET',
                async: true,
                data: {
                    'detailedId': list.index
                },
                success: function(resp) {
                    // console.log(resp);

                    // 渲染具体排列显示
                    // 删掉原有的子元素
                    if (foodUL.childNodes.length != 0) {
                        foodUL.innerHTML = '';
                    }
                    // 动态生成
                    for (let k = 0; k < resp.data.foods.length; k++) {
                        // console.log(resp.data.foods);
                        let li = document.createElement('li');
                        li.innerHTML = "<div class='img'>" +
                            "<img src='../Images/food/米饭.jpg'>" +
                            '</div><div class="brief">' +
                            '<h5 class="name">' + resp.data.foods[k].foodName + '</h5>' +
                            '<p>热量: <b>' + parseInt(resp.data.foods[k].energy) + '</b>千卡/100克</p>' +
                            '<p>脂肪: <span class="petname">' + resp.data.foods[k].fat + '</span></p></div>';
                        foodUL.style.width = 232 * resp.data.foods.length + 'px';
                        foodUL.appendChild(li);
                    }

                    // 生成后进行绑定
                    // 这个是每一二类的具体食物
                    // 会动态改变
                    let diet = document.querySelectorAll('.diet-frame li');
                    // console.log();
                    showDetail(diet, resp.data.foods)
                        // 默认显示第一项
                        // diet[0].click();

                    detail.querySelector('.name span').innerHTML = resp.data.foods[0].foodName
                    detail.querySelector('.heat span').innerHTML = +parseInt(resp.data.foods[0].energy) + '千卡 （ 每[100g]可食部）';
                    //营养项目
                    value[0].innerHTML = resp.data.foods[0].energy;
                    value[1].innerHTML = resp.data.foods[0].fat;
                    value[2].innerHTML = resp.data.foods[0].protein;
                    value[3].innerHTML = resp.data.foods[0].cho
                    value[4].innerHTML = resp.data.foods[0].dietaryFiber

                },
                error: function(error) {
                    console.log(error);
                }
            })

        })
        // }
}

// 具体详情数据显示
function showDetail(list, datalist) {
    for (let i = 0; i < list.length; i++) {
        list[i].addEventListener('click', function() {
            console.log(datalist);
            // 详情介绍
            detail.querySelector('img').src = datalist[i].iconUrl;
            detail.querySelector('.name span').innerHTML = datalist[i].foodName
            detail.querySelector('.heat span').innerHTML = +parseInt(datalist[i].energy) + '千卡 （ 每[100g]可食部）';
            //营养项目
            value[0].innerHTML = datalist[i].energy;
            value[1].innerHTML = datalist[i].fat;
            value[2].innerHTML = datalist[i].protein;
            value[3].innerHTML = datalist[i].cho
            value[4].innerHTML = datalist[i].dietaryFiber

        })
    }
}


















let guideStep = 1110;
var FValue = foodUL.offsetWidth - guideStep;

const button = document.querySelectorAll('button');
// btn[0].addEventListener('click',()=>{
//     console.log('jud');
//     if (foodUL.offsetLeft >= 0) {
//         foodUL.style.left = 0;
//         btn[0].disabled = true;
//     }else{
//         btn[0].disabled = false;
//     }
// })
// btn[1].addEventListener('click',()=>{
//     if (foodUL.offsetLeft <= FValue) {
//         foodUL.style.left = FValue+"px";
//         btn[1].disabled = true;
//     }else{
//         btn[1].disabled = false;
//     }
// })



var newLeft, guidePre, guideAft;
let timerL, timerR;

// 封装切换滚动
function guideArrow(obj, timer, callback) {
    obj.addEventListener("click", () => {

        if (flag) {
            console.log('click');
            clearInterval(timer)
            flag = false;

            newLeft = foodUL.offsetLeft;
            console.log(newLeft);
            guidePre = newLeft + guideStep;
            guideAft = newLeft - guideStep;
            if (callback) {
                callback && callback();
            }
            timer = setInterval(() => { flag = true; }, 70)
        }
    })
}

guideArrow(button[0], timerL, function() {
    if (guidePre > 0) {
        guidePre = 0;
    }
    moving(foodUL, "left", guidePre, 30)
})
guideArrow(button[1], timerR, function() {
    // if(guideAft<)
    moving(foodUL, "left", guideAft, -30);
})