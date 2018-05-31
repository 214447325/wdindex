/**
 * Created by User on 2017/6/12.
 * 充值
 */
var dataMap = '';
var code = '';
function recharge(formData,type) {
    Commain.appendCss('../bcss/recharge.css?v=3.6.0');
    var param = Common.getParam();
    var success = param.success;
    var formType = param.formType;
    var pageType = param.pageType;
    if(formType != undefined && formType != null && formType != '') {
        if(parseInt(formType) == 1) {
            limtRules(formData);
            return false;
        }

        if(parseInt(formType) == 2) {
                rechargeInfo(formData);
                return false;
        }

    }
    //if(pageType != undefined && pageType != null && pageType != '' && parseInt(pageType) == 1) {
    //    type = 1;
    //} else {
    //    type = 0;
    //}
    type = 1;

    if(success == 1) {
        rechSuccess(formData)
    }//limtRules(formData);

//兴业银行'0803090000',
    //               工商银行       建设银行   中国银行      中兴银行     光大银行
    var bankCode = ['0801020000','0801050000','0801040000','0803020000','0803030000',
    //              平安银行      邮政银行    上海银行      中国农业银行    明生银行     招商银行     广发银行     华夏银行
                    '0804105840','0801000000','080401001C','0801030000','0803050000','0803080000','0803060000','0803040000',
    //               北京银行     浙商银行
                  '0804031000','0803160000'];

    var _rechargeTableHtml = '';

    var a = bankCode.length;

    for(var i = 0; i < a; i++) {
        if(i == 0) {
            _rechargeTableHtml = _rechargeTableHtml + '<tr>';
        }
        _rechargeTableHtml = _rechargeTableHtml + '<td class="recharge-td">' +
                                                    '<a href="javascript:;" class="acode" code='+ bankCode[i] +'>'+
                                                    '<img src="../bimages/ban' + i + '.png" class="recharge-td-img">' +
                                                    '</a>' +
                                                    '</td>';
        if(((i + 1 ) % 5) == 0) {

            _rechargeTableHtml = _rechargeTableHtml + '</tr>';
            _rechargeTableHtml = _rechargeTableHtml + '<tr>';
        }
        if(i == (a-1)) {
            _rechargeTableHtml = _rechargeTableHtml + '</tr>';
        }
    }

    var _rechargeHtml = '';

    var rechLeft = '';
    var rechRight = '';
    //判断是网银充值还是银行卡充值type=1则跳转银行卡充值
    if(type == 1) {
        rechRight = 'seach';
    } else {
        rechLeft = 'seach';
    }

    //获取用户的可用余额
    $.ajax({
        url:Setting.apiRoot1 + '/u/queryMyAccountInfo.p2p',
        type:"post",
        async:false,
        dataType:'json',
        data: {
            userId:formData.userId,
            loginToken: formData.loginToken
        }
    }).done(function(res) {
        Common.ajaxDataFilter(res,function() {
            if(res.code == 1) {
                var _data = res.data;
                var _accountAmt = Common.comdify(parseFloat(_data.accountAmt).toFixed(2));
                dataMap.ammount = _accountAmt;
                _rechargeHtml = _rechargeHtml+'<div class="recharge">' +
                '<div class="recharge-box-top">' +
                '<div class="recharge-available-monery">' +
                '<span class="recharge-available-monery-text">可用余额:</span>' +
                '<span class="recharge-monery">' + _accountAmt + '</span>' +
                //'<span class="rechInfo1">（温馨提示：投资请前往<a class="rechInfo1-a">V金融APP</a>或<a class="rechInfo1-a">V金融微信理财号</a>）</span>' +
                '</div>' +
                '<div class="recharge-silver">' +
                //'<a href="javascript:;"><div class="rechLeft rech ' + rechLeft + '">银行卡充值</div></a>' +
                '<a href="javascript:;"><div class="rechRight rech ' + rechRight + '">网银充值</div></a>' +
                '</div>' +
                '</div>' +
                '<div class="rechappend"></div>' +
                '</div>';

                $('.useright').html(_rechargeHtml);

                //银行卡充值
                var $rech = $('.rech');

                //默认银行卡充值
                //bankCard(formData);
                //seach
                if($('.rechLeft').hasClass('seach')) {
                    bankCard(formData);
                }

                if($('.rechRight').hasClass('seach')) {
                    webBank(_rechargeTableHtml,formData);
                }

                //$rech.click(function() {
                //    $rech.removeClass('seach');
                //    if($(this).hasClass('rechLeft')) {
                //        $(this).addClass('seach');
                //        //bankCard(formData);
                //        window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=02';
                //    }
                //    if($(this).hasClass('rechRight')) {
                //        $(this).addClass('seach');
                //        //webBank(_rechargeTableHtml,formData);
                //        window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=02&pageType=1';
                //    }
                //
                //});

            } else {
                alert(res.message)
            }
        });
    }).fail(function() {
        alert('网络链接失败');
    });
}

