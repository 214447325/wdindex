/**
 * Created by User on 2017/10/23.
 */
$(function() {

    var uid = sessionStorage.getItem('uid');
    var loginToken = sessionStorage.getItem('loginToken');

    Vue.component('lucky', {
        props: ['count','monery'],
        template: '<div>本期剩余抽奖券张数：<a>{{count}}</a>张（投资满<a>{{monery}}</a>万元）</div>{{firstName}}'
    });

    Vue.component('listname',{
        props:['lists'],
        template:'<table><tr><th>排名</th><th>姓名</th><th>手机号</th><th>抽奖券张数</th></tr>' +
        '<tr v-for="list in lists"><td>第{{list.rank}}名</td><td>{{list.name}}</td><td>{{list.phoneNum}}</td><td>{{list.drawNum}}张</td></tr></table>'
    });

    var lucky = new Vue({
        el:'#lucky',
        data: {
            mainText:'',
            count:0,
            monery:0,
            div3w:{'width':0},
            div2p:{'padding-left':0},
            div2:'',
            uid:uid,
            nper:0,
            share:{'display':'none'},
            temHtml:'',
            lists:[]
        },
        methods: {
            //初始化方法
            luckyInit:function() {
                //控制进度条
                $.ajax({
                    url: Setting.apiRoot1 + '/luckyDraw/currentCycleInfo.p2p',
                    type: 'post',
                    dataType: 'json'
                }).done(function(res) {
                    if(res.code == 1) {
                        var _data = res.data;
                        //当前是第几期
                        lucky.mainText = '第' + _data.currentCycle + '期';
                        lucky.nper = _data.currentCycle;
                        //抽奖次数
                        lucky.count = _data.differenceOfCurrentCycle;
                        lucky.monery = _data.differenceOfCurrentCycle;
                        //控制进度条
                        changeText(parseInt(80 - (_data.differenceOfCurrentCycle)));
                    } else {
                        alert(res.message);
                        return false;
                    }
                }).fail(function() {
                    alert('网络连接失败！');
                    return false;
                });

                //榜单名次
                $.ajax({
                    url: Setting.apiRoot1 + '/luckyDraw/currentCycleDrawRankInfo.p2p',
                    type: 'post',
                    dataType: 'json'
                }).done(function(res) {
                    if(res.code == 1) {
                        var _data = res.data;
                        //榜单
                        lucky.lists = _data;

                    } else {
                        alert(res.message);
                        return false;
                    }
                }).fail(function() {
                    alert('网络连接失败！');
                    return false;
                });

                //判断该用户是否登录
               if(uid != undefined && uid != null && uid != '') {
                   //查看该用户的排名
                   $.ajax({
                       url: Setting.apiRoot1 + '/luckyDraw/u/userCurrentCycleDrawRankInfo.p2p',
                       type: 'post',
                       async:false,
                       dataType: 'json',
                       data:{
                           userId:uid,
                           loginToken:loginToken
                       }
                   }).done(function(res) {
                       if(res.code == -99) {
                           lucky.temHtml = '<a href="javascript:;" @click="login">登录后</a>可查看您的排名';
                           return false;
                       }
                       if(res.code == 1) {
                            var rank = res.data.rank;
                           if(rank == 0) {
                               lucky.temHtml = '您当前暂无排名，快去投资，榜上留名吧';
                           }

                           if(rank == 1) {
                               lucky.temHtml = '您当前排名为第1名，秒杀众生';
                           }

                           if(rank != 0 && rank != 1 && rank != undefined && rank != null && rank != '') {
                               lucky.temHtml = '您当前排名为第' + rank + '名，向冠军进发吧';
                           }
                       } else {
                           alert(res.message);
                           return false;
                       }

                   }).fail(function() {
                        alert('网络连接失败！');
                       return false;
                   });
               }
            },
            //点击活动规则
            onRules:function() {
                alert1.alertshow = {'display':'block'};
                var topHeight = $(window).height();
                var h = (topHeight - (625)) / 2;
                if(h <= 0) {
                    h = 100;
                }
                $('.divalert .alertbox .alertclose').css({'marginTop': h + 'px'});
                $("body").css({"overflow":"hidden","height":"100%"});
            },
            //鼠标移入立即分享
            mousemovefun:function() {
                lucky.share = {'display':'block'};
            },
            //鼠标移出立即分享
            mouseoutfun:function() {
                lucky.share = {'display':'none'};
            },
            //点击往期获奖名单
            loockperiod:function() {
                if(uid == undefined || uid == null || uid == '') {
                    Common.toLogin();
                    return false;
                }


                if(lucky.nper == 1) {
                    alert('第一期未满标，暂无法查看');
                    return false;
                }

                $.ajax({
                    url: Setting.apiRoot1 + '/luckyDraw/u/historicalReward.p2p',
                    type: 'post',
                    async:false,
                    dataType: 'json',
                    data:{
                        userId:uid,
                        loginToken:loginToken
                    }
                }).done(function(res) {
                    if(res.code == -99) {
                        Common.toLogin();
                        return false;
                    }
                    if(res.code == 1) {
                        $('.alertcontenttable').animate({scrollTop:0},1000);
                        alert2.alertshow = {'display':'block'};
                        var topHeight = $(window).height();
                        var h = (topHeight - (625)) / 2;
                        if(h <= 0) {
                            h = 100;
                        }
                        $('.divalert .alertbox .alertclose').css({'marginTop': h + 'px'});
                        $("body").css({"overflow":"hidden","height":"100%"});
                        var _data = res.data;
                        alert2.alertlist = _data;
                    } else {
                        alert(res.message);
                        return false;
                    }
                }).fail(function() {
                   alert('网络连接失败');
                    return false;
                });

            },
            //点击抽奖
            clickraffle:function() {
                window.location.href = 'https://www.yizhibo.com/l/AvjdJaYe6jLs3fdT.html';
                //if(lucky.nper == 1) {
                //
                //    return false;
                //}
            },
            //点击立即参赛投资按钮
            onclick:function() {
                window.location.href = Setting.staticRoot + '/pages/index.html';
            }
        }
    });

    lucky.luckyInit();
    var _temHtml = '';

    if(uid != undefined && uid != null && uid != '') {
        _temHtml = '<div class="main5my">' + lucky.temHtml + '</div>';
    } else {
        _temHtml = '<div class="main5my"><a href="javascript:;" @click="login">登录后</a>可查看您的排名</div>';
    }

    Vue.component('main5my', {
        template: _temHtml,
        methods: {
            login:function() {
                Common.toLogin();
                return false;
            }
        }
    });

    //进度条填充
    function changeText(n) {
        if(n != 0 && n != 80) {
            lucky.div2 = n + '张';
        }
        lucky.div3w = {'width' : ( parseInt(((n/80)*100)) + '%')};
        lucky.div2p = {'padding-left': (parseInt(((n/80)*100)) + '%')};
    }

    var alert1 = new Vue({
        el:'#alert1',
        data:{
            alertshow:{
                'display':'none'
            }
        },
        methods:{
            onClose:function() {
                alert1.alertshow = {'display':'none'};
                $("body").css({"overflow":"auto"});
            }
        }
    });
    var alert2 = new Vue({
        el:'#alert2',
        data:{
            alertshow:{
                'display':'none'
            },
            alertlist:[]
        },
        methods:{
            onClose:function() {
                alert2.alertshow = {'display':'none'};
                $("body").css({"overflow":"auto"});
            }
        }
    });
});