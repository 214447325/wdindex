/**
 * Created by User on 2017/9/7.
 */
var $useright = $('.useright');
function reward(formData){
    rewardInit(1);
}

//页面初始化
function rewardInit(count) {
    var _reward = '';
    _reward = _reward + '<div class="rewardTitle">现金奖励</div>' +
    '<div class="rewardContent"><div class="rewardList"></div></div>' +
    '<div class="reaedButtom"><div class="reward-monery">红包总计:<span><a class="rewardSpan">0.00</a>元</span></div>' +
    '<a href="javascript:;"><div class="reardBtn">提取至余额</div></a>' +
    '</div>';
    $useright.html(_reward);
    var _amount = 0.00;
    var $rewardContent = $('.rewardContent');
    //$rewardContent.dropload({
    //    scrollArea : $rewardContent,
    //    loadDownFn : function(me) {
            $.ajax({
                url: Setting.apiRoot1 + '/u/rewardCenter.p2p',
                type: 'post',
                dataType: 'json',
                async:false,
                data:{
                    userId:sessionStorage.getItem('uid'),
                    loginToken:sessionStorage.getItem('loginToken'),
                    pageNum:count,
                    pageSize:10
                }
            }).done(function(res) {
                if(res.code == -99) {
                    Common.toLogin();
                    return false;
                }
                if(res.code == 1) {//rewardSpan
                    var rewardAmount = res.data.rewardAmount;
                    if((rewardAmount == undefined || rewardAmount == '' || rewardAmount == null) && count == 1) {
                        $('.rewardSpan').html('0.00');
                        $('.reardBtn').addClass('disable');
                    } else {
                        _amount = parseFloat(_amount) + parseFloat(rewardAmount);
                        $('.rewardSpan').html(_amount.toFixed(2));
                    }
                    //可以使用的券
                    var useList = res.data.useList;

                    //不可以使用
                    var unList = res.data.unList;
                    //rewardShowHtml(2,unList);
                    if((unList == undefined || unList == null || unList == '' || unList.length == 0)
                        && (useList == undefined || useList == null || useList == '' || useList.length == 0) && count == 1) {
                        $('.rewardList').html('<div class="rewardText">空空如也，快去投资提升等级领取福利吧</div>');
                        //// 锁定
                        //me.lock();
                        //// 无数据
                        //me.noData(true);
                    } else {
                        if((unList == undefined || unList == null || unList == '' || unList.length == 0)
                            && (useList == undefined || useList == null || useList == '' || useList.length == 0)) {
                            //// 锁定
                            //me.lock();
                            //// 无数据
                            //me.noData(true);
                        } else {
                            rewardShowHtml(1,useList,rewardAmount);
                            rewardShowHtml(2,unList,rewardAmount);
                            count++;
                            //me.resetload();
                        }

                    }
                } else {
                    // 锁定
                    //me.lock();
                    //// 无数据
                    //me.noData(true);
                    alert(res.message);
                    return false;
                }
            }).fail(function() {
               alert('网络连接失败');
                return false;
            });
    //    }
    //});

    $('.reardBtn').click(function() {
        var amount = $('.rewardSpan').html();
        var $this = $(this);
        if($this.hasClass('disable')) {
            return false;
        }
        $this.addClass('disabled');
        $.ajax({
            url: Setting.apiRoot1 + '/u/extractRewardCenter.p2p',
            type: 'post',
            dataType: 'json',
            data: {
                userId : sessionStorage.getItem('uid'),
                loginToken:sessionStorage.getItem('loginToken')
            }
        }).done(function(res) {
            Common.ajaxDataFilter(res,function(){
                if(res.code == -1){
                    alert(res.message);
                    $this.removeClass("disabled");
                    return false;
                } else {
                    if(res.code != 1) {
                        $this.removeClass("disabled");
                        alert(res.message);
                        return false;
                    } else {
                        window.location.reload();
                    }
                }
            });
        }).fail(function() {
            alert('网络连接失败！');
            return false;
        });
    });
}

