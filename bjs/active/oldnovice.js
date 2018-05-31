/**
 * Created by User on 2017/10/13.
 */
$(function() {

    $.ajax({
        url: Setting.apiRoot1 + '/queryInvestPageInfoPC.p2p',
        type: 'post',
        dataType: 'json'
    }).done(function(res) {
        if(res.code == 1) {
            var data = res.data;
            var regularListDetail = data.regularList.regularListDetail;
            var $oldbutton = $('.oldbutton');
            for(var i = 0; i < regularListDetail.length; i++) {
                if(regularListDetail[i].loanCycle == 3) {
                    $oldbutton.attr({'prodId':regularListDetail[i].prodId});
                }
            }

            $oldbutton.click(function() {
                var prodid = $(this).attr('prodId');
                sessionStorage.setItem('prodid',prodid);
                window.location.href = Setting.staticRoot + '/bpage/buy.html';
            });
            //var prodId1 = newProdListDetail[0].prodId;
            //var prodId2 = newProdListDetail[1].prodId;
            //$('.nMainBtonn1').attr({'prodId':prodId1});
            //$('.nMainBtonn2').attr({'prodId':prodId2});
            //$('.aBtn').click(function() {
            //    var prodid = $(this).attr('prodId');
            //    sessionStorage.setItem('prodid',prodid);
            //    window.location.href = Setting.staticRoot + '/bpage/buy.html';
            //})
        }
    }).fail(function() {
        alert('网络连接失败！');
        return false;
    })

});