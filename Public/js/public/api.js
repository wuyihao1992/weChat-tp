/**
 * @author by wuyihao on 2017/4/19.
 * @method ajax封装
 * @param object param 请求参数
 * @param string url 请求结果
 * @param type 请求类型
 * 调用实例 api(param).then(successCallback, errorCallback);
 */
!define(['conf'], function ($conf) {
    return function (param, url = $conf.path + '/index.php/Api/Index/index', type = 'post', bfs = () => {}) {
        return $.ajax({
            url: url,
            type: type,
            dataType: 'json',
            data: JSON.stringify(param || {}),
            contentType: 'application/json',
            beforeSend: function () {
                console.log('before send');
                bfs();
            }
        }).then(function (result) {
            if (result.ret != undefined && result.ret == 0) {
                return result;
            }

            console.warn('ajax error!', url, param, result);
            return $.Deferred().reject(result);
        });
    }
});

/**
 * 或者可以有另一种封装, 将ajax所有参数放进param里面
 * 即:
 * params = {url: 'xxx', type: 'post/get/put/...', data: {}, contentType: 'application/json', ...}
 * 调用:
 * api(params).then(successCallback, errorCallback);
 */
/*!define(['conf'], function ($conf) {
    return function (params) {
        return $.ajax({
            url: !!params.url || ($conf.path + '/index.php/Api/Index/index'),
            type: !!params.type || 'post',
            dataType: !!params.dataType || 'json',
            data: JSON.stringify(!!params.data || {}),
            contentType: !!params.contentType || 'application/json',
            beforeSend: !!params.beforeSend && params.beforeSend() || (() => {})
        }).then(function (result) {
            if (result.ret != undefined && result.ret == 0) {
                return result;
            }

            console.warn('ajax error!', url, param, result);
            return $.Deferred().reject(result);
        });
    }
});*/