function rewardShowHtml(type,listData,rewardAmount){
    if(listData != undefined && listData != null && listData != '' && listData.length != 0) {
        var couponHtml = '';
        var _tex = '';
        for(var i = 0; i < listData.length; i++ ) {
            var _text = {};
            //可以使用
            if(type == 1) {
                _text.rate = parseFloat(listData[i].amount).toFixed(2);
                _text.redClass = 'reward';
                //1天数加息券 //2全程加息券 //3 体验金 //4现金红包//5投资红包
                switch (parseInt(listData[i].couponType)) {
                    case 1: {
                        _text.redText = '奖励金额(元)';
                        _text.addays = '使用产品：' + listData[i].activityName;
                        _text.fitProds = '天数加息券：' + parseFloat(listData[i].rateAmount).toFixed(2) + '%';
                        _text.date = '领取时间：' + listData[i].receiveTime;
                        break;
                    }

                    case 2: {
                        _text.redText = '奖励金额(元)';
                        _text.addays = '使用产品：' + listData[i].activityName;
                        _text.fitProds = '全程加息券：' + parseFloat(listData[i].rateAmount).toFixed(2) + '%';
                        _text.date = '领取时间：' + listData[i].receiveTime;
                        break;
                    }

                    case 3: {
                        _text.redText = '奖励金额(元)';
                        _text.addays = '使用产品：' + listData[i].activityName;
                        _text.fitProds = '体验金：' + parseFloat(listData[i].rateAmount).toFixed(2) + '元';
                        _text.date = '领取时间：' + listData[i].receiveTime;
                        break;
                    }

                    case 4: {
                        _text.redText = '现金红包(元)';
                        //_text.addays = '来源：' + listData[i].activityName;
                        _text.fitProds = '使用规则：' + '<span>可立即提现</span>';

                        if(listData[i].receiveTime != undefined && listData[i].receiveTime != null && listData[i].receiveTime != '') {
                            _text.date = '领取时间：' + listData[i].receiveTime;
                        } else {
                            _text.date = '';
                        }

                        if(listData[i].remark != undefined && listData[i].remark != null && listData[i].remark != '') {
                            if((listData[i].remark).indexOf('全场达标红利') != -1) {
                                _text.fitProds = '';
                            }
                            if((listData[i].remark).indexOf('浓浓秋意,双倍收益') != -1) {
                                _text.addays = '来源：' + listData[i].remark;
                                _text.fitProds = '使用规则：' + '<span>等待提现</span>';
                                _tex = '<div class="readText">使用产品：' + listData[i].activityName + '</div>';
                            } else {
                                _text.addays = '来源：' + listData[i].activityName;
                            }
                        } else {
                            _text.addays = '来源：' + listData[i].activityName;
                        }
                        break;
                    }

                    case 5: {
                        _text.redText = '投资红包(元)';
                        _text.addays = '来源：' + listData[i].activityName;
                        _text.fitProds = '使用规则：' + '<span>可立即提现</span>';
                        //_text.date = '';
                        if(listData[i].receiveTime != undefined && listData[i].receiveTime != null && listData[i].receiveTime != '') {
                            _text.date = '领取时间：' + listData[i].receiveTime;
                        } else {
                            _text.date = '';
                        }
                        break;
                    }
                }

                //0为等待领取
                if(listData[i].status == 0) {
                    _text.cardImg = '<img src="../bimages/reward/r1.png" />';
                } else {
                    _text.cardImg = '<img src="../bimages/reward/r0.png" />';
                }
            }

            if(type == 2) {
                _text.rate = parseFloat(listData[i].amount).toFixed(2);
                _text.redClass = 'readBox2';
                _text.cardImg = '';
                //1天数加息券 //2全程加息券 //3 体验金 //4现金红包//5投资红包
                switch (parseInt(listData[i].couponType)) {
                    case 1: {
                        _text.redText = '奖励金额(元)';
                        _text.addays = '使用产品：' + listData[i].activityName;
                        _text.fitProds = '天数加息券：' + parseFloat(listData[i].rateAmount).toFixed(2) + '%';
                        _text.date = '领取时间：' + listData[i].receiveTime;
                        break;
                    }
                    case 2: {
                        _text.redText = '奖励金额(元)';
                        _text.addays = '使用产品：' + listData[i].activityName;
                        _text.fitProds = '全程加息券：' + parseFloat(listData[i].rateAmount).toFixed(2) + '%';
                        _text.date = '领取时间：' + listData[i].receiveTime;
                        break;
                    }

                    case 3: {
                        _text.redText = '奖励金额(元)';
                        _text.addays = '使用产品：' + listData[i].activityName;
                        _text.fitProds = '体验金：' + parseFloat(listData[i].rateAmount).toFixed(2) + '元';
                        _text.date = '领取时间：' + listData[i].receiveTime;
                        break;
                    }

                    case 4: {
                        _text.redText = '现金红包(元)';
                        //_text.addays = '来源：' + listData[i].activityName;
                        _text.fitProds = '使用规则：' + '<span>可立即提现</span>';
                        if(listData[i].receiveTime != undefined && listData[i].receiveTime != null && listData[i].receiveTime != '') {
                            _text.date = '领取时间：' + listData[i].receiveTime;
                        } else {
                            _text.date = '';
                        }

                        if(listData[i].remark != undefined && listData[i].remark != null && listData[i].remark != '') {
                            if((listData[i].remark).indexOf('全场达标红利') != -1) {
                                _text.fitProds = '';
                            }
                            if((listData[i].remark).indexOf('浓浓秋意,双倍收益') != -1) {
                                _text.addays = '来源：' + listData[i].remark;
                                _text.fitProds = '使用规则：' + '<span>等待提现</span>';
                                _tex = '<div class="readText">使用产品：' + listData[i].activityName + '</div>';
                            } else {
                                _text.addays = '来源：' + listData[i].activityName;
                            }
                        } else {
                            _text.addays = '来源：' + listData[i].activityName;
                        }

                        //_text.date = '';
                        break;
                    }

                    case 5: {
                        _text.redText = '投资红包(元)';
                        _text.addays = '来源：' + listData[i].activityName;
                        _text.fitProds = '使用规则：' + '<span>可立即提现</span>';
                        if(listData[i].receiveTime != undefined && listData[i].receiveTime != null && listData[i].receiveTime != '') {
                            _text.date = '领取时间：' + listData[i].receiveTime;
                        } else {
                            _text.date = '';
                        }
                        break;
                    }
                }
            }


            couponHtml = couponHtml + '' +
            '<div class="readPeople">' +
            '<div class="' + _text.redClass + '">' +
            '<div class="readLeft">' +
            '<div class="readLeft-top">' + _text.rate + '</div>' +
            '<div class="readLeft-bottom">' + _text.redText + '</div>' +
            '</div>' +
            '<div class="readRight">' +
            '<div class="readRightText">' + _tex +
            '<div class="readText">' + _text.addays + '</div>';
            if(_text.fitProds != undefined && _text.fitProds != null && _text.fitProds != '') {
                couponHtml = couponHtml + '<div class="readText">' + _text.fitProds + '</div>';
            }
            couponHtml = couponHtml + '<div class="readText">' + _text.date + '</div>' +
            '<div class="readImg">' + _text.cardImg + '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        }


        $('.rewardList').append(couponHtml);
    } else {
        return false;
    }

}