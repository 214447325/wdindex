/**
 * Created by User on 2017/6/12.
 * 资产状态
 */
var _type = 1;

function portfolio(formData) {

    var param = Common.getParam();
    var formType = param.formType;
    if(formType != undefined && formType != null && formType != '') {
        //定期
        if(parseInt(formType) == 3) {
            productRecord(formType);
            return false;
        }

        //周周涨
        if(parseInt(formType) == 1) {
            currentRecord(formType);
            return false;
        }
    }

    //请求时间戳
    var timestamp = Date.parse(new Date());
    //顶部
    var proavailable = ['在投总额（元）','累计收益（元）','可用余额（元）'];
    var proavailableText = ['周周涨','固定收益','浮动收益'];

    //在投金额、累计收益、可用余额
    var proavailmonery = [];

    var _portfoHtml = '';

    $.ajax({
        url:Setting.apiRoot1 + '/u/queryMyAccountInfo.p2p',
        type:"post",
        async:false,
        dataType:'json',
        data: {
            userId:formData.userId,
            loginToken: formData.loginToken,
            guid:timestamp
        }
    }).done(function(res) {
        Common.ajaxDataFilter(res, function() {
            if(res.code == 1) {
                var _data = res.data;
                /**
                 * @type {*[]}
                 * inUseAmt 在投总额
                 * totalIncome 累计收益
                 * accountAmt 可用余额
                 */
                proavailmonery = [parseFloat(_data.inUseAmt).toFixed(2),parseFloat(_data.totalIncome).toFixed(2),parseFloat(_data.accountAmt).toFixed(2)];
                var _protext1 = '';
                for(var i = 0; i < proavailable.length; i++) {
                    _protext1 = _protext1 + '<div class="useright-portfolio-div">' +
                                            '<div class="useright-portfolio-title">' + Common.comdify(proavailmonery[i]) + '</div>' +
                                            '<div class="useright-portfolio-ins">' + proavailable[i] + '</div>' +
                                            '</div>';
                }
                var _amoutmonery = [];//在投金额
                var _amoutText = [];//在投金额文案
                var _left = ['','',''];
                var _center = ['','',''];
                var _right = ['','',''];
                var _type = [1,3,4];

                //周周涨
                var curHoldAmount = _data.curHoldAmount;
                if(curHoldAmount == undefined || curHoldAmount == null || curHoldAmount == '' || curHoldAmount == 0) {
                    _amoutmonery[0] = '<a>您还未投资周周涨产品</a>';
                    _amoutText[0] = '';
                    _center[0] = '<div class="prod-center"><div class="prod-top">0.00</div><div class="prod-bottom">昨日收益</div></div>';

                } else {
                    _amoutmonery[0] = Common.comdify(parseFloat(curHoldAmount).toFixed(2));
                    _amoutText[0] = '在投金额(元)';
                    _left[0] = '<div class="prod-left"><div class="prod-top">' + parseFloat(_data.yesterDayTotalRate).toFixed(2) + '%' + '</div><div class="prod-bottom">昨日年化</div></div>';

                    _right[0] = '<div class="prod-right"><div class="prod-top">' + Common.comdify(parseFloat(_data.yesterDayInterest).toFixed(2)) + '</div><div class="prod-bottom">昨日收益</div></div>';
                }

                //定期
                var regularHoldAmt = _data.regularHoldAmt;
                if(regularHoldAmt == undefined || regularHoldAmt == null || regularHoldAmt == '' || regularHoldAmt == 0) {
                    _amoutmonery[1] = '<a>您还未投资定期产品</a>';
                    _amoutText[1] = '';

                    _center[1] = '<div class="prod-center"><div class="prod-top">0.00</div><div class="prod-bottom">待分配总收益</div></div>';

                } else {
                    _amoutmonery[1] = Common.comdify(parseFloat(regularHoldAmt).toFixed(2));
                    _amoutText[1] = '在投金额(元)';

                    _left[1] = '<div class="prod-left"><div class="prod-top">' + _data.regularTime + '</div><div class="prod-bottom">最近一笔到期</div></div>';


                    _right[1] = '<div class="prod-right"><div class="prod-top">' + Common.comdify(parseFloat(_data.regularTotalAmount).toFixed(2)) + '</div><div class="prod-bottom">待分配总收益</div></div>';

                }

                //浮动收益产品
                var floatHoldAmt = _data.floatHoldAmt;
                if(floatHoldAmt == undefined || floatHoldAmt == null || floatHoldAmt == '' || floatHoldAmt == 0) {
                    _amoutmonery[2] = '<a>您还未投资浮动收益产品</a>';
                    _amoutText[2] = '';

                    _center[2] = '<div class="prod-center"><div class="prod-top">0.00</div><div class="prod-bottom">当前盈利</div></div>';

                } else {
                    _amoutmonery[2] = Common.comdify(parseFloat(floatHoldAmt).toFixed(2));
                    _amoutText[2] = '在投金额(元)';

                    _left[2] = '<div class="prod-left"><div class="prod-top">' + _data.floatEndTime + '</div><div class="prod-bottom">最近一笔到期</div></div>'

                    _right[2] = '<div class="prod-right"><div class="prod-top">' + Common.comdify(parseFloat(_data.floatTotalAmount).toFixed(2)) + '</div><div class="prod-bottom">当前盈利</div></div>';

                }

                var titles = ['<div class="proTitle current">周周涨</div>','<div class="proTitle product">固定收益</div>','<div class="proTitle float">浮动收益</div>'];
                var _protext2 = '';
                for(var i = 0; i < proavailableText.length; i++) {

                    _protext2 = _protext2 + ' <div class="useright-portfolio-div second' + i + '">' +
                                            titles[i] +
                                            '<div class="invest-amount">' +
                                                '<div class="invest-prod">' + _amoutmonery[i] + '</div>' +
                                                '<div class="invest-prod-text">' + _amoutText[i] + '</div>' +
                                            '</div>' +
                                            //编辑内容
                                            '<div class="prod-content">' + _left[i] + _center[i] + _right[i] + '</div>' +
                                           '<div class="prod-btn"><a href="javascript:;" type="' + _type[i] + '" class=" pBtn prodBtn' + i + '">交易记录</a></div>' +

                                            '</div>';
                }
//
                _portfoHtml = _portfoHtml + '<div class="useright-portfolio-box">' +
                                            '<div class="useright-portfolio-top">' + _protext1 +
                                            '</div>' +
                                            '<div class="useright-portfolio-center">' + _protext2 +
                                            '</div>' +
                                            '<div class="prod-btn-div">' +
                                            '<a href="javascript:;"><div class="prodrech">充值</div></a>' +
                                            '<a href="javascript:;"><div class="prodwith">提现</div></a>' +
                                            '</div>' +
                                            '</div>';

                $('.useright').html(_portfoHtml);
                $.ajax({
                    url: Setting.apiRoot1 + '/getCurrentAndFolat.p2p',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        userId:formData.userId
                    }
                }).done(function(data) {
                    if(res.code == 1) {
                        var _w = 792;
                        var _data = data.data;
                        var _currentCount = parseFloat(_data.currentCount);
                        var _floatCount = parseFloat(_data.floatCount);
                        if(_currentCount <= 0) {
                            $('.second0').hide();
                            _w = _w - 254;
                        }

                        if(_floatCount <= 0) {
                            $('.second2').remove();
                            _w = _w -254;
                        }

                        $('.useright-portfolio-center').width(_w)

                    } else {
                        alert(data.message);
                        return false;
                    }
                }).fail(function() {
                    alert('网络连接失败！');
                    return false;
                });

                //点击交易记录按钮
                $('.pBtn').click(function() {
                    var type = $(this).attr('type');
                    //定期
                   if(parseInt(type) == 3) {//formType
                       window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=01&formType=3';
                       //productRecord(type);
                   }

                    //周周涨
                    if(parseInt(type) == 1) {
                        window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=01&formType=1';
                        //currentRecord();
                    }

                    if(parseInt(type) == 4) {
                        alert('请至APP查看');
                        return false;
                    }
                });
                //点击充值按钮
                $('.prodrech').click(function() {
                    window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=02'
                });
                //点击提现按钮
                $('.prodwith').click(function() {
                    window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=03'
                })
            }
        })
    }).fail(function() {
        alert('网络链接失败');
    });
    //currentRecord();
    //proRedemption();
    //proRedemptAjaxSuccess();
}

