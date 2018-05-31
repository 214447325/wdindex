/**
 * formList.type: 1 周周涨  3 定期 4 浮动  5 新手标
 */

//过滤器
Vue.filter('number', function(value,index) {
  if (!value) {return '0.00'}
  value = value*1;
  return value.toFixed(index);
});
Vue.filter('comdify',function(value){
      var num = value + '';
      var re = /\d{1,3}(?=(\d{3})+$)/g;
      return num.replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2){
        return s1.replace(re,"$&,") + s2;
      });
})
Vue.filter('abs',function(value){
    return Math.abs(value);
});

var BugVm = new Vue({
	el:"#bugVm",
	data:{
		formList:'', //订单类型
		isNewHand:false,//新手标
		isRegular:false,//定期
        isCurrent:false,//周周涨
        isMayCoupon:false,//可用优惠券
		isStopCoupon:true,//已用优惠券
        activeRate:0,//活动
        isactiveloanCycle:true,
        activepercent:0,
        active_rate3:0,
        actrate11:'',
        activityRate:0,//尊享加息标
        flagQCDB:0,//全场达标红利
        flagKNHB:0,//开年红包
        activeloanCycle:0,//活动周期
		userData:{},//用户信息
		userId:'',//用户ID
		loginToken:'',
        placeholder:'请输入100的整数倍',

		tabli:1,//订单详情里的选项卡

		portfolioData:[],//资产组合

        money:'',//投资金额
        percent:'',//周期
        regularRate:'',//综合年化收益率

        indata:{},//档位

        pid:4826,//订单id
        cycle:0,//订单天数
        newProd:1,//0:已购买新手标  1没有购买新手标
        orderTypeData:{},
        couponSize:'未使用',
        couponData:[],

        couponAlreadyInUse:[],//选择的优惠卷
        couponAlreadyInUseTWO:[],//每次选择和取消过得优惠券的索引值
        couponWeight:0,//优惠卷总的权重
        poorCouponWeight:0,//最大权重 - 优惠卷总的权重 = 当前权重的差值
        couponDay:0,//天数加息券的总天数
        couponGentle:0,//选中优惠券的预期收益
        privilege:0,//选中优惠券的综合年化收益率
        // couponTiYan:0,

        couponDIV:0,//控制优惠券弹框显示与否
        week3:{},
        style:{'display':'block'},
        active:true,
        disabled:'v',
        maxPurchasedAmt:0,//14周活动
        purchasedAmt:0,//14周活动
        message:'',
        htmlStyle:{},
        buyNewType:0,
        htmlText:'立即抢购',
        //3周活动则显示
        show:false,
        UserInfo:false,

        voteAmount:0//活动可投余额主要用于点击全额购买
	},
	methods:{
		login:function(){
            Commain.toLogin();
		},
		tabliClick:function(index){
			BugVm.tabli = index;
		},
        // 全额购买
        buyClick:function(){
            if(!BugVm.userId){
                Common.toLogin();
                return;
            }
            checkUserInfo(1);//是否实名认证
            if(BugVm.UserInfo){
                if(BugVm.userData.accountAmt < BugVm.orderTypeData.minBuyAmt){
                    Commain.commonAlert('账户余额不足起投100.0','前往充值',function(){
                        window.location.href = '/wdindex/bpage/account.html?formPages=02';
                    },'','#333','#7a3fff');
                }else{
                    if(BugVm.userData.accountAmt > BugVm.orderTypeData.canBuyAmt){
                        BugVm.money = BugVm.orderTypeData.canBuyAmt;
                    }else{
                        var b_money = BugVm.userData.accountAmt;
                        var int_money = parseInt(b_money / 100);
                        BugVm.money = int_money * 100;
                    }

                    if(BugVm.voteAmount != 0 && BugVm.voteAmount != null && BugVm.voteAmount != '') {
                        if(BugVm.money > BugVm.voteAmount) {
                            BugVm.money = BugVm.voteAmount;
                        }
                    }
                }

            }
        },
        // 订单协议
        buyRule:function(){
            if(!BugVm.userId){
                Common.toLogin();
                return;
            }
            var fullName = sessionStorage.getItem('realname');
            var showName = "***";
            if(fullName==null || fullName==undefined || fullName.length<1){
            // alert('姓名错误：'+fullName);
            }else{
            var fisrtName = fullName.substr(0,1);
            if (fullName.length==2) {
            showName = fisrtName+'*';
            }else if(fullName.length==3){
            showName = fisrtName+'**';
            }else if(fullName.length==4){
            showName = fisrtName+'***';
            }//名字
            }
            var fullPhone = sessionStorage.getItem('uname');
            var phoneNum = "***********";
            if(fullPhone==null || fullPhone==undefined || fullPhone.length<11){
            // alert('手机号错误：'+fullPhone);
            }else{
            var _hide_number = fullPhone.substr(3,4);
            phoneNum = fullPhone.replace(_hide_number,'****');//手机
            }

            var fullCertNo = sessionStorage.getItem('cardNum');
            var cardNum = "***************";
            if(fullCertNo==null || fullCertNo==undefined || fullCertNo.length<15){
            // alert('身份证号错误：'+cardNum);
            }else{
            var _front_cardnum = fullCertNo.substr(0,3);
            var _last_cardnum = fullCertNo.substr(14,4);
            cardNum = _front_cardnum+'***********'+_last_cardnum;//身份证
            }





            if(BugVm.orderTypeData.prodType == 1){
                buyProtocolCurrent('buyProtocolCurrent.html');
            }else{
                buyProtocolCurrent('buyProtocolRegular.html');
            }
            var $name= $('.name'); //名
            var $cardnum    = $('.cardnum');//身份证
            var $phonenum       = $('.phonenum'); //手机
            $name.html(showName);
            $phonenum.html(phoneNum);
            $cardnum.html(cardNum);
        },
        // 关闭优惠券
        couponDIVClose:function(index){
             if(!BugVm.userId){
                Common.toLogin();
                return;
            }
            if(BugVm.couponData.length <= 0){
                return;
            }
            BugVm.couponDIV = index;
            // 直接关闭
            // couponDay
            if(index == 0){
                for (var i = 0; i < BugVm.couponAlreadyInUseTWO.length; i++) {
                    var num = BugVm.couponAlreadyInUseTWO[i]
                    if(BugVm.couponData[num].check){
                        BugVm.couponData[num].check = false;
                        BugVm.couponGentle -= BugVm.couponData[num].couponId * 1;
                        BugVm.couponWeight -= BugVm.couponData[num].weight * 1;
                        BugVm.couponDay -= BugVm.couponData[num].cycleTime * 1;
                    }else{
                        BugVm.couponData[num].check = true;
                        BugVm.couponGentle += BugVm.couponData[num].couponId * 1;
                        BugVm.couponWeight += BugVm.couponData[num].weight * 1;
                        BugVm.couponDay += BugVm.couponData[num].cycleTime * 1;
                    }
                }
                BugVm.poorCouponWeight = BugVm.orderTypeData.maxPrivilege - BugVm.couponWeight;
                BugVm.couponAlreadyInUseTWO = [];//增加的优惠券

                if(BugVm.couponAlreadyInUse.length <= 0){
                    BugVm.isMayCoupon = false;
                    BugVm.isStopCoupon = true;
                    BugVm.couponGentle = 0;
                    BugVm.couponDay = 0;
                    //console.log(BugVm.couponData.length)
                    BugVm.couponSize = BugVm.couponData.length + '张可用';
                }else{
                    BugVm.couponSize = '已使用';
                }

            }else if(index == 2){
                // 点击确定关闭
                BugVm.couponAlreadyInUse = [];
                for (var i = 0; i < BugVm.couponData.length; i++) {
                    if(BugVm.couponData[i].check){
                        BugVm.couponAlreadyInUse.push(BugVm.couponData[i]);
                    }
                }
                if(BugVm.couponAlreadyInUse.length > 0){
                    BugVm.isMayCoupon = true;
                    BugVm.isStopCoupon = false;
                    BugVm.couponSize = '已使用';
                }else{
                    BugVm.couponGentle = 0;
                    BugVm.isMayCoupon = false;
                    BugVm.isStopCoupon = true;
                    BugVm.couponDay = 0;
                    BugVm.couponSize = BugVm.couponData.length + '张可用';
                }
                var couponGentle = BugVm.couponGentle.toFixed(2);
                BugVm.privilege = 0;

                //if(BugVm.couponAlreadyInUse.length == 0) {
                    if(BugVm.activityRate != 0 && BugVm.activityRate != undefined && BugVm.activityRate != null && BugVm.activityRate != '') {
                        BugVm.actrate11 = parseFloat(BugVm.activityRate).toFixed(2);
                    } else {
                        BugVm.actrate11 = '';
                    }

                    if(BugVm.flagKNHB != 0 && BugVm.flagKNHB != undefined && BugVm.flagKNHB != null && BugVm.flagKNHB != '' && BugVm.money >= 50000) {
                        $('.actrate03').html('+' + parseFloat(BugVm.active_rate3).toFixed(2) + '%');
                    } else {
                        $('.actrate03').html('');
                    }
                //}

                for (var i = 0; i < BugVm.couponAlreadyInUse.length; i++) {
                    if(BugVm.couponAlreadyInUse[i].type == 1){
                        BugVm.privilege += parseFloat((BugVm.couponAlreadyInUse[i].couponId/BugVm.cycle)*365/BugVm.money*100).toFixed(2)*1;
                    }else if(BugVm.couponAlreadyInUse[i].type == 2){
                        BugVm.privilege += BugVm.couponAlreadyInUse[i].privilege.toFixed(2)*1;
                        //if(BugVm.activityRate != 0 && BugVm.activityRate != undefined && BugVm.activityRate != '' && BugVm.activityRate != null) {//新春活动1
                            var __activityRate = BugVm.privilege;
                            BugVm.privilege = BugVm.privilege - __activityRate;
                            BugVm.actrate11 = parseFloat(__activityRate + (BugVm.activityRate)).toFixed(2);
                            $('.actrate01').html('+' + parseFloat(__activityRate + (BugVm.activityRate)).toFixed(2) + '%');
                        //}
                    }else if(BugVm.couponAlreadyInUse[i].type == 3){
                        BugVm.privilege += parseFloat((BugVm.couponAlreadyInUse[i].couponId/BugVm.cycle)*365/BugVm.money*100).toFixed(2)*1;
                    }else{
                        BugVm.privilege += ((BugVm.couponAlreadyInUse[i].couponId/BugVm.cycle)*365/BugVm.money*100).toFixed(2)*1;
                    }
                    //开年红包活动
                    if(BugVm.couponAlreadyInUse[i].type == 5) {
                        //if(BugVm.flagKNHB != 0 && BugVm.flagKNHB != undefined && BugVm.flagKNHB != '' && BugVm.flagKNHB != null) {
                            var __privilege = BugVm.privilege;
                            BugVm.privilege = BugVm.privilege - __privilege;
                            $('.actrate03').html('+' + parseFloat(__privilege + (BugVm.active_rate3)).toFixed(2) + '%');
                        //}
                    }
                }
                BugVm.couponAlreadyInUseTWO = [];//增加的优惠券

            }
        },
        // 选择优惠券
        couponClick:function(item,index){
                if(BugVm.couponData[index].check){
                    if(item.weight == 0){
                        BugVm.couponDay -= item.cycleTime;
                    }else{
                        BugVm.couponWeight -= item.weight;
                    }
                    BugVm.couponGentle -= item.couponId *1;
                    BugVm.couponData[index].check = false;
                    BugVm.couponAlreadyInUseTWO.push(index);
                }else{
                    // 添加
                    if(BugVm.money >= item.minUseAmount){
                        if(item.weight == 0){
                            BugVm.couponDay += item.cycleTime;
                            if(BugVm.couponDay <= BugVm.cycle){
                                BugVm.couponData[index].check = true;
                                BugVm.couponAlreadyInUseTWO.push(index);
                                BugVm.couponGentle += item.couponId *1;
                            }else{
                                BugVm.couponDay -= item.cycleTime;
                                alert('用券天数不得超过产品期限');
                            }
                        }else{
                             BugVm.couponWeight += item.weight;
                             if( BugVm.couponWeight <= BugVm.orderTypeData.maxPrivilege){
                                BugVm.couponData[index].check = true;
                                BugVm.couponAlreadyInUseTWO.push(index);
                                BugVm.couponGentle += item.couponId *1;
                            }else{
                                BugVm.couponWeight -= item.weight;
                            }
                        }
                    }
                }
            BugVm.poorCouponWeight = BugVm.orderTypeData.maxPrivilege - BugVm.couponWeight;
        },
        // 支付
        placeOnOrder:function(){
            var buyTitle = $('.buy1 .buyTitle').html();
            if(BugVm.disabled == 'disabled') {
                alert(BugVm.message);
                return false;
            }

            if(!BugVm.userId){
                Common.toLogin();
                return;
            }
            if(parseFloat(BugVm.maxPurchasedAmt) > 0) {
                var _c = parseFloat(BugVm.maxPurchasedAmt) - parseFloat(BugVm.purchasedAmt);
                if(parseFloat(BugVm.money) > parseFloat(_c)) {
                    alert('剩余可投金额' + parseFloat(_c).toFixed(2) + '元');
                    return false;
                }
            }

            //var maxInvestAmounts = parseInt((BugVm.money)/100);
            var _m = parseFloat((BugVm.money) % 100);
            if(_m != 0) {
                alert('100元起投，递增金额100');
                return false;
            }

            checkUserInfo(1);//是否实名认证
            if(BugVm.UserInfo){
                if(!Common.reg.money.test(BugVm.money)){
                    BugVm.couponData = [];
                    BugVm.couponSize = '未使用';
                    alert('输入金额无效！');
                    BugVm.money = '';
                    $('.money').val("");
                    return;
                }else if (BugVm.money < BugVm.orderTypeData.minBuyAmt) {
                    alert('投资金额不能小于起投金额'+BugVm.orderTypeData.minBuyAmt+'元');
                    BugVm.money = '';
                    return;

                }else if (BugVm.money > BugVm.orderTypeData.canBuyAmt) {
                    if((BugVm.orderTypeData.prodTitle).indexOf('周周涨') != -1) {
                        alert('输入金额超过周周涨可投余额');
                    } else {
                        alert('投资金额不能大于剩余可购余额');
                    }

                    BugVm.money = '';
                    return;

                }else if(BugVm.money > BugVm.userData.accountAmt){
                    alert('账户余额不足，请去充值');
                    $('.submit').click(function(){
                        window.location.href = '/wdindex/bpage/account.html?formPages=02';
                    })
                    return;
                }
                //
                var _week3 = BugVm.week3;
                var week3 = _week3.week3;
                if(week3 == 1) {
                    /**
                     * week01为大于等于1W，小于3W
                     * week02为大于等于3W，小于5W
                     * week03为5W
                     */
                    var week01 = _week3.week01;
                    var week02 = _week3.week02;
                    var week03 = _week3.week03;
                    /**
                     * week01 == 0 第一档不能购买
                     * week02 == 0 第二档不能购买
                     * week03 == 0 第三档不能购买
                     */
                    if(week01 == 0) {
                        if(BugVm.money >= 10000 && BugVm.money < 30000) {
                            alert('每一个金额档次只能投资一次，请勿重复购买');
                            return false;
                        }
                    }

                    if(week02 == 0) {
                        if(BugVm.money >= 30000 && BugVm.money < 50000) {
                            alert('每一个金额档次只能投资一次，请勿重复购买');
                            return false;
                        }
                    }

                    if(week03 == 0) {
                        if(BugVm.money == 50000) {
                            alert('每一个金额档次只能投资一次，请勿重复购买');
                            return false;
                        }
                    }
                }

                if((BugVm.orderTypeData.prodTitle).indexOf('周周涨') != -1) {
                    $.ajax({
                        url: Setting.apiRoot1 + '/checkHuoQiBuyStatus.p2p',
                        type: 'post',
                        dataType: 'json'
                    }).done(function(res) {
                        if(res.code == 1) {
                            var _data = res.data;
                            var currentMonery = _data.currentVoteAmt;
                            BugVm.orderTypeData.canBuyAmt = currentMonery;
                            currentTime(res);
                        }
                    }).fail(function() {
                        alert('网络连接失败！');
                        return false;
                    })
                }

                Commain.payPass();
                buyOrder();
            }
        },
        //点击活动规则
        activeRule: function() {
            buyProtocolCurrent('activeRules.html');
        }
	},
     watch:{
       money:{
        handler:function(){
            if(BugVm.money > 0){
                //2,4,8,12,26,52
                var __week = BugVm.activeloanCycle;
                if(__week == 2 || __week == 4 || __week == 8 || __week == 12 || __week == 26 || __week == 52) {
                var __activityRate = BugVm.activityRate;
                var __flagQCDB = BugVm.flagQCDB;
                var __flagKNHB = BugVm.flagKNHB;
                if(__activityRate == 0) {
                    BugVm.actrate11 = '';
                    $('.actrate01').html('');
                }

                if(__flagKNHB == 0) {
                    $('.actrate03').html('')
                }

                if((__activityRate != 0 && __activityRate != undefined && __activityRate != null && __activityRate != '') ||
                    (__flagQCDB != 0 && __flagQCDB != undefined && __flagQCDB != '' && __flagQCDB != null) ||
                    (__flagKNHB != 0 && __flagKNHB != undefined && __flagKNHB != '' && __flagKNHB != null)
                ) {
                    var __money01 = BugVm.money;
                    var __rate = 0;
                    var __rate2 = 0;
                    var __money02 = parseInt(__money01 / 10000);

                    if((__activityRate != 0 && __activityRate != undefined && __activityRate != null && __activityRate != '') && (__week == 2 || __week == 4 || __week == 8 || __week == 12 || __week == 26 || __week == 52)) {
                        BugVm.actrate11 = parseFloat(__activityRate).toFixed(2) ;
                        $('.actrate01').html('+' + parseFloat(__activityRate).toFixed(2) + '%');
                        __rate = __rate + __activityRate;
                    }

                    if((__flagQCDB != 0 && __flagQCDB != undefined && __flagQCDB != null && __flagQCDB != '') && (__week == 2 || __week == 4 || __week == 8 || __week == 12 || __week == 26 || __week == 52)) {
                        if(__money02 <= 10) {
                            __rate = __rate + (__money02 * 0.1);
                            __rate2 = __money02 * 0.1;
                        } else {
                            __rate = __rate + 1;
                            __rate2 = 1;
                        }
                        if(__rate2 != 0 && __rate2 != undefined && __rate2 != null && __rate2 != '') {
                            $('.actrate02').html('+' + parseFloat(__rate2).toFixed(2) + '%')
                        } else {
                            $('.actrate02').html('')
                        }
                    }

                    if((__flagKNHB != 0 && __flagKNHB != undefined && __flagKNHB != null && __flagKNHB != '') && (__week == 2 || __week == 4 || __week == 8 || __week == 12 || __week == 26 || __week == 52)) {
                        //针对开年红包
                        if(__money01 >= 50000 && BugVm.isactiveloanCycle) {
                            BugVm.active_rate3 = 0.5;
                            BugVm.isactiveloanCycle = false;
                        } else {
                            if(__money01 < 50000) {
                                BugVm.active_rate3 = 0;
                            }
                            BugVm.isactiveloanCycle = true;
                        }
                        if(BugVm.active_rate3 != 0 && BugVm.active_rate3 != undefined && BugVm.active_rate3 != null && BugVm.active_rate3 != '') {
                            $('.actrate03').html('+' + parseFloat(BugVm.active_rate3).toFixed(2) + '%')
                        } else {
                            $('.actrate03').html('')
                        }
                    }

                    BugVm.percent = (BugVm.activepercent) * (BugVm.regularRate + __rate + BugVm.active_rate3);//..
                }
                }

                if(BugVm.money >= BugVm.orderTypeData.minBuyAmt && BugVm.money <= BugVm.orderTypeData.canBuyAmt && BugVm.money <= BugVm.orderTypeData.maxBuyAmt){
                    viewCoupon();
                }else if(BugVm.money > BugVm.orderTypeData.canBuyAmt){
                    $('.money').blur();
                    if((BugVm.orderTypeData.prodTitle).indexOf('周周涨') != -1) {
                        alert('输入金额超过周周涨可投余额');
                    } else {
                        alert('投资金额不能大于剩余可购余额');
                    }
                    BugVm.money = BugVm.orderTypeData.canBuyAmt;
                }else if(BugVm.money > BugVm.orderTypeData.maxBuyAmt){
                    $('.money').blur();
                    alert('最大投资金额为'+ BugVm.orderTypeData.maxBuyAmt + '元');
                    BugVm.money = BugVm.orderTypeData.maxBuyAmt;
                }else{
                    BugVm.couponData = [];
                    BugVm.couponSize = '未使用';
                    BugVm.couponAlreadyInUse = [];
                    sessionStorage.setItem('_size',BugVm.couponSize);
                    BugVm.isStopCoupon = false;
                }
            }else if(BugVm.money <= 0 && BugVm.money != ''){
                $('.money').blur();
                BugVm.couponData = [];
                BugVm.couponSize = '未使用';
                BugVm.couponAlreadyInUse = [];
                alert('输入金额无效！');$('.actrate2').html('');
                BugVm.money = '';
            }else{
                BugVm.couponData = [];
                BugVm.couponSize = '未使用';
                BugVm.couponAlreadyInUse = [];
            }

            var _week3 = BugVm.week3;
            var week3 = _week3.week3;
            if(week3 == 1) {
                /**
                 * week01为大于等于1W，小于3W
                 * week02为大于等于3W，小于5W
                 * week03为5W
                 */
                if(BugVm.money > 50000) {
                    BugVm.money = '';
                    $('.money').blur();
                    alert('输入金额不符合活动要求，详情参照“3周专享活动”规则');
                    return false;
                }
            }

            if(BugVm.voteAmount != 0 && BugVm.voteAmount != '' && BugVm.voteAmount != '') {
                if(BugVm.money > BugVm.voteAmount && BugVm.voteAmount > 100) {
                    alert('输入金额超过您的剩余可投金额' + BugVm.voteAmount + '元');
                    BugVm.money = '';
                    $('.money').blur();
                    return false;
                }
            }
            BugVm.couponGentle = 0;
            BugVm.privilege = 0;
            BugVm.couponWeight = 0;
            BugVm.couponDay = 0;
            BugVm.couponAlreadyInUseTWO = [];
            BugVm.poorCouponWeight = BugVm.orderTypeData.maxPrivilege;
            for (var i = 0; i < BugVm.couponData.length; i++) {
                BugVm.couponData[i].check = false;
            }
            BugVm.isMayCoupon = false;
            BugVm.isStopCoupon = true;

        },
        deep:true
       },
       tabli:{
        handler:function(){
            if(this.tabli == 2){
                productInit();
            }
        },
        deep:true,
       }
    }

});

