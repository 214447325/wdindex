/**
 * Created by User on 2017/8/24.
 */
var Commain = {};
var $html = $('html');
$.extend(Commain, {
    /**
     * 加载css样式
     * @param appHref 样式的地址
     */
    appendCss: function(appHref) {
        var $head = $('head');
        $head.append("<link>");
        css = $head.children(":last");
        css.attr({
            rel: "stylesheet",
            type: "text/css",
            href: appHref
        });
    },


    /**
     * 验证输入框只能输入数字
     * 需要验证的输入框
     * @param $input
     */
    inputChange: function($input) {
        $input.on('input change',function(e){
            var $this = $(this);
            var money = $.trim($this.val());
            money = parseFloat(money);

            if(isNaN(money)){
                $this.val('');
                return false;
            }

            if(e.type == 'change'){
                $this.val(parseFloat($this.val()).toFixed(2));
            }

        });
    },
    /**
     * 到登录页面
     * @param {url} 登录成功后回调页面
     * @return {[type]} [description]
     */
    toLogin: function(href){
        href = href || window.location.href;
        //alert('请先登录！', function(){
        window.location.replace(Setting.staticRoot + '/bpage/login.html?from=' + encodeURIComponent(href));
        //});
    },
    /**
     * confirm弹框
     * _text弹出内容
     * _btn1左边按钮文案
     * _btn2右边按钮文案
     * _click1点击左边按钮触发方法
     * _click2点击右边按钮触发方法
     */
    commonConfirm: function(_text,_btn1,_btn2,_click1,_click2) {
        var _commonConfirm = '';
        _commonConfirm = _commonConfirm + '<div class="conMain">' +
        '<div class="conMainBody"></div>' +
        '<div class="confim-box">' +
        '<div class="confimHead"><div class="confim-head"></div></div>' +
        '<div class="confimTitle">温馨提示</div>' +
        '<div class="confimText">' + _text + '</div>' +

        '<div class="confirm-bottom">' +
        '<div class="confirm-left"><a href="javascript:;">' + _btn1 + '</a></div>' +
        '<div class="confirm-right"><a href="javascript:;">' + _btn2 + '</a></div>' +
        '</div>' +

        '</div>' +
        '</div>';

        $html.append(_commonConfirm);
        $("body").css({"overflow":"hidden","height":"100%"});
        //点击关闭按钮
        $('.confim-head').click(function() {
            $('.conMain').remove();
            $("body").css({"overflow":"auto"});
        });

        //点击左边按钮的方法
        $('.confirm-left').click(function() {
            $('.conMain').remove();
            $("body").css({"overflow":"auto"});
            _click1 && _click1();
        });

        //点击右边的执行方法
        $('.confirm-right').click(function() {
            $('.conMain').remove();
            $("body").css({"overflow":"auto"});
            _click2 && _click2();
        });

    },
    /**
     * 特殊alert弹框
     * _click点击自定义的触发事件
     * 自带按钮颜色
     * _text文案内容
     * _btnText按钮内容
     * _click点击按钮触发事件
     *_closeClick点击关闭按钮触发事件
     * _textcolor内容颜色
     * color 按钮颜色
     * background按钮背景色
     */
    commonAlert: function(_text,_btnText,_click,_closeClick,_textcolor ,color,background) {
        if(color == undefined || color == null || color == '') {
            color = '#000000'
        }

        if(background == undefined || background == null || background == '') {
            background = '#ffffff'
        }

        if(_textcolor == undefined || _textcolor == null || color == '') {
            _textcolor = '#000000'
        }

        var _commonAlert = '';
        _commonAlert = _commonAlert + '<div class="conMain">' +
        '<div class="conMainBody"></div>' +
        '<div class="alert-box">' +
        '<div class="alertHead"><div class="confim-head"></div></div>' +
        '<div class="alertTitle">温馨提示</div>' +
        '<div class="alertText" style="color:' + _textcolor + ';">' + _text + '</div>' +

        '<div class="alert-bottom" style="background:' + background + ';">' +
         '<a href="javascript:;" style="color: ' + color + ';">' + _btnText +'</a>'+
        '</div>' +

        '</div>' +
        '</div>';
        $html.append(_commonAlert);
        $("body").css({"overflow":"hidden","height":"100%"});
        //点击关闭按钮
        $('.confim-head').click(function() {
            $('.conMain').remove();
            $("body").css({"overflow":"auto"});
            _closeClick && _closeClick();
        });

        //点击普通按钮
        $('.alert-bottom').click(function() {
            $('.conMain').remove();
            $("body").css({"overflow":"auto"});
            _click && _click();
        });
    },
    /**
     * 自定义小弹框
     * _text提示内容
     */
    backgAlert:function(_text) {
        var _backgAlert = '';
        _backgAlert = _backgAlert + '<div class="backg conMain">' +
        '<div class="conMainBody"></div>' +
        '<div class="backgAlert">' + _text + '</div>' +
        '</div>';
        $html.append(_backgAlert);
        $("body").css({"overflow":"hidden","height":"100%"});
        setTimeout(function() {
            $('.backg').remove();
            $("body").css({"overflow":"auto"});
        },2000);
    },

    /**
     * 输入交易密码弹框
     */
    payPass:function() {
        var _payPass = '';
        _payPass = _payPass + '<div class="conMain">' +
        '<div class="conMainBody"></div>' +
        '<div class="pay-box">' +
        '<div class="payHeader"><div class="pay-head"></div></div>' +
        '<div class="payDiv">' +
        '<div class="input-box"><span class="box"></span>' +
        '<span class="box"></span>' +
        '<span class="box"></span>' +
        '<span class="box"></span>' +
        '<span class="box"></span>' +
        '<span class="box"></span>' +
        '<input type="number" maxlength="6" class="input" value="">' +
        '</div>' +
        '<div class="forget-box">' +
        '<div class="forget"><div class="forgetright"><a href="javascript:;" class="getBtn">忘记密码?</a></div></div>' +
        '<div class="payButton"><a href="javascript:;" class="subPayBtn">确认付款</a></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
        $html.append(_payPass);
        $("body").css({"overflow":"hidden","height":"100%"});
        var $inputBox = $('.input-box');
        var $boxs = $('.box', $inputBox);
        $inputBox.on(' input focus blur', 'input', function(e){
            var $this = $(this);

            if(e.type == 'keydown'){
                var code = e.keyCode;
                if(code != 8 && (code < 48 || code > 57)){
                    return false;
                }
            }
            var val = $.trim( $this.val() );
            pass = val;//parseInt(val);

            isNaN(pass) && ( pass = '' );

            pass = pass + '';
            if(pass.length > 6){
                pass = pass.substring(0, 6);
            }
            $inputBox.find('input').val(pass);

            if(e.type == 'focusout'){
                $boxs.removeClass('focus');
            }
            var len = pass.length;
            if(e.type == 'focusin'){
                len == 0 ? (true) : (len = len - 1);
            }
            $boxs.eq(len).addClass('focus').siblings('.focus').removeClass('focus');
            var passArr = pass.split('');
            $boxs.each(function(index, box){
                var $box = $(box);

                if(!!passArr[index]){
                    $box.addClass('full');
                }else{
                    $box.removeClass('full');
                }
            });
        });

        //点击关闭弹窗按钮
        $('.pay-head').click(function() {
            $('.conMain').remove();
            $("body").css({"overflow":"auto"});
        });

        //点击忘记密码按钮
        $('.getBtn').click(function() {
            $('.conMain').remove();
            $("body").css({"overflow":"auto"});
            Commain.forgetPass();
        });

        $('.subPayBtn').click(function() {
           //console.log(pass)
        });

    },
    //实名认证
    realName: function(realNo,listData) {
        var _realName = '';
        var realNameDiv = '';
        var _closeHtml = '';
        if(realNo == 1) {
            _closeHtml = '<div class="closeDiv"><img src="../images/pages/index/cancel.png" class="close"></div>';
            realNameDiv = '<div class="realtop">' +
            '</div>' +
            '<div class="realContent">' +
            '<div class="realContent-top">为了您的账户安全，请先进行实名认证</div>' +
            '<div class="realForm">' +
            '<div class="realDiv1">' +
            '<div class="realDiv1-left">真实姓名:</div>' +
            '<div class="realDiv1-right">' +
            '<input class="realUserName" type="text" maxlength="12" name="realUserName" placeholder="请输入真实姓名" />' +
            '</div>' +
            '' +
            '</div>' +
            '<div class="realDiv1">' +
            '<div class="realDiv1-left">身份证号:</div>' +
            '<div class="realDiv1-right">' +
            '<input class="realUserNo" type="text" maxlength="20" placeholder="请输入身份证号" />' +
            '</div>' +
            '</div>' +
            '<a href="javascript:;">' +
            '<div class="realBtn next" id="next">下一步</div>' +
            '</a>' +
            '</div>' +
            '</div>' ;
        }
        if(realNo == 2) {
            _closeHtml = '';
            realNameDiv = '<div class="realtop1">' +
            '</div>' +
            '<div class="realContent">' +
            '<div class="realContent-top">为了您的账户安全，请设置6位交易密码</div>' +
            '<div class="realForm">' +
            '<div class="realDiv1">' +
            '<div class="realDiv1-left">创建交易密码:</div>' +
            '<div class="realDiv1-right">' +
            '<input class="realpass1" type="password" maxlength="6"  placeholder="创建交易密码(6位数字)" name="deal-password"/>' +
            '</div>' +
            '</div>' +
            '<div class="realDiv1">' +
            '<div class="realDiv1-left">确认交易密码:</div>' +
            '<div class="realDiv1-right">' +
            '<input class="realpass2" type="password" maxlength="6"  placeholder="确认交易密码(6位数字)" name= "password-agin"/>' +
            '</div>' +
            '</div>' +
            '<a href="javascript:;">' +
            '<div class="realBtn  subPass" id="subPass">确认</div>' +
            '</a>' +
            '</div>' +
            '</div>';
        }
        _realName = _realName + '<div class="conMain">' +
        '<div class="conMainBody"></div>' +
        '<div class="realNameBox">' + _closeHtml +
            '<div class="realNameDiv">' + realNameDiv +
            '</div>' +
        '</div>' +
    '</div>';
        $html.append(_realName);
        $("body").css({"overflow":"hidden","height":"100%"});

        //点击关闭按钮
        $('.close').click(function() {
            $('.conMain').remove();
            $("body").css({"overflow":"auto"});
        });

        //var $name = $('.realUserName');
        //$name.on('input change',function(e){
        //    var $this = $(this);
        //    var name = $.trim($this.val());
        //    $this.val(name);
        //});
        //
        //var $no = $('.realUserNo');
        //$no.on('input change',function(e){
        //    var $this = $(this);
        //    var no = $.trim($this.val());
        //    $this.val(no);
        //});

        //点击下一步（实名认证）
        $('#next').click(function() {
            if($(this).hasClass('disabled')) {
                return false;
            }
            validate(listData);
        });
        //点击确认按钮（设置交易密码）
        $('#subPass').click(function() {
            if($(this).hasClass('disabled')) {
                return false;
            }
            modify(listData);
        })
    },
    /**
     * 修改密码
     *
     *
     */
    forgetPass:function() {
        var uuid = sessionStorage.getItem('uuid');
        var imgSrc = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+uuid+'&time=' + Date.now();
        var _forgetPass = '';
        _forgetPass = _forgetPass + '' +
        '<div class="conMain">' +
            '<div class="conMainBody"></div>' +
            '<div class="forgetBox">' +
                '<div class="closeDiv">' +
                    '<img src="../images/pages/index/cancel.png" class="close">' +
                '</div>' +
                '<div class="forgetTitle">找回交易密码</div>' +
                    '<div class="forget-div">' +
                        '<div class="forget1">' +
                            '<div class="text userText">手机号：</div>' +
                            '<div class="forget-input">' +
                                '<input type="text" class="phone" name="phone" placeholder="请输入手机号" maxlength="13"/>' +
                            '</div>' +
                        '</div>' +
                        '<div class="forget1">' +
                            '<div class="text userText">图形验证：</div>' +
                            '<div class="forget-input-img">' +
                                '<input name="img-code" type="text"  class="imgcode" placeholder="请输入图形验证码" maxlength="4"/>' +
                            '</div>' +
                            '<div class="imgCode">' +
                                '<a href="javascript:;"><img src="' + imgSrc + '" class="img-code" /></a>' +
                            '</div>' +
                        '</div>' +
                    '<div class="forget2">' +
                        '<div class="forget3">' +
                            '<div class="text userText">验证码：</div>' +
                                '<div class="div-code">' +
                                    '<input type="number" placeholder="请输入短信验证码" name="code"  oninput="if(value.length>6)value=value.slice(0,6)"/>' +
                                '</div>' +
                            '</div>' +
                        '<a href="javascript:;">' +
                            '<div class="forget4 send-sms-code">获取验证码</div>' +
                        '</a>' +
                    '</div>' +
                    '<div class="forget1">' +
                        '<div class="text userText">新交易密码：</div>' +
                            '<div class="forget-input">' +
                                '<input type="password" class="new_psd" name="new_psd"  placeholder="请输入6位新交易密码" maxlength="6"/>' +
                            '</div>' +
                        '</div>' +
                        '<div class="forget1">' +
                            '<div class="text userText">确认密码：</div>' +
                            '<div class="forget-input">' +
                                '<input type="password" class="agin_psd " name="agin_psd " placeholder="请再次输入交易密码" maxlength="6"/>' +
                            '</div>' +
                        '</div>' +
                        '<a href="javascript:;">' +
                            '<div class="forgetBtn">确定</div>' +
                        '</a>' +
                    '</div>' +
                '</div>' +
            '</div>';
        $html.append(_forgetPass);
        $("body").css({"overflow":"hidden","height":"100%"});
        forGetPass(uuid);
    },
    /**
     * 修改密码
     * @param type
     * type = 2为修改交易密码
     * type = 1 为修改登录密码
     */
    updatePass:function(type) {
        var _updateTitle = '';
        var _oldPass = '';
        var _newPass = '';
        var _again = '';
        var maxLength = '';
        if(type == 2) {
            _updateTitle = '修改交易密码';
            _oldPass = '请输入6位旧交易密码';
            _newPass = '请输入6位新交易密码';
            _again = '请再次输入交易密码';
            maxLength = 6;
        }

        if(type == 1) {
            _updateTitle = '修改登录密码';
            _oldPass = '请输入(6-20)位旧登录密码';
            _newPass = '请输入(6-20)位新登录密码';
            _again = '请再次输入登录密码';
            maxLength = 20;
        }
        var _updatePass = '';
        _updatePass = _updatePass + '' +
        '<div class="conMain">' +
        '<div class="conMainBody"></div>' +
        '<div class="updateBox">' +
        '<div class="closeDiv">' +
        '<img src="../images/pages/index/cancel.png" class="close">' +
        '</div>' +
        '<div class="updateTitle">' + _updateTitle + '</div>' +
        '<div class="update-div">' +
        '<div class="update1"><div class="updateText">旧密码：</div><div class="update-input"><input type="password" name="old-password" maxlength="' + maxLength +'" placeholder="' + _oldPass + '" /></div></div>' +
        '<div class="update1"><div class="updateText">新密码：</div><div class="update-input"><input type="password" name="new-password" maxlength="' + maxLength + '" placeholder="' + _newPass + '"/></div></div>' +
        '<div class="update1"><div class="updateText">确认密码：</div><div class="update-input"><input type="password" name="agin-password" maxlength="' + maxLength + '" placeholder="' + _again + '" /></div></div>' +
        '<a href="javascript:;"><div class="updateBtn">确定</div></a>' +
        '</div>' +
        '</div>' +
        '</div>';
        $html.append(_updatePass);
        $("body").css({"overflow":"hidden","height":"100%"});
        updatePassGet(type);
    },
    bankCard: function() {
      var _bankCard = '';
        _bankCard = _bankCard + '' +
        '<div class="conMain">' +
        '<div class="conMainBody"></div>' +
        '<div class="bankCardBox">' +
        '<div class="closeDiv">' +
        '<img src="../images/pages/index/cancel.png" class="close">' +
        '</div>' +
        '<div class="bankCard-div">' +
        '<div class="bankdiv1"><div class="bankLeft">银行卡</div><div class="bankRight"><input type="number" class="bank-Card"  placeholder="请输入银行卡号" /></div></div>' +
        '<div class="bank-rules-title">为您投资方便建议您绑定以下银行卡：</div>' +
        '<div class="bank-Text">中国工商银行、中国建设银行、中国交通银行、中信银行、中国光大银行、平安银行、浦发银行</div>' +
        '<a href="javascript:;"><div class="bankClick">确定</div></a>' +
        '</div>' +
        '</div>' +
        '</div>';
        $html.append(_bankCard);
        $("body").css({"overflow":"hidden","height":"100%"});
        bankCardNo();
    },
    jumperPage:function() {
        var param = Common.getParam();//解析地址栏中的信息
        if(param.from!=null && param.from!=undefined){
            var pageUrl = decodeURIComponent(param.from);
            if(pageUrl.indexOf('account.html') != -1) {
                if(pageUrl.indexOf('formPages') != -1) {
                    window.location.href = decodeURIComponent(param.from);
                } else {
                    window.location.href =  '../bpage/account.html?formPages=0';
                }
            } else {
                window.location.href = decodeURIComponent(param.from);
            }

        }else{
            var formPages = param.formPages;
            if(formPages == undefined || formPages == null || formPages == '') {
                formPages = 0;
            }
            window.location.href =  '../bpage/account.html?formPages=' + formPages;
        }
    },
    /**
     * 用来添加分享
     * @param addshare 添加的类
     * @param share  背景色
     * @param imgSrc 二维码
     */
    addShare:function(addshare,share,imgSrc,text) {
        var _shareHtml = '<div class="'+ share + '" id="share">' +
            '<div class="commonsharediv">' +
            '<div class="commonshareimg">' +
            '<img src="' + imgSrc + '">' +
            '</div>' +
            '<div class="commonsharetext">' +
            text +
            '</div>' +
            '</div>' +
            '</div>';
        //addshare.mousemove(function() {
            addshare.append(_shareHtml);
        //});

        addshare.mouseout(function() {
            $('#share').remove();
        })
    }
});