//周周涨
function currentRecord() {
    var _proCurrentHtml = '';
    _proCurrentHtml = _proCurrentHtml + '' +
    '<div class="proCurrent-title"><a href="javascript:;" class="returnProCurr"><返回</a>周周涨交易记录</div>' +
    '<div class="proCurrent-content">' +
    '<div class="proCurrent-navigation">' +
    '<div class="proCurrent-navigation-left">' +
    '<a href="javascript:;" class="proCurClick1 isclick" type="1">购买</a>' +
    '<a href="javascript:;" class="proCurClick1" type="2">赎回</a>' +
    '<a href="javascript:;" class="proCurClick1" type="3">收益</a>' +
    '</div>' +
    '<div class="proCurrent-navigation-right">' +
    '<a href="javascript:;" class="proCurClick2 isdate" dateType="1">一周</a>' +
    '<a href="javascript:;" class="proCurClick2" dateType="2">一月</a>' +
    '</div>' +
    '</div>' +

    '<div class="proCurrentContent">' +
    '<div class="proCurrentContentTitle-Box" id="prodBottom">' +
    '<div class="proCurrentContentTitle-text">购买时间</div>' +
    '<div class="proCurrentContentTitle-text">购买金额</div>' +
    '</div>' +
    '' +
    '<div class="proCurrentRecord">' +
    '' +
    '<table class="proCurrentTable">' +

    '</table>' +

    '</div>' +

    '</div>' +

    '<div class="prodCurrent-bottom">' +
    '<a href="javascript:;" class="prodCurrent-a proCurrRedemption" style="margin: 0 auto">赎回</a>' +
    //'<a href="javascript:;" class="prodCurrent-a proCurrBuy" style="display: none">购买</a>' +
    '</div>' +
    '</div>' +
    '';
    $('.useright').html(_proCurrentHtml);
    proCurrentAjax(1);
    var $proCurrentRecord = $('.proCurrentRecord');
    //点击购买、赎回、交易按钮
    var $proCurClick1 = $('.proCurClick1');
    $proCurClick1.click(function() {
        $proCurClick1.removeClass('isclick');
        $(this).addClass('isclick');
        $proCurrentRecord.html('<table class="proCurrentTable"></table>');
        _type = $(this).attr('type');

        if(_type == 1) {
            $('#prodBottom').html('<div class="proCurrentContentTitle-text">购买时间</div><div class="proCurrentContentTitle-text">购买金额</div>');
        }
        if(_type == 2) {
            $('#prodBottom').html('<div class="proCurrentContentTitle-text">赎回时间</div><div class="proCurrentContentTitle-text">赎回金额</div>');
        }
        if(_type == 3) {
            $('#prodBottom').html('<div class="proCurrentContentTitle-text">时间</div><div class="proCurrentContentTitle-text">收益</div>');
        }
        proCurrentAjax(1);
    });

    //点击一周、一月按钮
    var $proCurClick2 = $('.proCurClick2');
    $proCurClick2.click(function() {
        $proCurClick2.removeClass('isdate');
        $(this).addClass('isdate');
        $proCurrentRecord.html('<table class="proCurrentTable"></table>');
        proCurrentAjax(1);
    });

    //点击购买（跳转首页产品列表）
    var $proCurrBuy = $('.proCurrBuy');
    $proCurrBuy.click(function() {

        window.location.href = Setting.staticRoot + '/pages/index.html';
    });

    //点击返回按钮
    var $returnProCurr = $('.returnProCurr');
    $returnProCurr.click(function() {
        window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=01';
    });

    //点击赎回按钮
    var $proCurrRedemption = $('.proCurrRedemption');
    $proCurrRedemption.click(function() {
        proRedemption();
    })
}

