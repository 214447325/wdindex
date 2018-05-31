/*
* @Author: User
* @Date:   2016-07-20 18:28:38
* @Last Modified by:   User
* @Last Modified time: 2016-08-05 19:11:28
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
          //'<a href="javascript:;" class="close"></a>',
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
    
    var channelId=param.channelId;
    var $receive = $('.receive');
    var $phoneNum = $('.phoneNum');
    var phoneNum;//用户输入的手机号
    var userStatus;
    $receive.on('click',function(){
         var phoneNum = $.trim($phoneNum.val());

        if (phoneNum.length < 11) {
            alert('请你输入正确的手机号码');

        }else{
                $.ajax({
                url: Setting.apiRoot2 + '/isRegistForGetReward.p2p',
                type: 'post',
                dataType: 'json',
                data: {
                  phoneNum:phoneNum
                }
              }).done(function(res){
                if(res.code == 1){
                var data =res.data;  
                userStatus=data.userStatus;
                      if (userStatus==0 ) {
                          if (channelId==null ||channelId==undefined) {
                          window.location.href ='../pages/regist-receive.html?userStatus=' +userStatus+ '&phoneNum=' + phoneNum;//新用户转注册
                          }else{
                          window.location.href ='../pages/regist-receive.html?userStatus=' +userStatus+ '&phoneNum=' + phoneNum+ '&channelId=' +channelId;
                          }
                      }
                      if (userStatus==1) {
                          if (channelId==null ||channelId==undefined) {
                          window.location.href ='../pages/issue-success.html?userStatus=' +userStatus+ '&phoneNum=' + phoneNum;//老用户未投资
                          }else{
                          window.location.href ='../pages/issue-success.html?userStatus=' +userStatus+ '&phoneNum=' + phoneNum+ '&channelId=' +channelId;
                          }
                      } 
                      if (userStatus==2) {
                          if (channelId==null ||channelId==undefined) {
                          window.location.href ='../pages/issue-success.html?userStatus=' +userStatus+ '&phoneNum=' + phoneNum;//老用户已投资
                          }else{
                          window.location.href ='../pages/issue-success.html?userStatus=' +userStatus+ '&phoneNum=' + phoneNum+ '&channelId=' +channelId;
                          }
                      }                    
                }else{
                      alert(res.message);
                }
              }).fail(function(){
                alert('网络连接失败');
              });

          }

    })
});