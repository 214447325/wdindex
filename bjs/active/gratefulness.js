/**
 * Created by User on 2017/10/18.
 */
$(function() {
   var uid = sessionStorage.getItem('uid');
   var loginToken = sessionStorage.getItem('loginToken');

    var galert = new Vue({
        el:'#galert',
        data:{
            alertshow:{
                'display':'none'
            },
            black:'back3',
            prodId:''
        },
        methods:{
            onclose:function() {
                galert.alertshow = {'display':'none'};
                grate.ginit();
                $("body").css({"overflow":"auto"});
                window.location.reload();
            },
            onclick:function() {
                var prodId = galert.prodId;
                sessionStorage.setItem('prodid',prodId);
                window.location.href = Setting.staticRoot + '/bpage/buy.html';
            }
        }
    });

   var grate = new Vue({
       el:'#grate',
       data:{
           gshow:false,
           openshow:true,
           rate:'',
           prodId:'',
           disabled:''
       },
       methods:{
           ginit:function() {
               $.ajax({
                   url: Setting.apiRoot1 + '/queryInvestPageInfoPC.p2p',
                   type: 'post',
                   dataType: 'json'
               }).done(function(res) {
                    if(res.code == 1) {
                        var _data = res.data;
                        var regularListDetail = _data.regularList.regularListDetail;
                        for(var i = 0; i < regularListDetail.length; i++) {
                            if(regularListDetail[i].loanCycle == 12) {
                                grate.prodId = regularListDetail[i].prodId;
                                galert.prodId = regularListDetail[i].prodId;
                            }
                        }

                        if(uid != undefined && uid != null && uid != '') {
                            $.ajax({
                                url: Setting.apiRoot1 + '/u/appreciationInReturn/receiveInfo.p2p',
                                type: 'post',
                                dataType: 'json',
                                data:{
                                    userId:uid,
                                    loginToken:loginToken
                                }
                            }).done(function(res) {
                                if(res.code == 1) {
                                    var _data = res.data;
                                    //判断是否已经使用
                                    var _couponStatus = _data.couponStatus;
                                    var _rate = _data.rate;
                                    if(_couponStatus == 0) {
                                        grate.rate = 'dark0';
                                        return false;
                                    }
                                    //0表示未使用1表示未使用
                                    if(_couponStatus == 1) {
                                        if(_rate == 3) {
                                            grate.rate = 'light3';
                                            grate.gpresentHtml = '';
                                            grate.gshow = true;
                                            grate.openshow = false;
                                        }

                                        if(_rate == 6) {
                                            grate.rate = 'light6';
                                            grate.gpresentHtml = '';
                                            grate.gshow = true;
                                            grate.openshow = false;
                                        }
                                    } else {
                                        if(_rate == 3) {
                                            grate.rate = 'drak3';
                                            grate.gpresentHtml = '';
                                            grate.gshow = true;
                                            grate.openshow = false;
                                        }

                                        if(_rate == 6) {
                                            grate.rate = 'drak6';
                                            grate.gpresentHtml = '';
                                            grate.gshow = true;
                                            grate.openshow = false;
                                        }
                                    }
                                } else {
                                    grate.rate = 'dark0';
                                    alert(res.message);
                                }
                            }).fail(function() {
                                grate.rate = 'dark0';
                                alert('网络失败');
                                return false;
                            })
                        } else {
                            grate.rate = 'dark0';
                        }
                    } else {
                        alert(res.message);
                        return false;
                    }
               }).fail(function() {
                  alert('网络连接失败！');
                   return false;
               });
           },
           onclick:function() {
                var prodId = grate.prodId;
               sessionStorage.setItem('prodid',prodId);
               window.location.href = Setting.staticRoot + '/bpage/buy.html';
           },
           openBack:function() {
               if(grate.rate != 'dark0') {
                   return false;
               }
               if(uid == undefined || uid == null || uid == '') {
                   //window.location.href = Setting.staticRoot + '/bpage/login.html';
                   Common.toLogin();
                   return false;
               }

               if(grate.disabled == 'disabled') {
                   return false;
               }

               grate.disabled = 'disabled';
               $.ajax({
                   url: Setting.apiRoot1 + '/u/appreciationInReturn/receive.p2p',
                   type: 'post',
                   dataType: 'json',
                   data:{
                       userId:uid,
                       loginToken:loginToken
                   }
               }).done(function(res) {
                   grate.disabled = '';
                    if(res.code == 1) {
                        var message = res.message;
                        if(message.indexOf('3%') != -1) {
                            galert.alertshow = {'display':'block'};
                            galert.black = 'back3';
                            $("body").css({"overflow":"hidden","height":"100%"});
                        }

                        if(message.indexOf('6%') != -1) {
                            galert.alertshow = {'display':'block'};
                            galert.black = 'back6';
                            $("body").css({"overflow":"hidden","height":"100%"});
                        }
                    } else {
                        alert(res.message);
                        return false;
                    }
               }).fail(function() {
                   alert('网络连接！');
                   return false;
               })
           }
       }
   });
    grate.ginit();
});