function bankCardNo() {
    //点击关闭按钮
    $('.close').click(function() {
        $('.conMain').remove();
        $("body").css({"overflow":"auto"});
    });

    $('.bankClick').click(function() {
        var $bankCard = $('.bank-Card');
        var banVal = $.trim($bankCard.val());
        if(banVal=='' || banVal.length < 16) {
            alert('请输入正确长度的银行卡号');
            return false;
        } else {
            $.ajax({
                url: Setting.apiRoot1 + '/u/forAllChannel/cardbin.p2p',
                type: 'post',
                dataType: 'json',
                data: {
                    userId: sessionStorage.getItem('uid'),
                    cardNum: banVal,
                    loginToken:sessionStorage.getItem('loginToken')
                }
            }).done(function(res) {
                if(res.code == 1) {
                    window.location.reload();
                } else {
                    alert(res.message);
                    return false;
                }
            }).fail(function(){
                alert('网络链接失败');
                return false;
            })

        }
    })
}

/**
 *实现重新设置交易密码
 */
function updatePassGet(type) {

    var formData = {};
    //点击关闭按钮
    $('.close').click(function() {
        $('.conMain').remove();
        $("body").css({"overflow":"auto"});
    });
    var $old_psd = $('[name=old-password]');
    var $psd = $('[name=new-password]');
    var $agin_psd = $('[name=agin-password]');
    var $uid = sessionStorage.getItem("uid");
    //点击确定按钮
    $('.updateBtn').click(function() {
        var $this = $(this);
        var _old_psd = $.trim($old_psd.val());
        var _psd  = $.trim($psd.val());
        var _agin_psd =  $.trim($agin_psd.val());

        if(type == 2) {
            if (!_old_psd.length>0) {
                alert("请输入由6位数字组成的旧密码！");
                return false;
            }

            if(!Common.reg.payPwd.test(_old_psd)){
                alert('请输入由6位数字组成的旧密码！');
                return false;
            }
        }

        if(type == 1) {
            if (!_old_psd.length>0) {
                alert("请输入由6位数字和字母组成的旧密码！");
                return false;
            }
            if(_old_psd.length < 6) {
                alert('登录密码长度不能小于6位');
                return false;
            }

            if(!Common.reg.pwd.test(_old_psd)){
                alert('请输入由6位数字和字母组成的旧密码！');
                return false;
            }
        }



        if(type == 2) {
            if (!_psd.length > 0) {
                alert("请输入由6位数字组成的新交易密码！");
                return false;
            }
            if(!Common.reg.payPwd.test(_psd)){
                alert('请输入由6位数字组成的新交易密码！');
                return false;
            }
        }

        if(type == 1) {
            if (!_psd.length > 0) {
                alert("请输入由6位数字组成的新登录密码！");
                return false;
            }
            if(_psd.length < 6) {
                alert('登录密码长度不能小于6位');
                return false;
            }

            if(!Common.reg.pwd.test(_psd)){
                alert('请输入由6位数字和字母组成的新登录密码！');
                return false;
            }
        }


        if (!_agin_psd.length>0) {
            alert("请再次输入新密码！");
            return false;
        }

        if (_psd != _agin_psd) {
            alert("两次密码输入不一致");
            return false;
        }

        formData.password = md5(_agin_psd);
        formData.oldPassword = md5(_old_psd);
        formData.userId = $uid;
        formData.type = type;
        formData.loginToken=sessionStorage.getItem('loginToken');
        $this.addClass('disabled').html('数据提交中...');
        $.ajax({
            url: Setting.apiRoot1 +'/u/password/modify.p2p',
            type: 'post',
            dataType: 'json',
            data: formData
        }).done(function(data) {
                Common.ajaxDataFilter(data.code,function(){
                    if(data.code == 1) {
                        Commain.commonAlert('重置密码成功','确认', function() {
                            $('.conMain').remove();
                            $("body").css({"overflow":"auto"});
                        });
                    } else {
                        alert(data.message);
                        $this.removeClass('disabled').html('确认');
                    }
                })
            })
            .fail(function() {
                alert('网络链接失败');
                $this.removeClass('disabled').html('确认');
            })
    })
}

