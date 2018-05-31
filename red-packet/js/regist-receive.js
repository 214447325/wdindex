/*
* @Author: User
* @Date:   2016-07-21 10:54:32
* @Last Modified by:   User
* @Last Modified time: 2016-07-25 19:19:01
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

     var $registerStep1 = $('.inviteregister');//注册的form表单
     var $sendAgain = $('.send-sms-code');//重新发送按钮
     var $inputphone = $('[name=phone]', $registerStep1);//注册的手机号
     var phoneNum=param.phoneNum;//获取上页面的手机号
     $inputphone.val(phoneNum);
     getSend();
     $('.send-sms-code').click(function() {
	//点击验证码按钮的时候重新发送验证码	
	getSend();
     });

      // 为用户发送短信验证码
function getSend() {
      var smsTimer;
      var defText = '重新发送';
      var timeText = '<strong>{time}</strong>s';


          var ph = $inputphone.val();
          var $this = $sendAgain;
          if($this.hasClass('disabled')){
              return false;
          }
          $this.addClass('disabled');
          if(ph=="" || ph.length == 0){
              alert('手机号码不能为空！');
              $this.removeClass('disabled');
              return false;
          }
          if(!Common.reg.mobile.test(ph)){
              alert('请输入正确的手机号码！');
              $this.removeClass('disabled');
              return false;
          }

          Common.sendMsgCode(ph, 2, function(data){
              if(data.code != 1){
                 alert(data.message);
                  $this.removeClass('disabled');
                  return false;
              }
              startSmsTimer(function(){
                  $this.html(defText).removeClass('disabled');
              });
          });


      // 短信发送定时器
      function startSmsTimer(timeOver){
          if(!!smsTimer){
              clearInterval(smsTimer);
          }
          var _i = Common.vars.sendWait;
          smsTimer = setInterval(function(){
              $sendAgain.html(timeText.replace(/{time}/, _i--));
              if(_i < 0){
                  clearInterval(smsTimer);
                  smsTimer = null;
                  timeOver();
              }
          }, 1000);
      }
}

      var formData = {};
      
      function checkForm(){
      // 注册提交
      var $msgcode = $('[name=sms-code]', $registerStep1);//验证码
      var $password = $('[name=new-password]', $registerStep1);//密码
      var msgcode = $.trim($msgcode.val());
      var password = $.trim($password.val());
      var inputphone = $inputphone.val();//手机号

      if(inputphone.length == 0){
          alert('请输入手机号码！');
          return false;
      }

      if(!Common.reg.mobile.test(inputphone)){
          alert('请输入正确的手机号码！');
          return false;
      }

      if(msgcode.length == 0){
          alert('请输入验证码！');
          return false;
      }

      if(password.length == 0){
          alert('请输入密码！');
          return false;
      }

      if(!Common.reg.pwd.test(password)){
          alert('密码格式有误，请输入6-20位字符！');
          return false;
      }

      formData.phoneNum = $.trim(inputphone);
      formData.password = md5(password);
      formData.identifyCode = msgcode;




      var channelId = param.channelId;

      if(channelId==null || channelId==undefined){
          channelId =null; //当没有默认渠道的时候
      }else{
          formData.channelId = channelId;
      }

      return true;
  }
   
         
         $('.inviteMoneybtn ').click(function() {
         var phoneNum= $inputphone.val();//手机号
          var $this = $(this);
          if($this.hasClass('disabled')){
              return false;
          }
          if(checkForm()){

              // 验证短信验证码是否正确
              Common.validMsgCode(formData.phoneNum, formData.identifyCode, 2, function(data){
                  if(data.code != 1){
                      alert('验证码输入有误！');
                      return false;
                  }

                  // 验证码输入正确
                  $.ajax({
                      url: Setting.apiRoot2 + '/registForInvestPackage.p2p',
                      type: 'post',
                      dataType: 'json',
                      data: formData
                  }).done(function(res){
                      if(res.code == 1){
                          alert('红包领取成功');
                         function  jumurl(){
                              window.location.href = '../pages/issue-success.html?userStatus=0&phoneNum=' + phoneNum;
                          }
                          setTimeout(jumurl,1000);
                      }else if(res.code == -1){
                          alert(res.message);
                          $this.removeClass('disabled');

                      }else{
                          alert(res.message);
                          $this.removeClass('disabled');
                          return false;
                      }

                  }).fail(function(){
                      alert('网络链接失败');
                      $this.removeClass('disabled');
                      return false;
                  });
              });
          }
      });

});