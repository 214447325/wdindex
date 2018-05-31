/**
 * Created by User on 2016/9/13.
 */
$(function() {

    var $win = $(window);
    var $body = $('body');
    
    //add by zyx 20160916 begin
    var username=document.cookie.split(";")[0].split("=")[1];
	//JS操作cookies方法!
	//写cookies
	function setCookie(name,value)
	{
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	}
	
	function getCookie(name)
	{
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	}


	var url = location.search; //获取url中"?"符后的字串
	var param = {};
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			param[strs[i].split("=")[0]] = decodeURIComponent(strs[i]
					.split("=")[1]);
		}
	}

	var utm_source = param.utm_source;
	var uid = param.uid;
	
	if(uid==null || uid==undefined || uid=='' || uid.length<2){
		uid=1316;
	}
	
	setCookie('fbb_utm_source', utm_source);
	setCookie('fbb_uid', uid);
	
	//BUHUIDIU
	if(utm_source=='fbaba'){
		sessionStorage.setItem('channelId', 1265);
	}
	sessionStorage.setItem('fbbuid', uid);
	//add by zyx 20160916 end

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
                });
                $body.append($alert);
            }
        });
    }();

    //banner轮播控制
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        autoplay : 3000,
        autoplayDisableOnInteraction : false,
        grabCursor : true,
        loop : true,
        slidesPerView: 1,
        paginationClickable: true,
        mousewheelControl: false

    });

    var $loginbtn = $('.loginbtn');//点击立即注册按钮
    var $serverActive = $('.servertd');//周周涨
    var $fixed = $('.fixed');//固定收益活动
    var $float = $('.floatTd');//浮动收益活动

    //点击界面上的马上注册按钮
    $loginbtn.click(function() {
        window.location.href = '#loginTable';
    });

    //鼠标移入和移出周周涨
    $serverActive.mouseover(function(data) {
        $('.server-span').addClass('server-span-content').show();
        $('.servertd').addClass('server');
        $('.index-table1-serven').addClass('server-img');
    });

    $serverActive.mouseout(function() {
        $('.server-span').removeClass('server-span-content');
        $('.servertd').removeClass('server');
        $('.index-table1-serven').removeClass('server-img');
    });

    //鼠标移入和移出固定收益活动
    $fixed.mouseover(function(data) {
        $('.index-table1-income').addClass('server-img');
        $('.fixed').addClass('server');
        $('.fixed-span').addClass('fixed-span-content');
    });

    $fixed.mouseout(function() {
        $('.index-table1-income').removeClass('server-img');
        $('.fixed').removeClass('server');
        $('.fixed-span').removeClass('fixed-span-content');
    });

    //浮动收益资产组合
    $float.mouseover(function(data) {
        $('.index-table1-float').addClass('server-img');
        $('.floatTd').addClass('server');
        $('.float-span').addClass('fixed-span-content');
    });

    $float.mouseout(function() {
        $('.index-table1-float').removeClass('server-img');
        $('.floatTd').removeClass('server');
        $('.float-span').removeClass('fixed-span-content');
    });

    var Common = {};
    // 公用变量
    $.extend(Common, {
        vars: {
            // 短信发送等待时间
            sendWait: 60
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
    var $sendAgain = $('.send-sms-code');//发送按钮
    var $inputphone = $('[name=phone]', $registerStep1);//手机输入框
    var $msgcode = $('[name=sms-code]', $registerStep1);//验证码输入框
    var $password = $('[name=new-password]', $registerStep1);//密码输入框

    var $falsePh =$('.phonewr');//手机号报错
    var $falsePass =$('.passerror');//密码报错
    var $falseSms =$('.msgerror');//验证码报错

    var $infoPh = $('.phWrong');//手机号错误提示信息
    var $infoPass = $('.passWrong');//密码错误提示信息
    var $infoSms = $('.msgWrong');//验证码错误提示信息
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
            $falsePh.show();
            $infoPh.html('手机号码不能为空');
            $this.removeClass('disabled');
            return false;
        }
        if(!Common.reg.mobile.test(ph)){
            $falsePh.show();
            $infoPh.text('请输入正确的手机号码');
            $this.removeClass('disabled');
            return false;
        }
        Common.sendMsgCode(ph, 2, function(data){

            if(data.code != 1){
                $falsePh.show();
                $infoPh.text(data.message);
                $this.removeClass('disabled');
                return false;
            }

            $('.phonewr').hide();
            $('.phIcon').show();
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

    //离开手机号码时判断手机号码是否符合
    //$inputphone.focusout(function(event) {
    //    getSend();
    //});

    //判断验证码输入是否正确
    $msgcode.focusout(function(event) {
        var msgcode = $.trim($msgcode.val());
        var inputphone = $inputphone.val();
        if(msgcode.length < 4){
            $falseSms.show();
            $infoSms.text('请输入4位短信验证码！');
            return false;
        }else{
            Common.validMsgCode($.trim(inputphone), msgcode, 2, function(data){
                if(data.code == 1){
                    formData.phoneNum = $.trim(inputphone);
                    formData.identifyCode = msgcode;
                    $falseSms.hide();
                }else{
                    $falseSms.show();
                    $infoSms.text('验证码输入有误');
                    return false;
                }

            });
        }

    });

    //判断输入的密码是否符合
    $password.focusout(function(event) {
        var password = $.trim($password.val());
        if(password.length == 0){
            $infoPass.text('请输入密码');
            return false;
        }
        if(password.length < 6){
            $infoPass.text('密码不能小于6位');
            return false;
        }

        if(!Common.reg.pwd.test(password)){
            $infoPass.text('密码暂不支持特殊字符');
            return false;
        }

        return true;
    });

    //点击重新获取验证码按钮
    $sendAgain.click(function() {
        getSend();
    });

    //点击注册按钮
    $('.btnSub').click(function() {
        if(checkForm()){
            // 验证码输入正确
            $.ajax({
                url: Setting.apiRoot2 + '/regist.p2p',
                type: 'post',
                dataType: 'json',
                data: formData
            }).done(function(res){
                if(res.code==1){
                    window.location.href = '../../index-landing/pages/landing-success.html';
                }else{
                    alert(res.message);
                    return false;
                }

            }).fail(function(){
                alert('网络链接失败');
                return false;
            });
        }

    });

    //注册信息表单验证
    function checkForm(){
        var msgcode = $.trim($msgcode.val());
        var password = $.trim($password.val());
        var inputphone = $inputphone.val();//手机号的值
        if(inputphone.length == 0){
            alert('请输入手机号码！');
            $falsePh.show();
            $infoPh.html('手机号码不能为空');
            return false;
        }

        if(!Common.reg.mobile.test(inputphone)){
            alert('请输入正确的手机号码！');
            $falsePh.show();
            $infoPh.html('请输入正确的手机号码！');
            return false;
        }

        if(password.length == 0){
            alert('请输入密码！');
            $falsePass.show();
            $infoPass.text('请输入密码');
            return false;
        }
        if(password.length < 6){
            alert('密码不能小于6位');
            $falsePass.show();
            $infoPass.text('密码不能小于6位');
            return false;
        }

        if(!Common.reg.pwd.test(password)){
            alert('密码格式有误，请输入6-20位字符！');
            $falsePass.show();
            $infoPass.text('密码格式有误，请输入6-20位字符');
            return false;
        }

        if(msgcode.length == 0){
            alert('请输入验证码');
            $falseSms.show();
            $infoSms.text('请输入验证码');
            return false;
        }
        formData.phoneNum = $.trim(inputphone);
        formData.password = md5(password);
        formData.identifyCode = msgcode;
        
        //add by zyx 20160916
        formData.channelId = sessionStorage.getItem('channelId');
        formData.fbbuid = sessionStorage.getItem('fbbuid');
        
        
        //隐藏错误提示
        $falsePh.hide();
        $falsePass.hide();
        $falseSms.hide();
        return true;
    }

});

//媒体报道跳转
function getActiveAddress(page) {
    window.location.href = '../../pages/general.html?pages=2&activeImg='+ page;
}
