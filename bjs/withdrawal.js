/**
 * Created by User on 2017/8/23.
 * 提现
 */

var $useright = $('.useright');
function withdrawal(formData) {
    Commain.appendCss('../bcss/withdrawal.css?v=3.6.0');
    var param = Common.getParam();
    var formType = param.formType;
    if(formType != undefined && formType != null && formType != '') {
        if(parseInt(formType) == 1) {
            withRules();
            return false;
        }
    }
    var _resData = {};
    //时间戳
    var timestamp = Date.parse(new Date());

    // 我的账户信息总览主要获取用户的可用余额信息
    $.ajax({
        url:Setting.apiRoot1 + '/u/queryMyAccountInfo.p2p',
        type:"post",
        async:false,
        dataType:'json',
        data:{
            userId: formData.userId,
            loginToken:formData.loginToken,
            guid:timestamp

        }
    }).done(function(res) {
        Common.ajaxDataFilter(res, function () {
            if (res.code == 1) {
                var data = res.data;
                var amountMoney = parseFloat(data.accountAmt).toFixed(2);//可用余额

                $.ajax({
                    url: Setting.apiRoot1 + '/u/findTransChanel.p2p',
                    type:"post",
                    dataType:'json',
                    data: {
                        userId: formData.userId,
                        loginToken: formData.loginToken,
                        transType: 20,
                        guid:timestamp
                    }
                }).done(function(res) {
                    if(res.code == 1) {
                        var data = res.data;
                       var  _withFormData = data;
                        var withdrawChanel = data.withdrawChanel;
                        //可取余额
                        amountMoney = parseFloat(amountMoney);
                        var curCanExtractAmt = parseFloat(data.curCanExtractAmt);
                        //可用余额
                        var ammount = '';

                        if(curCanExtractAmt > amountMoney) {
                            ammount = amountMoney.toFixed(2);
                        }

                        if (curCanExtractAmt <= amountMoney) {
                            ammount = curCanExtractAmt.toFixed(2);
                        }

                        var cardList = data.cardList;
                        var _isBind = true;
                        //富友支付
                        var c = 3;
                        //富友支付

                        for(var i = 0; i < cardList.length; i++) {
                            if(withdrawChanel == cardList[i].payChannel && cardList[i].bindType == 1 && cardList[i].cardNo != '') {
                                _isBind = false;
                                _withFormData.isBind = 1;
                                _withFormData.amountMoney = ammount;
                                //withTraversal(cardList[i],ammount,_withFormData);
                              break;
                            } else {
                                if(cardList[i].bindType == 1) {
                                    _isBind = false;
                                    _withFormData.isBind = 0;
                                    _withFormData.amountMoney = ammount;
                                    //withTraversal(cardList[i],ammount,_withFormData);
                                    break;
                                }
                            }
                        }

                        if(_isBind) {
                            Commain.commonAlert('请先充值再提现','确定',function(){cashPage()},function(){cashPage()});
                        } else {
                            withTraversal(cardList[i],ammount,_withFormData);
                        }

                    } else {
                        if(res.code == -99) {
                            Common.toLogin();
                        } else {
                            if(res.code == -2) {
                                Commain.realName(1,formData);
                                $('.close').click(function() {
                                    window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=01'
                                })
                            } else {
                                alert(res.message);
                                return false;
                            }

                        }
                    }
                }).fail(function() {
                    alert('网络连接失败！');
                    return false;
                });


            } else {
                alert(res.message);
                return false;
            }
        });
    }).fail(function(){
        alert('网络链接失败');
        return false
    });
}

function withTraversal(data,ammount,_withFormData) {

    //获取省份信息
    var provinceCode = data.provinceCode;
    //获取市信息
    var cityCode = data.cityCode;
    if(cityCode == undefined || cityCode == null || cityCode == '') {
        getPro(data,ammount,_withFormData);
    } else {
        drawalAmount(data,ammount,_withFormData)
    }
    //console.log(JSON.stringify(data))
}