//加载用户的信息
function userInfo() {
    $.ajax({
        url:Setting.apiRoot1 + '/u/queryMyAccountInfo.p2p',
        type:"post",
        async:false,
        dataType:'json',
        data:{
            userId: BugVm.userId,
            loginToken:BugVm.loginToken
        }
    }).done(function(res) {

        Common.ajaxDataFilter(res,function(){
            if(res.code == 1) {
    			BugVm.userData = res.data;
            } else {
                if(res.code == -99) {
                    Commain.toLogin();
                    return false;
                } else {
                    alert(res.message);
                    return false;
                }
            }
        })
    }).fail(function() {
        alert('网络链接失败');
        return false;
    });
}

function currentTime(res) {
    //var $currentBuyButton = $('.buy-btn');
    var _data = res.data;
    var currentStartTime = _data.currentStartTime;//开始抢购时间
    var currentEndTime = _data.currentEndTime;//抢购结束时间
    var currentTime = _data.currentTime;//服务器当前时间
    var date = new Date();
    var _date = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDay();
    var nowTime = new Date(_date + ' ' + currentTime);
    var currentVoteAmt = _data.currentVoteAmt;
    /**
     * 获取开始抢购的时、分、秒
     * @type {Date}
     */
    var startTime = new Date(_date + ' ' + currentStartTime);
    var isStart = false;
    var isEnd = false;
    if(nowTime.getTime() < startTime.getTime()) {
        isStart = true;
    }

    if(currentVoteAmt == 0) {
        BugVm.disabled = 'disabled';
        BugVm.message = '今日已售罄，明天再来吧';
        BugVm.htmlStyle = {'background':'#b9b9b9'};
        BugVm.htmlText = '已售罄';
        //$currentBuyButton.addClass('nBuy').html('已售罄').attr({'message':'今日已售罄，明天再来吧'}).css({'background':'#b9b9b9','color':'#ffffff'});
    }

    if(isStart) {
        BugVm.disabled = 'disabled';
        BugVm.message = '客官，抢购10:00开始哦';
        BugVm.htmlStyle = {'background':'#b9b9b9'};
        BugVm.htmlText = '立即抢购';
        //$currentBuyButton.addClass('nBuy').attr({'message':'客官，抢购10:00开始哦'}).css({'background':'#b9b9b9','color':'#ffffff'});
    } else {
        var endTime = new Date(_date + ' ' + currentEndTime);
        if(nowTime.getTime() >= endTime.getTime()) {
            isEnd = true;
        }
        if(isEnd) {
            BugVm.disabled = 'disabled';
            BugVm.message = '今日已结束，明天再来吧';
            BugVm.htmlStyle = {'background':'#b9b9b9'};
            BugVm.htmlText = '立即抢购';
            //$currentBuyButton.addClass('nBuy').attr({'message':'今日已结束，明天再来吧'}).css({'background':'#b9b9b9','color':'#ffffff'});
        }
    }


}

