window.addEventListener('load', () => {
    //获取一键生成帐号显示id的元素
    const IDbox = document.querySelector('.IDbox');
    const h1 = IDbox.querySelector('h1');
    let id = window.location.search.substring(1, 8);
    let password = window.location.search.substring(8);
    h1.innerHTML = id; //显示id帐号到signIn页面
    const lbtn = document.querySelector('.lbtn');
    lbtn.addEventListener('click', () => {
        location.href = '../HTML/login.html?' + id + password;
    })
})