/**
 * 如果改用户不是第一次提现则直接进行提现
 * @param data 记录该用户的银行卡的信息
 * @param ammount 可用余额也就是可以提现的余额
 * @param _withFormData 记录总体信息（如：是否支付手续费等等）
 */
function drawalAmount(data,ammount,resData) {
    var _bidHtml = '';
    //判断是否绑定
    if(resData.isBind == 1) {
        _bidHtml = _bidHtml + '<img src="../bimages/bind.png" class="bind" />';
    }
    var cardNo = data.cardNo;
    var card1 = cardNo.substring(0,4);
    var card2 = cardNo.substring(cardNo.length-4,cardNo.length);
    var card3 = card1 + ' **** **** ****' + card2;
    var extractMin = resData.extractMin;
    if(extractMin == undefined || extractMin == null || extractMin == '' || isNaN(extractMin) || extractMin < 100) {
        extractMin = 100;
    }

    var _withHtml = '';
    _withHtml = _withHtml + '' +
    '<div class="withTop">' +
        '<div class="with-head">' +
            '<div class="with-monery">可提现余额(元):<a class="ammount">' + Common.comdify(ammount) + '</a></div>' +
        '</div>' +
    '</div>' +
    '<div class="withbank-div">' +
        '<div class="baking">' +
            '<div class="bankingdiv">' +
                '<div class="with-bankBox">' +
                    '<div class="with-bankBox-div">' +
                        '<div class="with-bankBox-div-icon"><img src="' + data.bankImgURL + '" /></div>' +
                        '<div class="with-bankBox-div-name">' + data.bankName + '</div>' +
                        '<div class="with-bankBox-div-card">' + card3 + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>' +
    '<div class="drawal-box">' +
        '<div class="drawal-div1">' +
            '<div class="drawal-div1-left">提现金额(元):</div>' +
            '<div class="drawal-div1-right">' +
                '<input class="withAmountInput" type="number" placeholder="起提金额' + extractMin + '元" />' +
            '</div>' +
        '</div>' +
        '<div class="drawal-div2">' +
            '<div class="withAmount-left">您本月免费提现次数还剩<a>' + resData.count + '</a>次</div>' +
            '<div class="withAmount-right">提现手续费(元):<a>' + resData.fee + '</a></div>' +
            '<div class="drawal-div3"><a class="rulea" href="javascript:;">提现说明></a></div>' +
        '</div>' +
    '</div>'+

    '<div class="contentChanel">' +
        '<div class="bankstyle fuBox">' +
            '<div class="fuyoutitle">富友支付</div>' +
            '<div class="fuyouDiv-left">' +
                '<div class="fuyoucontent1">实时到账</div>' +
                '<div class="fuyoucontent1">单笔限额:100000元,当日无限额</div>' +
                //'<div class="fuyoucontent1">单笔限额：' + data.limitonce + '</div>' +
                //'<div class="fuyoucontent1">单日限额：' + data.limitday + '</div>' +
            '</div>' +
            '<div class="fuyouDiv-right">' + _bidHtml +
            '</div>' +
        '</div>' +
    '</div>'+
    '<a href="javascript:;" class="withBtn">提现</a>' +
    '';
    $useright.html(_withHtml);
    var $withAmountInput = $('.withAmountInput');//输入的金额

    Commain.inputChange($withAmountInput);
    btnClick(data,resData);
    //点击查看详情按钮
    $('.rulea').click(function() {
        //withRules();
        window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=03&formType=1';
    });
}

