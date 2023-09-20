

// shift参数为是否进行切换标识
// 参数说明
/*  tab 需要切换的元素
    moveBlock移动元素
    shift /true or false
    content 切换的内容
*/
function tabMove(tab,moveBlock,shift,content,callback){
    if(shift){
        for(let i = 0;i<tab.length;i++){
            tab[i].index=i;
            tab[i].addEventListener('click',function(){
                moveBlock.style.top = tab[i].offsetTop+'px';
                for(let j =0;j<content.length;j++){
                    content[j].classList.remove('active')
                }
                content[this.index].classList.add('active');
            })
        }
    }
    else{
        for(let i = 0;i<tab.length;i++){
            tab[i].addEventListener('click',()=>{
                moveBlock.style.top = tab[i].offsetTop+'px';
            })
        }
    }
    callback && callback();
}



function moving(obj,attr, target, speed,callback,changeVal) {
	//关闭上一个定时器
	clearInterval(obj.timer);
    // console.log(obj);
	
	//开启一个定时器，用来执行动画效果
	//向执行动画的对象中添加一个timer属性，用来保存它自己的定时器的标识
	obj.timer = setInterval(function() {
        
        if(attr=="width"){
            var oldValue = obj.offsetWidth;
        }
        else if(attr=="height"){
            var oldValue = obj.offsetHeight;
        }
		else if(attr=="left"){
			var oldValue = obj.offsetLeft;
		}


		//在旧值的基础上增加
		let newValue = oldValue + speed;
		//判断newValue是否大于800
		//从800 向 0移动
		//向左移动时，需要判断newValue是否小于target
		//向右移动时，需要判断newValue是否大于target
		if((speed < 0 && newValue < target) || (speed > 0 && newValue > target)) {
			newValue = target;
		}

		//将新值设置给box1
		obj.style[attr] = newValue + "px";

		//当元素移动到0px时，使其停止执行动画
		if(newValue == target) {
			//达到目标，关闭定时器
			clearInterval(obj.timer);
			// console.log(newValue);
		//动画执行完毕，调用回调函数
		}

	}, 10);
}

// var foodUL =document.querySelector('');

// let guideStep = 1110;
// var FValue=foodUL.offsetWidth-guideStep;

// const button = document.querySelectorAll('button');
// // btn[0].addEventListener('click',()=>{
// //     console.log('jud');
// //     if (foodUL.offsetLeft >= 0) {
// //         foodUL.style.left = 0;
// //         btn[0].disabled = true;
// //     }else{
// //         btn[0].disabled = false;
// //     }
// // })
// // btn[1].addEventListener('click',()=>{
// //     if (foodUL.offsetLeft <= FValue) {
// //         foodUL.style.left = FValue+"px";
// //         btn[1].disabled = true;
// //     }else{
// //         btn[1].disabled = false;
// //     }
// // })



// var newLeft,guidePre,guideAft;
// let timerL,timerR;

// // 封装切换滚动
// function guideArrow(obj, timer, callback) {
//     obj.addEventListener("click",() => {
     
//         if(flag){
//             console.log('click');
//             clearInterval(timer)
//             flag=false;
            
//             newLeft=foodUL.offsetLeft;
//             console.log(newLeft);
//             guidePre=newLeft+guideStep;
//             guideAft=newLeft-guideStep;
//             if(callback){
//                 callback && callback();
//             }
//             timer=setInterval(() =>{flag=true;},70)
//         }
//     })
// }




// guideArrow(button[0],timerL,function(){
//     if(guidePre>0){
//         guidePre=0;
//     }
//     moving(foodUL,"left",guidePre,30)
// })
// guideArrow(button[1],timerR,function(){
//     // if(guideAft<)
//     moving(foodUL,"left",guideAft,-30);
// })










