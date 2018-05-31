/**
 * Created by User on 2017/8/28.
 */
$(function() {
    var newProd = sessionStorage.getItem('newProd');
    var _weeks = 0;
    //banner页面加载
    $.ajax({
        url: Setting.apiRoot1 + '/queryFirstBarnerPC.p2p',
        type: 'post',
        dataType: 'json'
    }).done(function(res){
        if(res.code == 1) {

            var _data = res.data.bannerList;
            var _bHtml = '';
            var $banner = $('.banner');
            for (var i = 0; i < _data.length; i++) {
                if(_data[i].filePath != undefined && _data[i].filePath != null && _data[i].filePath != '') {
                    _bHtml = _bHtml + '<div class="swiper-slide"><a class="bannerClick" style="width: auto;height: 100%;display: block" url="' + _data[i].url + '"><img src="' + _data[i].filePath + '" /></a></div>';
                }
            }
            var _bannerHtml = '<div class="swiper-container">' +
                '<div class="swiper-wrapper">' + _bHtml +
                '</div>' +
                '<div class="swiper-pagination"></div>' +
                '</div>';
            $banner.html(_bannerHtml);
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                autoplay : 3000,
                autoplayDisableOnInteraction : false,
                grabCursor : true,
                loop : true,
                slidesPerView: 1,
                paginationClickable: true,
                mousewheelControl: false

            });

            $('.bannerClick').click(function() {
                var url = $(this).attr('url');
                if(url == 'http://') {
                    var _html = '';
                    _html = _html + '' +
                    '<div class="index-dialog">' +
                    '<div class="index-dialog-background"></div>' +
                    '<div class="index-dialog-box">' +
                    '<a class="index-dialog-close" href="javascript:;"></a>' +
                    '<div class="index-dialog-div">' +
                    '<div class="index-dialog-icon">' +
                    '<img src="../bimages/indexIcon/1512463498.png">' +
                    '</div>' +
                    '<div class="index-dialog-text">扫描上方二维码，参与V币大乐透，试试手气吧！</div>' +
                    '</div>'+
                    '</div>' +
                    '</div>' +
                    '';
                    var $body = $('body');
                    $body.append(_html);
                    var $dialogBox = $('.index-dialog-box');
                    var windowWidth = $(window).width();
                    var windowHeight = $(window).height();
                    var diaWidth = $dialogBox.width();
                    var diaHeight = $dialogBox.height();
                    $dialogBox.css({'top': ((windowHeight - diaHeight) / 2) + 'px', 'left':((windowWidth - diaWidth) / 2) + 'px'})
                    $body.css({"overflow":"hidden","height":"100%"});
                    $('.index-dialog-close').click(function() {
                        $('.index-dialog').remove();
                        $("body").css({"overflow":"auto"});
                    });
                    return false;
                }
                if(url == '...') {
                    setHtml('../bimages/indexIcon/1513564511.png', '扫描上方二维码，定制属于你的加薪计划吧！');
                    return false;
                }

                if(url == 'yearcelebration') {
                    setHtml('../bimages/indexIcon/1516082035.png', '扫描上方二维码，参与活动赚不停！');
                    return false;
                }

                if(url != undefined && url != null && url != '') {
                    if(url.indexOf('togetherhair') != -1) {//新春活动
                        setHtml('../bimages/indexIcon/1518313778.png', '扫描上方二维码，参与活动赚不停！');
                        return false;
                    }

                    if(url.indexOf('currentstock') != -1) {//获取转换量
                        setHtml('../bimages/indexIcon/1518337151.png', '扫描上方二维码，参与活动赚不停！');
                        return false;
                    }
                }

                if(url != undefined && url != null && url != '') {
                    window.location.href = url;
                } else {

                }
            });
            var uid = sessionStorage.getItem('uid');
            var loginToken = sessionStorage.getItem('loginToken');
            var banner = {};
            if(uid != undefined && uid != null && uid != '' && loginToken != undefined && loginToken != null && loginToken != '') {
                banner.text = '进入账户';
                banner.html = '';
                banner.class1 = 'user';
            } else {
                banner.text = '立即注册';
                banner.html = '<div class="indexBanner-Bottom">' +
                '<div class="index-banner-Text4">已有账户？</div>' +
                '<a href="javascript:;" class="indexBtnLogin">立即登录</div>' +
                '</div>';
                banner.class1 = '';
            }
            var _banner = '' +
                '<div class="index-banner">' +
                '<div class="index-banner-opacity"></div>' +
                    '<div class="index-contentBanner">' +
                        '<div class="index-banner-Text1">历史年化收益率</div>' +
                        '<div class="index-banner-Text2">8.3<span>%~</span>12<span>%</span></div>' +
                        '<div class="index-banner-Text3">' +
                            '<div class="index-banner-Text3-div">' +
                                '<div class="index-banner-Text3-icon1"></div>' +
                                '<div class="index-banner-Text3-Txt">银行存管</div>' +
                            '</div>' +
                            '<div class="index-banner-Text3-div">' +
                                '<div class="index-banner-Text3-icon2"></div>' +
                                '<div class="index-banner-Text3-Txt">分散投资</div>' +
                            '</div>' +
                        '</div>' +
                        '<a href="javascript:;" class="indexBannerBtn ' +  banner.class1 + '">' + banner.text + '</a>' + banner.html +
                        //'<div class="indexBanner-Bottom">' +
                        //    '<div class="index-banner-Text4">已有账户？</div>' +
                        //    '<a href="javascript:;" class="indexBtnLogin">立即登录</div>' +
                        //'</div>' +
                    '</div>' +
                '</div>';
            $banner.append(_banner);
            //点击立即登录
            $('.indexBtnLogin').click(function() {
                window.location.href = Setting.staticRoot + '/bpage/login.html';
            });

            //点击立即注册
            $('.indexBannerBtn').click(function() {
                if($(this).hasClass('user')) {
                    window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=01';
                } else {
                    //window.location.href = Setting.staticRoot + '/bpage/landing-regist.html';
                    //测试
                    //window.location.href = 'https://hlw-uat.chinazyjr.net/html/1LoginRegister/login.html?fromHeader=1';
                    //正式
                    window.location.href = 'https://www.haolyy.com/html/1LoginRegister/login.html';
                }
               //window.location.href = Setting.staticRoot + '/bpage/landing-regist.html';
            })

        } else {
            alert(res.message);
        }
    }).fail(function(){
        alert('网络异常');
        return false;
    });
    //../bimages/indexIcon/1512463498.png
    function setHtml(imgsrc, htmlText) {
        var _html = '';
        _html = _html + '' +
        '<div class="index-dialog">' +
        '<div class="index-dialog-background"></div>' +
        '<div class="index-dialog-box">' +
        '<a class="index-dialog-close" href="javascript:;"></a>' +
        '<div class="index-dialog-div">' +
        '<div class="index-dialog-icon">' +
        '<img src="' + imgsrc + '">' +
        '</div>' +
        '<div class="index-dialog-text">' + htmlText + '</div>' +
        '</div>'+
        '</div>' +
        '</div>' +
        '';
        var $body = $('body');
        $body.append(_html);
        var $dialogBox = $('.index-dialog-box');
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var diaWidth = $dialogBox.width();
        var diaHeight = $dialogBox.height();
        $dialogBox.css({'top': ((windowHeight - diaHeight) / 2) + 'px', 'left':((windowWidth - diaWidth) / 2) + 'px'})
        $body.css({"overflow":"hidden","height":"100%"});
        $('.index-dialog-close').click(function() {
            $('.index-dialog').remove();
            $("body").css({"overflow":"auto"});
        });
        return false;
    }

    //购买产品
    $.ajax({
        url: Setting.apiRoot1 + '/queryInvestPageInfoPC.p2p',
        type: 'post',
        dataType: 'json',
        data:{
            week14:'1'
        }
    }).done(function(res) {
        if(res.code == 1) {

            var data = res.data;

            //新手标
            var newProdListDetail = data.mapNewprodList2.newProdListDetail;

            //周周涨
            var currentListDetail = data.currentList.currentListDetail;

            //定期
            var regularListDetail = data.regularList.regularListDetail;

            productHtml(newProdListDetail,'newPeople','../images/pages/index/newPeople.png', $('.newProdListDetail'));
            productHtml(currentListDetail,
                'currentBox','../images/pages/index/currentBox.png',
                $('.buyCurrent'),
                ['../images/pages/index/1@3x.png',
                    '../images/pages/index/2@3x.png',
                    '../images/pages/index/3@3x.png',
                    '../images/pages/index/4@3x.png'],
            ['灵活赎回','分散投资','当日计息','提现实时到账']);
            productHtml(regularListDetail,'floatBox','../images/pages/index/floatBox.png',
                $('.buyFloat'),['../images/pages/index/5@3x.png',
                    '../images/pages/index/2@3x.png',
                    '../images/pages/index/3@3x.png'],
                ['每周派息','分散投资','T+1日计息']);
            pageFunction();
            activeIsShow();
            //新手标判断2为2周可以买，4为4周可以买
            if(newProd == 2) {
                $('.newBuy1').addClass('notBuy').html('已购买')
            }

            if(newProd == 4) {
                $('.newBuy0').addClass('notBuy').html('已购买')
            }
            //判断是否是已售罄
            var $currentBuyButton = $('.buyCurrent .buybtn');
            var isNBuy = $currentBuyButton.hasClass('nBuy');
            if(!isNBuy) {
                currentTime();
            } else {
                $currentBuyButton.addClass('nBuy').html('今日已售罄，明天再来吧')
            }
        } else {
            alert(res.message);
            return false;
        }
    }).fail(function() {
        alert('网络异常');
        return false;
    });

    function productHtml(data,leftClass,imgIon,$buyHtml,imgArr,textArr) {
        var _newProdHtml = '';

        for(var i = 0; i < data.length; i ++) {
            if(data[i].loanCycle == 3 || data[i].loanCycle == 14) {
                if(data[i].loanCycle == 14) {
                    var _addRate = 0;
                    if(data[i].addRate != undefined && data[i].addRate != null && data[i].addRate != '') {
                        _addRate = parseFloat(data[i].addRate);
                    }
                    _newProdHtml = _newProdHtml + '<div class="buyDivox first" levelRate=' + (parseFloat(data[i].maxRate) + _addRate) + ' loanCycle="' + data[i].loanCycle + '" style="display: none;">';//
                } else {
                    _newProdHtml = _newProdHtml + '<div class="buyDivox first" loanCycle="' + data[i].loanCycle + '" addRate="' + (data[i].addRate + data[i].maxRate) + '" style="display: none;">';
                }
            } else {
                _newProdHtml = _newProdHtml + '<div class="buyDivox first" loanCycle="' + data[i].loanCycle + '">';
            }

            _newProdHtml = _newProdHtml + '<div class="buy-box-left ' + leftClass + '"><div class="buy-box-top">';
            var _topHtml = '';
            var _bottomHtml = '';
            var _addrateHtml = '';
            var buyStatus = '';
            var newIcon = '';
            var _imgArr = '';
            var _newHtml = '';
            var _newHmlIcon = '';
            if(leftClass == 'newPeople') {
                newIcon = '<div class="newIcon newIcon' + i + '"></div>';
            } else {
                newIcon = '';
            }
            if(i == 0){
                if(leftClass == 'newPeople') {

                    _newHmlIcon = _newHmlIcon + '' +
                    '<div class="newPeopleLeftDiv"></div>';

                    _topHtml = '<div class="buyReturnMonery"></div><img src="' + imgIon + '" class="buy-name1">';
                    _bottomHtml = '' +
                    //'<div class="buy-button1">' +
                    //'<div class="buy-button1-text1">12<a>%</a></div>' +
                    //'<div class="buy-button1-text2">预期年化</div>' +
                    //'</div>' +
                    '<div class="buy-button1">' +
                    '<div class="buy-button1-text1">1446<a>元</a></div>' +
                    '<div class="buy-button1-text2">新手红包最高可得</div></div>' +
                    '<div class="buy-button1">' +
                    '<div class="buy-button1-text1">3010<a>元</a></div><div class="buy-button1-text2">红包+收益最高可得</div></div>' + _newHmlIcon;
                } else {
                    if(i == 0) {
                        _topHtml= '<div class="buycurrentMonery"><img src="' + imgIon + '" class="buy-name2"></div>';
                        for(var j = 0; j < imgArr.length; j++) {
                            _imgArr = _imgArr + '<div class="currentBox1">' +
                            '<div class="currentDivImg1"><img src="' + imgArr[j] + '" class="currentImg1"></div>' +
                            '<div class="currentDivText1"><div class="currentText1">' + textArr[j] + '</div></div>' +
                            '</div>';

                        }

                        _bottomHtml = _imgArr;
                    } else {
                        _topHtml = '<div class="buy-box-top"></div>';
                        _bottomHtml = '<div class="buy-box-button"></div>'
                    }



                }
            }//
            if(leftClass != 'currentBox') {
                if(data[i].addRate == 0 ) {
                    if(data[i].addInterestLabel != undefined && data[i].addInterestLabel != null && data[i].addInterestLabel != '') {
                        _addrateHtml = '<div class="buy-box-center-left-top">' + parseFloat(data[i].minRate).toFixed(2) + '%<a>' + data[i].addInterestLabel + '</a></div>';
                    } else {
                        _addrateHtml = '<div class="buy-box-center-left-top">' + parseFloat(data[i].minRate).toFixed(2) + '%</div>';
                    }
                } else {
                    if(data[i].addInterestLabel != undefined && data[i].addInterestLabel != null && data[i].addInterestLabel != '') {
                        _addrateHtml = '<div class="buy-box-center-left-top">' + parseFloat(data[i].maxRate).toFixed(2) + '%<a>+' + parseFloat(data[i].addRate).toFixed(2) + '%</a><a>' + data[i].addInterestLabel + '</a></div>';
                    } else {
                        _addrateHtml = '<div class="buy-box-center-left-top">' + parseFloat(data[i].maxRate).toFixed(2) + '%<a>+' + parseFloat(data[i].addRate).toFixed(2) + '%</a></div>';
                    }
                }
            } else {
                _addrateHtml = '<div class="buy-box-center-left-top">' + parseFloat(data[i].minRate).toFixed(2) + '%-' + parseFloat(data[i].maxRate).toFixed(2) + '%</div>';
            }


            //3和4未已售罄不可以购买点击
            if(data[i].buyStatus == 2) {
                if(leftClass == 'newPeople') {
                    if(newProd == 0) {
                        buyStatus = ' <div class="buybtn notBuy" prodId="' + data[i].prodId + '" >已购买</div>';
                    } else {
                        buyStatus = ' <div class="buybtn newBuy' + i + '" prodId="' + data[i].prodId + '" >立即抢购</div>';
                    }

                } else {
                    buyStatus = ' <div class="buybtn" investTerm="' + data[i].investTerm + '" prodId="' + data[i].prodId + '" >立即抢购</div>';
                    if(leftClass == 'currentBox') {
                        buyStatus = ' <div class="buybtn" investTerm="周周涨" prodId="' + data[i].prodId + '" >立即抢购</div>';
                    }
                    if(leftClass == 'floatBox') {
                        var investTerm = data[i].investTerm;
                        var userId = sessionStorage.getItem('uid');

                        if(investTerm.indexOf('3周') != -1 && (data[i].addRate + data[i].minRate) != 14) {
                            if(userId != undefined && userId != null && userId != '') {
                                $.ajax({
                                    url: Setting.apiRoot1 + '/u/checkUser3Week.p2p',
                                    type: 'post',
                                    async:false,
                                    dataType: 'json',
                                    data: {
                                        userId:userId,
                                        loginToken:sessionStorage.getItem('loginToken')
                                    }
                                }).done(function(res1) {
                                    if(res1.code == 1) {
                                        var week3 = res1.data.week3;
                                        if(week3 == 1) {
                                            var week3Level10000 = res1.data.week3Level10000;
                                            var week3Level30000 = res1.data.week3Level30000;
                                            var week3Level50000 = res1.data.week3Level50000;
                                            if(week3Level10000 == 0 && week3Level30000 == 0 && week3Level50000 == 0) {
                                                buyStatus = ' <div class="buybtn nBuy" message="每一个金额档次只能投资一次，请勿重复购买" investTerm="' + data[i].investTerm + '" prodId="' + data[i].prodId + '" >立即抢购</div>';
                                            } else {
                                                _weeks = 1;
                                            }
                                        } else {
                                            buyStatus = ' <div class="buybtn nBuy" message="您不符合购买条件，详情请参照“3周专享活动”规则" investTerm="' + data[i].investTerm + '" prodId="' + data[i].prodId + '" >立即抢购</div>';
                                        }
                                    }
                                }).fail(function() {
                                    alert('网络连接失败！');
                                    return false;
                                });
                            }
                        }
                    }

                }

            } else {
                buyStatus = ' <div class="buybtn nBuy" prodId="' + data[i].prodId + '" message="今日已售罄，明天再来吧">已售罄</div>';
            }

            if(leftClass == 'newPeople') {
                _newHtml = _newHtml +
                '<div class="newPeopleDiv">' +
                '<div class="newPeopleDiv-box' + i + '"></div>' +
                '</div>';
            }

            _newProdHtml = _newProdHtml + _topHtml +  '</div>' +
            '<div class="buy-box-button">' + _bottomHtml +
            '</div></div>' +
            '<div class="buy-box-center">' +
            '<div class="buy-box-center-left">' + _addrateHtml +
            ' <div class="buy-box-center-left-bottom">历史年化收益率</div>' +
            '</div>'+
            '<div class="buy-box-center-right">' +
            '<div class="buy-box-center-left-top">' + data[i].investTerm + '</div>' +
            '<div class="buy-box-center-left-bottom">投资期限</div>' +
            '</div>' +
            '</div>' +
            '<div class="buy-box-right">' +
            '<a href="javascript:;">' + buyStatus +
            '</a>' + newIcon +
            '</div>' + _newHtml ;
            _newProdHtml = _newProdHtml + '</div>';
        }

        $buyHtml.html(_newProdHtml);
    }

    //判断活动的周期是否隐藏或者显示

    function activeIsShow() {
        if(sessionStorage.getItem('uid') != undefined && sessionStorage.getItem('uid') != null && sessionStorage.getItem('uid') != '') {
            //$.ajax({
            //    url: Setting.apiRoot1 + '/u/queryUser14Week.p2p',
            //    type: 'post',
            //    dataType: 'json',
            //    data: {
            //        userId: sessionStorage.getItem('uid'),
            //        loginToken: sessionStorage.getItem('loginToken')
            //    }
            //}).done(function(res) {
            //    if(res.code == 1) {
            //        var _data = res.data;
            //        var levelRate = _data.levelRate;
            //        $("div[loancycle=14]").queue(function (res) {
            //            var levelRate1 = $(this).attr('levelRate');
            //            var maxPurchasedAmt = _data.maxPurchasedAmt;
            //            var purchasedAmt = _data.purchasedAmt;
            //            if(parseFloat(purchasedAmt) >= parseFloat(maxPurchasedAmt)) {
            //                if(levelRate == levelRate1) {
            //                    $(this).show();
            //                }
            //                $("div[loancycle=14]").hide().find('.buybtn').attr({'message':'可投额度不足'}).addClass('nBuy');
            //            } else {
            //                if(levelRate == levelRate1) {
            //                    $(this).show();
            //                }
            //            }
            //
            //        });
            //    } else {
            //        //if(res.code != -4 && res.code != -3 && res.code != -99) {
            //        //    alert(res.message);
            //        //    return false;
            //        //}
            //    }
            //}).fail(function() {
            //    //alert('网络连接失败');
            //    //return false;
            //});

            $.post(Setting.apiRoot1 + '/u/queryUser14WeekExt.p2p',
                {userId: sessionStorage.getItem('uid'),loginToken: sessionStorage.getItem('loginToken')},
            function(res) {
                if(res.code == 1) {
                    var _data = res.data;
                    var levelRate = _data.levelRate;
                    $("div[loancycle=14]").queue(function () {
                        var levelRate1 = $(this).attr('levelRate');
                        var maxPurchasedAmt = _data.maxPurchasedAmt;
                        var purchasedAmt = _data.purchasedAmt;
                        if(parseFloat(purchasedAmt) >= parseFloat(maxPurchasedAmt)) {
                            if(levelRate == levelRate1) {
                                $(this).show();
                            }
                            $("div[loancycle=14]").hide().find('.buybtn').attr({'message':'可投额度不足'}).addClass('nBuy');
                        } else {
                            if(levelRate == levelRate1) {
                                $(this).show();
                            }
                        }
                    });
                } else {
                    //if(res.code != -4 && res.code != -3 && res.code != -99) {
                    //    alert(res.message);
                    //    return false;
                    //}
                }
            },'json'
            )

            //3周是否可以购买 _weeks
            $('div[loancycle=3]').queue(function() {
                var _addrate = $(this).attr('addrate');
                if(_addrate == 14) {
                    $.post(Setting.apiRoot1 + '/u/currentStockValidator.p2p',
                        {userId: sessionStorage.getItem('uid'),loginToken: sessionStorage.getItem('loginToken')},
                        function(res) {
                            if(res.code == 1) {
                                var _data = res.data;
                                if(_data == 1) {
                                    $('div[addrate=14]').show();
                                    //$(this).css({'display':'block'});
                                }
                            } else {
                                if(res.code != -99) {
                                    alert(res.message);
                                    return false;
                                }
                            }
                        },'json'
                    )
                } else {
                    if(_weeks == 1) {
                        $(this).show();
                    }
                }
            });
        }
    }
});