function getPro(data,ammount,resData) {
    var _bidHtml = '';
    //判断是否绑定
    if(resData.isBind == 1) {
        _bidHtml = _bidHtml + '<img src="../bimages/bind.png" class="bind" />';
    }
    var cardNo = data.cardNo;
    var card1 = cardNo.substring(0,4);
    var card2 = cardNo.substring(cardNo.length-4,cardNo.length);
    var card3 = card1 + ' **** **** ****' + card2;
    var _cityHtml = '';
    _cityHtml = _cityHtml + '' +

    '<div class="city-box">' +
    '<div class="city-span1">省份:</div>' +
    '<div class="city-div withPro">' +
    '<select class="withprovinces" name="withprovinces">' +
    '<option value="0">请选择</option>' +
    '</select>' +
    '</div>' +
    '<div class="city-span1 with-city-text">城市:</div>' +
    '<div class="city-div withCity">' +
    '<select class="withcity" name="withcity">' +
    '<option value="0">请选择</option>' +
    '</select>' +
    '</div>' +
    '</div>';
    var extractMin = resData.extractMin;
    if(extractMin == undefined || extractMin == null || extractMin == '' || isNaN(extractMin) || extractMin < 100) {
        extractMin = 100;
    }

    var _withHtml = '';
    _withHtml = _withHtml + '<div class="withTop">' +
    '<div class="with-head">' +
    '<div class="with-monery">可提现余额(元):<a class="ammount">' + Common.comdify(ammount) + '</a></div>' +
    '</div>' +
    '</div>' +
    '<div class="withbank-div">' +
    '<div class="baking">' +
    '<div class="bankingdiv">' +
    '<div class="with-bankBox">' +
    '<div class="with-bankBox-div">' +
    '<div class="with-bankBox-div-icon"><img src="' + data.bankImgURL + '" /></div>' +
    '<div class="with-bankBox-div-name">' + data.bankName + '</div>' +
    '<div class="with-bankBox-div-card">' + card3 + '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="reflect-div"><div class="withCity">' + _cityHtml + '</div>' +
    '<div class="amount-box">' +
    '<div class="amount-text">提现金额(元)：</div>' +
    '<div class="amount-div">' +
    '<input class="withAmountInput" type="number" placeholder="起提金额' + extractMin + '元" />' +
    '</div>' +
    '</div>' +
    '<div class="withAmount-rule-box">' +
    '<div class="withAmount-left">您本月免费提现次数还剩<a>' + resData.count + '</a>次</div>' +
    '<div class="withAmount-right">提现手续费(元):<a>' + resData.fee + '</a></div>' +
    '</div>' +
    '<div class="withAmount-rules">' +
    '<a class="rulea" href="javascript:;">提现说明></a>' +
    '</div>' +

    '</div>' +
    '<div class="contentChanel">' +
    '<div class="bankstyle fuBox">' +
    '<div class="fuyoutitle">富友支付</div>' +
    '<div class="fuyouDiv-left">' +
    '<div class="fuyoucontent1">实时到账</div>' +
    '<div class="fuyoucontent1">单笔限额:100000元,当日无限额</div>' +
    //'<div class="fuyoucontent1">单笔限额：' + data.limitonce + '</div>' +
    //'<div class="fuyoucontent1">单日限额：' + data.limitday + '</div>' +
    '</div>' +
    '<div class="fuyouDiv-right">' + _bidHtml +
    '</div>' +
    '</div>' +
    '</div>'+
    '<a href="javascript:;" class="withBtn">提现</a>' +
    '';
    $useright.html(_withHtml);

    //点击查看详情按钮
    $('.rulea').click(function() {
        //withRules();
        window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=03&formType=1'
    });

    var $withAmountInput = $('.withAmountInput');//输入的金额

    Commain.inputChange($withAmountInput);
    btnClick(data,resData);
    $.ajax({
        url: Setting.apiRoot1 + '/getProvinceAndCity.p2p',
        type: 'post',
        dataType: 'json',
        data: {
            parentId: 1,//获取 省份
            payChannelId:3
        }
    }).done(function(res) {

        if(res.code == -99) {
            Common.toLogin();
            return false
        }

        if(res.code == 1) {
            var _data = res.data;
            var _options1 = '';
            for(var i = 0; i < _data.length; i++) {
                _options1 = _options1 + '<option id="' + _data[i].id + '" value="' + _data[i].no + '">' + _data[i].name +'</option>'
            }

            var $withprovinces =$('.withprovinces');//遍历省份
            $withprovinces.html(_options1);
            getCity(data,2,resData);
            $withprovinces.change(function() {
                var _provincesId =  $('.withprovinces option:selected').attr('id');
                getCity(data,_provincesId,resData);
            });
        } else {
            alert(res.message);
            return false;
        }

    }).fail(function() {
        alert('网络连接失败！');
        return false;
    });

}

