	//淡入效果(含淡入到指定透明度)
	function fadeIn(elem, speed, opacity){
		/*
		 * 参数说明
		 * elem==>需要淡入的元素
		 * speed==>淡入速度,正整数(可选)
		 * opacity==>淡入到指定的透明度,0~100(可选)
		 */
	    speed = speed || 20;
	    opacity = opacity || 100;
		//显示元素,并将元素值为0透明度(不可见)
	    elem.style.display = 'block';
	    iBase.SetOpacity(elem, 0);
		//初始化透明度变化值为0
	    var val = 0;
		//循环将透明值以5递增,即淡入效果
	    (function(){
	        iBase.SetOpacity(elem, val);
	        val += 5;
	        if (val <= opacity) {
	            setTimeout(arguments.callee, speed)
	        }
	    })();
	}
	
	//淡出效果(含淡出到指定透明度)
	function fadeOut(elem, speed, opacity){
		/*
		 * 参数说明
		 * elem==>需要淡入的元素
		 * speed==>淡入速度,正整数(可选)
		 * opacity==>淡入到指定的透明度,0~100(可选)
		 */
	    speed = speed || 20;
	    opacity = opacity || 0;
	    //初始化透明度变化值为0
	    var val = 100;
		//循环将透明值以5递减,即淡出效果
	    (function(){
	        iBase.SetOpacity(elem, val);
	        val -= 5;
	        if (val >= opacity) {
	            setTimeout(arguments.callee, speed);
	        }else if (val < 0) {
				//元素透明度为0后隐藏元素
	            elem.style.display = 'none';
	        }
	    })();
	}




    var iBase = {
        Id: function(name){
            return document.getElementById(name);
        },
		//设置元素透明度,透明度值按IE规则计,即0~100
        SetOpacity: function(ev, v){
            ev.filters ? ev.style.filter = 'alpha(opacity=' + v + ')' : ev.style.opacity = v / 100;
        }
    }


    const dot = document.querySelectorAll('.part2 .dot>div');
    // console.log(dot);
    const briefLi = document.querySelectorAll('.part2 .brief>ul>li');
    const imgLi = document.querySelectorAll('.part2 .imgBox li');
    // 封装播放图片函数


    function playfun(obj){
        for(let i=0;i<dot.length;i++){
            dot[i].classList.remove('active');
            briefLi[i].classList.add('fadeOut');
            briefLi[i].classList.remove('fadeIn');
            imgLi[i].classList.remove('fadeIn');
            imgLi[i].classList.add('fadeOut');
        }
        obj.classList.add('active');
        briefLi[obj.index].classList.add('fadeIn');
        briefLi[obj.index].classList.remove('fadeOut')
        imgLi[obj.index].classList.add('fadeIn');
        imgLi[obj.index].classList.remove('fadeOut')
    }
    let timer;
    // 封装自动播放函数
    function autoplay(){
        clearInterval(timer);
        timer = setInterval(function(){
            count%=dot.length;
            playfun(dot[count]);
            count++;
        },3000);
    }

    autoplay();

    // 记位
    var count = 0;
    // 点击圆圈
    for(let i=0;i<dot.length;i++){
        dot[i].index=i;
        dot[i].addEventListener('click',function(){
            // 清除定时器
            clearInterval(timer)
            // 传标识符
            count = this.index;
            playfun(this)
        })
    }
    // 鼠标移入
    const playwrap = document.querySelector('.part2 .wrap');
    playwrap.addEventListener('mouseover',()=>{
        clearInterval(timer);
    })
    playwrap.addEventListener('mouseout',()=>{
        autoplay();
    })