//定义最大的fontSize
const MAX_FONT_SIZE = 42;

//监听html文档被解析完成的时间
document.addEventListener('DOMContentLoaded',()=>{
//    获取html标签
    const html = document.querySelector('html');
    //获取根元素fontSize标准为屏幕宽度的1/10
    let fontSize = window.innerWidth / 10;
//    获取到的fontSize不允许超过定义的最大值
    fontSize = fontSize > MAX_FONT_SIZE ? MAX_FONT_SIZE : fontSize;
//    定义根元素html fontSize的大小rem
    html.style.fontSize = fontSize + 'px'
})