//获取城市的信息
function getCity(data,_provincesId,resData) {
    $.ajax({
        url: Setting.apiRoot1 + '/getProvinceAndCity.p2p',
        type: 'post',
        dataType: 'json',
        data: {
            parentId: _provincesId,//获取 城市
            payChannelId:3
        }
    }).done(function(res) {
        if(res.code == -99 ) {
            Common.toLogin();
            return false;
        }
        if(res.code == 1) {
            var _data = res.data;
            var _options = '';
            //var _cityId = _data[0].id;
           for(var i = 0; i < _data.length; i++) {
               _options = _options + '<option id="' + _data[i].id + '" value="' + _data[i].no + '">' + _data[i].name + '</option>';
           }
            var $withcity = $('.withcity');//城市
            $withcity.html(_options);

            $withcity.change(function() {
                var _cityId  =  $('.withcity option:selected').attr('id');
            });

            //btnClick(data,_provincesId,resData);
        } else {
            alert(res.message);
            return false;
        }
    }).fail(function() {
        alert('网络连接失败！');
        return false;
    });
}

/**
 * 处理点击提现按钮事件
 * @param data 当前卡的信息
 * @param _provincesId 省份信息
 * @param _cityId 城市信息
 */
function btnClick(data,resData) {
    //console.log(JSON.stringify(data))
    var _count = resData.count;
    //提现按钮
    var $withBtn = $('.withBtn');
    $withBtn.click(function() {
        if($(this).hasClass('disabled')) {
            return false;
        }
        //获取省份信息
        var provinceCode = data.provinceCode;
        //获取市信息
        var cityCode = data.cityCode;
        var province = '';
        var city = '';
        var $proSelected = $('.withprovinces option:selected');
        var $citySelected = $('.withcity option:selected');
        //如果城市和省份信息没有的话说明该用户第一次提现必须选择省份信息
        if(cityCode == undefined || cityCode == null || cityCode == '') {
            province = $proSelected.attr('id');
            city = $citySelected.attr('id');
            provinceCode = $proSelected.attr('value');
            cityCode = $citySelected.attr('value');
        }
        var $withAmountInput = $('.withAmountInput');//金额输入框
        var _withAmount = $.trim($withAmountInput.val());//获取输入的金额
        var extractMin = parseFloat(resData.extractMin);//最小提现金额
        var curCanExtractAmt = parseFloat(resData.curCanExtractAmt);//最大提现金额
        if(extractMin == undefined || extractMin == null || extractMin == '' || isNaN(extractMin) || extractMin < 100) {
            extractMin = 100;
        }

        if(_withAmount == undefined || _withAmount == null || _withAmount == '' || _withAmount == 0) {
            alert('请输入提现金额');
            return false;
        }

        var amountMoney = resData.amountMoney;
        if(parseFloat(_withAmount) > parseFloat(amountMoney)){
            alert('余额不足,请先充值');
            return false;
        }


        if(parseFloat(_withAmount) < parseFloat(extractMin)) {
            alert('最小单笔提现金额不能小于' + extractMin);
            return false;
        }

        if(parseFloat(_withAmount) > 100000) {
            //alert('最大单笔提现金额不能大于' + curCanExtractAmt + '元');
            alert('最大单笔提现金额不能大于100000元');
            return false;
        }

        var _form = {};
        _form.fee = resData.fee;
        _form.bankCard = data.cardNo;
        _form.provinceCode = provinceCode;
        _form.cityCode = cityCode;
        _form.braBankName = data.bankName;
        _form.cardNum = data.cardNo;
        _form.account = resData.count;
        _form.amount = $.trim(parseFloat(_withAmount).toFixed(2));
        _form.bankImgURL = data.bankImgURL;
        if(_count == 0) {
            Commain.commonAlert(resData.warning,'确定', function() {
                Commain.payPass();
                $('.subPayBtn').click(function() {
                    var $input = $('.input');
                    var pwd = $input.val();
                    if(pwd == undefined || pwd == null || pwd == ''){
                        alert('密码不能为空');
                        return false;
                    }else if(pwd.length < 6){
                        alert('请输入完整的交易密码！');
                        return false;
                    }
                    _form.tradePassword = md5(pwd);
                    _form.userId = sessionStorage.getItem('uid');
                    _form.loginToken=sessionStorage.getItem('loginToken');
                    $(this).addClass('disabled');
                    $.ajax({
                        url:Setting.apiRoot1 + '/u/fy/withdraw.p2p',
                        type: 'post',
                        dataType: 'json',
                        data: _form
                    }).done(function(res) {
                        if(res.code == -99) {
                            Common.toLogin();
                            return false;
                        }
                        if(res.code == 1) {
                            alert('提现成功');
                            $('.submit').click(function() {
                                window.location.reload();
                            });
                        } else {
                            alert(res.message);
                            $(this).removeClass('disabled');
                            $('.conMain').remove();
                            $("body").css({"overflow":"auto"});
                            return false;
                        }
                    }).fail(function(res) {
                        alert('网络连接失败！');
                        $(this).removeClass('disabled');
                        $('.conMain').remove();
                        $("body").css({"overflow":"auto"});
                        return false;
                    })
                });
            })
        } else {
            Commain.payPass();
            $('.subPayBtn').click(function() {
                var $input = $('.input');
                var pwd = $input.val();
                if(pwd == undefined || pwd == null || pwd == ''){
                    alert('密码不能为空');
                    return false;
                }else if(pwd.length < 6){
                    alert('请输入完整的交易密码！');
                    return false;
                }
                _form.tradePassword = md5(pwd);
                _form.userId = sessionStorage.getItem('uid');
                _form.loginToken=sessionStorage.getItem('loginToken');
                $(this).addClass('disabled');
                $.ajax({
                    url:Setting.apiRoot1 + '/u/fy/withdraw.p2p',
                    type: 'post',
                    dataType: 'json',
                    data: _form
                }).done(function(res) {
                    if(res.code == -99) {
                        Common.toLogin();
                        return false;
                    }
                    if(res.code == 1) {
                        alert('提现成功');
                        $('.submit').click(function() {
                            window.location.reload();
                        });
                    } else {
                        alert(res.message);
                        $(this).removeClass('disabled');
                        $('.conMain').remove();
                        $("body").css({"overflow":"auto"});
                        return false;
                    }
                }).fail(function(res) {
                    alert('网络连接失败！');
                    $(this).removeClass('disabled');
                    $('.conMain').remove();
                    $("body").css({"overflow":"auto"});
                    return false;
                })
            });
        }

    })
}