//详情列表
function rechargeInfo(formData) {
    var firstTr = '';
    var banks=[[]];
    banks = [['农业银行','-','-','-','-','-','-','50万','100万','100万','500万','-','-'],
             ['工商银行','300','300','500','1000','5万','5万','50万','100万','100万','500万','-','-'],
             ['中国银行','5万','5万','5万','5万','5万','5万','5万','5万','5万','5万','5万','5万'],
             ['建设银行','500','500','5000','5000','-','-','5万','10万','50万','50万','-','-'],
             //['交通银行','-','-','5000万','5000万','-','-','100万','100万','-','-','-','-'],
             ['邮储银行','-','-','20万','20万','-','-','200万','200万','-','-','2万','2万'],
             ['招商银行','5000','5000','-','-','-','-','无限额','无限额','-','-','-','-'],
             ['中信银行','-','-','1000','5000','-','-','无限额','无限额','-','-','-','-'],
             ['浦发银行','-','-','1万','20万','-','-','无限额','无限额','-','-','-','-'],
             //['兴业银行','-','-','5000万','5000万','-','-','100万','100万','100万','100万','5000万','5000万'],
             ['民生银行','-','-','-','-','-','-','50万','50万','-','-','5000','5000'],
             ['光大银行','-','-','-','-','50万','100万','50万','50万','-','-','2万','2万'],
             ['平安银行','-','-','-','-','-','-','5万','5万','-','-','-','-'],
             ['上海银行','-','-','6000','1万','-','-','50万','100万','-','-','-','-'],
             ['华夏银行','-','-','-','-','-','-','50万','50万','-','-','-','-'],
             ['北京银行','-','-','1000','5000','-','-','100万','100万','-','-','-','-'],
             ['广发银行','-','-','5万','5万','-','-','100万','100万','-','-','-','-'],
             ['浙商银行','200','1000','自设','自设','自设','自设','自设','自设','自设','自设','自设','自设']];
    //循环单笔单日
    firstTr = firstTr + '<td class="second" style="background: #f0f0f0;"></td>';
    for(var i = 1; i < 13; i++) {
       if(i%2 == 0) {
           firstTr = firstTr + '<td class="three" style="background: #f0f0f0;border: 1px solid #fafafa;">单日</td>';
       } else {
           firstTr = firstTr + '<td class="three" style="background: #f0f0f0;border: 1px solid #fafafa;">单笔</td>';
       }
    }

    var secondTr = '';
    for(var i = 0; i < banks.length; i++) {
        if(i % 2 == 0) {
            secondTr = secondTr + '<tr>';
        } else {
            secondTr = secondTr + '<tr style="background: #f0f0f0;">';
        }


        for(var j = 0; j < banks[i].length; j++) {
            if(j == 0) {
                secondTr = secondTr + '<td class="second" style="border: 1px solid #fafafa;">' + banks[i][j] + '</td>';
            } else {
                secondTr = secondTr + '<td class="three" style="border: 1px solid #fafafa;">' + banks[i][j] + '</td>';
            }
        }
        secondTr = secondTr + '</tr>';
    }

    var _bankBox = '';

    _bankBox = _bankBox + '<div class="bankBox">' +
                        '<div class="bankBox-title-box">' +
                        //'<a href="">' +
                        '<div class="bankBox-return"><a href="javascript:;">返回</a></div>' +
                        //'</a>' +
                        '<div class="bankBox-title">个人网银充值额度表</div>' +
                        '</div>' +
                        '<div class="bankBox-center">' +
                        '<table>' +
                        '<tr class="first">' +
                        '<td>银行名称</td>' +
                        '<td>静态存量密码</td>' +
                        '<td>口令卡</td>' +
                        '<td>电子密码器/数字证书</td>' +
                        '<td>一代UKEY</td>' +
                        '<td>二代UKEY</td>' +
                        '<td>短信</td>' +
                        '</tr>' + firstTr + secondTr +
                        '</table>' +
                        '</div>' +
                        '<div class="bankBox-note">' +
                        '<ul>' +
                        '<li>备注：</li>' +
                        '<li>1.“-”代表不支持。</li>' +
                        '<li>2.个人网银限额及变动取决于发卡银行的规定，以上额度仅供参考，详细请咨询发卡行。</li>' +
                        '<li>3.个人网银充值支持银行：中行、工行、建行、招行、民生、广发、平安、中信、华夏、光大、邮储、南京、宁波、上海农商行、洛阳银行。</li>' +
                        '<li>4.企业网银充值支持银行：中行、工行、建行、招行、民生、广发、平安、中信、华夏、光大、徽商、天津、宁波银行。金账户企业用户使用企业网银充值限额最高6000万/笔，单日无限额。企业网银支付额度由企业自行设置，如有问题，详询发卡行。</li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>';
    $('.useright').html(_bankBox);
    $('.bankBox-return').click(function() {
        //recharge(formData,1)
        window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=02&pageType=1';
    });
}