// 订单信息
function orderTypeData(){
    $.ajax({
        url: Setting.apiRoot1 + '/u/queryMyProductActions.p2p',
        type: 'post',
        async:false,
        dataType: 'json',
        data: {
            userId:BugVm.userId,
            loginToken:BugVm.loginToken,
            loanId: BugVm.pid
        }
    }).done(function(res){
        Common.ajaxDataFilter(res, function(data){
            if(data.code == 1){
                var data=res.data;
                BugVm.activeloanCycle = data.loanCycle;
                var prodTitle = data.prodTitle;
                if(parseFloat(data.minBuyAmt) < 100) {
                    BugVm.placeholder = '请输入100的整数倍';
                } else {
                    BugVm.placeholder = '请输入' + data.minBuyAmt + '的整数倍';
                }
                var __prodTitle = data.prodTitle;
                //22周双十一活动不可用券
                if(data.loanCycle == 22 || data.loanCycle == 9 || data.loanCycle == 5 || (data.loanCycle == 3 && (data.addRate + data.minRate) != 14) || (__prodTitle.indexOf('新手标') != -1)) {
                    BugVm.active = false;
                }
                if(prodTitle.indexOf('3周') != -1 && (data.addRate + data.minRate) == 14) {
                    $.post(Setting.apiRoot1 + '/u/currentStockValidator.p2p',
                    {userId:BugVm.userId,loginToken:BugVm.loginToken},
                    function(res) {
                        if(res.code == 1) {
                            var data = res.data;
                            if(data != 1) {
                                BugVm.htmlStyle = {'background':'#b9b9b9'};
                                BugVm.message = '先赎回活期产品方可投资3周';
                                BugVm.disabled = 'disabled';
                            }
                        }
                    },'json'
                );

                $.post(Setting.apiRoot1 + '/u/userCurrentStockInfo.p2p',
                    {userId:BugVm.userId,loginToken:BugVm.loginToken},
                    function(res) {
                        if(res.code == 1) {
                            var data = res.data;
                            BugVm.voteAmount = data.voteAmount;
                        }
                    },'json'
                );
            }

            if(prodTitle.indexOf('3周') != -1 && (data.addRate + data.minRate) != 14) {
                BugVm.style = {'display':'none'};
                BugVm.show = false;
                $.ajax({
                    url: Setting.apiRoot1 + '/u/checkUser3Week.p2p',
                    type: 'post',
                    async:false,
                    dataType: 'json',
                    data: {
                        userId:BugVm.userId,
                        loginToken:BugVm.loginToken
                    }
                }).done(function(res1) {
                    Common.ajaxDataFilter(res1, function() {
                        if(res1.code == 1) {
                            //week3为1表示可以参加活动，0表示不可以参加该活动
                            var week3 = res1.data.week3;
                            if(week3 != undefined && week3 != null && week3 != '') {
                                if(week3 == 1) {
                                    //第一档大于等于10000小于30000
                                    var week01 = res1.data.week3Level10000;
                                    //第二档大于等于30000小于50000
                                    var week02 = res1.data.week3Level30000;
                                    //第三档等于50000
                                    var week03 = res1.data.week3Level50000;
                                    if(week01 == 0 && week02 == 0 && week03 == 0) {
                                        BugVm.htmlStyle = {'background':'#b9b9b9'};
                                        BugVm.message = '每一个金额档次只能投资一次，请勿重复购买';
                                        BugVm.disabled = 'disabled';
                                    }
                                    BugVm.week3.week3 = week3;
                                    BugVm.week3.week01 = week01;
                                    BugVm.week3.week02 = week02;
                                    BugVm.week3.week03 = week03;
                                } else {
                                    BugVm.htmlStyle = {'background':'#b9b9b9'};
                                    BugVm.message = '您不符合购买条件，详情请参照“3周专享活动”规则';
                                    BugVm.disabled = 'disabled';
                                }
                            }
                        }
                    })
                }).fail(function() {
                    //alert('网络连接失败！');
                })
            }
            if(prodTitle.indexOf('14周') != -1) {
                $.ajax({
                    url: Setting.apiRoot1 + '/u/queryUser14WeekExt.p2p',
                    type:'post',
                    dataType:'json',
                    data:{
                        userId: sessionStorage.getItem('uid'),
                        loginToken: sessionStorage.getItem('loginToken')
                    }
                }).done(function(res) {
                    if(res.code == 1) {
                        var _data = res.data;
                        var maxPurchasedAmt = _data.maxPurchasedAmt;//可购买最大额度
                        var purchasedAmt = _data.purchasedAmt;//已经购买额度
                        BugVm.maxPurchasedAmt = maxPurchasedAmt;
                        BugVm.purchasedAmt = purchasedAmt;
                        if(parseFloat(purchasedAmt) >= parseFloat(maxPurchasedAmt)) {
                            BugVm.message = '可投额度不足';
                            BugVm.disabled = 'disabled';
                        }
                    } else {
                        alert(res.message);
                        return false;
                    }
                }).fail(function() {
                    alert('网络连接失败！');
                    return false;
                })
            }
            if(prodTitle.indexOf('周周涨') != -1) {
                $.ajax({
                    url: Setting.apiRoot1 + '/checkHuoQiBuyStatus.p2p',
                    type: 'post',
                    dataType: 'json'
                }).done(function(res) {
                    if(res.code == 1) {
                        var _data = res.data;
                        var currentMonery = _data.currentVoteAmt;
                        BugVm.orderTypeData.canBuyAmt = currentMonery;
                        currentTime(res);
                    }
                }).fail(function() {
                    alert('网络连接失败！');
                    return false;
                })
            }
            BugVm.orderTypeData = res.data;
            BugVm.orderTypeData.maxPrivilege = res.data.maxPrivilege;
            BugVm.poorCouponWeight = res.data.maxPrivilege;
            var cycleType = data.cycleType;//周期类型
            var cycle = data.loanCycle;//周期时长
            BugVm.buyNewType = cycle;
            if(cycle == BugVm.newProd || BugVm.newProd == 6) {
                //新手标可以购买
                BugVm.newProd = 1;
            } else {
                //新手标不可以购买
                BugVm.newProd = 0;
            }
            //固收产品的详细信息
        // pname=data.prodTitle;//title
        // pmount=parseFloat(data.canBuyAmt);//可投余额(标的余额)
        maxInvestAmount = parseFloat(data.maxBuyAmt);//最大投资金额
        minInvestAmount =parseFloat(data.minBuyAmt);//最小起投金额
        var maxRate=data.maxRate;//最大利率
        var minRate=data.minRate;//最小利率
        var addRate=data.addRate;//加息
        // cycle=data.loanCycle;//周期时长
        // cycleType=data.cycleType;//周期类型
        var action=data.action;//是否参加大额加息活动
        // action2=data.action2;//是否参加加息券
        // action3=data.action3;//是否参加体验金
        // action5=data.action5;//是否参加投资红包
        // maxPrivilege=data.maxPrivilege;//当前去除已参加的其他活动后的总权重
        // if (action==1) {//大额加息
        //     //$('.addimg').removeClass('hide');
        // }
            BugVm.cycle = parseFloat(data.loanCycle) * 7;

            var type = parseInt(data.prodType);
            switch (type){
                case 1 : BugVm.isCurrent = true;BugVm.tabli = 1; break;
                case 5 : BugVm.isNewHand = true;BugVm.isRegular = true;BugVm.tabli = 2; break;
                case 3 : BugVm.isRegular = true;BugVm.tabli = 2; break;
                case 6 : BugVm.isNewHand = true;BugVm.isRegular = true;BugVm.tabli = 2; break;
            }


            if( cycleType==1){
               percent = cycle / 365;//日
            }else if(cycleType==2){
               percent = cycle*30 /365;//月
            }else if(cycleType == 3){
               percent =cycle*365 /365;//年
            }else if(cycleType == 4){
               percent = cycle*7 /365;//周
            }
            if (action==1) {
                $.ajax({
                    url:Setting.apiRoot1 + '/queryAction1.p2p',
                    type:"post",
                    dataType:'json',
                    async:false,
                    data:{
                        loanId: BugVm.pid
                    }
                }).done(function(res){
                Common.ajaxDataFilter(res,function(){
                    if(res.code==1){
                        BugVm.indata = res.data;
                    }else{
                        alert(res.message);
                        return false;
                    }
                })
                }).fail(function(){
                alert('网络链接失败');
                return false
                });
            }
            var indata = BugVm.indata;
            var addInterestRate;//投资加息
            if (indata.length>0) {
                for (var i = 0; i < indata.length; i++) {
                    if( Number(indata[i].minAmt) <= Number(money) && Number(money) < Number(indata[i].maxAmt) ) {
                    addInterestRate = indata[i].addRate;
                    break;
                    }else{
                    addInterestRate = 0;
                    }
                }
                BugVm.regularRate=parseFloat(minRate)+parseFloat(addRate)+parseFloat(addInterestRate);
            }else{
                var __prodType = data.prodType;
                if((__prodType == 3) && (BugVm.activeloanCycle == 2 || BugVm.activeloanCycle == 4 || BugVm.activeloanCycle == 8 || BugVm.activeloanCycle == 12 || BugVm.activeloanCycle == 26 || BugVm.activeloanCycle == 52)) {
                    var activityRate = data.activityRate;
                    var flagQCDB = data.flagQCDB;//活动二
                    var flagKNHB = data.flagKNHB;//活动三，开年红包的活动
                    if(flagQCDB != 0 && flagQCDB != undefined && flagQCDB != '' && flagQCDB != null) {
                        BugVm.flagQCDB = flagQCDB;
                    }

                    if( flagKNHB != 0 && flagKNHB != undefined && flagKNHB != '' && flagKNHB != null) {
                        BugVm.flagKNHB = flagKNHB;
                    }

                    if((activityRate != 0 && activityRate != undefined && activityRate != '' && activityRate != null) ) {
                        BugVm.regularRate=parseFloat(minRate);
                        $('.actrate01').html('+' + activityRate + '%');
                        $('.addrate11').html('+' + activityRate + '%');
                        BugVm.activityRate = activityRate;
                        BugVm.actrate11 = activityRate;
                    } else {
                        BugVm.actrate11 = '';
                        BugVm.regularRate=parseFloat(minRate)+parseFloat(addRate);
                    }
                } else {
                    BugVm.regularRate=parseFloat(minRate)+parseFloat(addRate);
                }


            }
            var _activityRate = data.activityRate;
            //不等于说明可以参加8周和12周的活动
            if(_activityRate != 0 && activityRate != undefined && activityRate != '' && activityRate != null) {
                var _activeRate = BugVm.regularRate;
                BugVm.activeRate = _activeRate + _activityRate;
                BugVm.percent = percent * BugVm.activeRate;
            } else {
                BugVm.percent = percent * BugVm.regularRate;
            }
            BugVm.activepercent = percent;

            if(res.data.prodType == 6) {
                BugVm.orderTypeData.investTerm = ((res.data.loanCycle) * 7 ) + '天';
            }

        } else {
            alert(res.message);
            return false;
        }
      });

    }).fail(function(){
      alert('网络链接失败，请刷新重试！');
      return false;
    });
}