function proRedemption() {
    $.ajax({
        url: Setting.apiRoot1 + '/u/redeemCal.p2p',
        type: 'post',
        dataType:'json',
        data: {
            userId: sessionStorage.getItem('uid'),
            loginToken:sessionStorage.getItem('loginToken')
        }
    }).done(function(res) {
        Common.ajaxDataFilter(res,function() {
            if(res.code == 1) {
                var _data = res.data;
                var curHadShare = _data.curUserfulShare;
                var redeemAmount = _data.redeemAmount;
                var _proRedHtml = '';
                _proRedHtml = _proRedHtml + '' +
                '<div class="proRedBox">' +
                '<div class="proRedBox-background"></div>' +
                '<div class="proRedBox-div">' +
                '<a href="javascript:;" class="proRedClose"></a>' +
                '<div class="proRedTitle">赎回</div>' +

                '<div class="proRedContent">' +
                '<div class="proRedAmount">可赎回金额：¥' + parseFloat(curHadShare).toFixed(2) +'</div>' +
                //'<div class="proRedAmount">当日可赎回额度：' + parseFloat(redeemAmount).toFixed(2) +'</div>' +
                '<div class="proRed-input">' +
                '<div class="proRedText">赎回金额:</div>' +
                '<div class="proRed-input-div">' +
                '<input class="proRedInput" type="number" name="proRedInput" placeholder="输入需要赎回金额">' +
                '</div>' +
                '</div>' +
                '</div>'+

                '<a href="javascript:;" class="proRedBtn proRedBtn1">确定</a>'+
                '</div>' +
                '</div>';
                var $html = $('html');
                $html.append(_proRedHtml);
                $("body").css({"overflow":"hidden","height":"100%"});

                //点击关闭按钮
                $('.proRedClose').click(function() {
                    $('.proRedBox').remove();
                    $("body").css({"overflow":"auto"});
                });

                //点击确定按钮
                var $proRedBtn1 = $('.proRedBtn1');
                //输入框
                var $proRedInput = $('.proRedInput');
                Commain.inputChange($proRedInput);
                $proRedBtn1.click(function() {
                    var $this = $(this);
                    if($this.hasClass('disabled')) {
                        return false;
                    }
                    var _inputVal = $.trim($proRedInput.val());
                    //curHadShare可赎回金额
                    if(_inputVal == undefined || _inputVal == null || _inputVal == '' || !_inputVal){
                        alert('请填写赎回份额');
                        return false;
                    }

                    if(curHadShare == 0){
                        alert('未持有周周涨份额');
                        return false;
                    }
                    if(_inputVal == 0 ){
                        alert('赎回金额大于零');
                        return false;
                    }
                    if(_inputVal > curHadShare){
                        alert('输入赎回金额大于周周涨持有份额');
                        return false;
                    }

                    //if(_inputVal > redeemAmount){
                    //    alert('超过当日剩余可赎回额度，请重新赎回');
                    //    return false;
                    //}

                    //if(_inputVal > 100000){
                    //    alert('赎回金额不能大于10万元');
                    //    return false;
                    //}

                    //$this.attr('disabled',true);
                    $this.addClass('disabled');
                    //封装请求参数
                    var data1 = {};
                    data1.userId = sessionStorage.getItem('uid');
                    data1.redeemAmt = _inputVal;
                    data1.loginToken = sessionStorage.getItem('loginToken');

                    $.ajax({
                        url: Setting.apiRoot1 + '/u/redeem.p2p',
                        type: 'post',
                        dataType:'json',
                        data:data1
                    }).done(function(res) {
                        Common.ajaxDataFilter(res,function() {
                            if(res.code == 1) {
                                $('.proRedBox').remove();
                                $("body").css({"overflow":"auto"});
                                proRedemptAjaxSuccess();
                            } else {
                                alert(res.message);
                                $this.removeClass('disabled');
                                return false;
                            }
                        })
                    }).fail(function() {
                        alert('网络连接失败！');
                        $this.removeClass('disabled');
                        return false;
                    })

                })
            } else {
                alert(res.message);
                return false;
            }
        })
    }).fail(function() {
        alert('网络连接失败！');
        return false;
    });
}