//银行卡充值
function bankCard(formData) {
    var timestamp = Date.parse(new Date());
    $.ajax({
        url:Setting.apiRoot1 + '/u/findBestPayChannel.p2p',
        type:"post",
        async:false,
        dataType:'json',
        data:{
            userId: formData.userId,
            loginToken:formData.loginToken,
            guid:timestamp

        }
    }).done(function(res) {
        if(res.code == 1) {
            var data = res.data;
            var cardList = data.cardList;

            var _list = {};

            for(var i = 0; i < cardList.length; i++) {
                //富友充值
                if(cardList[i].payChannel == 3) {
                    _list.limitDay = cardList[i].limitDay;
                    _list.limitOnce = cardList[i].limitOnce;
                }
            }
            var _listData = {};
            _listData.bankImgURL = data.bankImgURL;
            _listData.bankName = data.bankName;
            _listData.cardNo = data.cardNum;
            _listData.cardType = data.cardType;
            _listData.fee = data.fee;
            _listData.rechargeMin = data.rechargeMin;

            var bindType = data.bindType;
            if(bindType == 1) {

                rechargeMonery(_listData,_list,formData);
            } else {
                bindBankCardHtml(formData,_list,_listData);
            }

        } else {
            //未实名认证的用户
            if(res.code == -2) {
                Commain.realName(1,formData);
                code = res.code;
                bindBankCardHtml(formData,res.code);
            }
        }

    }).fail(function() {
        alert('网络链接失败');
        return false
    });
}

