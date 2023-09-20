window.addEventListener('load', () => {
    var allLI = new Array();
    var ClassName;
    const detail = document.querySelector('.details .inner .right');
    const value = document.querySelectorAll('#value span');



    ajax({
        url: 'http://localhost:8080/team_project/food/allGroup',
        type: 'GET',
        async: true,
        data: {},
        success: function(resp) {
            let groupID;
            let classID;
            // let li ;
            const tabUL = document.querySelector('.tab>ul');
            // 渲染一级大类
            for (let i = 0; i < resp.data.groups.length; i++) {
                let Li = document.createElement('li');
                // 大分类名称
                Li.innerHTML = '<span>' + resp.data.groups[i].group + '</span>';
                tabUL.appendChild(Li);
                // Li.classList.remove('active')
                let ul = document.createElement('ul');
                ul.classList.add('dropnav');
                Li.appendChild(ul);
                // 点击一级类
                Li.addEventListener('click', () => {
                    // 保存大类名称
                    ClassName = resp.data.groups[i].group;
                    console.log(resp.data.groups[i].id);
                    // 默认显示
                    ajax({
                        url: 'http://localhost:8080/team_project/food/getFoods',
                        type: 'GET',
                        async: true,
                        data: {
                            'detailedId': (resp.data.groups[i].id)
                        },
                        success: function(resp) {
                            var foodUL = document.querySelector('.content .diet-frame ul .list1');
                            // 删掉原有的子元素
                            if (foodUL.childNodes.length != 0) {
                                foodUL.innerHTML = '';
                            }
                            //渲染具体食物
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

                                // console.log(resp.data.foods[k]);
                                // allLI = document.querySelectorAll('.diet-frame li')
                                // console.log(allLI);
                            }
                            console.log(resp);
                        },
                        error: function(error) {
                            console.log(error);
                        }
                    })

                })

                // 渲染二级类
                for (let j = 0; j < resp.data.groups[i].detailed.length; j++) {

                    li = document.createElement('li');
                    li.innerHTML = '<span>' + resp.data.groups[i].detailed[j].typeName + '</span>';
                    ul.appendChild(li);
                    li.setAttribute("data-id", resp.data.groups[i].detailed[j].id)
                    li.index = resp.data.groups[i].detailed[j].id

                    // 点击二级类
                    li.addEventListener('click', function() {
                        classID = this.index;
                        // console.log(this);
                        ajax({
                            url: 'http://localhost:8080/team_project/food/getFoods',
                            type: 'GET',
                            async: true,
                            data: {
                                'detailedId': classID
                            },
                            success: function(resp) {
                                // console.log(resp);
                                var foodUL = document.querySelector('.content .diet-frame ul .list1');
                                // 删掉原有的子元素
                                if (foodUL.childNodes.length != 0) {
                                    foodUL.innerHTML = '';
                                }
                                //渲染具体食物
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

                                    // console.log(resp.data.foods[k]);
                                    // allLI = document.querySelectorAll('.diet-frame li')
                                    // console.log(allLI);
                                }
                                // console.log(document.querySelectorAll('.diet-frame li'));
                                allLI = document.querySelectorAll('.diet-frame li')
                                for (let k = 0; k < allLI.length; k++) {

                                    allLI.index = k;
                                    allLI[k].addEventListener('click', function() {
                                        // console.log(resp.data.foods[k]);
                                        // const detail = document.querySelector('.details .inner .right');
                                        detail.querySelector('.name span').innerHTML = resp.data.foods[k].foodName
                                        detail.querySelector('.heat span').innerHTML = +parseInt(resp.data.foods[k].energy) + '千卡 （ 每[100g]可食部）';
                                        // detail.querySelector('.classCify span').innerHTML = ClassName;
                                        // 营养项目
                                        // const value = document.querySelectorAll('#value span');
                                        value[0].innerHTML = resp.data.foods[k].energy;
                                        value[1].innerHTML = '';
                                        value[2].innerHTML = resp.data.foods[k].protein;
                                        value[3].innerHTML = resp.data.foods[k].cho
                                        value[4].innerHTML = resp.data.foods[k].dietaryFiber
                                    })
                                }
                            },
                            error: function(error) {
                                console.log(error);
                            }
                        })
                    })
                    console.log(allLI.length);
                    // const allLI = document.querySelectorAll('.diet-frame li');
                    console.log();
                }
            }
            const NavLi = document.querySelectorAll('.tab>ul>li');
            for (let i = 0; i < NavLi.length; i++) {
                NavLi[i].index = i;
                NavLi[i].addEventListener('click', function() {
                    for (let j = 0; j < NavLi.length; j++) {
                        NavLi[j].classList.remove('active')
                    }
                    NavLi[this.index].classList.add('active')
                    console.log(ClassName);
                    // document.querySelector('.classCify span').innerHTML = ClassName;
                    // detail.querySelector('.classCify span').innerHTML = ClassName;
                    // console.log(document.querySelector('.classCify span'));
                    const classify = document.querySelector('.classify span');
                    classify.innerHTML = ClassName;
                })
            }
            // console.log();
            // classLI = document.querySelectorAll('.tab .dropnav li');
            // console.log(classLI.length);
            // for(let i=0;i<classID.length;i++){
            //     console.log(classLI[i].getAttribute('data-id'));
            // }


            // console.log(classID);
            // 渲染二级类
        },
        error: function(error) {

        }
    })
})