function orderTypeDataOne(){
    var percent = 0;
      $.ajax({
      url:Setting.apiRoot1 + '/queryPLoanInfoPC.p2p',
      type: 'get',
      async:false,
      dataType: 'json',
      data: {
        loanId:BugVm.pid
      }
    }).done(function(res){
      Common.ajaxDataFilter(res, function(data){
        if(data.code == 1){
            var data=res.data;
            if(data.prodType != 1){
                data.loanCycle = data.investTerm.replace(/[^0-9]/ig,"").toString();
            }
            var investTerm = data.investTerm;
            var __prodTitle = data.prodTitle;
            if(__prodTitle != undefined && __prodTitle!= null && __prodTitle != '') {
                if(__prodTitle.indexOf('新手标') != -1) {
                    BugVm.active = false;
                }
            }
            //22周双十一活动
            if(investTerm.indexOf('22周') != -1 || investTerm.indexOf('5周') != -1 || investTerm.indexOf('9周') != -1) {
                BugVm.active = false;
            }

            if(investTerm.indexOf('3周') != -1) {
                BugVm.style = {'display':'none'};
                BugVm.show = false;
            }
            BugVm.orderTypeData = res.data;
            // BugVm.orderTypeData.prodTitle = res.data.investTerm;
            BugVm.orderTypeData.maxPrivilege = res.data.maxPrivilege;
            BugVm.poorCouponWeight = res.data.maxPrivilege;
            var cycleType = data.cycleType;//周期类型
            var cycle = data.loanCycle;//周期时长
            //固收产品的详细信息
            var maxInvestAmount = parseFloat(data.maxBuyAmt);//最大投资金额
            var minInvestAmount =parseFloat(data.minBuyAmt);//最小起投金额
            var maxRate=data.maxRate;//最大利率
            var minRate=data.minRate;//最小利率
            var addRate=data.addRate;//加息
            var action=data.action;//是否参加大额加息活动
            // BugVm.cycle = parseFloat(data.loanCycle) * 7;

            var type = parseInt(data.prodType);
            switch (type){
                case 1 : BugVm.isCurrent = true;BugVm.tabli = 1; break;
                case 5 : BugVm.isNewHand = true;BugVm.isRegular = true;BugVm.tabli = 2; break;
                case 3 : BugVm.isRegular = true;BugVm.tabli = 2; break;
                case 6 : BugVm.isNewHand = true;BugVm.isRegular = true;BugVm.tabli = 2; BugVm.orderTypeData.maxRate = 12;break;
            }
            if(type == 6) {
                cycleType = 1;
                if(BugVm.orderTypeData.investTerm.indexOf('14') != -1) {
                    cycle = 14
                }

                if(BugVm.orderTypeData.investTerm.indexOf('28') != -1) {
                    cycle = 28
                }
            }
            if( cycleType==1){
               percent = cycle / 365;//日
            }else if(cycleType==2){
               percent = cycle*30 /365;//月
            }else if(cycleType == 3){
               percent =cycle*365 /365;//年
            }else if(cycleType == 4){
               percent = cycle*7 /365;//周
            }
            var indata = BugVm.indata;
            var addInterestRate;//投资加息
            if (indata.length>0) {
                for (var i = 0; i < indata.length; i++) {
                    if( Number(indata[i].minAmt) <= Number(money) && Number(money) < Number(indata[i].maxAmt) ) {
                    addInterestRate = indata[i].addRate;
                    break;
                    }else{
                    addInterestRate = 0;
                    }
                }
                BugVm.regularRate=parseFloat(minRate)+parseFloat(addRate)+parseFloat(addInterestRate);
            }else{
                BugVm.regularRate=parseFloat(minRate)+parseFloat(addRate);
            }
            BugVm.percent = percent * BugVm.regularRate;
            if(BugVm.orderTypeData.prodType == 1) {
                $.ajax({
                    url: Setting.apiRoot1 + '/checkHuoQiBuyStatus.p2p',
                    type: 'post',
                    dataType: 'json'
                }).done(function(res) {
                    if(res.code == 1) {
                        var _data = res.data;
                        var currentMonery = _data.currentVoteAmt;
                        BugVm.orderTypeData.canBuyAmt = currentMonery;
                        currentTime(res);
                    }
                }).fail(function() {
                    alert('网络连接失败！');
                    return false;
                })
            }
        } else {
            alert(res.message);
            return false;
        }
      });
    }).fail(function(){
      alert('网络链接失败，请刷新重试！');
      return false;
    });

}

