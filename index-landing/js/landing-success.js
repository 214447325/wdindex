/*
* @Author: User
* @Date:   2016-08-16 15:26:47
* @Last Modified by:   User
* @Last Modified time: 2016-08-19 20:11:12
*/

$(function(){
   var $win = $(window);
   var $body = $('body');
    var $headerOne = $('.header-ulOne');//控制首页切换
    var $headerSpan = $('.header-span-ultwo');//点击关于我们下拉框
    var $headerDiv = $('.header-ultwo-div');//关于我们的下拉框
    var $headerIm = $('.index-div-header-img2');//下拉列框图标
    var $headerThree = $('.header-ulThree');//鼠标移入平台介绍
    var $headerFour = $('.header-ulFour');//控制安全控制

    var aBox = $('.header-ultwo-li');
    var $oneli = $('.header-ulOne-li');
    var $slider = $('.slider');//控制标题栏下的黄条
    var isHomePage = true;//首页
    var isPlax = true;//平台介绍
    var isSer = true;//安全保障
    //鼠标移入首页
    $headerOne.mouseover(function() {
        $headerDiv.hide();
        $('.index-div-header-img2').attr({'src': '../../images/pages/in-head-x1.png'});
        if(isHomePage){
            isHomePage = false;
            isPlax = true;
            isSer = true;
            $slider.html('');
            $('.header-ulThree-li').html('');
            $('.header-ulOne-li').html('<img src="../../images/pages/in-head-dhx1.png" class="index-div-header-img3">');
        }
    });

    //鼠标移入平台控制界面
    $headerThree.mouseover(function() {
        $headerDiv.hide();
        $('.index-div-header-img2').attr({'src': '../../images/pages/in-head-x1.png'});
        if(isPlax) {
            isPlax = false;
            isHomePage = true;
            isSer = true;
            $slider.html('');
            $('.header-ulThree-li').html('<img src="../../images/pages/in-head-dhx1.png" class="index-div-header-img3">');
        }
    });

    //鼠标移入安全控制
    $headerFour.mouseover(function() {
        $headerDiv.hide();
        $('.index-div-header-img2').attr({'src': '../../images/pages/in-head-x1.png'});
        if(isSer) {
            isSer = false;
            isPlax = true;
            isHomePage = true;
            $slider.html('');
            $('.header-ulFour-li').html('<img src="../../images/pages/in-head-dhx1.png" class="index-div-header-img3">');
        }
    });

    //点击关于我们控制下拉框
    $headerSpan.mouseover(function() {
        isHomePage = true;
        isPlax = true;
        isSer = true;
        $headerDiv.show();
        $slider.html('');
        $headerIm.attr({'src': '../../images/pages/in-head-y1.png'});
        aBox.html('<img src="../../images/pages/in-head-dhx1.png" class="index-div-header-img3">');
        $oneli.html('');
        $('.header-ulThree-li').html('');
    });


    $('.container').mouseover(function() {
        $('.index-div-header-img2').attr({'src': '../../images/pages/in-head-x1.png'});
        $headerDiv.hide();
    });

    $('.index-introduced').mouseover(function() {
        $headerDiv.hide();
        $headerIm.attr({'src': '../../images/pages/in-head-x1.png'});
        aBox.html('');
    });
    // Default System UI
    $headerOne.click(function() {
        window.location.href = '../../pages/index.html';
    });

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

 //点击返回首页     
      $('.back-button').click(function() {
         	window.location.href = '../../pages/index.html';
      });
        $('.logo').click(function() {

              window.location.href = '../../pages/index.html';
            })

    $('.header-ulOne').click(function() {
        window.location.href = '../../pages/index.html';
    });
});