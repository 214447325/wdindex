/**
 * Created by User on 2016/9/29.
 */

$(function() {
    var $body = $('body');
    !function(){
        window._alert = alert;
        window._confirm = confirm;

        var _dialogTpl = doT.template([
            '<div class="ui-alert backdrop">',
            '<div class="dialog-content"> ',
            '<h3 class="dialog-title">温馨提示</h3>',
            '<div class="dialog-article">',
            '<p class="alert-message">{{=it.message}}</p>',
            '</div>',
            '<div class="tc btn-box2 full-btn "><!-- 按钮 -->',
            '<a href="javascript:;" class="btn btn-default btn-sm submit">确定</a>',
            '{{?it.type == "confirm"}}',
            '<a href="javascript:;" class="btn btn-border btn-sm cancel">取消</a>',
            '{{?}}',
            '</div>',
            '</div>',
            '</div>'
        ].join(''));

        $.extend(window, {
            alert: function(str, cb){
                var $alert = $(_dialogTpl({
                    type: 'alert',
                    message: str
                }));
                $alert.on('click', '.close', function(){
                    $alert.remove();
                }).on('click', '.submit', function(){
                    $alert.remove();
                    cb && cb();
                });
                $body.append($alert);
            },
            confirm: function(str, sb, cl){
                var $alert = $(_dialogTpl({
                    type: 'confirm',
                    message: str
                }));
                $alert.on('click', '.close', function(){
                    $alert.remove();
                }).on('click', '.submit', function(){
                    $alert.remove();
                    sb && sb();
                }).on('click', '.cancel', function(){
                    $alert.remove();
                    cl && cl();
                });;
                $body.append($alert);
            }
        });
    }();
});
