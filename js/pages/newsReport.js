$(function() {
    var $rg = $('.rg');
    var c = $rg.find('.rc').length;
    for (var i = 0; i <= c; i++) {
        $('.report-contetn' + i).hide();
    }

    var $headerOne = $('.header-ulOne');//控制首页切换
    //鼠标移入首页
    $headerOne.mouseover(function() {
        window.location.href = '../pages/index.html';
    });

    var param = Common.getParam();
    var pageCount = param.pageCountns;
    //console.log(JSON.stringify(param))
    $('.page-content').hide();
    $('.new-pages').hide();
    if(pageCount == 5) {
        $('.index-problem-choose').css({'height': '3500px'});
    }
    $('.report-contetn' + pageCount).show();

});