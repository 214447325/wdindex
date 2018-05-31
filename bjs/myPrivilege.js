/**
 * Created by User on 2017/8/24.
 */
function myPrivilege(formData) {
    //mpInit()
    myPriAjax();
}

function myPriAjax() {
    //mpInit();
    $.ajax({
        url: Setting.apiRoot1 + '/u/queryMyVipPrivilege433.p2p',
        type: 'post',
        dataType: 'json',
        async:false,
        data:{
            userId:sessionStorage.getItem('uid'),
            loginToken:sessionStorage.getItem('loginToken')
        }
    }).done(function(res) {
        Common.ajaxDataFilter(res,function() {
            if(res.code != 1) {
                alert(res.message);
                return false;
            }
            if(res.code == -1){
                alert('查询失败');
                return false;
            }

            var data=res.data;
            mpInit(data);
        });
    }).fail(function() {
       alert('网络连接失败！');
        return false;
    });
}

function mpInit(data,clickype) {
      var defeatPercent = data.defeatPercent;//打败全国占比
      var powerValue = data.powerValue;//用户的威武值
      var vipRank = data.vipRank;//用户当前等级
      var oldVipCount = data.oldVipCount;//
      var _mpInfoHtml = '';
      var per = '';
      if(oldVipCount == undefined || oldVipCount == null || oldVipCount == '') {
          data.oldVipCount = 0;
          oldVipCount = 0;
      }

        //判断clickype的值如果没有则为默认为当前的等级
      if((clickype == undefined || clickype == '' || clickype == null) && clickype != 0) {
          clickype = vipRank;
      }


    var index = '';
    var Lists = [];
    var vipNum = 10;
    var _listData = [];
    if(clickype < vipRank) {
        Lists[0] = {};
        index = clickype + 1;
        Lists[0].startValue = data['V' + clickype + 'Score'];//当前等级最低的威力值
        Lists[0].endValue = data['V'+index+'Score'];//当前等级最高的威力值
        Lists[0].text = '威武值已满';
    }

    if(clickype > vipRank) {
        index = clickype + 1;
        Lists[0] = {};
        Lists[0].startValue = data['V'+clickype+'Score'];//当前等级最低的威力值
        Lists[0].endValue = data['V'+index+'Score'];//当前等级最高的威力值
        Lists[0].text = '加油';
        if(clickype >= vipNum){
            Lists[0].endValue = '+∞ '
        }
        Lists[0].poor = data['V'+clickype+'Score'];//距离升级还差多少威力值
    }

    //判断如果clickype和当前的VIP相等的话则改变样式
    if(clickype == vipRank) {
        Lists[0] = {};
        index = vipRank * 1 + 1;
        Lists[0].powerValue = data.powerValue; //当前威力值
        Lists[0].startValue = data['V'+vipRank+'Score'];//当前等级最低的威力值
        Lists[0].VIPFinish = data.powerValue < data['V'+vipRank+'Score'] ? 'V'+ vipRank : 'VIP'+ index;
        Lists[0].poor = data['V'+index+'Score']*1 - data.powerValue*1;//距离升级还差多少威力值
        Lists[0].defeatPercent = data.defeatPercent;//打败全国占比
        if(clickype >= vipNum){
            var infinite = 50000000;
            per = (data.powerValue*1 - data['V'+vipRank+'Score']*1)/(infinite*1 - data['V'+vipRank+'Score']*1);
            Lists[0].endValue = '+∞';
        }else{
            per = (data.powerValue*1 - data['V'+vipRank+'Score']*1)/(data['V'+index+'Score']*1 - data['V'+vipRank+'Score']*1);
            Lists[0].endValue = data['V'+index+'Score'];//当前等级最高的威力值
        }


        var _htmlText1 = '';
        var _htmlText2 = '';
        var _htmlText3 = '';
        if(Lists[0].powerValue < Lists[0].startValue) {
            _htmlText1 = '<div class="mpVip2" style="color: red">' + Lists[0].powerValue + '</div>';
            _htmlText3 = '<div class="mpTopBottom" style="color: #ff0000">您当前的威武值已低于<span style="color: #ffffff">VIP' + vipRank + '</span>等级要求，请于降级前<span style="color: #ffffff">尽快投资</span>!</div>';
        } else {
            if((Lists[0].powerValue >= Lists[0].startValue) && Lists[0].VIPFinish != "VIP11") {
                _htmlText3 = '<div class="mpTopBottom">距离<span>' + Lists[0].VIPFinish + '</span>等级还差<span>' + Lists[0].poor + '威武值</span> </div>';
            } else {
                _htmlText3 = '<div class="mpTopBottom">您现在是最高级别，请保持</div>';
            }
            _htmlText1 = '<div class="mpVip2">' + Lists[0].powerValue + '</div>';
        }

        if(Lists[0].VIPFinish == 11 || vipRank == 10) {
            _htmlText2 = '<a href="javascript:;" class="mpVipUpgrade mpVip3-content">继续提升<img src="../bimages/exclusive/vup.png" class="mpVup" /></a>';

        } else {
            _htmlText2 = '<a href="javascript:;" class="mpVipUpgrade mpVip3-content">马上升级<img src="../bimages/exclusive/vup.png" class="mpVup" /></a>';

        }


        _mpInfoHtml = '';
        _mpInfoHtml = '' +
        '<div class="nowmpVipIcon">' +
            '<div class="mpVipIcon-top">' +
                '<div class="mpVipIcon">' +
                    '<div class="mpVipIconText">您已打败' + defeatPercent + '%用户</div>' +
                    '<div class="mpVipIcon-div"><img src="../bimages/exclusive/' + clickype + '.png"/></div>' +
                '</div>' +
                '<div class="mpVipIcon1">' +
                    '<div class="canvasFather">' +
                        '<canvas id="vipMighty" width="374px" height="374px" style="width: 100%;height: 100%;"></canvas>' +
                        '<div class="mpVipInfo">' +
                            '<div class="mpVip1Value"><div class="mpVip1">威武值</div><a href="javascript:;" class="mpVip1A">?</a></div>' +
                            _htmlText1+
                            '<div class="mpVip3">' +
                                '<div class="mpVip3-left">' + Lists[0].startValue + '</div>' +
                                _htmlText2 +
                                '<div class="mpVip3-right">' + Lists[0].endValue + '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' + _htmlText3 +
        '</div>';
    } else {
        if(clickype < vipRank) {
            per = 1;
        }

        _mpInfoHtml = '';
        _mpInfoHtml = '' +
        '<div class="nompVipIcon">' +
            '<div class="mpVipIcon-top">' +
                '<div class="mpVipIcon">' +
                    '<div class="mpVipIcon-div"><img src="../bimages/exclusive/' + clickype + '.png"/></div>' +
                '</div>' +
                '<div class="mpVipIcon1">' +
                    '<div class="canvasFather">' +
                        '<canvas id="vipMighty" width="374px" height="374px" style="width: 100%;height: 100%;"></canvas>' +
                        '<div class="mpVipInfo">' +
                            '<div class="mpVip1Value"><div class="mpVip1">所需威武值</div></div>' +
                            '<div class="mpVip2">' + Lists[0].startValue + '</div>' +
                            '<div class="mpVip3">' +
                                '<div class="mpVip3-left">' + Lists[0].startValue + '</div>' +
                                '<a href="javascript:;" class="mpVipUpgrade mpVip4-content">' + Lists[0].text + '</a>' +
                                '<div class="mpVip3-right">' + Lists[0].endValue + '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    }

    var mpTopLeft = '';
    var mpTopContentLeft = '';
    var mpTopRight = '';
    var mpTopContentRight = '';
    //左边的点击按钮是否显示
    if(clickype > 0) {
        mpTopLeft = '<div class="mpTop-left"></div>';
        mpTopContentLeft = '<div class="mpTop-center-left">' +
        '<a href="javascript:;" class="mpTopClick mpTop-center-leftIcon" number="' + (parseInt(clickype) - 1) + '"></a>' +
        '</div>';
    }

    if(clickype < 10) {
        mpTopRight = '<div class="mpTop-right"></div>';
        mpTopContentRight = '<div class="mpTop-center-right">' +
        '<a href="javascript:;" class="mpTopClick mpTop-center-rightIcon" number="' + (parseInt(clickype) + 1) + '"></a>' +
        '</div>';
    }
    var dataList = data['V'+ clickype +'List'];
        // 删除体验金的显示数据
    for(var j = 0; j < dataList.length; j++){
        dataList[j].oldVipCount = data.oldVipCount;
        if(dataList[j].couponType == 3){
            dataList.splice(j,1);
        }
    }
        _listData = dataList;
    var _mpCardHtml = '';
    for(var i = 0; i < _listData.length; i++) {
        if(_listData[i].awardCount > 0) {
            var _text = {};
            _text.rate = '';
            _text.redText = '';
            _text.addays = '';
            _text.fitProds = '';
            _text.date = '';
            //1、可领（立即领取）  2、已领取（立即使用/立即提现)
            if((_listData[i].status == 1 || _listData[i].status == 2) && _listData[i].oldVipCount <= 0) {
                if(_listData[i].status == 2 && _listData[i].couponType != 4) {
                    _text.redClass = 'mpcard0';
                } else {
                    if(_listData[i].couponType == 1) {
                        _text.redClass = 'mpcard1';
                    }
                    if(_listData[i].couponType == 2) {
                        _text.redClass = 'mpcard2';
                    }
                    if(_listData[i].couponType == 3) {
                        _text.redClass = 'mpcard3';
                    }
                    if(_listData[i].couponType == 4) {
                        _text.redClass = 'mpcard4';
                    }
                    if(_listData[i].couponType == 5) {
                        _text.redClass = 'mpcard5';
                    }
                }
            }

            switch (parseInt(_listData[i].couponType)) {
                case 1: {//加息券
                    _text.rate = parseFloat(_listData[i].addRate).toFixed(1) + '<span>%</span>';
                    _text.redText = '天数加息券';
                    _text.addays = '加息天数：' + _listData[i].addDays;
                    _text.fitProds = '适用产品：' + _listData[i].fitProds;
                    if(_listData[i].status == 2) {
                        _text.date = '奖励张数：' + _listData[i].noUseCouponNum + '张';
                    } else {
                        _text.date = '奖励张数：' + _listData[i].awardCount + '张';
                    }
                    //_text.date =
                    break;
                }

                case 2: {//全程加息券
                    _text.rate = parseFloat(_listData[i].addRate).toFixed(1) + '<span>%</span>';
                    _text.redText = '全程加息券';
                    _text.addays = '加息天数：全程';
                    _text.fitProds = '适用产品：' + _listData[i].fitProds;
                    if(_listData[i].status == 2) {
                        _text.date = '奖励张数：' + _listData[i].noUseCouponNum + '张';
                    } else {
                        _text.date = '奖励张数：' + _listData[i].awardCount + '张';
                    }
                    break;
                }

                case 3: {//体验金
                    _text.rate = _listData[i].voucherAmt ;
                    _text.redText = '体验金';
                    _text.addays = '使用规则：' + _listData[i].useRule;
                    _text.fitProds = '适用产品：' + _listData[i].fitProds;
                    _text.date = '体验天数：' + _listData[i].addDays;
                    break;
                }

                case 4: {//现金红包
                    if(_listData[i].status == 1 || _listData[i].status == -1) {
                        _text.rate = '?';
                    } else {
                        _text.rate = _listData[i].rewardAmt;
                    }

                    _text.redText = '现金红包';
                    _text.addays = '使用规则：' + _listData[i].useRule;
                    _text.fitProds = '';
                    _text.date = '';
                    break;
                }

                case 5: {//投资红包
                    _text.rate = _listData[i].investCouponAmt;
                    _text.redText = '投资红包';
                    _text.addays = '使用规则：' + _listData[i].useRule;
                    _text.fitProds = '适用产品：' + _listData[i].fitProds;
                    _text.date = '';
                    _text.date = '奖励张数：' + _listData[i].awardCount + '张';
                    break;
                }

            }

            _text.img = '';//图片
            _text.btn = '';//按钮
            if(_listData[i].status == 1) {//1、可领（立即领取）
                if(_listData[i].couponType == 4) {
                    _text.btn = '<a href="javascript:;" class="mpBtn" fun="takeApart" vpId="' + _listData[i].vpId + '">拆</a>';
                } else {
                    _text.btn = '<a href="javascript:;" class="mpBtn" fun="nowReceive" vpId="' + _listData[i].vpId + '">立即领取</a>';
                }
            }

            if(_listData[i].status == 2) {//2、已使用（立即使用/立即提现）
                if(_listData[i].couponType == 1) {
                    _text.redClass = 'mpcard1';
                }
                if(_listData[i].couponType == 2) {
                    _text.redClass = 'mpcard2';
                }
                if(_listData[i].couponType == 3) {
                    _text.redClass = 'mpcard3';
                }
                if(_listData[i].couponType == 4) {
                    _text.redClass = 'mpcard4';
                }
                if(_listData[i].couponType == 5) {
                    _text.redClass = 'mpcard5';
                }

                if(_listData[i].couponType == 4) {
                    _text.btn = '<a href="javascript:;" class="mpBtn" fun="goWithdraw" vpId="' + _listData[i].vpId + '">立即提现</a>';
                } else {
                    _text.img = '<img src="../bimages/exclusive/mp1.png" />';
                }
            }

            if(_listData[i].status == 3 || _listData[i].status == -1 || _listData[i].oldVipCount > 0) {//3、已使用（已提现）-1、不可领
                _text.redClass = 'mpcard0';
            }

            if(_listData[i].status == 3) {//3、已使用（已提现）
                _text.redClass = 'mpcard0';
                if(_listData[i].couponType == 4) {
                    _text.img = '<img src="../bimages/exclusive/mp3.png" />';
                } else {
                    _text.img = '<img src="../bimages/exclusive/mp4.png" />';
                }
            }

            if(_listData[i].status == -1) {
                if(_listData[i].couponType == 1 || _listData[i].couponType == 2) {
                    _text.img = '<img src="../bimages/exclusive/mp7.png" />';
                } else {
                    _text.img = '<img src="../bimages/exclusive/mp6.png" />';
                }

            }

            if((data.newVipId < data.oldVipId) && (data.vipPrivilegeCount > 0)){
                if(_listData[i].couponType == 1 || _listData[i].couponType == 2) {
                    _text.img = '<img src="../bimages/exclusive/mp7.png" />';
                } else {
                    _text.img = '<img src="../bimages/exclusive/mp6.png" />';
                }

                _text.btn = '';
            }

            _mpCardHtml = _mpCardHtml + '' +
            '<div class="mpCard">' +
                '<div class="mpdata">' +
                    '<a href="javascript:;" class="mpCardsClick  ' + _text.redClass + '">' +
                        '<div class="mpLeft">' +
                            '<div class="mpLeft-top">' + _text.rate + '</div>' +
                            '<div class="mpLeft-bottom">' + _text.redText + '</div>' +
                        '</div>' +
                        '<div class="mpRight">' +
                            '<div class="mpRightText">' +
                                '<div class="mpText">' + _text.addays + '</div>' +
                                '<div class="mpText">' + _text.fitProds + '</div>' +
                                '<div class="mpText">' + _text.date + '</div>' +
                                '<div class="mpImg">' + _text.img +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</a>' + _text.btn +
                '</div>' +
            '</div>';
        }
    }


    //等级为0则不显示
    if(clickype == 0 || vipNum == 0) {
        _mpCardHtml = '';
    }

    var _mpHtml = '';
    _mpHtml = _mpHtml + '' +
    '<div class="mp">' +
        '<div class="mpTop">' + mpTopLeft +
            '<div class="mpTop-center">' + mpTopContentLeft +
                '<div class="mpTopCenter">' + _mpInfoHtml + '</div>' + mpTopContentRight +
            '</div>' + mpTopRight +
        '</div>' +
    '</div>' +

    '<div class="mpBottom">' +
    '<div class="mpBottomBox">' +

    '<div class="mpBottom-top-box"><div class="mpBottom-top-box-left"></div>我的权益<div class="mpBottom-top-box-right"></div></div>' +
    '' +
    '<div class="mpBottomContent">' + _mpCardHtml +
    '' +
    '</div>' +

    '</div>' +
    '</div>';
    $('.useright').html(_mpHtml);

    setTimeout(function(){
        var $canvasFather = $(".canvasFather");
        var speed = 10;
        var canvas = document.getElementById('vipMighty');
        var  canvasWidth = $canvasFather.width()*2;
        var  canvasHeight = $canvasFather.height()*2;
        var r = canvasWidth/2.5;
        var canvasX = canvasWidth/2;
        var canvasY = canvasWidth/2;
        $(".vipMightyText").css({'width':canvasWidth/2,'height':canvasHeight/2});
        canvas.setAttribute('width',canvasWidth+'px');
        canvas.setAttribute('height',canvasWidth+'px');
        $('#vipMighty').css({'width':'100%','height':'100%'});
        var ctx = canvas.getContext("2d");
        if(clickype > vipRank) {
            ctx.strokeStyle='#cbd0da';
        } else {
            ctx.strokeStyle='#F5EECB';
            ctx.shadowBlur = 30;
        }

        ctx.lineWidth= 10;
        ctx.lineCap ='round';
        ctx.shadowColor = '#D8CA8F';
        ctx.arc(canvasX,canvasY,r,0.75*Math.PI,0.25*Math.PI,false);
        ctx.stroke();
        var num = 0;
        var time = setInterval(function(){
            num = num + 0.01;
            if(num >= 1){
                num = 1;
            }

            if(num <= per){
                ctx.beginPath();
                ctx.clearRect(0, 0, ctx.width, ctx.height);
                ctx.arc(canvasX,canvasY,r,0.75*Math.PI,Math.PI*(0.75+num*3/2),false);
                if(clickype == vipRank) {
                    ctx.strokeStyle='#82702E';
                } else if(clickype < vipRank){
                    ctx.strokeStyle='#5b6577';
                }
                ctx.shadowBlur = 0;
                ctx.shadowColor = 'transparent';
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }else if(num == 1){
                clearInterval(time)
            }else{
                clearInterval(time)
            }
        },speed);
    },300);

    //点击问号
    $('.mpVip1A').click(function() {
        var $body = $('body');
        var _bodyHtml = '' +
            '<div class="mypriLog">' +
            '<div class="mypriLog-background"></div>' +
            '<div class="mypriLog-div">' +
            '<div class="mypriLog-title">温馨提示</div>' +
            '<div class="mypriLog-content"><p>近2个月投资年化，计算方式为：每笔投资金额*投资期限/365天每天计算。<br>投资越多，威武值越高</p></div>' +
            '<a href="javascript:;" class="mypriLogAlert">我知道了</a>' +
            '</div>' +
            '</div>';
        $body.append(_bodyHtml);
        $body.css({"overflow":"hidden","height":"100%"});
        $('.mypriLogAlert').click(function() {
           $('.mypriLog').remove();
            $body.css({"overflow":"auto"});
        });
    });

    //点击向左或者向右按钮
    $('.mpTopClick').click(function() {
        var number = $(this).attr('number');
        mpInit(data,parseInt(number));
    });

    //点击升级或者加油按钮
    $('.mpVipUpgrade').click(function() {
        window.location.href = Setting.staticRoot + '/pages/index.html?products=products';
    });

    $('.mpBtn').click(function() {
        var fun = $(this).attr('fun');
        var vipID = $(this).attr('vpid');
        if(fun == 'takeApart') {
            takeApart(vipID);
        }
        if(fun == 'goWithdraw') {
            window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=13';
        }

        if(fun == 'nowReceive') {
            nowReceive(vipID);
        }
    });
}

//使用天数加息券
function nowReceive(vpid) {
    $.ajax({
        url: Setting.apiRoot1 + '/u/getVipPrivilege.p2p',
        type: 'post',
        dataType: 'json',
        data:{
            userId: sessionStorage.getItem('uid'),
            loginToken:sessionStorage.getItem('loginToken'),
            privilegeId:vpid
        }
    }).done(function(res) {
        Common.ajaxDataFilter(res,function(){
            if(res.code == 1) {
                alert(res.message);
                $('.submit').click(function() {
                    window.location.reload();
                })
            } else {
                alert(res.message);
                return false;
            }
        });
    }).fail(function() {
        alert('网络连接失败');
        return false;
    })
}

//使用现金红包
function takeApart(vpid) {
    $.ajax({
        url: Setting.apiRoot1 + '/u/getVipPrivilege.p2p',
        type: 'post',
        dataType: 'json',
        data:{
            userId: sessionStorage.getItem('uid'),
            loginToken:sessionStorage.getItem('loginToken'),
            privilegeId:vpid
        }
    }).done(function(res) {
        Common.ajaxDataFilter(res,function() {
            if(res.code == 1) {
                sessionStorage.setItem('userCouponId',res.data.userCouponId);
                sessionStorage.setItem('cashredAmt',res.data.couponAmt);//拆出金额
                //$('.submit').click(function() {
                window.location.reload();
                //})
            } else {
                alert(res.message);
                return false;
            }
        })
    }).fail(function() {
        alert('网络连接失败');
        return false;
    })
}