!define(['conf', 'api'], function ($conf, api) {
    console.info('success required test.js');

    var param = {
        "tranCode" : 1000,
        "data" : {
            "id" : 1,
            "name" : 123
        }
    };
    api(param).then(function(result){
    	console.log(result);
    });
});
