$(function() {
    var $headerOne = $('.header-ulOne');//控制首页切换
    //鼠标移入首页
    $headerOne.mouseover(function() {
        window.location.href = '../pages/index.html';
    });

});