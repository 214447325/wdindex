/**
 * Created by User on 2016/8/12.
 */

$(function() {
    var $headerSpan = $('.header-span-ultwo');//点击关于我们下拉框
    var $headerDiv = $('.header-ultwo-div');//关于我们的下拉框
    var $headerIm = $('.index-div-header-img2');//下拉列框图标
    var $headerThree = $('.header-ulThree');//鼠标移入平台介绍
    var $serverActive = $('.servertd');//七天乐活动
    var $fixed = $('.fixed');//固定收益活动
    var $float = $('.floatTd');//浮动收益活动
    var $btn = $('.in-btn');//点击马上赚钱按钮
    var $tc = $('.index-bounced');//弹窗按钮
    var $qd = $('.index-bounced-qd');//谈出框中的确定按钮

    $headerDiv.hide();
    $tc.hide();

    var aBox = $('.header-ultwo-li');
    var box = $('.header-ulOne-li');
    var $headerOne = $('.header-ulOne');//控制首页切换
    //鼠标点击首页
    $headerOne.click(function() {
        $headerDiv.hide();
        $headerIm.attr({'src': '../images/pages/in-head-x1.png'});
        aBox.html('');
        box.html('<img src="../images/pages/in-head-dhx1.png" class="index-div-header-img3">');
        //$headerSpan.css({'color':'#272536'});
        //$('.header-ulOne').css({'color': '#004589'});
    });


    //鼠标点击平台介绍界面
    $headerThree.click(function() {
        window.location.href = '../pages/general.html?pages=' + 1;
    });


    //鼠标移入和移出周周涨
    $serverActive.mouseover(function(data) {
        $('.server-span').addClass('server-span-content');
        $('.servertd').addClass('server');
        $('.index-table1-serven').addClass('server-img');
    });

    $serverActive.mouseout(function() {
        $('.server-span').removeClass('server-span-content');
        $('.servertd').removeClass('server');
        $('.index-table1-serven').removeClass('server-img');
    });

    //鼠标移入和移出固定收益活动
    $fixed.mouseover(function(data) {
        $('.index-table1-income').addClass('server-img');
        $('.fixed').addClass('server');
        $('.fixed-span').addClass('fixed-span-content');
    });

    $fixed.mouseout(function() {
        $('.index-table1-income').removeClass('server-img');
        $('.fixed').removeClass('server');
        $('.fixed-span').removeClass('fixed-span-content');
    });

    //浮动收益资产组合
    $float.mouseover(function(data) {
        $('.index-table1-float').addClass('server-img');
        $('.floatTd').addClass('server');
        $('.float-span').addClass('fixed-span-content');
    });

    $float.mouseout(function() {
        $('.index-table1-float').removeClass('server-img');
        $('.floatTd').removeClass('server');
        $('.float-span').removeClass('fixed-span-content');
    });

    $btn.click(function() {
        $tc.show();
    });

    $qd.click(function() {
        $tc.hide();
    });

});

function getActiveAddress(page) {
    window.location.href = '../pages/general.html?pages=2&activeImg='+ page;
}