function proRedemptAjaxSuccess() {
    var _proRedHtml = '';
    _proRedHtml = _proRedHtml + '' +
    '<div class="proRedBox">' +
    '<div class="proRedBox-background"></div>' +
    '<div class="proRedBox-div">' +
    '<a href="javascript:;" class="proRedClose"></a>' +
    '<div class="proRedTitle">赎回</div>' +

    '<div class="proRedContent">' +
    '<div class="proRedContentText1">赎回成功</div>' +
    '<div class="proRedContentText2">可前往资产状态中查看</div>'+
    '</div>'+

    '<a href="javascript:;" class="proRedBtn proRedBtn2">确定</a>'+
    '</div>' +
    '</div>';
    var $html = $('html');
    $html.append(_proRedHtml);
    $("body").css({"overflow":"hidden","height":"100%"});
    //点击确定按钮
    $('.proRedBtn2').click(function() {
        window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=01';
    });

    //点击关闭按钮
    $('.proRedClose').click(function() {
        $('.proRedBox').remove();
        $("body").css({"overflow":"auto"});
    })
}

/**
 * 循环迭代数据
 * @param count 表示第几页
 */
function proCurrentAjax(count) {
    var $isclick = $('.isclick');
    var $isdate = $('.isdate');
    var type = $isclick.attr('type');
    var dateType = $isdate.attr('dateType');
    var $proCurrentRecord = $('.proCurrentRecord');
    $proCurrentRecord.dropload({
        scrollArea : $proCurrentRecord,
        loadDownFn : function(me) {
            //me.noData(false);
            $.ajax({
                url: Setting.apiRoot1 + '/u/queryCurrentList.p2p',
                type: 'post',
                dataType: 'json',
                data: {
                    userId : sessionStorage.getItem('uid'),
                    financeDetailType: type,
                    dateType:dateType,
                    pageNum:count,
                    pageSize:10,
                    loginToken:sessionStorage.getItem('loginToken')
                }
            }).done(function(res) {
                Common.ajaxDataFilter(res,function() {
                   if(res.code == 1) {
                       var _data = res.data;
                       var isProAmount = true;
                       if(_data != undefined && _data != null && _data != '' && _data.length > 0) {
                           var _dataHtml = '';
                           for(var i = 0; i < _data.length; i++) {
                               if(parseFloat(_data[i].interestAmount) > 0 && type == _type) {
                                   isProAmount = false;
                                   _dataHtml = _dataHtml + '' +
                                   '<tr>' +
                                   '<td>' + _data[i].dateStr + '</td>' +
                                   '<td>' + parseFloat(_data[i].interestAmount).toFixed(2) + '</td>' +
                                   '</tr>';
                               }

                           }

                           if(isProAmount && count == 1) {
                               $proCurrentRecord.html('<div class="proCurrentRecord-text">空空如也，快去投资吧</div>');
                           }

                           if(count == 1) {
                               $('.proCurrentTable').html(_dataHtml);
                           } else {
                               $('.proCurrentTable').append(_dataHtml);
                           }
                           count++;
                           me.resetload();
                       } else {
                           // 锁定
                           me.lock();
                           // 无数据
                           me.noData(true);
                           if(count == 1) {
                               $proCurrentRecord.html('<div class="proCurrentRecord-text">空空如也，快去投资吧</div>');
                           }
                       }

                   } else {
                       alert(res.message);
                       // 锁定
                       me.lock();
                       // 无数据
                       me.noData(true);
                       return false;
                   }
                })
            }).fail(function() {
                // 锁定
                me.lock();
                // 无数据
                me.noData(true);
                alert('网络连接失败！');
                return false;
            });
        }
    });
}


//定期
function productRecord(type) {
    var _div = ['产品名称','产品周期','购买金额','综合年化','预期总收益（元）','已用券'];
    var _trHtml = '';
    _trHtml = _trHtml + '<div class="prod-title1">';
    for(var i = 0; i < _div.length; i++) {
        _trHtml = _trHtml + '<div>' + _div[i] + '</div>';
    }
    _trHtml = _trHtml + '</div>';
    var _recordHtml = '';
    _recordHtml = _recordHtml + '<div class="proRecord"><div class="returnPage"><a href="javascript:;"><返回</a></div>定期交易记录</div>' +
    '<div class="proRecord-center">' +
    '<a href="javascript:;"><div class="due beforePro profull">未到期</div></a>' +
    '<a href="javascript:;"><div class="due afterPro">已到期</div></a>' +
    '</div>' +
    '<div class="prodContent">' +
    '<div>' + _trHtml +
    '' +
    '</div>' +
    '<div class="pro-table proTable">' +
    '</div>'+
    '</div>';
    $('.useright').html(_recordHtml);
    $.ajax({
        url: Setting.apiRoot1 + '/u/queryMyRegularLoanInfo.p2p',
        type: 'post',
        async:false,
        dataType: 'json',
        data:{
            userId:sessionStorage.getItem('uid'),
            loginToken:sessionStorage.getItem('loginToken'),
            type:type,
            status:0
        }
    }).done(function(res) {
        Common.ajaxDataFilter(res,function() {
            if(res.code == -99) {
                Common.toLogin();
                return false;
            }
            if(res.code == 1) {
                var userRateCouponCount = res.data.userRateCouponCount;
                var pageNum = 1;
                queryMyRegularLoanList(pageNum,userRateCouponCount,false);
                var $due = $('.due');
                //点击未到期
                var $proTable = $('.pro-table');
                $('.beforePro').click(function() {
                    if($proTable.hasClass('proTable')) {
                        return false;
                    }
                    $due.removeClass('profull');
                    $(this).addClass('profull');
                    pageNum = 1;
                    queryMyRegularLoanList(pageNum,userRateCouponCount,false);
                });

                //点击已到期
                $('.afterPro').click(function() {
                    if($proTable.hasClass('proNoTable')) {
                        return false;
                    }
                    $due.removeClass('profull');
                    $(this).addClass('profull');
                    pageNum = 1;
                    queryMyRegularLoanExpired(pageNum,userRateCouponCount,true)
                });

                $('.returnPage').click(function() {
                    window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=01';
                })
            } else {
                alert(res.message);
            }
        });
    }).fail(function() {
        alert('网络连接失败！');
        return false;
    });
}