function pageFunction() {
    var $newIcon = $('.newIcon');//鼠标移入或者点击立即分享按钮（在新手标里的分享按钮）
    var $iconBack = $('.iconBack');//立即分享二维码
    var $buybtn = $('.buybtn');//鼠标移入或者点击立即抢购按钮

    var _iconBack = '<div class="iconBack">' +
        '<div class="iconBack-box">' +
        '<div class="iconBack-title">微信分享</div>' +
        '<div class="iconCodeDiv">' +
        '<img src="../images/pages/index/invalid-namecode@3x.png" class="iconBackImg">' +
        '</div>' +
        '<div class="iconText">手机扫描上方二维码，即可通过微信分享，享有好友投资分红</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    //鼠标移入（立即分享）
    $newIcon.on('click, mouseover',function() {
        //$iconBack.show();
        $(this).html(_iconBack);
    });

    //鼠标移出（立即分享）
    $newIcon.mouseout(function() {
        //$iconBack.hide();
        $(this).html('');
    });

    //鼠标移入或者点击立即抢购按钮
    $buybtn.on('mouseover', function() {
        if($(this).hasClass('nBuy')) {
            return false;
        }
        if($(this).hasClass('notBuy')) {
            return false;
        }
        $(this).css({'background':'#fd546c','color':'#ffffff'});
    });

    //鼠标移出（立即立即抢购按钮）
    $buybtn.mouseout(function() {
        if($(this).hasClass('nBuy')) {
            return false;
        }//notBuy
        if($(this).hasClass('notBuy')) {
            return false;
        }
        $(this).css({'background':'#ffffff','color':'#fd546c'});
    });

    //点击立即购买按钮
    $buybtn.click(function() {
        if($(this).hasClass('nBuy')) {
            var meaage = $(this).attr('message');
            alert(meaage);
            return false;
        }
        // $(this).css({'background':'#fd546c','color':'#ffffff'});
        var prodid = $(this).attr('prodid');
        //获取产品的ID
        var investterm = $(this).attr('investterm');
        //var userId = sessionStorage.getItem('uid');
        //周周涨活动
        if(investterm == '周周涨') {
            currentTime(true,prodid)
        } else {
            sessionStorage.setItem('prodid',prodid);
            window.location.href = Setting.staticRoot + '/bpage/buy.html';
        }
    })
}

