/**
 * Created by User on 2017/9/6.
 */
var $useright = $('.useright');

function redenvelope(formData) {
    var param = Common.getParam();
    var type = param.type;

    if(type == undefined || type == null || type == '') {
        type = 1;
    } else {
        if(type.indexOf('#') != -1) {
            type = $.trim(type.replace('#',''));
        }
    }
    initReadPeople(type);
}

function initReadPeople(type) {
    var count = 1;
    //var _type = 1;
    var titleForm = {};
    if(type == 1) {
        titleForm.one = 'redelect';
        titleForm.two = '';
        titleForm.three = '';
    }

    if(type == 5) {
        titleForm.one = '';
        titleForm.two = 'redelect';
        titleForm.three = '';
    }

    if(type == 3) {
        titleForm.one = '';
        titleForm.two = '';
        titleForm.three = 'redelect';
    }
    $useright.html('<div class="readPeoTitle">' +
    '<a href="javascript:;"><div style="width: 50%" class="redPeoDiv ' + titleForm.one + '" type="1">加息券</div></a>' +
    '<a href="javascript:;"><div style="width: 50%" class="redPeoDiv ' + titleForm.two + '" type="5">投资红包</div></a>' +
    //'<a href="javascript:;"><div class="redPeoDiv ' + titleForm.three +'" type="3">体验金</div></a>' +
    '</div>' +
    '<div class="content"><div class="lists"></div></div>');
    var $content = $('.content');
    $content.dropload({
        scrollArea : $content,
        loadDownFn : function(me) {
           //if(type == 1) {
               $.ajax({
                   url: Setting.apiRoot1 + '/u/getALLMyReward.p2p',
                   type: 'post',
                   dataType: 'json',
                   async:false,
                   data: {
                       userId : sessionStorage.getItem('uid'),
                       type: type,// 类型 5投资红包   3体验金  1加息券
                       pageNum:count,
                       pageSize:10,
                       loginToken:sessionStorage.getItem('loginToken')
                   }
               }).done(function(res) {
                   Common.ajaxDataFilter(res,function() {
                       if(res.code == -1) {
                           alert('查询失败');
                           // 锁定
                           me.lock();
                           // 无数据
                           me.noData(true);
                           return false;
                       }
                       if(res.code != 1) {
                           // 锁定
                           me.lock();
                           // 无数据
                           me.noData(true);
                           return false;
                       }
                       if(res.code == 1) {
                           var couponList;
                           // if(type == 1) {
                           //     couponList = res.data.RewardResultList;
                           // }
                           //
                           //if(type == 5) {
                           //    couponList = res.data.RewardResultList;
                           //}
                           //
                           //if(type == 5) {
                           //    couponList = res.data.RewardResultList;
                           //}

                           couponList = res.data.RewardResultList;
                           if (couponList.length == 0 && count == 1) {
                               // 锁定
                               me.lock();
                               // 无数据
                               me.noData(true);
                               $('.lists').html('<div class="listText">空空如也，快去投资提升等级领取福利吧</div>');
                               return false;
                           } else {
                               if(couponList.length != 0 && couponList.length != undefined && couponList.length != null && couponList.length != '') {
                                   showcasing(couponList,count,type);
                                   count++;
                                   me.resetload();
                               } else {
                                   // 锁定
                                   me.lock();
                                   // 无数据
                                   me.noData(true);
                                   return false;
                               }

                           }
                       }
                   })
               }).fail(function() {
                   alert('网络链接失败');
                   return false
               });
           //}
        }
    });

    var $redPeoDiv = $('.redPeoDiv');
    $redPeoDiv.click(function() {
        $redPeoDiv.removeClass('redelect');
        $(this).addClass('redelect');
        var _type1 = $(this).attr('type');
        window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=12&type=' + _type1 ;
    })
}

