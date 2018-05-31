/**
 * Created by User on 2017/10/13.
 */
$(function() {
    //var _imgUrl =  '../images/pages/in-head-dhx1.png';
    //var imgUrl = '<img src='+_imgUrl+' class="index-div-header-img3">';
    //$('.header-ulOne-li').html(imgUrl).parent().find('.fush').addClass('full');

    var $nMainBtn1 = $('.nMainBtn1');
    var $nMainIcon1 = $('.nMainIcon1');
    var $nMainBtn2 = $('.nMainBtn2');
    var $nMainIcon2 = $('.nMainIcon2');
    $nMainBtn1.on('click, mouseover',function() {
        $nMainIcon1.show();
    });

    $nMainBtn1.mouseout(function() {
        $nMainIcon1.hide();
    });

    $nMainBtn2.on('click, mouseover',function() {
        $nMainIcon2.show();
    });

    $nMainBtn2.mouseout(function() {
        $nMainIcon2.hide();
    });

    $.ajax({
        url: Setting.apiRoot1 + '/queryInvestPageInfoPC.p2p',
        type: 'post',
        dataType: 'json'
    }).done(function(res) {
        //console.log(JSON.stringify(res))
        if(res.code == 1) {
            var data = res.data;
            var newProdListDetail = data.mapNewprodList2.newProdListDetail;
            var prodId1 = newProdListDetail[0].prodId;
            var prodId2 = newProdListDetail[1].prodId;
            $('.nMainBtonn1').attr({'prodId':prodId1});
            $('.nMainBtonn2').attr({'prodId':prodId2});
            $('.aBtn').click(function() {
                var prodid = $(this).attr('prodId');
                sessionStorage.setItem('prodid',prodid);
                window.location.href = Setting.staticRoot + '/bpage/buy.html';
            })
        }
    }).fail(function() {
        alert('网络连接失败！');
        return false;
    })


});