//银行卡已绑定直接充值
function rechargeMonery(data,_list,formData) {
    var cardNo = data.cardNo;
    var card1 = cardNo.substring(0,4);
    var card2 = cardNo.substring(cardNo.length-4,cardNo.length);
    var card3 = card1 + ' **** **** ****' + card2;
    var rechargeMin = data.rechargeMin;
    if(rechargeMin == undefined || rechargeMin == null || rechargeMin == '' || rechargeMin < 100) {
        rechargeMin = 100;
    }
    //用来拼接城市的输入框
    var _cityHtml = '';

    var _bidHtml = '';
    //判断是否绑定
    if(_list.isBind == 1) {
        _bidHtml = _bidHtml + '<img src="../bimages/bind.png" class="bind" />';
    }

    //_cityHtml = _cityHtml + '<div class="city-box"><div class="city-span1">省份&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;城市:</div><div class="city-div">请选择省份和城市</div></div>';

    var _rechargeMonery = '';
    _rechargeMonery = _rechargeMonery +
    '<div class="bank-div">' +
        '<div class="baking">' +
            '<div class="bankingdiv">' +
                '<div class="bankDiv">' +
                    '<div class="bank-icon">' +
                        '<img src="' + data.bankImgURL + '" class="bankingImg">' +
                    '</div>' +
                    '<div class="bank-name">' + data.bankName + '</div>' +
                    '<div class="bank-cards">' + card3 + '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    //'</div>' +
    '</div>' +
    '<div class="with-top"></div>' +
    '<div class="reflect-div">' + _cityHtml +
        '<div class="amount-box">' +
            '<div class="amount-text">充值金额(元)：</div>' +
            '<div class="amount-div">' +
                '<input type="number" name="amountInput" class="amountInput" placeholder="起投金额' + rechargeMin + '元" />' +
            '</div>' +
        '</div>' +

        '<div class="rechAmount-rules">' +
            '<a class="rulea recharge-info-b" href="javascript:;">各支付通道支持银行及限额说明></a>' +
        '</div>' +
        '' +

        '<div class="contentChanel">' +
            '<div class="bankstyle fuBox">' +
                '<div class="fuyoutitle">富友支付</div>' +
                    '<div class="fuyouDiv-left">' +
                        '<div class="fuyoucontent1">单笔限额：' + _list.limitOnce+ '</div>' +
                        '<div class="fuyoucontent1">单日限额：' + _list.limitDay + '</div>' +
                    '</div>' +
                    '<div class="fuyouDiv-right">' + _bidHtml +
                '</div>' +
            '</div>' +
        '</div>' +
    '<a href="javascript:;" class="reflectaBtn">充值</a>' +
    '</div>';
    $('.rechappend').html(_rechargeMonery);
    //点击各支付限额说明
    $('.recharge-info-b').click(function() {
        //limtRules(formData);
        window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=02&formType=1';
    });

    //金额变化后自动添加小数点
    var $amountInput = $('.amountInput');
    //console.log(JSON.stringify())
    //使输入的金额为货币形式
    Commain.inputChange($amountInput);
    $('.reflectaBtn').click(function() {
        var $this = $(this);
        if($this.hasClass('disabled')) {
            return false;
        }

        if(card3 == undefined || card3 == null || card3 == '') {
            alert('卡号异常！');
            return false;
        }
        rechCheckForm(data.cardNo,$amountInput,data,$this,_list);
    });

}

