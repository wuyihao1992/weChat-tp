'use strict';

/**
 * es6 to es5 test
 */
!define(['conf', 'api', 'app'], function ($conf, api, $app) {

    var $testBody = $('#testBody');
    $testBody.html($app.loadTable);
    var param = {
        "tranCode": 1000,
        "data": {
            "id": 1,
            "name": 123
        }
    };
    api(param).then(function (result) {
        console.log(result);
        var data = result.data;
        var str = '<tr><td>' + data.name + '</td><td>' + data.email + '</td><td>' + data.createtime + '</td></tr>';
        $testBody.html(str);
    });
});