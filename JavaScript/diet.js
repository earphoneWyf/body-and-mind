// 未封装版本!!!


// 卡片展示,需要修改为动态
// 需要封装为两个ul效果
    // // 动态设置ul的宽度
    // const frame = document.querySelector('.diet-frame');
    // let middle=document.querySelector(".content .diet-frame>ul");
    // let middle_li=document.querySelectorAll(".diet-frame li");
    // // middle.style.width = middle_li[0].offsetWidth*middle_li.length;
    // // 点击箭头切换
    // let click_left=document.querySelector("#left");
    // let click_right=document.querySelector("#right");
    // var scroll_click;
    // // 写这个值
    // // middle.style.width = middle_li[0].offsetWidth*middle_li.length;
    // let count = 0;
    // // 滑块记位号
    // move(click_left,-1);
    // move(click_right,1);
    // // 点击滑动条
    // // 点击具体位置的地方
    // // let scroll_click = document.querySelectorAll(".scroll .scroll-click");
    // let scroll_block = document.querySelector(".block-wrap");
    // // 点击分类导航之后再执行滚动展示
    // //
    // const navli = document.querySelectorAll('.tab .dropnav li');
    // let blockCount;
    // // 点击初始化
    // for(let i=0;i<navli.length;i++){
    //     navli[i].addEventListener('click',()=>{
    //         // scroll_click = document.querySelectorAll(".scroll .scroll-click");

    //         middle.style.left=0;
    //         scroll_block.style.left=0;
    //         // 动态生成点击数量
    //         blockCount=Math.ceil(liCount/5);            
        
    //         // 动态生成blockclick
    //         const scroll = document.querySelector('.scroll');
    //         if(scroll.childNodes.length != 0){
    //             scroll.innerHTML='';
    //         }
    //         // console.log(scroll);
    //         for(let i=0;i<blockCount;i++){
    //             let div = document.createElement('div');
    //             div.classList.add('scroll-click');
    //             scroll.appendChild(div);
    //         }    
        
        
    //     })  
    // }















    // for(var i = 0; i< scroll_click.length; i++){
    //     scroll_click[i].index = i;
    //     scroll_click[i].onclick = function(){
    //         for(var i = 0; i<scroll_click.length; i++){
    //             middle.style.left=-222*this.index+"px";//204为li宽度+margin
    //             // scroll_block.style.left=60*this.index+"px";//滑块移动距离
    //             scroll_block.style.left=94*this.index+"px";//滑块移动距离
    //         count=this.index;
    //         console.log(count);
    //         }
    //     }
    // }
    // 参数move用来判断点击左边还是点击右边
//     function move(object,move) {            
//         click(object,function(){
//             // 判断滑块尽头
//             if(move<0){
//                 if(scroll_block.offsetLeft<=0)
//                     return false;                 
//             }
//             else{
//                 if(scroll_block.offsetLeft>=560)
//                     return false; 
//             }

//             // 取整
//             // 
//             count%=7;
//             if(move<0)
//                 count=count-2;
//             if(move>0)
//                 count=count+2;
//             if(count<0)
//                 count=0;
//             if(count>6)
//                 count=6;
//             scroll_click[count].onclick();        
//         });
//     }
//     // 滑动条拖拽
//     scroll_block.onmousedown=function(event){
        
//         event = event || window.event;
//         var ol =event.clientX - scroll_block.offsetLeft;
//         document.onmousemove=function(event){
//             middle.style.transition="all 0s ";
//             scroll_block.style.transition='all 0s ';
//             event = event || window.event;
//             var left = event.clientX - ol;
//             scroll_block.style.left = left + "px";
//             if(event.clientX-ol<=0){
//                 scroll_block.style.left=0+"px";
//             }
//             if(event.clientX-ol>=560){
//                 scroll_block.style.left=560+"px";
//             }
//             // 到这没问题
//             middle.style.left=(-scroll_block.offsetLeft*((foodUL.offsetWidth-2*frame.offsetWidth)/560))+"px";
//             // 这里bug
//             console.log(scroll_block.offsetLeft);
//         }
//         document.onmouseup = function() {
//             // 控制拖拽终点
//             // 控制滑块终点
//             if(scroll_block.offsetLeft>0&&scroll_block.offsetLeft<40)
//                 scroll_click[0].onclick();
//             if(scroll_block.offsetLeft>=40&&scroll_block.offsetLeft<85)
//                 scroll_click[1].onclick();            
//             if(scroll_block.offsetLeft>=85&&scroll_block.offsetLeft<145)
//                 scroll_click[2].onclick();
//             if(scroll_block.offsetLeft>=145&&scroll_block.offsetLeft<190)
//                 scroll_click[3].onclick();
//             if(scroll_block.offsetLeft>=190&&scroll_block.offsetLeft<260)
//                 scroll_click[4].onclick();
//             if(scroll_block.offsetLeft>=260&&scroll_block.offsetLeft<310)
//                 scroll_click[5].onclick();
//             if(scroll_block.offsetLeft>=310&&scroll_block.offsetLeft<360)
//                 scroll_click[6].onclick();
//             document.onmousemove = null;
//             document.onmouseup = null;
//             middle.style.transition="all .15s ease-in";
//             scroll_block.style.transition= "all .15s linear";
//         }; 
//         return false;  
//     }


//     // 封装单击函数
// function click(obj , callback) {
//     obj.onclick=function() {
//         if ( typeof callback == 'function')
//         callback();
//     }
// }




// 点击展示更多
const more = document.querySelector('.more');

// 高度变化
const list = document.querySelector('.content .list');
// // 点击展示更多
more.addEventListener('click',()=>{
    more.classList.toggle('close');
    list.classList.toggle('show')
})

// tab 切换
const tabLi = document.querySelectorAll('.tab>ul>li'),
      moveblock = document.querySelector('.tab .move');
      
const content = document.querySelectorAll('.content .active');
// 需要更多content







