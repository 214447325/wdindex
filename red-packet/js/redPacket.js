/*
* @Author: User
* @Date:   2016-07-20 17:41:08
* @Last Modified by:   User
* @Last Modified time: 2016-07-25 19:17:17
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
    	  var channelId=param.channelId;
    	  
  	  var $openRed = $('.open-red');
  	  $openRed.on('click',function(){
  	      if (channelId==null ||channelId==undefined) {
    	      window.location.href ='../pages/receiveRedpacket.html';
            }else{
    	      window.location.href ='../pages/receiveRedpacket.html?channelId=' +channelId;
    	}
        
      });
  })