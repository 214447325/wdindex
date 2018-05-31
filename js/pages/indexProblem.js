/**
 * Created by User on 2016/8/12.
 */

$(function() {
    var $btnLogin = $('.btn-login');//注册按钮
    var $headerSpan = $('.header-span-ultwo');//点击关于我们下拉框
    var $headerDiv = $('.header-ultwo-div');//关于我们的下拉框
    var $headerIm = $('.index-div-header-img2');//下拉列框图标
    var $headerThree = $('.header-ulThree');//鼠标移入平台介绍
    var $tc = $('.index-bounced');//弹窗按钮
    var $problem = $('.header-li-span-two');//点击联系我们
    var $pt = $('.pt');//点击平台介绍
    var $headerOne = $('.header-ulOne');//控制首页切换

    var $headerContent = $('.introduced-content-header');
    var countHeader = $headerContent.find('.problem-answer').length;
    for(var i = 0; i <= countHeader; i++){
        $('.problem' + i).hide();
    }

    $pt.click(function() {
        window.location.href = '../pages/indexPlatform.html';
    });

    var isClickHeader = true;
    $headerDiv.hide();
    $tc.hide();
    //点击注册
    $btnLogin.click(function() {
        window.location.href = '';
    });



    //鼠标移入首页
    $headerOne.mouseover(function() {
        window.location.href = '../pages/index.html';
    });

    //点击关于我们控制下拉框
    $headerSpan.click(function() {
        if (isClickHeader) {
            $headerDiv.show();
            isClickHeader = false;
            $headerIm.attr({'src': '../images/pages/in-head-y.png'});
        } else {
            $headerDiv.hide();
            $headerIm.attr({'src': '../images/pages/in-head-x.png'});
            isClickHeader = true;
        }
    });

    //鼠标移入平台介绍界面
    $headerThree.mouseover(function() {
        window.location.href = '../pages/indexPlatform.html';
    });

});

var contentHeight = 64;
function clickAnswer(problemAnswer) {
    var $problemImg = $('.problem-img' + problemAnswer);
    var $problemCount = $('.problem0'+ problemAnswer);
    var $problemn = $('.problem' + problemAnswer);
        var isClick = $problemCount.hasClass('problemClick');
        if(isClick) {
            $problemImg.attr({'src': '../images/pages/in-problem-la.png'});
            $problemn.hide();
            $problemCount.removeClass('problemClick');
        } else {
            $problemImg.attr({'src': '../images/pages/problem-he.png'});
            $problemn.show();
            $problemCount.addClass('problemClick');
        }
}

//点开一个关闭一个

//var count = 0;
// function clickAnswer(problemAnswer) {
//     var $background = $('.index-problem-choose');//背景
//     var $headerContent = $('.introduced-content-header');
//     var countHeader = $headerContent.find('.problem-answer').length;
//     for(var i = 0; i <= countHeader; i++){
//         $('.problem' + i).hide();
//     }
//     if (count != problemAnswer) {
//         $('.problem' + count).hide().css({'marginTop': '0px'});
//         $('.problem-img' + count).attr({'src': '../images/pages/in-problem-la.png'});
//         $background.css({'height': '800px'});
//         $('.problem0' + (count + 1)).css({'marginTop': '0'});
//         count = problemAnswer;
//         $('.problem' + problemAnswer).show().css({'marginTop': '0px'});
//         $('.problem-img' + problemAnswer).attr({'src': '../images/pages/problem-he.png'});
//        if (problemAnswer == 1) {
//            $background.css({'height': '1200px'});
//        } else {
//            $background.css({'height': '900px'});
//        }
//         $('.problem0' + (problemAnswer + 1)).css({'marginTop': '60px'});
//     } else {
//         $('.problem' + problemAnswer).hide().css({'marginTop': '0px'});
//         $('.problem-img' + problemAnswer).attr({'src': '../images/pages/in-problem-la.png'});
//         $background.css({'height': '800px'});
//         $('.problem0' + (count + 1)).css({'marginTop': '0'});
//         count = 0;
//     }
//
// }
