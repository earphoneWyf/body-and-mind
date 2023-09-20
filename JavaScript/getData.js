// 封装请求数据函数
// 需要使用的变量
var tabUL = document.querySelector('.tab>ul')
var foodUL = document.querySelector('.content .diet-frame ul .list1');
var detail = document.querySelector('.details .inner');
var value = document.querySelectorAll('#value span');
var flag = true;
const title = document.querySelector('.content h1');
var nav;
// 加载默认显示
window.addEventListener('load', function() {
    ajax({
        url: 'http://localhost:8080/team_project/food/getOneType',
        type: 'GET',
        async: true,
        data: {},
        success: function(resp) {
            // 渲染一级大类
            firstNav();
            // 渲染单个食物
            showData(resp.data.foods);
                // 显示具体详情
            let dataLI = document.querySelectorAll('.diet-frame ul .list1 li');
            showDetail(dataLI, resp.data.foods)
            dataLI[0].click();
        },
        error: function(error) {
            console.log(error);
        }
    })

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
                    Li.setAttribute('data-id',resp.data.groups[i].id)
                    Li.classList.remove('active')
                    let ul = document.createElement('ul');
                    ul.classList.add('dropnav');
                    Li.appendChild(ul);
                    // 点击大类效果
                    Li.addEventListener('click', function(event) {
                            // event = event || window.event;
                            // window.event.cancelBubbl = true;
                            // 显示大类名称
                            ClassName = resp.data.groups[i].group;
                            const classify = document.querySelector('.classify span');
                            title.innerHTML = ClassName
                            classify.innerHTML = ClassName;
                    });
                        // 渲染二级分类
                    for (let j = 0; j < resp.data.groups[i].detailed.length; j++) {
                        let li = document.createElement('li');
                        li.innerHTML = '<span>' + resp.data.groups[i].detailed[j].typeName + '</span>';
                        li.classList.add('type');//委托事件进行判定
                        ul.appendChild(li);
                        // 把你当小类id
                        li.setAttribute("data-id", resp.data.groups[i].detailed[j].id);
                        li.index = resp.data.groups[i].detailed[j].id
                    }
                }
                nav = document.querySelectorAll('.tab>ul>li');
                for (let i = 0; i < nav.length; i++) {
                    nav[i].index = i;
                    nav[i].addEventListener('click', function(event) {
                        window.event.stopPropagation();
                        nav[i].cancelBubble = true;
                        window.event.cancelBubbl = true;
                        //默认调用第一类
                        this.querySelectorAll('li')[0].click();
                        for (let j = 0; j < nav.length; j++) {
                            nav[j].classList.remove('active')
                        }
                        this.classList.add('active');
                        
                    })
                }

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


// 使用事件委托
// 一级导航添加交互样式

    // window.document.body.addEventListener('click',()=>{
    //     for(let i =0;i<nav.length;i++){
    //         nav[i].classList.remove('active');
    //     }
    // })

// 二级导航发送请求
function secondNav(list) {
        list.addEventListener('click', function(e) {
        e.stopPropagation();
            foodUL.style.left = 0;
            ajax({
                url: 'http://localhost:8080/team_project/food/getFoods',
                type: 'GET',
                async: true,
                data: {
                    'detailedId': list.index
                },
                success: function(resp) {
                    showData(resp.data.foods);
                    // 每一二类的具体食物
                    let diet = document.querySelectorAll('.diet-frame li');
                    showDetail(diet, resp.data.foods)
                        // 默认显示第一项
                    diet[0].click();
                },
                error: function(error) {
                    console.log(error);
                }
            })
    })
}

// 具体详情数据显示
function showDetail(list, datalist) {
    for (let i = 0; i < list.length; i++) {
        list[i].addEventListener('click', function() {
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

function showData (arr){
    if (foodUL.childNodes.length != 0) {
        foodUL.innerHTML = '';
    }

    arr.forEach(element => {
        let li = document.createElement('li');
        li.innerHTML = "<div class='img'>" +
                        "<img src='" + element.iconUrl + "'>" +
                        '</div><div class="brief">' +
                        '<h5 class="name">' +element.foodName + '</h5>' +
                        '<p>热量: <b>' + parseInt(element.energy) + '</b>千卡/100克</p>' +
                        '<p>脂肪: <span class="petname">' + element.fat + '</span></p></div>';
        foodUL.style.width = 232 * arr.length + 'px';
        foodUL.appendChild(li);
    });
}

const searchBtn = document.querySelector('#searchBtn');
// 点击进行关键词搜索
searchBtn.addEventListener('click',()=>{
    let searKey = document.querySelector('#searchIpt').value;
    ajax({
        url: 'http://localhost:8080/team_project/food/search',
        type: 'GET',
        async: true,
        data: {
            "kw":searKey
        },
        success: function(resp) {
            console.log(resp);
            // 渲染食物信息
            showData(resp.data.foods);
            console.log(resp.data.foods);
            let firstLi = document.querySelectorAll('.tab>ul>li');
            let dataLI = document.querySelectorAll('.diet-frame ul .list1 li');
            showDetail(dataLI, resp.data.foods);//点击显示每一个详情
            dataLI[0].click();
            dataLI.forEach((element,i) =>{
                element.addEventListener('click',function(){
                    // 点击显示大类信息
                    title.innerHTML = firstLi[resp.data.foods[i].groupId-1].querySelectorAll('span')[0].innerHTML;

                })
            })


        },error: function(error){
            console.log(error);
        }
    })
});




let guideStep = 1110;
var FValue = foodUL.offsetWidth - guideStep;
const button = document.querySelectorAll('button');
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
    moving(foodUL, "left", guideAft, -30);
})
