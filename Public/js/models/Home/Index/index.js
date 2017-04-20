!define(['conf', 'api'], function ($conf, api) {
    console.log('welcome to Index/index.html');

    var param = {
        "tranCode" : 0,
        "data" : {
            "id" : 1,
            "name" : 123
        }
    };
    api(param).then(function (result) {

    });
});