/**
 * 从新设置交易密码
 */
function forGetPass(uuid){
    var formData = {};
    //点击关闭按钮
    $('.close').click(function() {
        $('.conMain').remove();
        $("body").css({"overflow":"auto"});
    });

    var img = new Image();
    var $imgCode = $('.img-code');
    //点击图形验证码按钮
    $imgCode.click(function() {
        var src = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+uuid+'&time=' + Date.now();
        $imgCode.attr({'src':src});
    });

    //点击获取短信验证码按钮
    var $sendAgain = $('.send-sms-code');
    var $phone = $('[name=phone]');//用户的手机号码
    var $img_code =$('.imgcode');//图形验证码
    var defText = '获取验证码';

    $sendAgain.click(function() {
        var $this = $(this);
        var phone = $.trim($phone.val());
        if($this.hasClass('disabled')){
            return false;
        }

        if (!phone.length>0) {
            alert("请输入手机号码！");
            return false;
        }
        if(!Common.reg.mobile.test(phone)){
            alert('手机号码格式有误，请重新输入！');
            $phone.val('');
            return false;
        }
        var _imageCode  =$.trim($img_code.val());
        if(_imageCode == null || _imageCode == '' || _imageCode == undefined || _imageCode.length <= 0) {
            alert('请输入图形验证码');
            return false;
        }
        //图形验证码进行效验成功以后发送短信验证码
        $.post(Setting.apiRoot1 + '/isRegist.p2p?divnceId=' + uuid,
            {phoneNum: phone, code: _imageCode, type: 3},
            function(data) {
                if(data.code == 1) {
                    $this.addClass('disabled');
                    //获取验证码
                    Common.sendMsgCode(phone, 3, _imageCode, uuid, function (res) {
                        if (res.code != 1) {
                            alert(res.message);
                            $this.removeClass('disabled');
                            return false;
                        }
                        startSmsTimer(function(){
                            $this.html(defText).removeClass('disabled');
                        });
                    });
                } else {
                    alert(data.message);
                    $this.removeClass('disabled');
                    return false;
                }
            },'json'
        );
    });

    var $forgetBtn = $('.forgetBtn');//点击确定提交按钮
    $forgetBtn.click(function () {
        var $this = $(this);
        var phone = $.trim($phone.val());
        //$this.addClass('disabled').html('数据提交中...');
        if (!phone.length>0) {
            alert("请输入手机号码！");
            return false;
        }

        if(!Common.reg.mobile.test(phone)){
            alert('手机号码格式有误，请重新输入！');
            return false;
        }

        var _imageCode  =$.trim($img_code.val());
        if(_imageCode == null || _imageCode == '' || _imageCode == undefined || _imageCode.length <= 0) {
            alert('请输入图形验证码');
            return false;
        }

        var $code = $('[name=code]');//获取短信验证码
        var _codeVal = $.trim($code.val());//获取短信验证码的值

        if (!_codeVal.length>0) {
            alert("请输入短信验证码！");
            return false;
        }

        var $new_psd = $('.new_psd');
        var $agin_psd = $('.agin_psd ');
        var new_psd = $.trim($new_psd.val());
        var agin_psd = $.trim($agin_psd.val());

        if (!new_psd.length>0) {
            alert("请输入新交易密码！");
            return false;
        }

        if(!Common.reg.payPwd.test(new_psd)){
            alert('请输入由6位数字组成的新交易密码！');
            return false;
        }

        if (!agin_psd.length>0) {
            alert("请再次输入新交易密码！");
            return false;
        }
        if (new_psd != agin_psd) {
            alert("两次密码输入不一致");
            return false;
        }

        formData.userId = sessionStorage.getItem('uid') ;
        formData.password = md5(new_psd);
        formData.comfirmPwd = md5(agin_psd);
        formData.code = _codeVal;
        formData.type = 3 ;//交易密码
        formData.phoneNum = phone;
        $this.addClass('disabled').html('数据提交中...');
        $.ajax({
            url: Setting.apiRoot1 +'/password/reset.p2p',
            type: 'post',
            dataType: 'json',
            data: formData
        })
            .done(function(data) {
                Common.ajaxDataFilter(data.code,function(){
                    if(data.code == 1) {
                        Commain.commonAlert('重置密码成功','确认', function() {
                            $('.conMain').remove();
                            $("body").css({"overflow":"auto"});
                        })
                        //alert('重置密码成功！');
                    } else {
                        alert(data.message);
                        $this.removeClass('disabled').html('确认');
                    }
                })
            })
            .fail(function() {
                alert('网络链接失败');
                $this.removeClass('disabled').html('确认');
            })

    })
}

