/**
 * Created by User on 2016/8/12.
 */

$(function() {

    var $btnLogin = $('.btn-login');//注册按钮
    var $headerSpan = $('.header-span-ultwo');//点击关于我们下拉框
    var $headerDiv = $('.header-ultwo-div');//关于我们的下拉框
    var $headerIm = $('.index-div-header-img2');//下拉列框图标

    var $tc = $('.index-bounced');//弹窗按钮
    var isClickHeader = true;
    $headerDiv.hide();
    $tc.hide();
    $btnLogin.click(function() {
        window.location.href = '';
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
});