//提现规则
function withRules() {
    var _withRules = '';
    //规则列表
    var _ul1 = ['提现限额',
        '<li class="li2" style="border-bottom: none">1、每笔提现最低100.00元。</li><li class="li2">2、每日提现无限额。</li>',
        '提现到账时间',
        '<li class="li2"><span class="special">富友支付提现：</span>提现金额实时到账。</li>',
        '交易明细',
        '<li class="li2">可在APP"账户—可用余额—支出"中查看明细</li>'
    ];

    var _ul1Html = '';

    for(var i = 0; i < _ul1.length; i++ ) {
        if ( i % 2 == 0) {
            _ul1Html = _ul1Html + '<li class="li1"><div class="liDivImg"><img src="../bimages/withdrawal/icon' + i + '.png" class="liImg" /></div>' + _ul1[i] + '</li>';
        } else {
            _ul1Html = _ul1Html +  _ul1[i] ;
        }
    }

    _withRules = _withRules + '<div class="withRulesTop"><div class="returnPage"><a href="javascript:;" id="returnPage">返回</a></div>提现说明</div>' +
                '<div class="withRulesContent">' +
                '<ul class="ul1">' + _ul1Html +
                '</ul>' +
                '</div>';

    $useright.html(_withRules);

    $('#returnPage').click(function() {
        //window.location.reload();
        window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=03';
    });
}

function cashPage() {
    window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=02';
}