// 短信发送定时器
function startSmsTimer(timeOver){
    var $sendAgain = $('.send-sms-code');
    var smsTimer;
    var defText = '获取验证码';
    var timeText = '<strong>{time}</strong>s后重新发送';
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

//交易密码设置
function modify(listData) {
    //设置交易密码提交按钮
    var $subPass = $('#subPass');
    var formData = {};
    //创建交易密码对话框
    var $pass1 = $('.realpass1');
    //确认交易密码对话框
    var $pass2 = $('.realpass2');
    //输入的交易密码
    var pass1 = $.trim($pass1.val());
    //确认交易密码的内容
    var pass2 = $.trim($pass2.val());
    //判断有没有输入交易密码
    if (!pass1.length > 0) {
        alert("请输入交易密码！");
        return false;
    }

    //交易密码认证
    if(!Common.reg.payPwd.test(pass1)){
        alert('密码格式有误，请重新输入！');
        return false;
    }

    //判断有没有再次输入交易密码
    if (!pass2.length>0) {
        alert("请再次输入交易密码！");
        return false;
    }

    //判断2次输入的交易密码是否相同
    if (pass1 != pass2) {
        alert("两次密码输入不一致");
        return false;
    }

    formData.password = md5(pass1);
    formData.userId = listData.userId;
    formData.type = 2;
    formData.loginToken = listData.loginToken;

    //提交数据
    $subPass.addClass('disabled').html('数据提交中...');
    $.ajax({
        url: Setting.apiRoot1 +'/u/setTradePwd.p2p',
        type: 'post',
        dataType: 'json',
        data: formData
    }).done(function(data) {
        Common.ajaxDataFilter(data.code,function(){
            if(data.code == -99) {
                //Commain.commonAlert(data.message,'确认',function () {
                    Common.toLogin();
                    return false;
                //})
            }
            if(data.code == 1) {
                sessionStorage.setItem('validTrade',1);//是否设置交易密码
                window.location.reload();
            }
            //else {
            //    alert(data.message);
            //    return false;
            //}
        });
    }).fail(function() {
        alert('网络链接失败');
        $subPass.removeClass('disabled').html('确认');
        return false;
    });
}

//用户的身份证信息验证
function validate (listData) {
    //按钮
    var $next = $('#next');
    var formData = {};
    //用户名的输入框
    var $userName = $('.realUserName');
    //用户的身份证输入框
    var $userNo = $('.realUserNo');
    //获取用户的真实姓名
    var userName = $.trim($userName.val());
    var userNo = $.trim($userNo.val());
    //判断有没有输入用户名
    if(!userName.length > 0) {
        alert('请输入姓名');
        return false;
    }

    for (var i = 0; i < userName.length; i++) {
        if(userName[i] == null || userName[i] == '' || userName[i] == undefined || userName[i] == ' ') {
            alert('请输入合法的姓名');
            return false;
        }
    }


    //判断有没有输入用户的身份证号码
    if(!userNo.length > 0) {
        alert('请输入身份证号码');
        return false;
    }

    //验证输入的身份证号码是否合法
    if(!Common.reg.idCard.test(userNo)) {
        alert('身份证号码格式有误，请重新输入！');
        return false;
    }

    for (var i = 0; i < userNo.length; i++) {
        if(userNo[i] == null || userNo[i] == '' || userNo[i] == undefined || userNo[i] == ' ') {
            alert('身份证号码格式有误，请重新输入！');
            return false;
        }
    }

    formData.userName = userName;
    formData.idNo = userNo;
    formData.userId = listData.userId;
    formData.loginToken = listData.loginToken;
    $next.addClass('disabled').html('实名认证中...');
    $.ajax({
        url: Setting.apiRoot1 + '/u/idCard/validate.p2p',
        type: 'post',
        dataType: 'json',
        data: formData
    }).done(function(res) {
        if(res.code == -99) {
            Commain.commonAlert(res.message,'确认',function () {
                Common.toLogin();
                return false;
            })
        }
        if(res.code == 1 || res.code == 2) {
            sessionStorage.setItem('validName',1);//是否设置实名认证
            sessionStorage.setItem('cardNum',formData.idNo);//身份证
            sessionStorage.setItem('realname',formData.userName);//名
            $('.conMain').remove();
            $("body").css({"overflow":"auto"});
            Commain.realName(2,formData);
        } else {
            alert(res.message);
            $next.removeClass('disabled').html('下一步');
            return false;
        }
    }).fail(function() {
        alert('网络链接失败');
        $next.removeClass('disabled').html('下一步');
        return false;
    });
}

window.Commain = Commain;