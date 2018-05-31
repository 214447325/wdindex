/*
* @Author: User
* @Date:   2016-08-19 00:12:59
* @Last Modified by:   User
* @Last Modified time: 2016-08-19 15:16:28
*/

$(function() {

    var url = window.location.href; //获取url中"?"符后的字串
    var param = {};
    if (url.indexOf("?") != -1) {
       // var str = url.substr(1);
        var str = url.split('?')[1];
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            param[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
    }
  //param  
    var selectPages = param.pages;


    var $headerSpan = $('.header-span-ultwo');//点击关于我们下拉框
    var $headerDiv = $('.header-ultwo-div');//关于我们的下拉框
    var $headerIm = $('.index-div-header-img2');//下拉列框图标
    var $headerThree = $('.header-ulThree');//鼠标移入平台介绍
    var $headerFour = $('.header-ulFour');//控制安全控制
    var aBox = $('.header-ultwo-li');
    var box = $('.header-ulOne-li');
    var $headerOne = $('.header-ulOne');//控制首页切换

    var isClickHeader = true;
    $headerDiv.hide();

    var $slider = $('.slider');//控制标题栏下的黄条
    var isHomePage = true;//首页
    var isPlax = true;//平台介绍
    var isSer = true;//安全保障

    $('.red-rain').mouseover(function() {
        $('.index-div-header-img2').attr({'src': '../../images/pages/in-head-x1.png'});
        $headerDiv.hide();
    });

    $('.index-introduced').mouseover(function() {
        $headerDiv.hide();
        $headerIm.attr({'src': '../../images/pages/in-head-x1.png'});
        aBox.html('');
    });
//event


    //鼠标首页
    $headerOne.mouseover(function() {
        $headerDiv.hide();
        $('.index-div-header-img2').attr({'src': '../../images/pages/in-head-x1.png'});
        if(isHomePage){
            isHomePage = false;
            isPlax = true;
            isSer = true;
            $slider.html('');
            $('.header-ulThree-li').html('');
            $('.header-ulOne-li').html('<img src="../../images/pages/in-head-dhx1.png" class="index-div-header-img3">');
        }
    });

    //鼠标移入安全控制
    $headerFour.mouseover(function() {
        $headerDiv.hide();
        $('.index-div-header-img2').attr({'src': '../../images/pages/in-head-x1.png'});
        if(isSer) {
            isSer = false;
            isPlax = true;
            isHomePage = true;
            $slider.html('');
            $('.header-ulFour-li').html('<img src="../../images/pages/in-head-dhx1.png" class="index-div-header-img3">');
        }
    });


//鼠标移入平台介绍界面
    $headerThree.click(function() {
        window.location.href = '../../pages/general.html?pages=' + 1;
    });

    //点击关于我们控制下拉框
    $headerSpan.mouseover(function() {
        $headerDiv.show();
        $headerIm.attr({'src': '../../images/pages/in-head-y1.png'});
        aBox.html('<img src="../../images/pages/in-head-dhx1.png" class="index-div-header-img3">');
        box.html('');
        $('.header-ulThree-li').html('');
    });


 //nav 二级页面
 $('.b1').click(function(){
        $sidebar.removeClass('ce');
        $('.c1').addClass('ce');
        $gif.attr({src: '../../pages/indexPlatform.html?pages=1'});
        $titleImg.attr({src: '../../images/pages/index-ptjs.jpg'});
        window.location.href = '../../pages/general.html?pages=1';
    });

    $('.b2').click(function() {
        $sidebar.removeClass('ce');
        $('.c2').addClass('ce');
        $gif.attr({src: '../../pages/indexreports.html'});
        $titleImg.attr({src: '../../images/pages/report.jpg'});
        window.location.href = '../../pages/general.html?pages=2';
    });

    $('.b3').click(function() {
        $sidebar.removeClass('ce');
        $('.c3').addClass('ce');
        $gif.attr({src: '../../pages/indexProblem.html?pages=3'});
        $titleImg.attr({src: '../../images/pages/in-problem.jpg'});
        window.location.href = '../../pages/general.html?pages=3';
    });

    $('.b4').click(function() {
        $sidebar.removeClass('ce');
        $('.c4').addClass('ce');
        $gif.attr({src: '../../pages/indexContact.html?pages=4'});
        $titleImg.attr({src: '../../images/pages/contact.jpg'});
        window.location.href = '../../pages/general.html?pages=4';
    });

    $('.b5').click(function() {
        $sidebar.removeClass('ce');
        $('.c5').addClass('ce');
        $gif.attr({src: '../../pages/indexdisclaimer.html?pages=5'});
        $titleImg.attr({src: '../../images/pages/mzsm-header.jpg'});
        window.location.href = '../../pages/general.html?pages=5';
    });

    $('.b6').click(function() {
        $sidebar.removeClass('ce');
        $('.c6').addClass('ce');
        $gif.attr({src: '../../pages/security.html?pages=6'});
        $titleImg.attr({src: '../../images/pages/mzsm-header.jpg'});
        window.location.href = '../../pages/general.html?pages=6';
    });
    //
    $('.index-c2').click(function() {
        window.location.href = '../../pages/general.html?pages=2';
    });

    $('.index-c3').click(function() {
        window.location.href = '../../pages/general.html?pages=3';
    });

    $('.index-c4').click(function() {
        window.location.href = '../../pages/general.html?pages=4';
    });

    $('.index-c5').click(function() {
        window.location.href = '../../pages/general.html?pages=5';
    });

    $('.index-c6').click(function() {
        window.location.href = '../../pages/general.html?pages=6';
    });
});