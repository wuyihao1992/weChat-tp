/**
 * Created by wuyihao on 2017/4/19.
 */
!define(['conf'],function ($conf) {
    return function (param, url = '') {
        return $.ajax({
            url : !!url ? url : ($conf.path +'/index.php/Api/Index/index'),
            type : 'post',
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