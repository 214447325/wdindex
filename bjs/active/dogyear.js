/**
 * Created by User on 2018/3/5.
 */


$(function() {
    var userId = sessionStorage.getItem('uid');

    var dog = new Vue({
        el:'#dog',
        data:{
            isclickdog8:false,//8周按钮
            isclickdog12:false,//12周按钮
            dogsrctrue2121:'',//控制活动2的样式
            dogsrc011:0.1,//控制活动里面的圆圈样式
        },
        methods: {
            dogsrcllow:function(rate,count) {
                dog.dogsrc011 = 0;
                dog.dogsrc011 = rate;
                $('.dogsrc').removeClass('dogsrctrue2121');
                $('.dogscro' + count).addClass('dogsrctrue2121');
            },
            queryInvestPageInfoPC:function(selectId) {
                if(userId == undefined || userId == null || userId == '') {
                    Commain.toLogin();
                    return false;
                }
                if(selectId != undefined && selectId != null && selectId != '') {
                    if(selectId == 8) {
                        if(dog.isclickdog8) {
                            return false;
                        }
                        dog.isclickdog8 = true;
                    }

                    if(selectId == 12) {
                        if(dog.isclickdog12) {
                            return false;
                        }

                        dog.isclickdog12 = true;
                    }

                    $.ajax({
                        url:Setting.apiRoot1 + '/queryInvestPageInfoPC.p2p'
                    }).done(function(res) {
                        dog.isclickdog8 = false;
                        dog.isclickdog12 = false;
                        if(res.code == 1) {
                            var _data = res.data;
                            var regularList = _data.regularList;
                            var regularListDetail = regularList.regularListDetail;
                            for(var i = 0; i < regularListDetail.length; i++) {
                                if(regularListDetail[i].loanCycle == selectId) {
                                    sessionStorage.setItem('prodid',regularListDetail[i].prodId);
                                    window.location.href = Setting.staticRoot + '/bpage/buy.html';
                                    return false;
                                }
                            }

                        } else {
                            alert(res.message);
                            return false;
                        }
                    }).fail(function() {
                        dog.isclickdog8 = false;
                        dog.isclickdog12 = false;
                        alert('网络连接失败！');
                        return false;
                    })
                } else {
                    window.location.href = Setting.staticRoot + '/pages/index.html';
                }
            }
        }
    })
});