// 检测是否实名认证和设置交易密码
function checkUserInfo(type){
    var userData = {
        userId:BugVm.userId,
        loginToken:BugVm.loginToken
    }
    $.ajax({
        url : Setting.apiRoot1 + '/u/checkUserInfo.p2p',
        type : 'post',
        dataType : 'json',
        data : {
            userId : BugVm.userId,
            type : type,//1：是否实名认证  2：是否设置交易密码
            loginToken : BugVm.loginToken

        },
        async:false,
    }).done(function(res) {
            Common.ajaxDataFilter(res, function(data) {
                if(data.code == 1){
                    if(type == 1){
                        checkUserInfo(2);//是否设置交易密码
                    }else{
                        // return true;
                        BugVm.UserInfo = true;
                    }
                }else{
                    Commain.realName(type,userData);
                    return false;
                }
            });
        }).fail(function() {
            alert('网络链接失败，请刷新重试！');
            return false;
    });
}

// 资产组合详情
function productInit(){
    var proType = BugVm.orderTypeData.prodType;
    if(proType == 6) {
        proType = 3;
    }
    $.ajax({
        url:Setting.apiRoot1 + '/queryDebtInfo.p2p',
        type:"post",
        dataType:'json',
        data:{
            type:proType
        }
    }).done(function(res) {
        if(res.code == 1) {
        	BugVm.portfolioData = [];
            if(res.data == null || res.data == '' || res.data.length == 0) {
                var _res = [  {
                    "count": 20,
                    "eachPercent": "100.00%",
                    "loanPurpose": "其他",
                    "purposeCode": "9"
                }];
                BugVm.portfolioData = _res;
                assets( _res);
            } else {
                BugVm.portfolioData = res.data;
                assets(res.data);
            }

        } else {
            alert(res.message);
        }

    }).fail(function() {
        alert('网络连接失败');
        return false;
    });
}