//绑定银行卡
function bindBankCardHtml(formData,_listData,list) {
    var rechargeMin = 100;
    if(list != undefined && list != null && list != '') {
         rechargeMin = list.rechargeMin;
        if(rechargeMin == undefined || rechargeMin == null || rechargeMin == '' || rechargeMin < 100) {
            rechargeMin = 100;
        }
    }

    var _addBankCard = '';
    _addBankCard = _addBankCard + '<div class="addBankInputBox">' +
    '<div class="addBankText">银行卡:</div>' +
    '<div class="addBankDiv">' +
    '<input class="addCardNo" type="number" oninput="if(value.length>20)value=value.slice(0,20)" name="addCardNo" placeholder="请输入银行卡号">' +
    '</div>' +
    '</div>' +
    '<div class="addCardRuleBox">' +
    '<ul>' +
    '<li>为您投资方便建议您绑定以下银行卡：</li>' +
    '<li>中国工商银行、中国建设银行、中国交通银行、中信银行、中国光大银行、平安银行、浦发银行</li>' +
    '</ul>' +
    '</div>' ;
    var _bankCard = '';
    _bankCard = _bankCard + '<div class="bankCard">' +
                                '<a href="javascript:;" class="addBankCard">' +
                                    '<div class="bind-card">' +
                                        '<div class="add-bind-div">+</div>' +
                                     '</div>' +
                                    //'<div class="bindcard">' +
                                    //    '<div class="addCard-img">' +
                                    //        //'<img src="../bimages/topup-cash/add.png" class="addCardImg">' +
                                    //    '</div>' +
                                    //     //'<div class="addText">添加银行卡</div>' +
                                    //'</div>' +
                                '</a>' +
                            '</div>' +

    '<div class="spacing"></div>' +
    '<div class="bindClickAddBank">' +

    '<div class="addShow">' + _addBankCard + '</div>' +

    '<div class="addmonery">' +
    '<div class="addmonery-div">' +
    '<div class="addmoneryText">充值金额(元):</div>' +
    '<div class="addmoneryInputDiv">' +
    '<input class="add-monery" type="number" name="add-monery" placeholder="起充金额' + rechargeMin + '元"/>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="bankCardRule">' +
    '<a href="javascript:;" class="recharge-info-c">各支付通道支持银行及限额说明></a>' +
    '</div>' +
    '<a href="javascript:;"><div class="addBtn">充值</div></a>' +

    '</div>';

    $('.rechappend').html(_bankCard);

    //点击各支付限额说明
    $('.recharge-info-c').click(function() {
        //rechargeInfo();
        //limtRules(formData)
        window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=02&formType=1';
    });

    var $amountInput = $('.add-monery');
    Commain.inputChange($amountInput);
    //点击充值按钮
    $('.addBtn').click(function() {
        if(code == -2) {
            Commain.realName(1,formData);
            return false;
        }

        var $addCardNo = $('.addCardNo');//获取银行卡号
        var _addCardNoVal = $.trim($addCardNo.val());
        if(_addCardNoVal == undefined ||_addCardNoVal == null || _addCardNoVal == '' || _addCardNoVal.length == 0) {
            alert('请输入银行卡号！');
            return false;
        }

        if(!Common.reg.isNum.test(_addCardNoVal) || _addCardNoVal.length < 10 || _addCardNoVal.length > 20) {
            alert('请输入合法的银行卡号！');
            return false;
       }

        var $this = $(this);

        rechCheckForm(_addCardNoVal,$amountInput,'',$this,_listData);

    });
}

