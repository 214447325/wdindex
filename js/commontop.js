/**
 * Created by User on 2017/6/8.
 * 公共使用的头部和底部
 */
$(function() {
    //获取域名
    //var host = window.location.host;
    //if((host.toString()).indexOf('vfint') != -1) {
    //    var paramter = window.location.href;
    //    var paramLength = paramter.indexOf('?');
    //    var pageName = location.pathname;
    //    var pageSub = '';
    //    if(paramLength != -1) {
    //        pageSub = paramter.substring(paramLength, paramter.length);
    //        window.location.href = 'http://www.wdclc.cn' + pageName + pageSub;
    //    } else {
    //        window.location.href = 'http://www.wdclc.cn' + pageName;
    //    }
    //}

    //var host = window.location.host;
    //if((host.toString()).indexOf('120.25.226.224:8080') != -1) {
    //    var paramter = window.location.href;
    //    var paramLength = paramter.indexOf('?');
    //    var pageName = location.pathname;
    //    var pageSub = '';
    //    if(paramLength != -1) {
    //        pageSub = paramter.substring(paramLength, paramter.length);
    //        window.location.href = 'http://www.wdclc.cn' + pageName + pageSub;
    //    } else {
    //        window.location.href = 'https://teststatic.wdclc.cn/wx/pages/';
    //    }
    //}





    var $body = $('.body');
    //图片
    var _imgUrl =  '../images/pages/in-head-dhx1.png';
    var imgUrl = '<img src='+_imgUrl+' class="index-div-header-img3">';

    //用户登录名（未登录是登录/注册,登录是用户的昵称）
    var nickName = '登录/注册';
    var sessionNickName = sessionStorage.getItem('nickName');
    var uname = sessionStorage.getItem('uname');
    var nick = ['登录','注册'];
    var nickUrl =['../bpage/login.html','https://www.haolyy.com/html/1LoginRegister/login.html'];

    if(sessionNickName != undefined && sessionNickName != null && sessionNickName != '') {
        nickName = sessionNickName;
        nick = ['账户中心', '安全退出'];
        nickUrl = ['../bpage/account.html', '#'];
    } else {
        if(uname != undefined && uname != null && uname != '') {
            nickName = uname.substring(0,3) + '***' + uname.substr(uname.length-4, 4);
            nick = ['账户中心', '安全退出'];
            nickUrl = ['../bpage/account.html', '#'];
        }
    }

    sessionStorage.setItem('nickUserName',nickName);



    //标题的头
    var top = '<div class="titleTop">' +
        '<div class="top" id="top">' +
        '<div class="index-div-header-div1">' +
        '<div class="log"></div>' +
        '<div class="logContent">' +
        '<div class="financial">V金融</div>' +
        '<div class="dream">V梦想投资</div>' +
        '</div>' +
        '</div>' +
        '<div class="head">' +
        '<a href="javascript:;">' +
        '<ul class="header-ul header-ulOne"><span style="color: #555555" class="fush full">首页</span>' +
        '<li class="header-li slider header-ulOne-li">' + imgUrl +
        '</li>' +
        '</ul>' +
        '</a>' +
        '<ul class="header-ul header-ultwo">' +
        '<a href="javascript:;">' +
        '<div class="click">' +
        '<span class="header-span-ultwo "><span style="color: #555555" class="fush">关于我们</span><img src="../images/pages/in-head-x1.png" class="upHImg"></span>' +
        '<li class="header-li slider gener header-ultwo-li"></li>' +
        '</div>' +
        '</a>' +
        '<div class="header-ultwo-div">' +
        '<a href="#" class="instruction genclick index-c7" name="7">' + '平台介绍' + '</a>' +

        '<a href="#" class="instruction genclick index-c2" name="2">' + '媒体报道' + '</a>' +

        '<a href="#" class="instruction genclick index-c3" name="3">' + '常见问题' + '</a>' +

        '<a href="#" class="instruction genclick index-c4" name="4">' + '联系我们' + '</a>' +

        '<a href="#" class="instruction genclick index-c5" name="5">' + '免责声明' + '</a>' +
        '</div>' +
        '</ul>' +
        //'<a href="../pages/general.html?pages=6" class="index-c6">' +
        //'<ul class="header-ul header-ulFour"><span style="color: #555555" class="fush">业务模式</span>' +
        //'<li class="header-li slider header-ulFour-li"></li>' +
        //'</ul>' +
        //'</a>' +
        '<ul class="header-ul header-ulFive"><span style="color: #555555" class="fush">' + nickName + '<img src="../images/pages/in-head-x1.png" class="imgNick"></span>' +
        '<li class="header-li slider logdiv header-ulFive-li"></li>' +
        '<div class="log_div">' +
        '<li class="logl first_li">' +
        '<a href='+nickUrl[0]+'>'+nick[0]+'</a>' +
        ' </li>' +
        '<li class="first_li_img">' +
        '<img src="../images/pages/in-head-li1.png" class="index-div-header-img6">' +
        '</li>' +
        '<li class="logl two_li"><a href='+nickUrl[1]+' class="exit">'+nick[1]+'</a></li>' +
        '</div>' +
        '</ul>' +
        '<a href="javascript:;">' +
        '<ul class="header-ul header-ulSix rech"><span style="color: #555555" class="fush">充值</span>' +
        '<li class="header-li slider header-ulSix-li"></li>' +
        '</ul>' +
        '</a>' +
        '</div>' +
        '</div>' +
        '</div>';
    $('.titleTop').append(top);
    $body.before(top);
    //标题的尾
    var bottom = '<div class="bottom-nav">' +
                 '<div class="index-footer">' +
                '<div class="index-footer-div">' +
                '<table class="index-footer-table">' +
                '<tr class="index-footer-tr">' +
                '<td class="index-footer-td01">' +
                '<div class="index-footer-td01-div">' +
                '<a href="#" class="instruction index-c2" name="2">' +
                '<span class="index-footer-1" style="color: #ffffff">媒体报道</span>' +
                '</a>' +
                '<span class="index-footer-fg">|</span>' +
                '<a href="#" class="instruction index-c3" name="3">' +
                '<span class="index-footer-1" style="color: #ffffff">常见问题</span>' +
                '</a>' +
                '<span class="index-footer-fg">|</span>' +
                '<a href="#" class="instruction index-c4" name="4">' +
                '<span class="index-footer-1" style="color: #ffffff">联系方式</span>' +
                '</a>' +
                '<span class="index-footer-fg">|</span>' +
                '<a href="#" class="instruction index-c5" name="5">' +
                '<span class="index-footer-1" style="color: #ffffff">免责声明</span>' +
                '</a>' +
                '</div>' +
                //'<div class="index-footer-td01-div">' +
                //'<a href="../pages/general.html?pages=6" class="instruction">' +
                //'<span class="index-footer-1" style="color: #ffffff">业务模式</span>' +
                //'</a>' +
                //'<span class="index-footer-fg">|</span>' +
                //'<a href="javascript:;" class="rech">' +
                //'<span class="index-footer-1" style="color: #ffffff">充值</span>' +
                //'</a>' +
                //'</div>' +
                '<div class="index-footer-td01-div02">' +
                '<span>V金融提醒您: 市场有风险,投资需谨慎</span><br>' +
                '<span class="index-footer-td01-p02">预期或测算收益不等于实际收益</span>' +
                '</div>' +
                '</td>' +
                '<td class="index-footer-td02">' +
                '<img src="../images/pages/footerfg.png" class="index-footer-td02-img1">' +
                '</td>' +
                '<td class="index-footer-td03">' +
                '<!--下载APP-->' +
                '<img src="../images/pages/xiazaiApp.png" class="index-footer-td02-img2">' +
                '<div class="index-footer-td03-content">' +
                '<span>下载APP</span>' +
                '</div>' +
                '</td>' +
                '<td class="index-footer-td04">' +
                '<div class="index-footer-td04-div">' +
                '<img src="../images/pages/guanzhu.png" class="index-footer-td02-img3">' +
                '<div class="index-footer-td03-content">' +
                '<span>关注微信理财号</span>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '<td class="index-footer-td02">' +
                '<img src="../images/pages/footerfg.png" class="index-footer-td02-img1">' +
                '</td>' +
                '<td class="index-footer-td04">' +
                '<div class="index-footer-td04-div1">' +
                '<span class="index-footer-td04-span1">' +
                '客服电话: 4000-521-388' +
                '</span>' +
                '</div>' +
                '<br>' +
                '<div class="index-footer-td04-div2">' +
                '<span class="index-footer-td04-span2">' +
                ' 微信客服: 关注公众号V金融' +
                '</span>' +
                '</div>' +
                '<br>' +
                '<div class="index-footer-td04-div3">' +
                '<span class="index-footer-td04-span3">' +
                ' 周一至周日9:00-18:00' +
                '</span>' +
                '</div>' +
                '<br>' +
                '<div class="index-footer-td04-div4">' +
                '<span class="index-footer-td04-span4">' +
                '地址: 上海市杨浦区政府路18号<br>波司登国际大厦16层' +
                '</span>' +
                '</div>' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '<div class="index-footer-center">' +
                '<div class="footer">' +
                '<span class="index-footer-span">Copyright@2016-2019 上海赢祺来金融信息服务有限公司 沪ICP备16000210号-1</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
    $('.bottom-nav').append(bottom);
    $body.after(bottom);

    //页面头部的点击按钮
    $('.instruction').click(function() {
        var _name = $(this).attr('name');
        window.location.href = '../pages/general.html?pages=' + _name;
    });

    $('.exit').click(function() {
        var _href = $(this).attr('href');
        if(_href.indexOf('#') != -1) {
            sessionStorage.clear();
            window.location.reload(true);
        }
    });

    var url = window.location.href; //获取url中"?"符后的字串
    var param = {};
    if (url.indexOf("?") != -1) {
        var str = url.split('?')[1];
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            param[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
    }

    var $btnLogin = $('.btn-login');//注册按钮
    var $headerSpan = $('.header-span-ultwo');//点击关于我们下拉框
    var $headerDiv = $('.header-ultwo-div');//关于我们的下拉框
    var $logDiv = $('.log_div');//登录注册
    var $headerIm = $('.index-div-header-img2');//下拉列框图标
    var $btn = $('.in-btn');//点击马上赚钱按钮
    var $tc = $('.index-bounced');//弹窗按钮
    var $qd = $('.index-bounced-qd');//谈出框中的确定按钮
    var $headerOne = $('.header-ulOne');//控制首页切换
    var $recharge = $('.rech');//充值
    var $fush = $('.fush');//改变字体颜色

    var body = $('body');
    var isClickHeader = true;
    $headerDiv.hide();
    $tc.hide();

    var $headerUl = $('.header-ul');
    var $upHImg = $('.upHImg');
    var $imgNick = $('.imgNick');
    //鼠标移入标题栏
    $headerUl.mouseover(function() {
        $headerDiv.hide();
        $logDiv.hide();
        $fush.removeClass('full');
        $headerUl.find('.slider').html('');
        var $findSlider = $(this).find('.slider');
        $findSlider.parent().find('.fush').addClass('full');
        addFocus();
        //$upHImg.attr({'src':'../images/pages/in-head-y.png'});
        //关于我们
        if($findSlider.hasClass('gener')) {
            $headerDiv.show();
            $upHImg.attr({'src':'../images/pages/in-head-y.png'});
        } else {
            $headerDiv.hide();
            $upHImg.attr({'src':'../images/pages/in-head-x1.png'});
        }

        if($findSlider.hasClass('logdiv')) {
            $logDiv.show();
            $imgNick.attr({'src':'../images/pages/in-head-y.png'});
        } else {
            $logDiv.hide();
            $imgNick.attr({'src':'../images/pages/in-head-x1.png'});
        }
    });

    ////鼠标移出
    $headerDiv.mouseout(function() {
        $headerDiv.hide();
        $upHImg.attr({'src':'../images/pages/in-head-x1.png'});
    });
    //
    ////鼠标移出
    $logDiv.mouseout(function() {
        $logDiv.hide();
        $imgNick.attr({'src':'../images/pages/in-head-x1.png'});
    });

    //鼠标移出区域
    $headerUl.mouseout(function() {
        $headerDiv.hide();
        $logDiv.hide();
        $fush.removeClass('full');
        $headerUl.find('.slider').html('');
        $imgNick.attr({'src':'../images/pages/in-head-x1.png'});
        $upHImg.attr({'src':'../images/pages/in-head-x1.png'});
        addFocus();
    });

    //滚动滚动条隐藏
    $('.wra').scroll(function() {
        $headerDiv.hide();
        $logDiv.hide();
        $imgNick.attr({'src':'../images/pages/in-head-x1.png'});
        $upHImg.attr({'src':'../images/pages/in-head-x1.png'});
    });

    body.scroll(function() {
        $headerDiv.hide();
        $logDiv.hide();
        $imgNick.attr({'src':'../images/pages/in-head-x1.png'});
        $upHImg.attr({'src':'../images/pages/in-head-x1.png'});
    });

    //鼠标点击首页
    $headerOne.click(function() {
        window.location.href = '../pages/index.html';
    });

    $('.swiper-container').mouseover(function() {
        $('.index-div-header-img2').attr({'src': '../images/pages/in-head-x1.png'});
        $headerDiv.hide();
        $upHImg.attr({'src':'../images/pages/in-head-x1.png'});
    });

    $('.index-introduced').mouseover(function() {
        $headerDiv.hide();
        $headerIm.attr({'src':'../images/pages/in-head-x1.png'});
        $upHImg.attr({'src':'../images/pages/in-head-x1.png'});
    });


    ////点击关于我们控制下拉框
    $headerSpan.click(function() {
        if (isClickHeader) {
            $headerDiv.show();
            isClickHeader = false;
            $headerIm.attr({'src': '../images/pages/in-head-y.png'});
            $upHImg.attr({'src':'../images/pages/in-head-y.png'});
        } else {
            $headerDiv.hide();
            $upHImg.attr({'src':'../images/pages/in-head-x1.png'});
            $headerIm.attr({'src': '../images/pages/in-head-x1.png'});
            isClickHeader = true;
        }
    });

    $btn.click(function() {
        $tc.show();
    });

    $qd.click(function() {
        $tc.hide();
    });


    $headerUl.find('.slider').html('');
    $fush.removeClass('full');
    var _pages = param.pages;
    var _formPages = param.formPages;
    addFocus();
    function addFocus() {
        //平台资质
        if(_pages == 1) {
            $('.header-ulThree-li').html(imgUrl).parent().find('.fush').addClass('full');
        }

        //媒体报道
        if(_pages == 2 || _pages == 3 || _pages == 4 || _pages == 5 || _pages == 7) {
           $('.header-ultwo-li').html(imgUrl).parent().find('.fush').addClass('full');
        }

        //业务模式
        if(_pages == 6) {
            $('.header-ulFour-li').html(imgUrl).parent().find('.fush').addClass('full');
        }

        //首页
        if(url.indexOf('index.html') != -1) {
            $('.header-ulOne-li').html(imgUrl).parent().find('.fush').addClass('full');
        }

        //登录
        if((url.indexOf('login.html') != -1 || url.indexOf('landing-regist.html') != -1 || url.indexOf('account.html') != -1) && (_formPages != '02')) {
            $('.header-ulFive-li').html(imgUrl).parent().find('.fush').addClass('full');
        }

        //账户中心
        if(_formPages == 0) {
            $('.header-ulFive-li').html(imgUrl).parent().find('.fush').addClass('full');
        }

        //充值
        if(_formPages == '02') {
            $('.header-ulSix-li').html(imgUrl).parent().find('.fush').addClass('full');
        }

    }
    //点击充值按钮，如果未登录出现提示
    var _topUp = '<div class="top-up">' +
                    '<div class="alert-login-content">' +
                    '<div class="alertbox">' +
                    '<div class="top-up-title">温馨提示</div>' +
                    '<div class="top-up-content">您还未登录，是否去登录</div>' +
                    '<div class="top-up-button">' +
                    '<a href="javascript:;" class="nohref">' +
                    '<div class="no">否</div>' +
                    '</a>' +
                    '<a href="../bpage/login.html?formPages=02" class="yeshref">' +
                    '<div class="yes">是</div>' +
                    '</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
    //添加弹框
    body.after(_topUp);
    var userId = sessionStorage.getItem('uid');
    var $topUp = $('.top-up');//充值跳出的弹框
    var $nohref = $('.nohref');//点击否

    //点击充值按钮
    $recharge.click(function() {
        if(userId == undefined || userId == null || userId == '') {
            $topUp.show();
        } else {
            window.location.href = '../bpage/account.html?formPages=02'
        }
    });

    //点击否按钮
    $nohref.click(function() {
        $topUp.hide();
    });

    var loginToken = sessionStorage.getItem('loginToken');
    //每个页面都需要的弹框
    if(userId != undefined && userId != null && userId != '') {
        $.post(Setting.apiRoot1 + '/u/userCurrentTip.p2p',{userId:userId,loginToken:loginToken},function(res) {
            var code = res.code;
            if(code == 1) {
                var data = res.data;
                if(data == 1) {
                    var html = '<div class="t-banner">' +
                        '<div class="t-back"></div>' +
                        '<div class="t-div">' +
                            '<a href="javascript:;" class="close1"></a>' +
                            '<div>' +
                                '<div>' +
                                    '<p>尊敬的V粉，您好：</p>' +
                                    '<div>' +
                                        '<div>' +
                                            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                                                '因合规要求，平台接入银行存管后需对活期在投资金进行调整，' +
                                            '特推出<a>3周定期（14%年化收益）</a>产品，用户在活期产品赎回后即可购买。 ' +
                                        '</div>' +
                                        '<div><a href="javascript:;" class="lookrule3">查看规则</a></div>' +
                                        '<div><a href="javascript:;" class="tcurrent">活期赎回</a></div>' +
                                    '</div>' + '' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '</div>';
                    var $body = $('body');
                    $body.append(html);
                    $body.css({"overflow":"hidden","height":"100%"});
                    var $tdiv = $('.t-div');
                    var _tHeight = $tdiv.height();
                    var _height = $(window).height();
                    $tdiv.css({'top': ((_height - _tHeight) / 2) + 'px'});
                    $('.close1').click(function() {
                        $('.t-banner').remove();
                        $("body").css({"overflow":"auto"});
                    });

                    $('.tcurrent').click(function() {
                        $('.t-banner').remove();
                        window.location.href = Setting.staticRoot + '/bpage/account.html?formPages=01&formType=1';
                    });

                    $('.lookrule3').click(function() {
                        $('.t-banner').remove();
                        setHtml(Setting.staticRoot + '/bimages/indexIcon/1515669390.png','扫描上方二维码，定制属于你的加薪计划吧！');
                    });
                }
            } else {
                //alert(res.message);
                //return false;
            }
        },'json');
    }

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
    }
});

