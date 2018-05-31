/**
 * Created by User on 2017/6/12.
 */
$(function() {
    var param = Common.getParam();
    //判断是否点充值
    var formPages = param.formPages;
    var userId = sessionStorage.getItem('uid') || param.uid;//获取用户的ID
    var phone = sessionStorage.getItem('uname'); //获取手机号码
    var avatar = sessionStorage.getItem('avatar');//获取用户的头像
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;//获取用户的loginToken
    var formData = {};
    formData.userId = userId;
    formData.phone = phone;
    formData.loginToken = loginToken;
    if(formPages != undefined && formPages != null && formPages != '') {
        if(formPages.indexOf('#') != -1) {
            formPages = $.trim(formPages.replace('#',''));
        }
    }

    //是否进行过实名认证
    formData.validName = sessionStorage.getItem('validName');
    //身份证号码
    formData.cardNum = sessionStorage.getItem('cardNum');
    //真实姓名
    formData.realname = sessionStorage.getItem('realname');
    //用户未登录

    if(userId == undefined || userId == '' || userId == null) {
        Common.toLogin();
    }

    var _phone = sessionStorage.getItem('nickUserName');

    if(avatar == undefined || avatar == '' || avatar == null || avatar == "undefined") {
        avatar = '../bimages/usericon.png';
    }

    //左侧用户中心里面的小图标
    var limg = ['<img src="../bimages/icon@3x.png" class="left-img" style="width: 35px;height: 30px">',
                '<img src="../bimages/icon2@3x.png" class="left-img" style="width: 35px;height: 30px">',
                '<img src="../bimages/icon5@3x.png" class="left-img" style="width: 35px;height: 30px">'];
//,'邀请记录'
    var litext = [['资金管理','资产状态','充值','提现'],
        ['会员权益','专属特权','超值礼券','现金奖励'],
        ['设置','账户安全']];

    var _li = '';
    var _id = [['00','01','02','03'],['00','11','12','13','14'],['00','21']];

    //左边状态栏循环迭代
    for(var i = 0; i < litext.length; i++) {
        _li = _li + '<ul>';
        for(var j = 0; j < litext[i].length; j++) {
            _li = _li + '<a href="javascript:;"><li>';
            if(j == 0) {
                _li = _li + '<div class="li-div-left">' + limg[i] + '</div><div class="li-div-right" >' + litext[i][j] + '</div>';
            } else {
                _li = _li + '<a href="javascript:;" class="liclick state' + _id[i][j] + '" name=state' + _id[i][j] + ' number=' + _id[i][j] + '>' +
                '<div class="li-div-oth">' + litext[i][j] + '</div>' +
                '</a>';
            }
            _li = _li + '</li></a>';

        }
        _li = _li + '</ul>';
    }

    var vip = sessionStorage.getItem('VIP');
    if(vip == undefined || vip == null || vip == '') {
        vip = 'V0';
    }

    //页面左边的标题栏
    var _userleft = '<div class="userleft-content">' +
                     '<div class="head-div">' +
                    '<div class="portrait">' +
                    '<div class="portrait-div">' +
                    '<img src=' + avatar + ' class="portrait-img">' +
                    '</div>' +
                    '<div class="user-phone">昵称:<a>' + _phone +'</a></div>' +
                    '<div class="user-vip">会员等级:<a>V' + vip + '</a></div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="leftlist">' +
                     _li +
                    //'</ul>' +
                    '</div>' +
                    '</div>';

    $('.userleft').html(_userleft);

    var $liclick = $('.liclick');//点击左侧的按钮

    //默认界面为资产状态
    if(formPages == undefined || formPages == null || formPages == '' || formPages == 0) {
        formPages = '01';
    }
    var success = param.success;
    if(formPages == 1 && success != undefined && success != null && success != '') {
        formPages = '02'
    }

    //页面初始状态选中
    var $aName = $('a[name=state' + formPages + ']');
    $aName.addClass('disclick').find('.li-div-oth').addClass('selected');
    //$aName.find('.left-img').attr({'src': '../bimages/recharge' + formPages + '.png'});


    switchFun(formPages);

    //点击左侧界面
    $liclick.click(function() {
        //点击的按钮进行状态的切换
        var _number = $(this).attr('number');
        window.location.href = '../bpage/account.html?formPages=' + _number;
    });

    function switchFun(formPages) {
        switch (formPages) {
            //资产状态
            case '01': {
                portfolio(formData);
                break;
            }
            //充值
            case '02': {
                recharge(formData);
                break;
            }
            //提现
            case '03': {
                withdrawal(formData);
                break;
            }
            //会员专属特权
            case '11': {
                myPrivilege(formData);
                break;
            }
            //超值礼券
            case '12': {
                redenvelope(formData);
                break;
            }
            //现金奖励
            case '13': {
                reward(formData);
                break;
            }
            //账户与安全
            case '21': {
                security(formData);
                break;
            }
        }
    }
});