//网银充值
function webBank(_rechargeTableHtml,formData){
    var param = Common.getParam();

    var _webBank =  '<div class="recharge-box-center">' +
                    '<div class="recharge-bank">' +
                        '<table class="recharge-table">' + _rechargeTableHtml + '</table>' +
                    '</div>' +
                '</div>' +
                '<div class="rechargebox">' +
                     '<div class="recharge-box-bottom">充值金额（元）:</div>' +
                    '<div class="recharge-div">' +
                        '<div class="recharge-div-input">' +
                            '<input class="recharge-input" name="money" type="number" placeholder="起充金额100元" />' +
                        '</div>' +
                    '</div>' +
                     '<a href="javascript:;"><div class="recharge-button">充值</div></a>' +
                '</div>' +
                '<div class="recharge-info">' +
                    '<a href="javascript:;" class="recharge-info-a">各支付通道支持银行及限额说明></a>' +
                '</div>' +
             '</div>';
    $('.rechappend').html(_webBank);
    var $acode = $('.acode');//点击银行
    var $td = $('.recharge-td');
    var _bankCode = '';
    $acode.click(function() {
        $td.removeClass('bcode');
        _bankCode = $(this).attr('code');
        $(this).parent().addClass('bcode');
    });

    var $money = $('input[name=money]');//金额input
    //金额变化后自动添加小数点
    $money.change(function(){
        $money.val(parseFloat($(this).val()).toFixed(2));
    });

    var $rechBtn = $('.recharge-button');//点击充值按钮
    $rechBtn.click(function() {
        var money = $.trim($money.val());
        money = parseFloat(money).toFixed(2);
        if(!$td.hasClass('bcode')) {
            alert('请选择充值银行');
            return false;
        }

        if(money == undefined || money == null || money == '' ) {
            alert('请输入充值金额');
            return false;
        }

        if(isNaN(money)) {
            alert('请输入合法金额');
            $money.val('');
            return false;
        }

        if(!Common.reg.money.test(money)){
            $money.val('');
            alert('金额输入有误');
            return false;
        }

        if(money < 100) {
            alert('起充金额为100元');
            return false;
        }


        $.ajax({
            url:Setting.apiRoot1 + '/u/fy/rechargeForPC.p2p',
            type:"post",
            async:false,
            dataType:'json',
            data: {
                amount:money,
                bankCode: _bankCode.toString(),
                userId: formData.userId,
                loginToken:formData.loginToken
            }
        }).done(function(res) {
            Common.ajaxDataFilter(res,function() {
                if(res.code == 1) {
                    var _data = res.data;

                    var _form = '';
                    _form = _form + '<form action=' + _data.pay_url + ' method="post" style="display: none">' +
                    '<input name="back_notify_url" value="' + _data.back_notify_url+ '"/>' +
                    '<input name="goods_display_url" value="' + _data.goods_display_url+ '"/>' +
                    '<input name="goods_name" value="' + _data.goods_name+ '"/>' +
                    '<input name="iss_ins_cd" value="' + _data.iss_ins_cd+ '"/>' +
                    '<input name="mchnt_cd" value="' + _data.mchnt_cd+ '"/>' +
                    ' <input name="md5" value="' + _data.md5+ '"/>' +
                    '<input name="order_amt" value="' + _data.order_amt+ '"/>' +
                    '<input name="order_id" value="' + _data.order_id+ '"/>' +
                    '<input name="order_pay_type" value="' + _data.order_pay_type+ '"/>' +
                    '<input name="order_valid_time" value="' + _data.order_valid_time+ '"/>' +
                    '<input name="page_notify_url" value="' + _data.page_notify_url+ '"/>' +
                    '<input name="rem" value="' + _data.rem+ '"/>' +
                    '<input name="ver" value="' + _data.ver+ '"/>' +
                    '</form>';
                    $('body').append(_form);

                    $('form').submit();
                    //$('.recharge-up').show();
                } else {
                    if(res.code == -2) {
                        Commain.realName(1,formData);
                        return false;
                    } else {
                        alert(res.message);
                        return false;
                    }
                }
            });
        }).fail(function() {
            alert('网络链接失败');
        });

    });


    //点击各银行支付通道说明按钮
    $('.recharge-info-a').click(function() {
        //rechargeInfo(formData);
        window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=02&formType=2'
    });

}

//绑定银行卡充值的规则
function limtRules(formData) {
    var bankName = ['中国工商银行','中国农业银行','中国建设银行','中国银行','中国交通银行',
    '兴业银行','中信银行','中国光大银行','平安银行','中国邮政储蓄银行','浦发银行','中国民生银行',
    '北京银行','上海银行','招商银行','广发银行','华夏银行'];
    var bankValue = ['10万 | 20万(单日限5笔成功交易)','5万 | 20万(单日限6笔成功交易)','5万 | 10万',
    '5万 | 20万','5万 | 5万','5万 | 5万','1万 | 2万','5万 | 5万','10万 | 20万','10万 | 20万','10万 | 20万',
        '10万 | 20万','5万 | 5万','5万 | 5万','5万 | 20万','10万 | 20万','10万 | 20万'];

    var _trHtml = '';
    for(var i = 0; i < bankName.length; i++) {
        _trHtml = _trHtml + '<tr><td>' + bankName[i] + '</td><td>' + bankValue[i] + '</td></tr>'
    }
    var _limtHtml = '';
    _limtHtml = _limtHtml + '' +
    '<div class="limtTitle"><a href="javascript:;" class="limtReturn"><返回</a>限额说明</div>' +
    '<div class="limtContent">' +
    '<table>' +
    '<tr>' +
    '<th>银行</th>' +
    '<th>富友（单日 | 单笔）</th>'+
    '</tr>' + _trHtml +
    '</table>' +
    '<div class="limt-rules-box">' +
    '<ul>' +
    '<li>备注：</li>' +
    '<li>1.建议用户开通手机银行。</li>' +
    '<li>2.当前支付渠道可以绑定同一张银行卡也可以绑定不同的银行卡。</li>' +
    '<li>3.商户限额、用户银行卡本身限额、认证支付标准限额，三者取最低限额。限额表仅供参考，实际以支付界面提示为准。</li>' +
    '</ul>' +
    '</div>' +
    '</div>';

    $('.useright').html(_limtHtml);

    //点击返回按钮
    $('.limtReturn').click(function() {
        //recharge(formData,0);
        window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=02';
    })
}

