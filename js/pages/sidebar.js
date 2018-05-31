/**
 * Created by User on 2016/9/29.
 */
$(function() {
    var $current = $('.current1');//周周涨按钮
    var $pub = $('.pub');
    var $tearm = $('.tearm1');//定期按钮
    var $float = $('.float1');//浮动收益按钮
    var $select = $('.select');//点击选择产品的按钮
    var $currentMoney = $('.currentMoney');//周周涨购买金额
    var $currentDays = $('.currentDays');//周周涨天数
    var $currentExpected = $('.currentExpected');//周周涨预期收益填写
    var $backtop = $('.backtop');//点击返回按钮
    var $sel = $('.sel');//控制选择产品
    var money = 0;
    var isSelsect = true;

    $(window).scroll(function() {
        var st = $(this).scrollTop();
        if (parseInt(st) > 200) {
            $backtop.show();
        } else {
            $backtop.hide();
        }
    });

    //周周涨触发
    $currentMoney.on('keyup',function() {
        currentCalculate()
    });

    $currentDays.on('keyup',function() {
        currentCalculate()
    });

    //周周涨计算
    function currentCalculate() {
        var _cMoney = $currentMoney.val();
        var _cDays = $currentDays.val();
        var _m = 0;
        var _arr = [];
        if(_cMoney != null && _cDays != null && _cMoney != 0 && _cDays != 0) {
            var arrdar = [8.88,8.98,9.10,9.24,9.42,9.62,9.87,10.17,10.53,10.96,11.48,12.08];
            if(_cDays > 7) {
                var _day = parseInt(_cDays / 7);
                if(_day == 0) {
                    _day = 1;
                }
                var _ds = _cDays % 7;
                for(var i = 0; i < _day; i++) {
                    if(arrdar[i] != undefined && arrdar[i] != null && arrdar[i] != '') {
                        _arr.push(arrdar[i]);
                    } else {
                        _arr.push(12.08);
                    }
                    _m = _m + parseFloat(( _cMoney*(_arr[i])/100/365*7));
                }
                if(_ds != 0) {
                    if(arrdar[_day] != undefined && arrdar[_day] != null && arrdar[_day] != '') {
                        _arr.push(arrdar[_day]);
                    } else {
                        _arr.push(12.08);
                    }
                    var _le = parseInt(_day);
                    _m = _m + parseFloat(( _cMoney*(_arr[_le])/100/365*(_ds)));
                }
            } else {
                _m = _m + parseFloat(( _cMoney*8.88/100/365*(_cDays)));
            }
            $currentExpected.html(parseFloat(_m).toFixed(2));
        } else {
            $currentExpected.html('0');
        }
    }
    //点击周周涨
    $current.click(function() {
        $pub.removeClass('clickPh');
        $(this).addClass('clickPh');
        $('.menu-content li').hide();
        $('.current2').show();
    });

    //点击定期
    $tearm.click(function() {
        $pub.removeClass('clickPh');
        $(this).addClass('clickPh');
        $('.menu-content li').hide();
        $('.term2').show();
    });

    //点击浮动收益
    $float.click(function() {
        $pub.removeClass('clickPh');
        $(this).addClass('clickPh');
        $('.menu-content li').hide();
        $('.float2').show();
    });

    //点击选择产品的按钮
    $select.click(function() {
        if (isSelsect) {
            $('.select li').show();
            isSelsect = false;
        } else {
            $('.select li').hide();
            isSelsect = true;
        }
    });

    //默认2周
    var week = 2;
    var earnings = 9.2;
    var $regularMoney = $('.regularMoney');//获取定期的购买金额
    var $day = $('.day');//定期的天数
    var $tearmExpected = $('.tearmExpected');//定其中的预期收益

    $('.calc').hover(function() {
        $('.selectLi').hide();
    });

    //点击2周触发
    $('.four').click(function() {
        week = 2;
        earnings = 9.2;
        $sel.html('2周 9.2%');
        $day.html('14');
        regularCalculate();
    });

    //点击4周触发
    $('.eight').click(function() {
        week = 4;
        earnings = 9.5;
        $sel.html('4周 9.5%');
        $day.html('28');
        regularCalculate();
    });

    //点击12周触发
    $('.twelve').click(function() {
        week = 12;
        earnings = 10.5;
        $sel.html('12周 10.5%');
        $day.html('84');
        regularCalculate();
    });

    //点击24周触发
    $('.twentyFour').click(function() {
        week = 26;
        earnings = 12;
        $sel.html('26周 12%');
        $day.html('182');
        regularCalculate();
    });

    $regularMoney.on('keyup', function() {
        regularCalculate();
    });

    //定期计算方法
    function regularCalculate() {
        var _rMoney = $regularMoney.val();
        money = 0;
        if(_rMoney != null && _rMoney != 0) {
            money = _rMoney*earnings/100/365*(week*7);
            $tearmExpected.html(parseFloat(money).toFixed(2));
        } else {
            $tearmExpected.html('0');
        }
    }

    var $floatMoney = $('.floatMoney');//获取浮动购买的金额
    var $floatExpected = $('.floatExpected');//浮动收益中的预期收益

    //浮动购买的金额
    $floatMoney.on('keyup', function() {
        floatCalculate();
    });


    //购买浮动计算方法
    function floatCalculate() {
        var _fMoney = $floatMoney.val();
        money = 0;
        var _money = 0;
        if(_fMoney != null && _fMoney != 0) {
            money = _fMoney*8/100/365*210;
            _money = _fMoney*33/100/365*210;
            //$floatExpected.html(parseFloat(money).toFixed(2) + '元～' + parseFloat(_money).toFixed(2) + '元');
            $floatExpected.html(parseFloat(money).toFixed(2) + '元');
        } else {
            $floatExpected.html('0');
        }
    }


    //点击返回顶部按钮
    $backtop.click(function() {
        $backtop.hide();
        window.location.href = '#top';
    });
});