/**
 * 未到期
 */

function queryMyRegularLoanList(pageNum,userRateCouponCount,isdue){
    $('.pro-table').addClass('proTable').removeClass('proNoTable').html('');
    var $content = $('.proTable');
    $content.dropload({
        scrollArea : $content,
        loadDownFn : function(me){
            $.ajax({
                url: Setting.apiRoot1 + '/u/queryMyRegularLoanList.p2p',
                type: 'post',
                async:false,
                dataType: 'json',
                data:{
                    userId:sessionStorage.getItem('uid'),
                    loginToken:sessionStorage.getItem('loginToken'),
                    pageNum:pageNum
                }
            }).done(function(res) {
                if(res.code == 1) {
                    var _res = res.data;
                    var _noList = _res.myRegularInvestList;//未到期
                    var cycle;//周期时长
                    var cycleType;//周期类型
                    var percent;
                    var rate;
                    var money;
                    for(var i=0;i<_noList.length;i++){
                        var interestTotalAmount=_noList[i].interestTotalAmount;
                        cycle=_noList[i].loanCycle;//周期
                        cycleType=_noList[i].cycleType;//周期类型
                        rate=_noList[i].rate;//年化收益率
                        money=_noList[i].holdMoney;//每种产品购买的金额
                        if( cycleType==1){
                            percent = cycle / 365;//日
                        }else if(cycleType==2){
                            percent = cycle*30 /365;//月
                        }else if(cycleType == 3){
                            percent =cycle*365 /365;//年
                        }else if(cycleType == 4){
                            percent = cycle*7 /365;//周
                        }
                        if (interestTotalAmount==0) {
                            interestTotalAmount=parseFloat(percent*money*rate/100).toFixed(2);
                        }
                        _noList[i].interestTotalAmount=interestTotalAmount;

                    }

                    if(_noList != undefined && _noList != null && _noList != '' && _noList.length != 0) {
                        addProdVoucher(_noList,userRateCouponCount,isdue,pageNum,$content);
                        pageNum++;
                        me.resetload();
                    } else {
                        me.lock();
                        me.noData(true);
                        return false;
                    }

                } else {
                    me.lock();
                    me.noData(true);
                    alert(res.message);
                    return false;
                }
            }).fail(function() {
                me.lock();
                me.noData(true);
                alert('网络连接失败！');
                return false;
            })
        }
    })
}

/**
 * 已到期
 */
function queryMyRegularLoanExpired(pageNum,userRateCouponCount,isdue) {
    $('.pro-table').addClass('proNoTable').removeClass('proTable').html('');
    var $content = $('.proNoTable');
    $content.dropload({
        scrollArea : $content,
        autoLoad:true,
        loadDownFn : function(me){
            $.ajax({
                url: Setting.apiRoot1 + '/u/queryMyRegularLoanExpired.p2p',
                type: 'post',
                async:false,
                dataType: 'json',
                data:{
                    userId:sessionStorage.getItem('uid'),
                    loginToken:sessionStorage.getItem('loginToken'),
                    pageNum:pageNum
                }
            }).done(function(res){
                if(res.code == 1) {
                    var _res = res.data;
                    var _expiredList = _res.myRegularExpireInvestList;//已到期
                    if(_expiredList != undefined && _expiredList != null && _expiredList != '' && _expiredList.length > 0) {
                        addProdVoucher(_expiredList,userRateCouponCount,isdue,pageNum,$content);
                        pageNum++;
                        me.resetload();
                    } else {
                        me.lock();
                        me.noData(true);
                    }
                } else {
                    me.lock();
                    me.noData(true);
                    alert(res.message);
                    return false;
                }
            }).fail(function() {
                me.lock();
                me.noData(true);
                alert('网络连接失败！');
                return false;
            });
        }
    })
}


/**
 * 定期交易记录循环遍历
 * @param listData 存放是否到期
 * @param userRateCouponCount
 * @param isdue 判断是否到期
 */
