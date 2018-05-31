/*
* @Author: User
* @Date:   2016-08-09 15:07:15
* @Last Modified by:   User
* @Last Modified time: 2016-08-10 19:10:32
*/

$(function(){
   var $win = $(window);
   var $body = $('body');   

  // Default System UI
  !function(){
    window._alert = alert;
    window._confirm = confirm;

    var _dialogTpl = doT.template([
      '<div class="ui-alert backdrop">',
        '<div class="dialog-content"> ',
           '<h3 class="dialog-title">温馨提示</h3>',
           '<div class="dialog-article">',
             '<p class="alert-message">{{=it.message}}</p>',
           '</div>',
           '<div class="tc btn-box2 full-btn "><!-- 按钮 -->',
             '<a href="javascript:;" class="btn btn-default btn-sm submit">确定</a>',
             '{{?it.type == "confirm"}}',
             '<a href="javascript:;" class="btn btn-border btn-sm cancel">取消</a>',
             '{{?}}',
           '</div>',
        '</div>',
      '</div>'
    ].join(''));

    $.extend(window, {
      alert: function(str, cb){
        var $alert = $(_dialogTpl({
          type: 'alert',
          message: str
        }));
        $alert.on('click', '.close', function(){
          $alert.remove();
        }).on('click', '.submit', function(){
          $alert.remove();
          cb && cb();
        });
        $body.append($alert);
      },
      confirm: function(str, sb, cl){
        var $alert = $(_dialogTpl({
          type: 'confirm',
          message: str
        }));
        $alert.on('click', '.close', function(){
          $alert.remove();
        }).on('click', '.submit', function(){
          $alert.remove();
          sb && sb();
        }).on('click', '.cancel', function(){
          $alert.remove();
          cl && cl();
        });;
        $body.append($alert);
      }
    });
  }();

    var Common = {}
  // 公用变量
  $.extend(Common, {
    vars: {
      // 短信发送等待时间
      sendWait: 60,
    }
  });

    // 正则
  $.extend(Common, {
    reg: {
      mobile: /^((\+86)|(\(\+86\)))?-?(13|14|15|18|17)[0-9]{9}$/, // 验证手机号码
      pwd: /^[a-zA-Z0-9]{6,20}$/, // 登录密码 6-16位字符
      payPwd: /^[0-9]{6}$/, // 交易密码 6-16位字符
      isNum: /^[0-9]*$/,
      money: /^\d{1,12}(?:\.\d{1,2})?$/, // money
      idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/ // 身份证
    }
  });

    //function
    $.extend(Common, {
      /**
     * 短信验证码发送
     * @param {number} [phone] [手机号码 ]
     * @param {number} [type] [1：找回密码短信 2：注册验证码 3：找回交易密码验证码]
     * @param {function} [callback] [发送状态回调]
     * @return {[type]} [description]
     */
    sendMsgCode: function(phone, type, callback){
      $.ajax({
        url: Setting.apiRoot1 + '/sms/send.p2p',
        type: 'post',
        dataType: 'json',
        data: {
          phoneNum: phone,
          type: type
        }
      }).done(function(res){
        callback(res);
      }).fail(function(){
        callback({
          code: -1,
          message: '网络链接失败！'
        });
      });
    },
    /**
     * 验证短信验证码正确性
     * @param  {[type]}   phone    [手机号码 ]
     * @param  {[type]}   code     [验证码]
     * @param  {[type]}   type     [1：找回密码短信 2：注册验证码]
     * @param  {Function} callback [验证回调]
     */
    validMsgCode: function(phone, code, type, callback){
      $.ajax({
        url: Setting.apiRoot1 + '/sms/validate.p2p',
        type: 'post',
        dataType: 'json',
        data: {
          phoneNum: phone,
          identifyCode: code,
          type: type
        }
      }).done(function(res){
        callback(res);
      }).fail(function(){
        callback({
          code: -1,
          message: '网络链接失败！'
        });
      });
    }
    });
    window.Common = Common;

    //获取上个页面的参数	
    var url = location.search; //获取url中"?"符后的字串
    var param = {};
    if (url.indexOf("?") != -1) {
       var str = url.substr(1);
       strs = str.split("&");
       for(var i = 0; i < strs.length; i ++) {
          param[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
       }
    }

//定义
     var $index = $('.index');

     var maxRate;//七天乐
     var minRate;

 //点击注册        
      $('.regist').click(function() {
         	window.location.href = '../pages/wdclc-regist.html';
      });

//点击侧边栏七天乐 定期 浮动 切换选项卡
      $index.on('click', '.menu li', function(){
        var $this = $(this);
        $this.addClass('current').siblings('.current').removeClass('current');
        var target= $this.data('type');
        $('.' + target).addClass('current').siblings('.current').removeClass('current');
      });


      //查询产品接口  
      !function() {

                      //七天乐 获得利率
                      $.ajax({

                          url:Setting.apiRoot1 + '/queryProdInfo.p2p',
                          type:"post",
                          dataType:'json',
                          data:{
                           loanType:1,
                           type:1
                          }
                        }).done(function(res){
                            if(res.code==1){
                            var data=res.data;
                            maxRate=data[0].maxRate;
                            minRate=data[0].minRate;
                            console.log(maxRate);
                            }else{
                              alert(res.message);
                                return false;
                            }

                        }).fail(function(){
                          alert('网络链接失败');
                          return false
                        });


                      // //定期 获取利率
                      // $.ajax({
                      //     url:Setting.apiRoot1 + '/queryProdInfo.p2p',
                      //     type:"post",
                      //     dataType:'json',
                      //     data:{
                      //      loanType:1,
                      //      type:3
                      //     }
                      //   }).done(function(res){
                      //       if(res.code==1){
                      // var data=res.data;
                      //       }else{
                      //         alert(res.message);
                      //           return false;
                      //       }

                      //   }).fail(function(){
                      //     alert('网络链接失败');
                      //     return false
                      //   });


                      // //浮动收益 获取净值
                      // $.ajax({
                      //   url:Setting.apiRoot1 + '/queryProdInfo.p2p',
                      //   type:"post",
                      //   dataType:'json',
                      //   data:{
                      //    loanType:1,
                      //    type:4
                      //   }
                      // }).done(function(res){
                      //     if(res.code==1){
                      //   var data=res.data;
                      //   var loanId=data[0].productId;
                      //   cycle=data[0].cycle;
                      //   cycleType=data[0].cycleType;
                      //   Rate=data[0].minRate;
                      //   //alert(Rate);
                              
                      //   $amount.text(Common.comdify(data[0].amount));//可购份额
                      //          amount1=data[0].amount;
                      //          getFloatBuyValue(cycleType, amount1);
                      //          //alert(amount1);
                      //     }else{
                      //       alert(res.message);
                      //         return false;
                      //     }

                      // }).fail(function(){
                      //   alert('网络链接失败');
                      //   return false
                      // });

      }();

});