/**
 * Created by User on 2017/9/4.
 * 账户与安全
 */
function security(formData) {

    Commain.appendCss('../bcss/security.css?v=3.6.0');
    //时间戳
    var timestamp = Date.parse(new Date());
    var _data2 = {
        type : 1,
        userId : formData.userId,
        loginToken:formData.loginToken
    };
    var cardType = 0;
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
    }).done(function(bankRes) {
        if(bankRes.code == -99) {
            Common.toLogin();
            return false;
        }
        var _cardText = '立即绑卡';
        if(bankRes.code == 1) {
            var cardList = bankRes.data.cardList;
            //记录卡的信息
            var _cardList= {};
            //记录绑卡的文案

            //检测是否绑卡0为未绑卡1为已经绑卡

            if(cardList != undefined && cardList != null && cardList != '') {
                for(var i = 0; i < cardList.length; i++) {
                    if(cardList[i].cardNo != undefined && cardList[i].cardNo != null && cardList[i].cardNo != '') {
                        _cardList = cardList[i];
                        _cardText = '<span>已绑卡</span>';
                        cardType = 1;
                    }
                }
            }
        }

        $.ajax({
            url: Setting.apiRoot1 +'/u/checkUserInfo.p2p',
            type: 'post',
            dataType: 'json',
            data: _data2
        }).done(function(res) {
            //未实名认证
            //var _sTitle = [];
            var _text2 = [[]];
            _cardText = '';
            //_cardText = '';
            if(res.code == -2) {
                _text2 = [['',_cardText],['','立即认证'],['忘记密码','修改密码'],['','修改密码']];
                initSecurity(_text2,'-2',_cardList,cardType,formData);
            }

            //数据正常
            if(res.code == 1) {
                _text2 = [['',_cardText],['','<span>已认证</span>'],['忘记密码','修改密码'],['','修改密码']];
                initSecurity(_text2,'1',_cardList,cardType,formData);
            }
            //登录超时跳转登录页面
            if(res.code == -99) {
                Common.toLogin();
            }
        }).fail(function() {
            alert('网络链接失败')
        });

    }).fail(function() {
       alert('网络连接失败！');
        return false;
    });



}

/**
 * 页面显示
 * @param _text2 记录各个状态
 * @param isName 是否实名认证
 * @param _cardList 记录卡的信息
 * @param cardType 记录是否已经绑卡0为未绑卡，1为已经绑卡
 */
function initSecurity(_text2,isName,_cardList,cardType,formData) {
    var _sTitle = ['绑定银行卡','实名认证','交易密码','登录密码'];
    var _text1 = ['银行卡已绑定，如需解绑请联系客服400-052-1388','为了您的资金安全，请先进行实名认证','交易验证采用6位交易密码','为了您的账户安全，建议您定期修改登录密码'];
    var _sHtml = '';
    var _bankHtml = '';
    if(cardType == 1) {
        var no = _cardList.cardNo;
        var card1 = no.substring(0,4);
        var card2 = no.substring(no.length-4,no.length);
        var card3 = card1 + '**** **** ****' + card2;
        _bankHtml = '<div class="bankBox-div">' +
        '<div class="bankDiv">' +
        '<div class="bank1">' +
        '<div class="bank2"><div class="bank_img"><img src="' + _cardList.bankImgURL +'"></div>' +
        '<div class="bankText">' + _cardList.bankName + '</div></div>' +
        '<div class="bankCard">' + card3 + '</div>' +
        '<div>' +
        '</div>' +
        '</div>';
    }

    for(var i = 0; i < _sTitle.length; i++) {
        var _text2Html = '';
        for(var j = 0; j < _text2[i].length; j++) {
            if(_text2[i][j] != '' && _text2[i][j] != null && _text2[i][j] != undefined) {
                _text2Html = _text2Html + '<div class="text2"><a href="javascript:;" class="btn' + i+j + '">' +  _text2[i][j] + '</a></div>';
            } else {
                _text2Html = _text2Html + '<div class="text2"></div>';

            }
        }
        _sHtml = _sHtml + '' +
        '<div class="box2">' +
        '<div class="topTitle">' +
        '<div class="topTitleIcon">' +
        '<img src="../bimages/security/sicon@0' + i + 'x.png">' +
        '</div>' +
        '<div class="topTitleCenter">' + _sTitle[i] + '</div>' +
        '</div>' +
        '<div class="center">' +
        '<div class="text1">' + _text1[i] + '</div>' + _text2Html +

        '</div>';
        if(i == 0) {
            _sHtml = _sHtml + '<div class="bottom' + i +'">' + _bankHtml + '</div></div>' ;
        } else {
            _sHtml = _sHtml + '<div class="bottom' + i +'"></div></div>' ;
        }
    }


    var _initSecurity = '';
    _initSecurity = _initSecurity + '' +
    '<div class="securityBox">' +
    '<div class="box1">' + _sHtml +

    //'<div class="box2">' +
    //'<div class="topTitle">' +
    //'<div class="topTitleIcon">' +
    //'<img src="../bimages/security/sicon@01x.png">' +
    //'</div>' +
    //'<div class="topTitleCenter">绑定银行卡</div>' +
    //'</div>' +
    //'<div class="center">' +
    //'<div class="text1">银行卡已绑定，如需解绑请联系客服400-052-1388</div>' +
    //'<div class="text2"></div>' +
    //'<div class="text2">立即绑定</div>' +
    ////'<div class="text3"></div>' +
    //'</div>' +
    //'</div>' +

    //'<div class="box2"></div>' +
    //'<div class="box2"></div>' +
    //'<div class="box2"></div>' +
    '</div>' +
    '</div>';
    $('.useright').html(_initSecurity);
    sercurityLogic(isName,cardType,formData);
}

/**
 * 此方法用来控制点击事件
 * @param isName 判断是否已经进行过实名认证
 * @param cardType 判断是否已经绑定银行卡0为未绑卡，1为已经绑卡
 */
function sercurityLogic(isName,cardType,formData) {

    $('.btn01').click(function() {
       if(cardType == 0) {
            if(isName == -2) {
                Commain.commonAlert('请先进行实名认证！','确定',function() {
                    Commain.realName(1,formData);
                })
            } else {
                window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=02';
            }
       }
    });
    //点击实名认证按钮
    $('.btn11').click(function() {
        if(isName == 1) {
            return false;
        }
        //-2为实名认证
       if(isName == -2) {
           Commain.realName(1,formData);
       }
    });

    //点击忘记交易密码按钮
    $('.btn20').click(function() {
        Commain.forgetPass();
    });

    //点击修改交易密码
    $('.btn21').click(function() {
        Commain.updatePass(2)
    });

    //点击修改登录密码
    $('.btn31').click(function() {
        Commain.updatePass(1)
    })
}