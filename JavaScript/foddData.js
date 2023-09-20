var liCount;
var foodUL = document.querySelector('.content .diet-frame ul .list1');
// 饮食数据接口
ajax({
    url:'http://175.178.7.180:8080/team_project/food/allGroup',
    type:'GET',
    async:true,
    data:{},
    success:function(resp){
        // 首页分类
        const NavLi = document.querySelectorAll('.tab .dropnav li>a');
        const foodClass = document.querySelector('.content h1');
        // 展示li
     
        const foodList = document.querySelectorAll('.diet-frame .list1 li');
        let ClassName;
        for(let i=0;i<NavLi.length;i++){
            // 自定义属性标号
            // NavLi[i].index=i;
            // NavLi[i].innerHTML = resp.data.groups[i].group;
                // 分类名
                // 默认显示
                // foodClass.innerHTML = resp.data.groups[0].group;
                // ClassName = resp.data.groups[0].group;
        //    绑定点击渲染不同数据
        // 默认显示
        // ajax({
        //     url:'http://175.178.7.180:8080/team_project/food/orderedFoods',
        //     type:'GET',
        //     async:true,
        //     data:{
        //         groupId:classID
        //     },
        //     success:function(resp){

        //     },error:function(error){
        //         console.log();
        //     }
        // });
        // 点击大类
            NavLi[i].addEventListener('click',function(){
                // 分类名
                foodClass.innerHTML = resp.data.groups[this.index].group;
                ClassName = resp.data.groups[this.index].group;


                // 大类ID
                let classID = resp.data.groups[this.index].id;
                    ajax({
                        url:'http://175.178.7.180:8080/team_project/food/orderedFoods',
                        type:'GET',
                        async:true,
                        data:{
                            groupId:classID
                        },
                        success:function(resp){
                            // 删掉原有的子元素
                            if(foodUL.childNodes.length != 0){
                                foodUL.innerHTML='';
                            }
                            // 需要这么多个li
                            foodUL.style.width = 232*resp.data.foods.length+'px'
                            for(let j=0;j<resp.data.foods.length;j++){

                                let li = document.createElement('li');
                                li.index=j;
                                li.innerHTML="<div class='img'>"+
                                                "<img src='../Images/food/米饭.jpg'>"
                                            +'</div><div class="brief">'+
                                                '<h5 class="name">'+resp.data.foods[j].foodName+'</h5>'+
                                                '<p>热量: <b>'+parseInt(resp.data.foods[j].energy)+'</b>千卡/100克</p>'+
                                                '<p>脂肪: <span class="petname"></span></p></div>';
                                foodUL.appendChild(li);
                                // 显示详情信息
                                li.addEventListener('click',function(){
                                    // 还得加照片
                                    const detail = document.querySelector('.details .inner .right');
                                    detail.querySelector('.name span').innerHTML = resp.data.foods[this.index].foodName
                                    detail.querySelector('.heat span').innerHTML = +parseInt(resp.data.foods[this.index].energy)+'千卡 （ 每[100g]可食部）';
                                    detail.querySelector('.classify span').innerHTML = ClassName;
                                    // 营养项目
                                    const value = document.querySelectorAll('#value span');
                                    value[0].innerHTML=resp.data.foods[this.index].energy;
                                    value[1].innerHTML='';
                                    value[2].innerHTML=resp.data.foods[this.index].protein;
                                    value[3].innerHTML=resp.data.foods[this.index].cho
                                    value[4].innerHTML=resp.data.foods[this.index].dietaryFiber
                                })
                                // 点击每个食物

                                
                            }
                            liCount = foodUL.childNodes.length;
                            console.log(liCount);
                        },error:function(error){
                            console.log(error);
                        }
                    })
                    
                })
        }

        


    },error:function(error){
        console.log(error);
    }
})


// ajax({
//     url:'http://175.178.7.180:8080/team_project/food/getFoods',
//     type:'GET',
//     async:true,
//     data:{
//         detailedId:1
//     },
//     success:function(resp){
//         console.log(resp.data.foods);
//     },error:function(error){
//         console.log(error);
//     }
// })







// 存放
const detail = document.querySelector('.details .inner .right');
                                    detail.querySelector('.name span').innerHTML = resp.data.foods[this.index].foodName
                                    detail.querySelector('.heat span').innerHTML = +parseInt(resp.data.foods[this.index].energy)+'千卡 （ 每[100g]可食部）';
                                    detail.querySelector('.classify span').innerHTML = ClassName;
                                    // 营养项目
                                    const value = document.querySelectorAll('#value span');
                                    value[0].innerHTML=resp.data.foods[this.index].energy;
                                    value[1].innerHTML='';
                                    value[2].innerHTML=resp.data.foods[this.index].protein;
                                    value[3].innerHTML=resp.data.foods[this.index].cho
                                    value[4].innerHTML=resp.data.foods[this.index].dietaryFiber