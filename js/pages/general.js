/**
 * Created by User on 2016/8/12.
 */

$(function() {
    var url = window.location.href; //获取url中"?"符后的字串
    var param = {};
    if (url.indexOf("?") != -1) {
        var str = url.split('?')[1];
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            param[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
    }

    var $headerDiv = $('.header-ultwo-div');//关于我们的下拉框
    var $tc = $('.index-bounced');//弹窗按钮
    $headerDiv.hide();
    $tc.hide();
});