// 资产组合
function assets(data){
    var _tableJsonData = [];
    var _tableArray = [];
    var _arr = 0;
    for(var i = 0; i < data.length; i++){
        var _tableJson = {};
        if(i < 4 && data[i].loanPurpose != '其他') {
            _tableArray[i] = data[i].loanPurpose;
            _tableJson.value = parseFloat(data[i].eachPercent).toFixed(2);
            _tableJson.name = data[i].loanPurpose;
            _arr = _arr + (parseFloat(data[i].eachPercent));
            _tableJsonData.push(_tableJson);
        } else {
            _tableArray[i] = '其他';
        }

    }

    _arr = parseFloat(100 - (_arr)).toFixed(2);
    if(data.length > 4) {
        _tableJsonData.push({'value': _arr,'name':'其他'});
    }
    var myChart = echarts.init(document.getElementById('assTable'));
    var option = {
           tooltip: {
               trigger: 'item',
               formatter: "{a} <br/>{b}: {c} ({d}%)"
           },
           legend: {
               orient: 'vertical',
               x: 'center',
               y:'center',
               data:_tableArray,
               textStyle: {
                   fontSize:14
               }
           },
           series: [
               {
                   name:'资产组合及详情',
                   type:'pie',
                   radius: ['80%', '90%'],
                   avoidLabelOverlap: false,
                   label: {
                       normal: {
                           show: false,
                           position: 'center'
                       },
                       emphasis: {
                           show: false,
                           textStyle: {
                               fontSize: '14',
                               fontWeight: 'bold'
                           }
                       }
                   },
                   labelLine: {
                       normal: {
                           show: false
                       }
                   },
                   data:_tableJsonData
               }
           ]
       };
    myChart.setOption(option);
}

 //输入金额>起投金额之后
