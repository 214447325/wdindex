$(function(){
    var userId = sessionStorage.getItem('uid');
    var loginToken = sessionStorage.getItem('loginToken');
    // 规则
    $('.rule').on('click',function(){
        $('.guize').css('display','block')
    })
    $('.closeguize').on('click',function(){
        $('.guize').css('display','none');
    });
    $('#share').hover(function(){
        $('.ashare').css('display','block');
    },function(){
        $('.ashare').css('display','none');
    });

    //接口
    if(!!userId){
      $.ajax({
        url:Setting.apiRoot1 + '/u/queryAddInvestPRP.p2p',
        dataType:'json',
        type:'get',
        data:{
            userId:userId,
            loginToken:loginToken
        }
      }).done(function(res){
        Common.ajaxDataFilter(res,function(res){
            if(res.code == 1){
                var data = res.data;
                $('.money').eq(0).html(data.amtYear30);
                $('.money').eq(1).html(data.amtYear92);
                $('.red').html(data.amtYear30 - data.amtYear92);
                if(data.redPkg*1 != 0){
                    $('.noMoney').css('display','none');
                    $('.redMoney').css('display','block');
                    $('.redMoney').html(data.redPkg + '<div>元</div>');
                }
            }
        })
      }).fail(function(res){
        alert('网络链接失败');
          return false
      })
    }
});