function rechCheckForm(card,$amountInput,data,$this,_listData) {
    var _amount = $.trim($amountInput.val());

    if(_amount.length == 0) {
        alert('请输入充值金额！');
        return false;
    }

    if(!Common.reg.money.test(_amount)) {
        $amountInput.val('');
        alert('金额输入有误');
        return false;
    }

    var rechargeMin = parseFloat(data.rechargeMin);
    if(rechargeMin == undefined || rechargeMin == null || rechargeMin == '' || rechargeMin < 100 || isNaN(rechargeMin)) {
        rechargeMin = parseFloat(100);
    }

    if(_amount < rechargeMin) {
        alert('充值金额不能低于'+ rechargeMin +'元');
        return false;
    }
    var limitOnce = parseFloat(_listData.limitOnce);
    if(_amount > limitOnce) {
        alert('充值金额不能大于' + limitOnce);
        return false;
    }

    $this.addClass('disabled');
    $.ajax({
        url: Setting.apiRoot1 + '/u/fy/rechargeForCertPC.p2p',//富友充值
        type: 'post',
        dataType: 'json',
        data: {
            cardNum: card,
            userId: sessionStorage.getItem('uid'),
            amount:_amount,
            loginToken:sessionStorage.getItem('loginToken')
        }
    }).done(function(res) {
        if(res.code == -99) {
            Common.toLogin();
            return false;
        }
        if(res.code == 1) {
            var _data = res.data;
            //console.log(JSON.stringify(_data));
            //var url = 'https://pay.fuiou.com/dirPayGate.do';//富友正式地址
            var url = 'http://www-1.fuiou.com:8888/wg1_run/dirPayGate.do'; //富友测试地址

            //var RSA = (_data.rSA).replace(/(\n)+|(\r\n)+/g, "");
            var RSA = (_data.rSA).replace("\r\n", "<br>");
            RSA = RSA.trim();
            var _formHtml = '<form action=' + url + ' method="post" style="display: none">' +
                '<input name="back_notify_url" value="' + _data.back_notify_url + '">' +
                '<input name="cardholder_name" value="' + _data.cardholder_name + '">' +
                '<input name="cert_no" value="' + _data.cert_no + '">' +
                '<input name="cert_type" value="' + _data.cert_type + '">' +
                '<input name="mchnt_cd" value="' + _data.mchnt_cd + '">' +
                '<input name="order_amt" value="' + _data.order_amt + '">' +
                '<input name="order_id" value="' + _data.order_id + '">' +
                '<input name="page_notify_url" value="' + _data.page_notify_url + '">' +
                '<input name="RSA" value="' + RSA + '">' +
                '<input name="user_id" value="' + _data.user_id + '">' +
                '<input name="user_type" value="' + _data.user_type + '">' +
                '</form>';

            //$('html').html(res.data);
            $('body').append(_formHtml);
            $('form').submit();

        } else {
            alert(res.message);
            return false;
        }

    }).fail(function() {
        alert('网络链接失败！');
        $this.removeClass('disabled');
        return false;
    })
}