function showcasing(couponList,count,type) {
    var couponHtml = '';

    for(var i = 0; i < couponList.length; i++) {
        var _text = {};
        //var cardImg = '';
        //天数加息券


        if(type == 1) {
            // 1未使用 2已使用 3已过期 4已结清
            _text.addays = '加息天数：' + couponList[i].addDays;
            _text.fitProds = '适用产品：' + couponList[i].fitProds;
            _text.date = '有效期：' + couponList[i].validEndTime;
            if(couponList[i].couponOrigin != undefined && couponList[i].couponOrigin != null && couponList[i].couponOrigin != '') {
                _text.couponOrigin = '<div class="readText">来源：' + couponList[i].couponOrigin + '</div>';
            } else {
                _text.couponOrigin = '';
            }
            if(couponList[i].status == 1) {
                _text.cardImg = '';
                if(couponList[i].couponType == 1) {
                    _text.redText = '天数加息券';
                    _text.redClass = 'readBox0';
                    _text.rate = couponList[i].addRate + '<a>%</a>';
                    _text.btn =  '<a href="javascript:;"><div class="readBtn">立即使用</div></a>';
                }

                if(couponList[i].couponType == 2) {
                    _text.btn =  '<a href="javascript:;"><div class="readBtn">立即使用</div></a>';
                    _text.redText = '全程加息券';
                    _text.redClass = 'readBox1';
                    _text.rate = couponList[i].addRate + '<a>%</a>';
                }
            }

            if(couponList[i].status == 2 || couponList[i].status == 3 || couponList[i].status == 4) {
                _text.btn = '';
                _text.cardImg = '<img src="../bimages/red/no' + couponList[i].status + '.png" />';
                _text.redClass = 'readBox2';
                if(couponList[i].couponType == 1) {
                    _text.redText = '天数加息券';
                    _text.rate = couponList[i].addRate + '<a>%</a>';
                }

                if(couponList[i].couponType == 2) {
                    _text.redText = '全程加息券';
                    _text.rate = couponList[i].addRate + '<a>%</a>';
                }
            }
        }

        //投资红包
        if(type == 5) {
            if(couponList[i].activityName != undefined && couponList[i].activityName != null && couponList[i].activityName != '') {
                _text.couponOrigin = '<div class="readText">来源：' + couponList[i].activityName + '</div>';
            } else {
                _text.couponOrigin = '';
            }
            if(couponList[i].status == 3 || couponList[i].status == 6 || couponList[i].status == 7) {
                _text.btn = '';
                if(couponList[i].status == 3) {
                    _text.cardImg = '<img src="../bimages/red/no3.png" />';
                } else if(couponList[i].status == 6) {
                    _text.cardImg = '<img src="../bimages/red/no2.png" />';
                } else {
                    _text.cardImg = '';
                }

                _text.addays = '使用规则：' + couponList[i].remark;
                _text.fitProds = '适用产品：' + couponList[i].useContent;
                _text.date = '有效期：' + couponList[i].endTime;
                _text.redText = couponList[i].activityName;
                _text.redClass = 'readBox2';
                _text.rate = '￥' + couponList[i].amount;

            }

            if(couponList[i].status == 5) {
                _text.addays = '使用规则：' + couponList[i].remark;
                _text.fitProds = '适用产品：' + couponList[i].useContent;
                _text.date = '有效期：' + couponList[i].endTime;
                _text.cardImg = '';
                _text.btn =  '<a href="javascript:;"><div class="readBtn">立即使用</div></a>';
                _text.redText = couponList[i].activityName;
                _text.redClass = 'readBox3';
                _text.rate = '￥' + couponList[i].amount;
            }
        }

        //体验金
        if(type == 3) {
            _text.addays = '体验天数：' + couponList[i].cycleTime;
            _text.fitProds = '使用规则：' + couponList[i].remark;
            _text.date = '有效期：' + couponList[i].validEndTime;
            _text.redText = '体验金';
            _text.rate = '￥' + couponList[i].voucherAmount;
            _text.couponOrigin = '';
            //状态1、 1未使用 2已使用 3已过期 4已结清
            if(couponList[i].status == 1) {
                _text.cardImg = '';
                _text.redClass = 'readBox4';
                _text.btn =  '<a href="javascript:;"><div class="readBtn">立即使用</div></a>';

            }
            //状态1、 1未使用 2已使用 3已过期 4已结清
            if(couponList[i].status == 2 || couponList[i].status == 3 || couponList[i].status == 4) {
                _text.btn = '';
                _text.cardImg = '<img src="../bimages/red/no' + couponList[i].status + '.png" />';
                _text.redClass = 'readBox5';
            }
        }
        if(couponList[i].couponType != 1) {
            couponHtml = couponHtml + '' +
            '<div class="readPeople">' +
            '<div class="' + _text.redClass + '">' +
            '<div class="readLeft">' +
            '<div class="readLeft-top">' + _text.rate + '</div>' +
            '<div class="readLeft-bottom">' + _text.redText + '</div>' +
            '</div>' +
            '<div class="readRight">' +
            '<div class="readRightText">' + _text.couponOrigin +
                //'<div class="readText">' + _text.couponOrigin + '</div>' +
            '<div class="readText">' + _text.addays + '</div>' +
            '<div class="readText">' + _text.fitProds + '</div>' +
            '<div class="readText">' + _text.date + '</div>' +
            '<div class="readImg">' + _text.cardImg + '</div>' +
            '</div>' +
            '</div>' +
            '</div>' + _text.btn +
            '</div>';
        }



    }
    if(count == 1) {
        $('.lists').html(couponHtml);
    } else {
        $('.lists').append(couponHtml);
    }
    $('.readBtn').click(function() {
        window.location.href = Setting.staticRoot + '/pages/index.html?products=products';
    });
}