/*
* @Author: User
* @Date:   2016-07-21 16:39:51
* @Last Modified by:   User
* @Last Modified time: 2016-07-21 16:54:30
*/

$(function() {
    //获取上个页面的参数	
    var url = location.search; //获取url中"?"符后的字串
    var param = {};
    if (url.indexOf("?") != -1) {
       var str = url.substr(1);
       strs = str.split("&");
       for(var i = 0; i < strs.length; i ++) {
          param[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
       }
    }
    
    var phoneNum=param.phoneNum;
    var userStatus=param.userStatus;
    
    $('.account-phone').html(phoneNum);
    if (userStatus == 1 || userStatus== 0) {
        $('.limitMoney').html(1000);
    }
    if (userStatus == 2) {
        $('.limitMoney').html(2000);
    }

});
