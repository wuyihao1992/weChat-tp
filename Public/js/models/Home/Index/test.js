!define(['conf'], function ($conf) {
    console.info('success required test.js');

    var param = {
        "tranCode" : 0,
        "data" : {
            "id" : 1,
            "name" : 123
        }
    };
    param = JSON.stringify(param);
    $.ajax({
        type : 'post',
        dataType : 'json',
        url : $conf.path +'/index.php/Api/Index/index',
        data : param,
        success : function (result) {

        }
    });
});
