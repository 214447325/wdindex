/*
 * @Author: User
 * @Date:   2016-08-09 15:08:59
 * @Last Modified by:   User
 * @Last Modified time: 2016-08-24 15:01:19
 */

$(function(){
    var uuid = $.cookie('uuid');
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
                    Common.sendMsgCode(ph, 2,_imgeVal,uuid, function(data){
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
                    var listData = {};
                    listData.loginName = formData.phoneNum;
                    listData.password = formData.password;
                    $.ajax({
                        url: Setting.apiRoot2 + '/login.p2p',
                        type: 'post',
                        dataType: 'json',
                        data: listData,
                        cache:false
                    }).done(function(res){
                        if(res.code == 1){
                            var downloadStatus = sessionStorage.getItem('status');//获取首页下载APP的按钮的状态
                            sessionStorage.clear();
                            sessionStorage.setItem('uname', res.data.phoneNum);
                            sessionStorage.setItem('nickName',res.data.nickName);
                            sessionStorage.setItem('avatar',res.data.avatar);
                            sessionStorage.setItem('uid', res.data.id);
                            sessionStorage.setItem('uuid', res.data.weixin);
                            sessionStorage.setItem('ucode', res.data.code);
                            sessionStorage.setItem('loginToken',res.token);
                            sessionStorage.setItem('payChannel',res.data.payChannel);
                            sessionStorage.setItem('realname',res.data.name);//zyx add
                            sessionStorage.setItem('relation',res.data.relation);//zyx add
                            sessionStorage.setItem('cardNum',res.data.cardNum);//身份证
                            sessionStorage.setItem('validTrade',res.data.validTrade);//是否设置交易密码
                            sessionStorage.setItem('validName',res.data.validName);//是否设置实名认证
                            sessionStorage.setItem('status',downloadStatus);
                            sessionStorage.setItem('newProd',res.data.newProd);//是否购买过新手标
                            sessionStorage.setItem('VIP',res.data.vip);//会员等级
                            var gifts20171111 = res.data.gifts20171111;
                            //双十一活动
                            if(gifts20171111 == 0) {
                                acrive(0,res.data.giftsList20171111);
                            } else {
                                Commain.jumperPage();
                            }

                        }else{
                            alert(res.message);
                            $this.removeClass('disabled');
                        }
                    }).fail(function(){
                        alert('网络链接失败');
                        $this.removeClass('disabled');
                        return false;
                    });
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


    function acrive(act,data) {
        var actHtml = '';
        if(act == 0) {
            actHtml = actHtml + '<div class="actelevn-div2"></div>' +
            '<a class="actBtn" href="javascript:;"></a>';
        } else {
            var cardHtml = '';
            var cardTest = {};
            for(var i = 0; i < data.length; i++) {
                cardTest = {};
                //couponType 1:天数加息券，2：体验金，5：投资红包
                if(data[i].couponType == 1) {
                    cardTest.text1 =  data[i].addRate + '%天数加息券(1天)';
                    cardTest.count = data[i].awardCount + '张';
                }

                if(data[i].couponType == 2) {
                    cardTest.text1 = data[i].voucherAmt + '元体验金(1天)';
                    cardTest.count = data[i].awardCount + '张';
                }

                if(data[i].couponType == 5) {
                    cardTest.text1 =  data[i].investCouponAmt + '元投资红包';
                    cardTest.count = data[i].awardCount + '个';

                }
                cardHtml = cardHtml + '' +
                '<div class="actCard0">' +
                '<div class="actleft">' + cardTest.text1 +
                '</div>' +
                '<div class="actright">' + cardTest.count +'</div>' +
                '</div>';
            }

            actHtml = actHtml + '' +
            '<div class="actCard">' +
            '' + cardHtml + '' +
            '<div class="actrules">' +
            '<p class="ptitle">使用规则</p>' +
            '<p>1.所获礼包奖励您可以前往“账户-超值礼券”中查看；</p>' +
            '<p>2.礼包奖励适用于任意定期产品（新手标除外），100元起投；</p>' +
            '<p>3.礼包奖励有效期1周，需在到期前使用。</p>' +
            '</div>' +
            '</div>';
        }
        var _html = '<div class="actlogin">' +
            '<div class="actbanner"></div>' +
            '<div class="actelevn">' +
            '<div class="actelevn-div1"><a href="javascript:;" class="actcannel"></a></div>' +
            actHtml +
            '</div>' +
            '</div>';
        $('html').append(_html);
        $("body").css({"overflow":"hidden","height":"100%"});
        $('.actBtn').click(function() {
            $('.actlogin').remove();
            $("body").css({"overflow":"auto"});
            acrive(1,data)
        });

        $('.actcannel').click(function() {
            $('.actlogin').remove();
            $("body").css({"overflow":"auto"});
            Commain.jumperPage();
        })
    }

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