function addProdVoucher(listData,userRateCouponCount,isdue,pageNum,$content) {
    var $proTable = $content;
    var _tableHtml = '';
    var prodMonery = '';
    if(isdue) {
        prodMonery = '';
        $proTable.addClass('afterPro');
    } else {
        prodMonery = 'prodMonery';
        $proTable.removeClass('afterPro');
    }
    _tableHtml = _tableHtml + '<table>';
    for(var i = 0; i < listData.length; i++) {
        var _td = '';
        if(listData[i].product_type == 5){
            _td =_td + '<td class="firstPod">新手标</td>';
        }else if(listData[i].product_type == 6){
            if(listData[i].loanCycle == 2){
                _td =_td + '<td class="firstPod">新手标A</td>';
            }
            if(listData[i].loanCycle == 4){
                _td =_td + '<td class="firstPod">新手标B</td>';
            }
        } else {
            _td =_td + '<td class="firstPod">' + listData[i].loanCycle + '周定期</td>'
        }

        _td = _td + '<td>' + listData[i].createTime +'至' + listData[i].endtime + '</td>';
        _td = _td + '<td class="' + prodMonery + '" id="' + listData[i].financeId + '">' + parseFloat(listData[i].holdMoney).toFixed(2) + '</td>';
        _td = _td + '<td>' + parseFloat(listData[i].addRate).toFixed(2) + '%</td>';
        _td = _td + '<td>' + parseFloat((parseFloat(listData[i].interestTotalAmount) + parseFloat(listData[i].addAmt)).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2) + '</td>';

        var couponConut = listData[i].couponConut;
        var _fcDays = 0;
        var _tdLast = '';
        if(couponConut != undefined && couponConut != null && couponConut != '' && couponConut.length != 0) {
            var _td1 = '';
            for(var j = 0; j < couponConut.length; j++) {
                if(couponConut[j].couponType == 1) {
                    _fcDays = couponConut[j].count;
                }

                if(couponConut[j].count == 1) {
                    _tdLast = _tdLast +  '<div>' + couponConut[j].couponTitle +'</div>'
                } else {
                    _tdLast = _tdLast + '<div>' + couponConut[j].couponTitle + 'X' + couponConut[j].count + '</div>'
                }
            }
        }

        //判断是否出现添加券的按钮
        if((userRateCouponCount != undefined && userRateCouponCount != null && userRateCouponCount != '' && userRateCouponCount > 0) || listData[i].restWeight > 0) {
            //_restWeightText = _restWeightText + '<span class="use" loanCycle =' + _noList[i].loanCycle + ' id="use' + i + '"  date=' + listData[i].endtime + ' onClick="jumpcoupon(' + _noList[i].financeId + ',' + i + ',' + _fcDays + ')">使用加息券></span>';
            //判断是否已经过期和是否使用添加券
            //if(!isdue && listData[i].product_type != 5 && listData[i].product_type != 6 && listData[i].loanCycle != 3 && listData[i].loanCycle != 22 && listData[i].loanCycle != 9) { console.log(JSON.stringify(listData[i].product_type))
            //    _tdLast = _tdLast + '<div><a href="javascript:;" class="useBtn" financeId="' + listData[i].financeId + '" rate="' + listData[i].rate + '" maxWeight="' + listData[i].maxWeight + '" restWeight="' + listData[i].restWeight + '" amount="' + parseFloat(listData[i].holdMoney).toFixed(2) + '" loanCycle =' + listData[i].loanCycle + ' id="use' + i + '" date=' + listData[i].endtime + ' number=' + i +' fcDays= ' + _fcDays + '>添加券</a></div>';
            //}
        }

        _td = _td + '<td class="lastPod">' + _tdLast + '</td>';

        _tableHtml = _tableHtml + '<tr>' + _td +'</tr>';
    }
    _tableHtml = _tableHtml + '</table>';
    if(pageNum == 1) {
        $proTable.html(_tableHtml);
    } else {
        $proTable.append(_tableHtml);
    }


    $('.useBtn').click(function() {
        var $this = $(this);

        var _listData = {};

        //获取周期
        var loancycle = $this.attr('loancycle');

        var restWeight = $this.attr('restWeight');
        //最大权重
        var maxWeight = $this.attr('maxWeight');
        //获取结束时间
        var _endtime = $this.attr('date');
        //获取投资金额
        var _amount = $this.attr('amount');
        //把获取到的结束时间进行转换
        var _end = new Date(_endtime);
        //获取本机当前的时间
        var _nowtime = new Date();
        var _now = (_end.getTime()-_nowtime.getTime())/1000;
        //获取到可用券的时间段
        var day = parseInt(_now / (24*60*60));
        var redays = $this.attr('fcDays');

        var rate = $this.attr('rate');
        var financeId = $this.attr('financeId');
        _listData.financeId = financeId;
        _listData.restWeight = restWeight;
        _listData.maxWeight = maxWeight;
        _listData.amount = _amount;
        _listData.rate = rate;
        _listData.day = day;
        addPortCard(_listData);

    });
}

//浮动收益
function floatRecord() {

}

function addPortCard(listData) {
    var _protHtml = '';
    _protHtml = _protHtml + '' +
    '<div class="proAlert-box">' +
    '<div class="proAlert-box-background"></div>' +
    '<div class="proAlert-div">' +
    '<div class="proalClose"></div>' +
    '<div class="proAlert-title">我的优惠券</div>' +

    '<div class="proAlertContent">' +
        //'<div class="proalCardBox">' +
        //    '<div class="proalCardIcon1" >' +
        //        '<div class="proalLeft">' +
        //            '<div class="proalLeft-top">10<a>%</a></div>' +
        //            '<div class="proalLeft-bottom">天数加息券</div>' +
        //        '</div>' +
        //        '<div class="proalRight">' +
        //            '<div class="proalAddMonery">+2000</div>' +
        //            '<div class="proalText">加息天数：1天</div>' +
        //            '<div class="proalText">适用产品：任意定期</div>' +
        //            '<div class="proalText">有效期：2017.08.01~2017.08.30</div>' +
        //            '<div class="proalElect"><img src="../bimages/pro/invalid-name.png"></div>' +
        //        '</div>' +
        //     '</div>' +
        //'</div>' +
    '</div>' +

    '<div class="pro-alert-instruction">注：点击要使用的券即可选中</div>' +
    '<div class="pro-alert-amount">预期收益(元)：<span class="proSpan">0</span></div>' +
    '<a href="javascript:;" class="proAlertBtn">确定</a>' +
    '</div>' +
    '</div>';


    var $body = $('body');
    $body.after(_protHtml);
    $body.css({"overflow":"hidden","height":"100%"});

    //点击关闭按钮
    $('.proalClose').click(function() {
        $('.proAlert-box').remove();
        $body.css({"overflow":"auto"});
    });
   prodropload(listData);
}