function currentTime(isclick,prodid) {
    //判断是否是已售罄
    var $currentBuyButton = $('.buyCurrent .buybtn');
    var isNBuy = $currentBuyButton.hasClass('nBuy');
    if(!isNBuy) {
        /**
         * 周周涨进行时间的判断是否可以购买。
         * 字段：currentListDetail
         */
        $.ajax({
            url: Setting.apiRoot1 + '/checkHuoQiBuyStatus.p2p',
            type: 'post',
            dataType: 'json'
        }).done(function(res) {
            if(res.code == 1) {
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
                if(currentVoteAmt == 0) {
                    $currentBuyButton.addClass('nBuy').html('已售罄').attr({'message':'今日已售罄，明天再来吧'});
                }
                if(nowTime.getTime() < startTime.getTime()) {
                    isStart = true;
                }

                if(isStart) {
                    $currentBuyButton.addClass('nBuy').html('立即抢购').attr({'message':'客官，抢购10:00开始哦'});
                } else {
                    var endTime = new Date(_date + ' ' + currentEndTime);
                    if(nowTime.getTime() >= endTime.getTime()) {
                        isEnd = true;
                    }
                    if(isEnd) {
                        $currentBuyButton.addClass('nBuy').html('立即抢购').attr({'message':'今日已结束，明天再来吧'});
                    }
                }


                //判断是否点击
                if(isclick) {
                    if(isStart == false && isEnd == false && currentVoteAmt > 0) {
                        sessionStorage.setItem('prodid',prodid);
                        window.location.href = Setting.staticRoot + '/bpage/buy.html';
                    } else {
                        return false;
                    }
                }
            }
        }).fail(function() {
            alert('网络连接失败！');
            return false;
        });

    } else {
        $currentBuyButton.addClass('nBuy').html('今日已售罄，明天再来吧');
        return false;
    }
}