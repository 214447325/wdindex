/**
 * Created by User on 2017/10/11.
 */
$(function() {
    var uuid = $.cookie('uuid');

    var noiveBody = new Vue({
        el : '#noiveBody',
        data: {
            imgSrc: Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+uuid+'&time=' + Date.now(),
            isNoviceShow: '',
            phone: '',//手机号码
            imgCode:'',//图形验证码
            password:'',//密码
            code:'',//短信验证码
            codeClass:'',
            rester:'',
            codeText:'获取验证码',
            btnText:'立即领取福利'
        },
        methods : {
            //初始化
            init : function(){
                this.isShow = true;
            },
            //点击立即注册
            noRegister : function() {
                window.scrollTo(0,0);
            },
            //更换图形验证码
            changeImage : function() {
                this.imgSrc = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+uuid+'&time=' + Date.now();
            },
            //点击是否阅读单选框
            isRead : function() {
                var isNoviceShow = this.isNoviceShow;
                //判断是否选中
                if(this.isNoviceShow == 'isNoviceShow') {
                    this.isNoviceShow = '';
                } else {
                    this.isNoviceShow = 'isNoviceShow';
                }
            },
            //点击立即抢购按钮跳转首页
            onclick : function() {
                window.scrollTo(0,0);
                //window.location.href = Setting.staticRoot + '/pages/index.html';
            },
            //点击立即登录按钮
            clickLogin : function() {
                window.location.href = Setting.staticRoot + '/bpage/login.html';
            },
            //点击阅读协议
            readProtocol : function() {
                $.ajax({
                    url:'protocol.html',
                    type:'post',
                    data:{},
                    async: false,
                    success:function(data){
                        $('body').append(data);
                        $('.buyProtocolCloseImg').on('click',function(){
                            $('.buyProtocolBox').remove();
                        })
                    }
                })
            },
            //获取短信验证码
            getCode : function() {
                //获取手机号码
                var phone = this.phone.trim();
                //获取图形验证码
                var imgCode = this.imgCode.trim();
                var codeClass = this.codeClass;
                var defText = '重新发送';
                if(codeClass == 'disabled') {
                    return false;
                }
                this.codeClass = 'disabled';
                if(this.check1(phone,imgCode)) {
                    //7验证手机号码是否已经被注册过
                    $.post(Setting.apiRoot1 + '/isRegist.p2p?divnceId=' + uuid,
                        {divnceId: uuid,phoneNum: phone,type: 2,code: imgCode},
                        function(data) {
                            if(data.code != 1) {
                                alert(data.message);
                                noiveBody.codeClass = '';
                                return false;
                            }
                            //获取验证码
                            Common.sendMsgCode(phone,2,imgCode,uuid,function(data) {
                                if(data.code == 1) {
                                    noiveBody.startSmsTimer(function() {
                                        noiveBody.codeText = defText;
                                        noiveBody.codeClass = '';
                                    })
                                } else {
                                    alert(data.message);
                                    noiveBody.codeClass = '';
                                    return false;
                                }
                            });

                        },'json'
                    )
                } else {
                    this.codeClass = '';
                }
            },
            //点击立即领取福利按钮
            userRegister : function() {
                var rester = this.rester;
                if(rester == 'disabled') {
                    return false;
                }
                //获取手机号码
                var phone = this.phone.trim();
                //获取图形验证码
                var imgCode = this.imgCode.trim();
                //获取密码
                var password = this.password.trim();
                //获取短信验证码
                var code = this.code.trim();
                if(this.check1(phone,imgCode)) {
                    if(this.check2(password,code)) {
                        var isNoviceShow = noiveBody.isNoviceShow;
                        if(!(isNoviceShow == 'isNoviceShow')) {
                            alert('请先阅读V金融理财协议');
                            return false;
                        }
                        noiveBody.btnText = '正在提交...';
                        var formData = {};
                        formData.phoneNum = phone;//手机号码
                        formData.password = md5(password);//密码
                        formData.msgcode = code;//短信验证码
                        formData.identifyCode = code;


                        Common.validMsgCode(formData.phoneNum,formData.identifyCode,2,function(data) {
                            if(data.code == 1) {
                                $.ajax({
                                    url: Setting.apiRoot2 + '/regist.p2p',
                                    type: 'post',
                                    dataType: 'json',
                                    data: formData
                                }).done(function(res) {
                                    if(res.code == 1) {
                                        noiveBody.rester = '';
                                        noiveBody.codeClass = '';
                                        noiveBody.btnText = '立即领取福利';
                                        var listData = {};
                                        listData.loginName = formData.phoneNum;
                                        listData.password = formData.password;
                                        $.ajax({
                                            url: Setting.apiRoot2 + '/login.p2p',
                                            type: 'post',
                                            dataType: 'json',
                                            data: listData,
                                            cache:false
                                        }).done(function(res) {
                                            if(res.code == 1) {
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
                                                sessionStorage.setItem('VIP',res.data.vip);
                                                //window.location.href = Setting.staticRoot + '/active/novice.html';                                    } else {
                                                alert(res.message);
                                                $('.submit').click(function() {
                                                    window.location.href = Setting.staticRoot + '/active/novice.html';
                                                });
                                                return false;
                                            }
                                        }).fail(function() {
                                            alert('网络连接失败');
                                            return false;
                                        })
                                    } else {
                                        alert(res.message);
                                        noiveBody.rester = '';
                                        noiveBody.btnText = '立即领取福利';
                                        return false;
                                    }
                                }).fail(function() {
                                    alert('网络连接失败');
                                    noiveBody.rester = '';
                                    noiveBody.btnText = '立即领取福利';
                                    return false;
                                })
                            } else {
                                alert(data.message);
                                noiveBody.rester = '';
                                noiveBody.btnText = '立即领取福利';
                                return false;
                            }
                        })

                    } else {
                        this.rester = '';
                    }
                } else {
                    this.rester = '';
                }
            },
            //验证手机号码和图形验证码
            check1 : function(phone,imgCode) {
                if(phone == null || phone == '' || phone == undefined || phone.length == 0) {
                    alert('手机号码不能为空');
                    //this.codeClass = '';
                    //this.rester = '';
                    return false;
                }
                if(!Common.reg.mobile.test(phone)) {
                    alert('请输入正确的手机号码');
                    //this.codeClass = '';
                    //this.rester = '';
                    return false;
                }

                if(imgCode == null || imgCode == '' || imgCode.length == 0 || imgCode == undefined) {
                    alert('请输入图形验证码');
                    //this.codeClass = '';
                    //this.rester = '';
                    return false;
                }

                if(imgCode.length < 4) {
                    alert('请输入正确的图形验证码');
                    //this.codeClass = '';
                    //this.rester = '';
                    return false;
                }
                return true;
            },
            //验证密码和验证码
            check2 : function(password,code) {
                if( password == null || password == '' || password == undefined || password.length == 0) {
                    alert('请输入密码！');
                    return false;
                }

                if(password.length < 6) {
                    alert('密码不能小于6位');
                    return false;
                }

                if(!Common.reg.pwd.test(password)){
                    alert('密码格式有误，请输入6-20位字符！');
                    return false;
                }

                if(code == undefined || code == null || code == '' || code.length == 0){
                    alert('请输入验证码');
                    return false;
                }

                return true;
            },
            // 短信发送定时器
            startSmsTimer : function(timeOver) {
                var smsTimer;
                var timeText = '<strong>{time}</strong>s';
                if(!!smsTimer){
                    clearInterval(smsTimer);
                }
                var _i = Common.vars.sendWait;
                smsTimer = setInterval(function(){
                    noiveBody.codeText = timeText.replace(/{time}/, _i--);
                    if(_i < 0){
                        clearInterval(smsTimer);
                        smsTimer = null;
                        timeOver();
                    }
                }, 1000);
            }
        }
    });
});