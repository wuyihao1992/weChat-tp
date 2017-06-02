!define(['conf', 'api', 'app'], function ($conf, api, $app) {
    console.info('success required test.js');

    var $testBody = $('#testBody');
    $testBody.html($app.loadTable);
    var param = {
        "tranCode" : 1000,
        "data" : {
            "id" : 1,
            "name" : 123
        }
    };
    api(param).then(function(result){
    	console.log(result);
        var data = result.data;
        var str = '<tr><td>'+ data.name +'</td><td>'+ data.email +'</td><td>'+ data.createtime +'</td></tr>'
        $testBody.html(str);
    });
});
