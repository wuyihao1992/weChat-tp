/**
 * @author by wuyihao on 2017/4/19.
 * @method ajax封装
 * @param object param 请求参数
 * @param string url 请求结果
 * @param type 请求类型
 */
!define(['conf'], function ($conf) {
    return function (param, url = $conf.path +'/index.php/Api/Index/index', type = 'post') {
        return $.ajax({
            url : url,
            type : type,
            dataType : 'json',
            data : JSON.stringify(param || {}),
            contentType : 'application/json'
        }).then(function (result) {
            if (result.ret != undefined && result.ret == 0) {
                return result;
            }

            console.warn('ajax error!', url, param, result);
            return $.Deferred().reject(result);
        });
    }
});