function prodropload(listData){
    //券的内容区域
    var $proAlertContent = $('.proAlertContent');
    $.ajax({
        url:Setting.apiRoot1 + '/u/getUsefulRateCoupon.p2p',
        type:"post",
        async:false,
        dataType:'json',
        data:{
            userId: sessionStorage.getItem('uid'),
            loginToken:sessionStorage.getItem('loginToken'),
            couponType:1,//1==加息券
            useType:2,//使用场景，1--投资时查询  2--投资未到期查询
            prodType:3,//定期
            financeId:listData.financeId
        }
    }).done(function(res) {
        Common.ajaxDataFilter(res,function() {
            if(res.code == 1) {
                var couponData = res.data;
                var amount = listData.amount;//余额
                var maxPrivilege = res.maxPrivilege;
                var cycleTime = listData.day;
                var  _speaceDay = res.speaceDay; //加息券可以使用的天数
                if(couponData.length > 0) {
                    for(var i = 0; i < couponData.length; i++) {
                        var _prDataValue = '';
                        if(couponData[i].couponType == 1) {//天数
                            _prDataValue = parseFloat(parseFloat(amount) * parseFloat(couponData[i].rate) * couponData[i].addDays / 36500).toFixed(2);
                            couponData[i]. couponId = _prDataValue;
                        }

                        if(couponData[i].couponType == 2) {//全程
                            _prDataValue = parseFloat(parseFloat(amount) * parseFloat(couponData[i].rate) * parseFloat(_speaceDay) / 36500).toFixed(2);
                            couponData[i]. couponId = _prDataValue;
                        }

                        if(couponData[i].couponType == 3) {
                            _prDataValue = parseFloat(parseFloat(amount) * parseFloat(couponData[i].rate) * couponData[i].addDays / 36500).toFixed(2);
                            couponData[i].couponId = _prDataValue;
                        }

                        if(couponData[i].couponType == 5) {
                            _prDataValue = parseFloat(couponData[i].rate).toFixed(2);
                            couponData[i].couponId = _prDataValue;
                        }
                    }
                        for(var i = 0; i < couponData.length; i++) {
                            for(var j = i + 1; j < couponData.length;j++) {
                                if(couponData[i].couponId < couponData[j].couponId) {
                                    var tmp = couponData[i];
                                    couponData[i] = couponData[j];
                                    couponData[j] = tmp;
                                }
                            }
                        }


                    proAlertAddCardInit(couponData,listData,_speaceDay);
                }

            } else {
                alert(res.message);
                return false;
            }
        })
    }).fail(function() {
        alert('网络连接失败！');
        return false;
    });

}

