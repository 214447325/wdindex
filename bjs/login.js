/**
 * Created by User on 2017/6/9.
 */
$(function() {
    var param = Common.getParam();//解析地址栏中的信息
    var $phone = $('.phone');//手机号码验证框
    var $password = $('.password');//密码验证框
    var _phoneValue = '';
    var _passwordValue = '';
    var $liphone = $('.liphone');//用户框的样式
    var $lipass = $('.lipass');//密码框样式
    var $errorphone = $('.errorphone');//手机号码错误提示
    var $errorpass = $('.errorpass');//密码错误提示
    var $phoneicon = $('.phoneicon');//用户名输入正确提示
    var $passicon = $('.passicon');//密码正确提示
    var $errphone = $('.errphone');//手机号码错误文案
    var $errpass = $('.errpass');//密码错误文案
    var $showIcon = $('.show-icon');//明文、密文
    var $libtn = $('.libtn');//点击登录按钮
    var formData = {};
    var loadingText = '登录中...';
    var defText = '登录';
    $showIcon.click(function() {
        //由明文转换为密文
        if($showIcon.hasClass('ming')) {
            $showIcon.removeClass('ming').addClass('mi');
            $password.attr({'type': 'text'});
            return false;
        }

        //由密文转换为明文
        if($showIcon.hasClass('mi')) {
            $showIcon.removeClass('mi').addClass('ming');
            $password.attr({'type': 'password'});
            return false;
        }
    });

    //当用户框获取焦点的时候
    $phone.focus(function() {
        $liphone.addClass('phone-li');
    });

    //当用户框失去焦点的时候
    $phone.focusout(function() {
        $liphone.removeClass('phone-li');
        checkPhone();
    });

    //当密码框获取焦点的时候
    $password.focus(function() {
        $lipass.addClass('passli');
    });

    //当密码框失去焦点的时候
    $password.focusout(function() {
        $lipass.removeClass('passli');
        checkPass();
    });

    $libtn.click(function() {
        if(checkPhone()) {
            if(checkPass()) {
                var $this = $(this);
                if($this.hasClass('disabled')){
                    return false;
                }
                $this.addClass('disabled').text(loadingText);
                $.ajax({
                    url: Setting.apiRoot2 + '/login.p2p',
                    type: 'post',
                    dataType: 'json',
                    data: formData,
                    cache:false
                }).done(function(res){
                    if(res.code == 1){
                        var downloadStatus = sessionStorage.getItem('status');//获取首页下载APP的按钮的状态
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
                        $this.removeClass('disabled').text(defText);
                    }
                }).fail(function(){
                    alert('网络链接失败');
                    $this.removeClass('disabled').text(defText);
                    return false;
                });
            }
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


    //手机号码验证
    function checkPhone() {
        _phoneValue = $.trim($phone.val());//获取手机号码
        if(_phoneValue == undefined || _phoneValue == '' || _phoneValue == null) {
            $errorphone.show();
            $errphone.html('请您收入手机号码');
            $phoneicon.hide();
            return false;
        }

        if(!Common.reg.mobile.test(_phoneValue)) {
            $errorphone.show();
            $errphone.html('请输入正确的手机号码！');
            $phoneicon.hide();
            return false;
        }
        $errorphone.hide();
        $phoneicon.show();
        formData.loginName = _phoneValue;
        return true;
    }

    //密码验证
    function checkPass() {
        _passwordValue = $.trim($password.val());//获取密码
        if(_passwordValue == undefined || _passwordValue == '' || _passwordValue == null) {
            $errorpass.show();
            $errpass.html('请输入密码');
            $passicon.hide();
            return false;
        }

        if(_passwordValue.length < 6) {
            $errorpass.show();
            $errpass.html('请输入正确的密码');
            $passicon.hide();
            return false;
        }

        $errorpass.hide();
        $passicon.show();
        formData.password = md5(_passwordValue);
        return true;
    }

    $('.regster').click(function() {
        var _form = param.from;
        if(param.from =! null && param.from != undefined && param.from != '') {
            //window.location.href = Setting.staticRoot + '/bpage/landing-regist.html?from=' + encodeURIComponent(_form);
            //测试
            //window.location.href = Setting.staticRoot + '/bpage/landing-regist.html?from=' + encodeURIComponent(_form);
            //正式
            window.location.href = 'https://www.haolyy.com/html/1LoginRegister/login.html?from=' + encodeURIComponent(_form);
        } else {
            //window.location.href = Setting.staticRoot + '/bpage/landing-regist.html';
            //测试
            //window.location.href = Setting.staticRoot + '/bpage/landing-regist.html';
            //正式
            window.location.href = 'https://www.haolyy.com/html/1LoginRegister/login.html';
        }

    })
});