function rechSuccess(formData) {
    var newSuccess = '' +
        '<div class="reacher-alert-box">' +
        '<div class="reacher-alert-background"></div>' +
        '<div class="reacher-alert-div">' +
        '<div class="reachClose"></div>' +
        '<div class="reacher-alert-div1">' +
        '<div class="reacher-alert-title">请在网银界面完成充值后选择：</div>' +
        '<div class="reacher-alert-div2">' +
        '<div class="rechIcon rech-icon1"></div>' +
        '<div class="reacher-alert-text">充值成功</div>' +
        '<a href="' + Setting.staticRoot + '/bpage/account.html?formPages=01" class="reacher-alert-href">查看账户</a>' +
        '<a href="' + Setting.staticRoot + '/pages/index.html" class="reacher-alert-href2">前往投资</a>' +
        '</div>' +
        '<div class="reacher-alert-div2">' +
        '<div class="rechIcon rech-icon2"></div>' +
        '<div class="reacher-alert-text">充值失败</div>' +
        //'<a href="javascript:;" class="reacher-alert-href rechBankCard">选择银行卡充值</a>'+
        //'<a href="javascript:;" class="reacher-alert-href2 rechRolad">再试一次</a>'+
        '<a href="javascript:;" class="reacher-alert-href rechRolad">再试一次</a>'+
        '</div>' +
        '</div>'+
        '</div>' +
        '</div>' +
        '';

    var $body = $('body');
    $body.after(newSuccess);

    var param = Common.getParam();
    var success = param.success;
    var message = param.message;
    if(success == 1) {
        $('.reacher-alert-box').show();
        if(message != undefined && message != null && message != '') {
            alert(message);
        }

        $body.css({"overflow":"hidden","height":"100%"});
    }
    //点击银行卡充值
    $('.rechBankCard').click(function() {
        recharge(formData,1)
    });

    //点击再试一次按钮
    $('.rechRolad').click(function() {
        window.location.href =  '../bpage/account.html?formPages=02';
    });

    //点击关闭按钮
    $('.reachClose').click(function() {
        window.location.href =  '../bpage/account.html?formPages=02';
    });



}

function oldSuccess() {
    var _rechargeAlert = '';
    _rechargeAlert = _rechargeAlert + '' +
    '<div class="recharge-up">' +
    '<div class="recharge-content">' +
    '<div class="recharge-alert">' +
    '<div class="recharge-alert-img-div">' +
    '<img src="../bimages/cancel.png" class="recharge-img-alert recharge-alert-close">' +
    '</div>' +
    '<div class="recharge-alert-margin">' +
    '<div class="recharge-alert-title">请在网银界面完成充值后选择</div>' +
    '<div class="recharge-alert-table">' +
    '<table>' +
    '<tr>' +
    '<td>' +
    '<div class="recharge-alert-div1">' +
    '<img src="../bimages/success.png" class="recharge-alert-td-img">' +
    '</div>' +
    '<div class="recharge-alert-div2">充值成功</div>' +
    '</td>' +
    '<td>' +
    '<a href="../bpage/account.html?formPages=0">' +
    '<div class="recharge-alert-div3">查看账户</div>' +
    '</a>' +
    '</td>' +
    '</tr>' +
    '<tr>' +
    '<td>' +
    '<div class="recharge-alert-div1"></div>' +
    '<div class="recharge-alert-div2"></div>' +
    '</td>' +
    '<td><div class="recharge-alert-div4">或使用V金融APP进行投资</div></td>' +
    '</tr>' +
    '<tr>' +
    '<td>' +
    ' <div class="recharge-alert-div1">' +
    '<img src="../bimages/fail.png" class="recharge-alert-td-img">' +
    '</div>' +
    '<div class="recharge-alert-div2">充值失败</div>' +
    '</td>' +
    '<td>' +
    '<a href="javascript:;" class="recharge-alert-close">' +
    '<div class="recharge-alert-div5">重试</div>' +
    '</a>' +
    '</td>' +
    '</tr>' +
    '</table>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';
    var $body = $('body');
    $body.after(_rechargeAlert);
    var param = Common.getParam();
    var success = param.success;
    var message = param.message;
    if(success == 1) {
        $('.recharge-up').show();
        if(message != undefined && message != null && message != '') {
            alert(message);
        }

        $body.css({"overflow":"hidden","height":"100%"});
    }


    var $close = $('.recharge-alert-close');//关闭和重试按钮
    $close.click(function() {
        window.location.href =  '../bpage/account.html?formPages=02';
    });
}