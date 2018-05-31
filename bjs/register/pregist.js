/*
 * @Author: User
 * @Date:   2016-08-09 15:08:59
 * @Last Modified by:   User
 * @Last Modified time: 2016-08-24 15:01:19
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
    var uuid = $.cookie('uuid');

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
        isSer = true;
        isHomePage = true;
        isPlax = true;
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
        sendMsgCode: function(phone, type, code, callback){
            $.ajax({
                url: Setting.apiRoot1 + '/sms/send.p2p?divnceId=' + uuid,
                type: 'post',
                dataType: 'json',
                data: {
                    phoneNum: phone,
                    type: type,
                    code:code
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
    var $sendAgain = $('.send-sms-code');//发送按钮
    var $inputphone = $('[name=phone]', $registerStep1);//手机输入框
    var $msgcode = $('[name=sms-code]', $registerStep1);//验证码输入框
    var $password = $('[name=new-password]', $registerStep1);//密码输入框
    var $invite = $('[name=invite]', $registerStep1);//邀请码输入框
    var $invitation = $('.invitation');
    var $choose = $('.choose');
    var $change = $('.change');
    var $logo = $('.logo');
    var $ming= $('.ming');
    var $falsePh =$('.false-ph')//手机号报错
    var $falsePass =$('.false-pass')//密码报错
    var $falseImage = $('.false-image');//图形验证报错
    var $falseSms =$('.false-sms')//验证码报错
    var $falseInvite =$('.false-invite')//邀请码报错
    var $infoPh = $('.info-ph');//手机号错误提示信息
    var $infoPass = $('.info-pass');//密码错误提示信息
    var $infoSms = $('.info-sms');//验证码错误提示信息
    var $infoImage = $('.info-image');//图形验证提示信息
    var $infoInvite = $('.info-invite');//验证码错误提示信息
    var $rightIcon = $('.right-icon');//手机号验证icon
    var $imgeCode = $('.imgeCode');//图形验证码的信息
    var inviteCode;
    $rightIcon.hide();
    $invitation.hide();
    var formData = {};


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
            $rightIcon.hide();
            $infoPh.text('手机号码不能为空');
            $falsePh.css('visibility', 'visible');
            $this.removeClass('disabled');
            return false;
        }
        if(!Common.reg.mobile.test(ph)){
            // alert('请输入正确的手机号码！');
            $rightIcon.hide();
            $infoPh.text('请输入正确的手机号码');
            $falsePh.css('visibility', 'visible');
            $this.removeClass('disabled');
            return false;
        }
        //获取图形验证
        var _imgeVal = $.trim($imgeCode.val());
        var inputphone = $inputphone.val();//手机号的值
        if(getImageCode(_imgeVal,inputphone)){
            $.post(Setting.apiRoot1 + '/isRegist.p2p?divnceId=' + uuid,{divnceId: uuid,phoneNum: inputphone,type: 2,code: _imgeVal}, function(data) {
                if(data.code == 1) {
                    $falseImage.css('visibility', 'hidden');
                    Common.sendMsgCode(ph, 2,_imgeVal, function(data){
                        if(data.code != 1){
                            alert(data.message);
                            $this.removeClass('disabled');
                            return false;
                        }
                        startSmsTimer(function(){
                            $this.html(defText).removeClass('disabled');
                        });
                    });
                } else {
                    $falseImage.css('visibility', 'visible');
                    $infoImage.html(data.message);
                    $sendAgain.removeClass('disabled');
                    return false;
                }
            },'json');
        }
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
        $falsePh.css('visibility', 'hidden');
        $rightIcon.show();

    }

    function getImageCode(_imgeVal,inputphone) {

        if(inputphone.length == 0){
            alert('请输入手机号码！');
            $sendAgain.removeClass('disabled');
            return false;
        }

        if(!Common.reg.mobile.test(inputphone)){
            alert('请输入正确的手机号码！');
            $sendAgain.removeClass('disabled');
            return false;
        }

        if(_imgeVal == null || _imgeVal == '' || _imgeVal == undefined) {
            $falseImage.css('visibility', 'visible');
            $infoImage.html('请输入图形验证码');
            alert('请输入图形验证码');
            $sendAgain.removeClass('disabled');
            return false;
        }
        $falseImage.css('visibility', 'hidden');
        return true;

    }
    //注册信息表单验证
    function checkForm(){
        var msgcode = $.trim($msgcode.val());
        var password = $.trim($password.val());
        var inputphone = $inputphone.val();//手机号的值
        inviteCode =$.trim($invite.val());
        if(inputphone.length == 0){
            alert('请输入手机号码！');
            return false;
        }

        if(!Common.reg.mobile.test(inputphone)){
            alert('请输入正确的手机号码！');
            return false;
        }

        if(password.length == 0){
            alert('请输入密码！');
            $infoPass.text('请输入密码');
            $falsePass.css('visibility', 'visible');
            return false;
        }
        if(password.length < 6){
            alert('密码不能小于6位');
            $infoPass.text('密码不能小于6位');
            $falsePass.css('visibility', 'visible');
            return false;
        }

        if(!Common.reg.pwd.test(password)){
            alert('密码格式有误，请输入6-20位字符！');
            $infoPass.text('密码格式有误，请输入6-20位字符');
            $falsePass.css('visibility', 'visible');
            return false;
        }

        if(msgcode.length == 0){
            alert('请输入验证码');
            $infoSms.text('请输入验证码');
            $falseSms.css('visibility', 'visible');
            return false;

        }

        formData.phoneNum = $.trim(inputphone);
        formData.password = md5(password);
        formData.identifyCode = msgcode;
        formData.channelId = "1201";//人人利
        if (inviteCode!=null && inviteCode.length==4 ) {
            formData.invitationCode = inviteCode;
        }

        return true;

    }


    $inputphone.focusin(function(event) {
        // $this=$(this);
        $inputphone.css({
            backgroundImage: 'url(../images/checked1.png)',
            backgroundSize: '438px 48px'
        });
    });
    $inputphone.focusout(function(event) {
        $inputphone.css({
            backgroundImage: '',
            backgroundSize: '438px 48px'
        });
        //getSend();
    });

    $password.focusin(function(event) {
        $password.css({
            backgroundImage: 'url(../images/checked1.png)',
            backgroundSize: '438px 48px'
        });
    });
    $('.btn-sm-div').click(function() {
        getSend();
    });
    $password.focusout(function(event) {
        $password.css({
            backgroundImage: '',
            backgroundSize: '438px 48px'
        });
        var password = $.trim($password.val());
        if(password.length == 0){
            $infoPass.text('请输入密码');
            $falsePass.css('visibility', 'visible');
            return false;
        }
        if(password.length < 6){
            $infoPass.text('密码不能小于6位');
            $falsePass.css('visibility', 'visible');
            return false;
        }

        if(!Common.reg.pwd.test(password)){
            $infoPass.text('密码暂不支持特殊字符');
            $falsePass.css('visibility', 'visible');
            return false;
        }

        $falsePass.css('visibility', 'hidden');
        return true;
    });



    $msgcode.focusin(function(event) {
        $msgcode.css({
            backgroundImage: 'url(../images/checked1.png)',
            backgroundSize: '216px 54px'
        });
    });
    $msgcode.focusout(function(event) {
        $msgcode.css({
            backgroundImage: '',
            backgroundSize: '216px 54px'
        });

        var msgcode = $.trim($msgcode.val());
        // var password = $.trim($password.val());
        var inputphone = $inputphone.val();
        if(msgcode.length < 4){
            $infoSms.text('请输入4位短信验证码！');
            $falseSms.css('visibility', 'visible');
            return false;
        }else{
            formData.phoneNum = $.trim(inputphone);
            // formData.password = md5(password);
            formData.identifyCode = msgcode;

            Common.validMsgCode(formData.phoneNum, formData.identifyCode, 2, function(data){

                if(data.code == 1){
                    $falseSms.css('visibility', 'hidden');

                }else{
                    $infoSms.text('验证码输入有误');
                    $falseSms.css('visibility', 'visible');
                    return false;
                }

            });
        }

    });

//密码格式的明文密文切换
    var cipher=document.getElementById("cipher");
    $change.click(function(event) {
        cipher.type="password";
        $ming.css('display', 'block');
        $change.css('display', 'none');
    });
    $ming.click(function(event) {
        cipher.type="text";
        $ming.css('display', 'none');
        $change.css('display', 'block');
    });

//选择是否填写邀请码
    $choose.click(function(event) {
        $invitation.slideToggle(function(){
            if ($invitation.is(':hidden')) {
                $choose.css('background-image', 'url(../images/pages/la.png)');
            }else{
                $choose.css('background-image', 'url(../images/pages/xia.png)');
            }
        });
    });

    $invite.focusin(function(event) {
        $invite.css({
            backgroundImage: 'url(../images/checked1.png)',
            backgroundSize: '438px 48px'
        });
    });
    $invite.focusout(function(event) {
        $invite.css({
            backgroundImage: '',
            backgroundSize: '505px 55px'
        });
        inviteCode = $.trim($invite.val());
        if (inviteCode!=null && inviteCode!='') {
            //邀请码接口
            $.ajax({
                url: Setting.apiRoot1 + '/getUserByInviteCode.p2p',
                type: 'post',
                dataType: 'json',
                data:{
                    inviteCode: inviteCode
                }
            }).done(function(res){
                if(res.code == 1){
                    $falseInvite.css('visibility', 'hidden');
                    return true;
                }else{
                    $infoInvite.text(res.message);
                    $falseInvite.css('visibility', 'visible');
                    return false;
                }

            }).fail(function(){
                alert('网络链接失败');
                return false;
            });
        }else{
            $falseInvite.css('visibility', 'hidden');
        }

    });

//点击注册按钮
    $('.regist-button').click(function() {
        var $this = $(this);
        if($this.hasClass('disabled')){
            return false;
        }
//              alert("checkForm()的返回值"+checkForm());
        if(checkForm()){
            $this.addClass('disabled');

            // 验证码输入正确
            $.ajax({
                url: Setting.apiRoot2 + '/regist.p2p',
                type: 'post',
                dataType: 'json',
                data: formData
            }).done(function(res){

                if(res.code==1){
                    window.location.href = '../bpage/landing-success.html';
                }else{
                    alert(res.message);
                    $this.removeClass('disabled');
                    return false;
                }

            }).fail(function(){
                alert('网络链接失败');
                $this.removeClass('disabled').html('注册');
                return false;
            });
        }


    });

    $logo.click(function() {

        window.location.href = '../../pages/index.html';
    });

    //图形验证码
    var $Verification = $('.Verification-code');

    //微信才有UUID
    var img = new Image();
    img.src = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+uuid+'&time=' + Date.now();
    $Verification.html(img);

    $Verification.click(function() {
        img.src = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+uuid+'&time=' + Date.now();
        $(this).html(img);
    });
});