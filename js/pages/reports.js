$(function() {
    var $headerOne = $('.header-ulOne');//控制首页切换
    //鼠标移入首页
    $headerOne.click(function() {
        window.location.href = '../pages/index.html';
    });


    var  $header = $('.introduced-content-header');
    var count = $header.find('.news').length;
    for (var i = 0; i <= count; i++) {
        if(i != 1) {
            $('.new-div' + i).hide();
        }
        $('.report-contetn'+ i).hide();
    }
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
    var pageCount = 0;
    if (param != null && param != undefined) {
        pageCount = param.pagesCount;
    }

    if(pageCount == 1 || pageCount == null || pageCount == undefined) {
        pageChoose(1)
    } else {
        pageChoose(pageCount)
    }
});

function pageChoose(page){
    var  $pageSpan = $('.new-pages-span');
    var count = $pageSpan.find('.reporta').length;
    for(var i = 0; i <= count; i++) {
        $('.new-div' + i).hide();
    }
    $('.new-pages-a').removeClass('newPage');
    if(page == 0 || page == -1) {

        if(page == 0) {

            $('.new-div1').show();
            $('.a1').addClass('newPage');
        }
        if(page == -1) {

            $('.new-div' + count).show();
            $('.a' + count).addClass('newPage');
        }
    } else {
        $('.new-div' + page).show();
        $('.a' + page).addClass('newPage');

    }

    /**
     * 解析地址栏中的信息
     * @type {string}
     */
    var url = window.location.href; //获取url中"?"符后的字串
    var param = {};
    if (url.indexOf("?") != -1) {
        var str = url.split('?')[1];
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            param[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
    }

    var activeImg = param.activeImg;
    //alert(activeImg)
      if(activeImg == 2) {
          window.location.href = '../pages/twoActive.html';
      }
    if(activeImg == 3) {
        window.location.href = '../pages/threeActive.html';
    }

    if(activeImg == 4) {
        window.location.href = '../pages/fourActive.html';
    }

    if(activeImg == 6) {
        window.location.href = '../pages/sixActive.html';
    }

    if(activeImg == 7) {
        window.location.href = '../pages/serverActive.html';
    }
}