function proAlertAddCardInit(couponData,listData,_speaceDay) {
    var restWeight = listData.restWeight;
    var maxWeight = listData.maxWeight;
    var _proAlert = '';
    for(var i = 0; i < couponData.length; i++) {
        var _addCards = {};
        var couponId = couponData[i].couponId;
        if(couponId == undefined || couponId == null || couponId == '' || parseFloat(couponId) < 0 ) {
            couponId = 0;
        }

        var proBack = 0;
        var proNoData = '';
        //天数加息券
        if(couponData[i].couponType == 1) {
            _addCards.text = '天数加息券';
            _addCards.addDays = couponData[i].addDays;
            proBack = 1;
        }
        //全程加息券
        if(couponData[i].couponType == 2) {
            _addCards.text = '全程加息券';
            _addCards.addDays = '全程';
            proBack = 2;
            //剩余权重为maxWeight 天数加息OR全称加息 均可选择
            if(restWeight == maxWeight) {
                proNoData = '';
            } else {//剩余权重不足maxWeight 全称加息置灰不可选 仅天数加息可选
                proNoData = 'proNoData';
            }
        }

        //proNoData

        _proAlert = _proAlert + '' +
        '<div class="proalCardBox">' +
            '<div class="proClick ' + proNoData + ' proalCardIcon' + proBack + ' " couponId="' + couponId + '" couponType="' + couponData[i].couponType + '" weight="' + couponData[i].weight + '" cpid="' + couponData[i].id + '">' +
                '<div class="proalLeft">' +
                    '<div class="proalLeft-top">' +  couponData[i].rate + '<a>%</a></div>' +
                    '<div class="proalLeft-bottom">' + _addCards.text + '</div>' +
                '</div>' +
                '<div class="proalRight">' +
                    '<div class="proalAddMonery">+' + couponId +'元</div>' +
                    '<div class="proalText">加息天数：' + _addCards.addDays +'</div>' +
                    //'<div class="proalText">适用产品：任意定期</div>' +
                    '<div class="proalText">有效期：' + couponData[i].lifeTime + '</div>' +
                    '<div class="proalElect"></div>' +
                '</div>' +
            '</div>' +
        '</div>';
    }


    var $proAlertContent = $('.proAlertContent');
    $proAlertContent.html(_proAlert);

    var $proClick = $('.proClick');
    var couponIdCount = 0;
    var tempWeightSum = 0;//权重
    var residualWeight;
    var tempChooseConponObj = [];//用于存放选中券的信息
    var tempChooseConpon = [];//存放选中券的Id
    //点击加息券
    $proClick.click(function() {
        if($(this).hasClass('proNoData')) {
            return false;
        }
        var $proalElect = $(this).find('.proalElect'); //$('.proalElect');
        var chooseWeight = $(this).attr('weight');//当前点击的加息券的权重
        var chooseConponId = $(this).attr('cpid');//当前点击的加息券的id
        var couponType = $(this).attr('couponType');//获取选中的是否是天数加息券（1为天数加息券，2为全程加息券）
        var couponId = $(this).attr('couponId');//获取选中券添加的金额
        //是否被选中
        if($(this).hasClass('selectTrue')) {
            couponIdCount = couponIdCount - parseFloat(couponId);
            tempWeightSum = tempWeightSum - Number(chooseWeight);
            residualWeight = restWeight - tempWeightSum;//剩余总权重
            for(var i = 0;i < tempChooseConpon.length; i++){
                if(tempChooseConpon[i] == chooseConponId){
                    //删除选中的ID
                    tempChooseConpon.splice(i,1);
                }
            }

            for(var i = 0;i < tempChooseConponObj.length; i++){
                if(tempChooseConponObj[i].id == chooseConponId){
                    if(tempChooseConponObj[i].couponType == 1) {
                        _speaceDay = _speaceDay + tempChooseConponObj[i].addDays;
                    }
                    //删除选中的数据
                    tempChooseConponObj.splice(i,1);
                }
            }
            $proalElect.html('');
            $(this).toggleClass('selectTrue');
        } else {
            if(Number(chooseWeight) + tempWeightSum > restWeight){
                return false;
            }

            if(tempWeightSum >= restWeight && chooseWeight != 0){
                $(this).removeClass('selectTrue');
                return false;
            } else {
                tempWeightSum += Number(chooseWeight);
                residualWeight = restWeight - tempWeightSum;//剩余总权重
            }

            //如果选中的为天数加息券则判断剩余的天数有没有超出券的使用天数

            for(var i=0; i < couponData.length; i++){
                if(couponData[i].id == chooseConponId){
                    if(couponData[i].couponType == 1) {
                        _speaceDay = _speaceDay - couponData[i].addDays;
                        if(_speaceDay < 0) {
                            alert('投后用券天数之和不得超过产品剩余期限');
                            _speaceDay = _speaceDay + couponData[i].addDays;
                            return false;
                        } else {
                            tempChooseConponObj.push(couponData[i]);
                            $(this).toggleClass('selectTrue');
                            tempChooseConpon.push(chooseConponId);
                            $proalElect.html('<img src="../bimages/pro/invalid-name.png" />');

                            couponIdCount = couponIdCount + parseFloat(couponId);
                        }
                    } else {
                        tempChooseConponObj.push(couponData[i]);
                        $(this).toggleClass('selectTrue');
                        tempChooseConpon.push(chooseConponId);
                        $proalElect.html('<img src="../bimages/pro/invalid-name.png" />');
                        couponIdCount = couponIdCount + parseFloat(couponId);
                    }
                }
            }
        }
        var $proSpan = $('.proSpan');//改变预期收益
        if(couponIdCount <= 0 ) {
            $proSpan.html('0');
        } else {
            $proSpan.html(parseFloat(couponIdCount).toFixed(2));
        }

        //根据剩余权重判断剩余加息券是否可选

        if(residualWeight == 0) {//剩余总权重为0 不能选择其他任何加息券
            if (chooseWeight==3) {
                //$(this).addClass('proNoData');
                $('div[couponType=1]').removeClass('proNoData');
                $('div[couponType=2]').addClass('proNoData');
                $(this).removeClass('proNoData');
            }
            if (chooseWeight==1) {
                $('div[couponType=2]').addClass('proNoData');
                $('div[couponType=1]:not([class="proClick selectTrue"])').addClass('proNoData');
            }
        } else if(residualWeight > 0 && residualWeight < maxWeight) {//剩余总权重大于0小于maxWeight 只能选择天数加息券不可以选择全程
            $('div[couponType=1]').removeClass('proNoData');
            $('div[couponType=2]').addClass('proNoData');
        } else {//剩余总权重为maxWeight 可选择任意加息券
            $('div[couponType=1]').removeClass('proNoData');
            $('div[couponType=2]').removeClass('proNoData');
        }
    });

    //点击确定按钮
    $('.proAlertBtn').click(function() {
        var ad = tempChooseConpon.toString();
        var userCouponIds = ad.replace('[','');
        var userRateCouponIds = userCouponIds.replace(']','');
        if(userRateCouponIds == '' || userRateCouponIds == null || userRateCouponIds.length < 1) {
            alert('请选择有效的券');
            return false;
        } else {
            $.ajax({
                url:Setting.apiRoot1 + '/u/useRateCoupon.p2p',
                type:"post",
                async:false,
                dataType:'json',
                data:{
                    userId: sessionStorage.getItem('uid'),
                    loginToken:sessionStorage.getItem('loginToken'),
                    prodType:3,//定期
                    financeId:listData.financeId,
                    userRateCouponIds:userRateCouponIds
                }
            }).done(function(res) {
                Common.ajaxDataFilter(res,function() {
                    if(res.code == 1) {
                        $('.proAlert-box').remove();
                        $("body").css({"overflow":"auto"});
                        alert(res.message);
                        $('.submit').click(function() {
                            window.location.reload();
                        });
                    } else {
                        alert(res.message);
                    }
                })
            }).fail(function() {
                alert('网络连接失败！');
                return false;
            })
        }
    })
}