//查找可用加息券 可用投资红包 可用体验金
function viewCoupon(){
    var minInvestAmount = BugVm.orderTypeData.minBuyAmt;
    if (BugVm.money>=minInvestAmount) {
        $.ajax({
            url:Setting.apiRoot1 + '/u/checkUsefulRateCoupon.p2p',
            type:"post",
            async:false,
            dataType:'json',
            data:{
                userId: BugVm.userId,
                loginToken:BugVm.loginToken,
                prodId:BugVm.pid,
                amount:$.trim(BugVm.money)
            }
        }).done(function(res){
            Common.ajaxDataFilter(res,function(){
                if(res.code==1){
                    var data=res.data;
                    var money = BugVm.money;
                    var cycle = BugVm.cycle;
                    var regularRate = parseFloat(BugVm.regularRate);
                    for(var i = 0; i < data.coupons.length; i++){
                        data.coupons[i].check = false;
                        switch(data.coupons[i].type){
                            case 1 :data.coupons[i].couponId = couponMoney(1,money,data.coupons[i].privilege,data.coupons[i].cycleTime,0,0);break;
                            case 2 :data.coupons[i].couponId = couponMoney(2,money,data.coupons[i].privilege,0,cycle,0);break;
                            case 3 :data.coupons[i].couponId = couponMoney(3,data.coupons[i].privilege,0,data.coupons[i].cycleTime,0,regularRate);break;
                            case 5 :data.coupons[i].couponId = couponMoney(5,money,data.coupons[i].privilege,0,0,0);;break;
                        }
                    }
                    BugVm.couponData = data.coupons;
                    var size=data.size;
                    sessionStorage.setItem('_size',size);
                    if (size>0) {
                        BugVm.couponSize = size + '张可用';
                    } else {
                        BugVm.couponSize = '未使用';
                        BugVm.couponData = [];
                    }
                    BugVm.couponAlreadyInUse = [];
                }else{
                    return false;
                }
            })
        }).fail(function(){
            alert('网络链接失败');
            return false
        });
    }else{
        $('.rowac a').removeAttr('href');
        $('.canclick').removeClass('canclick');
        $('.showSize').hide();
        $(".rowac span").removeClass('used').html('大于起投金额可用');
    }
}

