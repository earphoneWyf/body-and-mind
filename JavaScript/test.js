
// 当前页
let pageNO = 0;
// 内容页
const pages = document.querySelectorAll('.part3 .content.active .page');
// 总页码
const PAGECOUNT = pages.length;
// 按钮
const btn = document.querySelectorAll('.btn button');
function init(){
    for(let i=0;i<pages.length;i++){
        pages[i].style.zIndex = PAGECOUNT - i-1;
    }
    pages[0].style.zIndex = PAGECOUNT;
    pages[pages.length-1].style.zIndex=1;
    // 开始禁左键
    btn[0].disabled=true;
 
    btn[0].addEventListener('click',()=>{
        // 第一页禁用左键
        if(pageNO<=1){
            btn[0].disabled=true
        }
        btn[1].disabled=false;
        pageNO--;
            pages[pageNO].classList.add('appear');
            pages[pageNO].classList.toggle('disappear')
            pages[pageNO].style.transform = 'rotateY(0deg)'

        pages[pageNO].style.zIndex = PAGECOUNT-pageNO;

    });
    // 到尽头的时候全清
    btn[1].addEventListener('click',()=>{
        if(pageNO == pages.length){
            for(let i=0;i<pages.length;i++){
                pages[i].classList.remove('appear'); 
                pages[i].classList.remove('disappear'); 
            }
        }
            btn[0].disabled=false
            pages[pageNO].style.transform = 'rotateY(-180deg) translateX(-40px)'
            pages[pageNO].classList.remove('appear');
            pages[pageNO].classList.add('disappear')

        pages[pageNO].style.zIndex=PAGECOUNT+pageNO;
        pageNO++;
        if(PAGECOUNT==pageNO){
            // console.log(pageNO);
            btn[1].disabled = true;
        }
    })
}
init();