// 每张优惠券的优惠金额
function couponMoney(type,money,privilege,cycleTime,cycle,_regularRate){
    var coupons = 0;
    // 天数加息
    if(type == 1){
        coupons = parseFloat(parseFloat(parseFloat(money) * parseFloat(privilege) * cycleTime / 36500).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
    }
    // 全程加息
    if(type == 2){
        coupons = parseFloat(parseFloat(parseFloat(money) * parseFloat(privilege) * parseFloat(cycle) / 36500).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
    }
    // 体验金
    if(type == 3){
         coupons = parseFloat(parseFloat(parseFloat(money) * _regularRate * cycleTime / 36500).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
    }
    // 投资红包
    if(type == 5){
         coupons = parseFloat(parseFloat(privilege).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
    }
    return coupons;
}

// 购买订单
function buyOrder(){
    $('.subPayBtn').click(function() {
        var pwd = $('.input').val()
        if(pwd == ''){
            alert('密码不能为空');
            return;
        }else if(pwd.length < 6){
            alert('请输入完整的交易密码！');
            return;
        }
        var userRate = [];
        var invest = [];
        for(var j = 0; j < BugVm.couponAlreadyInUse.length; j++){
            if(BugVm.couponAlreadyInUse[j].type == 1 || BugVm.couponAlreadyInUse[j].type == 2 || BugVm.couponAlreadyInUse[j].type == 3){
                userRate.push(BugVm.couponAlreadyInUse[j].id);
            }else{
                invest.push(BugVm.couponAlreadyInUse[j].id);
            }
        }
        userRate = userRate.join(',');
        invest = invest.join(',');
        var reback = BugVm.orderTypeData.prodType == 1 ? 0 : 1;
        var isJoinInvite = reback == 0 ? 0 : '';
        $.ajax({
            url: Setting.apiRoot1 + '/u/investPurchaseNew.p2p',
            type: 'post',
            dataType: 'json',
            data: {
                investAmt : BugVm.money,
                prodId : BugVm.pid,
                userId: BugVm.userId,
                tradePassword: md5(pwd),
                reback: reback,//判断是否是定期 1为定期  0：不是定期
                isJoinInvite:isJoinInvite,
                userRateCouponIds:userRate,
                investCouponId:invest,
                loginToken:BugVm.loginToken

            }
        }).done(function(res){
            Common.ajaxDataFilter(res, function(res){
                if(res.code == -3){//交易密码错误
                    bugAlert("交易密码输入有误" ,'javescript:;' ,'javescript:;','重新输入' ,'忘记密码');
                    $('.btn-link').on('click',function(){
                        $('#alert').remove();
                        Commain.payPass();
                        buyOrder();
                    })
                    $('.btn-default-two').on('click',function(){
                        $('#alert').remove();
                        Commain.forgetPass();
                    })
                }else if(res.code == -2){//交易密码输入错误达到5次
                    alert(res.message);
                }else if(res.code == 1){//交易成功
                    sessionStorage.setItem('newProd',res.data.newProd);
                    bugAlert("投资购买成功，客官您可以" ,'/wdindex/bpage/account.html' ,'/wdindex/bpage/buy.html','查看账户' ,'继续购买');
                    if(BugVm.orderTypeData.prodType == 5 || BugVm.orderTypeData.prodType == 6){
                        var newProd = sessionStorage.getItem('newProd');
                        var buyNewType = BugVm.buyNewType;
                        // if(newProd != 0) {
                        //     if(newProd == 6) {
                        //         if(buyNewType == 2) {
                        //             sessionStorage.setItem('newProd',4);
                        //         }
                        //         if(buyNewType == 4) {
                        //             sessionStorage.setItem('newProd',2);
                        //         }
                        //     } else {
                        //         sessionStorage.setItem('newProd',0);
                        //     }
                        // }
                        //sessionStorage.setItem('newProd',0);//是否购买过新手标
                    }
                }else{//交易失败
                    alert(res.message);
                }
            });
        }).fail(function(){
            alert('支付失败，请重试！');
            return false;
        });

    $('.conMain').remove();

    });

}

//交易成功或失败
function bugAlert(message,urlLeft,urlRight,btnLeft,btnRight){
    var template = ' <div class="ui-dialog backdrop" id="alert">'+
      '<div class="dialog-content">'+
        '<div class="topup_top_box">'+
          '<div class="close">'+
            '<img src="../bimages/topup_close.png" alt="" class="closeImg">'+
          '</div>'+
           '<div class="dialog-title">温馨提示</div> <!-- 标题 -->'+
          ' <div class="dialog-article"> <!-- 内容 -->'+
             '<p>'+ message +'</p>'+
           '</div>'+
        '</div>'+
         '<div class="tc btn-box1  "><!-- 按钮 -->'+
           '<a href="'+ urlLeft +'" class="btn btn-link btn-sm" >'+ btnLeft +'</a>'+
           '<a href="'+ urlRight +'" class="btn btn-default-two btn-sm">'+ btnRight +'</a>'+
         '</div>'+
     ' </div>'+
    '</div>';
    $('body').append(template);
    $('.closeImg').on('click',function(){
        window.location.reload();
    })
}

function buyProtocolCurrent(url){
    $.ajax({
        url:url,
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
}

function scrollnews(el){
     $("."+el+"").animate({left:'-588px'},12000,function(){
        $("."+el+"").css({left:'280px'});
        scrollnews('buyDetails')
    })
}
$(function(){
	BugVm.userId = sessionStorage.getItem('uid');
    BugVm.loginToken = sessionStorage.getItem('loginToken');
    BugVm.pid = sessionStorage.getItem('prodid');
    BugVm.newProd = sessionStorage.getItem('newProd');
    if(!BugVm.pid){
        //alert('参数有误！！');
        window.location.href = Setting.staticRoot + '/pages/index.html';
        return false;
    }
    if(BugVm.userId){
        userInfo();
        orderTypeData();
    }else{
        orderTypeDataOne();
    }
})
window.onload = function(){
    var $buyIcon = $('.buyIcon');
    var $buyDetail = $('.buyDetail');
    var $buyDetails = $('.buyDetails');
    var totalTravel = '-' + $buyDetails.width() + 'px';
    var defTiming = $buyDetail.width();

    //鼠标移入加息券后面的小log显示内容
    $buyIcon.on('click, mouseover',function() {
        $buyDetail.show();
        scrollnews('buyDetails')
    });
    //鼠标移出加息券后面的小log隐藏内容
    $buyIcon.mouseout(function() {
        $buyDetails.stop(true,true);
        $buyDetail.hide();
    });
}
