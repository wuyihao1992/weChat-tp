/**
 * es6 to es5 test
 */
!define(['conf', 'api', 'app'], function ($conf, api, $app) {

    let $testBody = $('#testBody');
    $testBody.html($app.loadTable);
    let param = {
        "tranCode" : 1000,
        "data" : {
            "id" : 1,
            "name" : 123
        }
    };
    api(param).then(function(result){
        console.log(result);
        let data = result.data;
        let str = '<tr><td>'+ data.name +'</td><td>'+ data.email +'</td><td>'+ data.createtime +'</td></tr>';
        $testBody.html(str);
    });

    (a) => { return a + 1;}

    let f1 = () => ({ a : 1});
    f1();

    let f2 = ([a, b] = [1, 2], {x: c} = {x: a + b}) => a + b + c;
    f2();

    function Persion() {
        this.age = 0;
        if (this.age < 10) {
            setInterval(() => {
                this.age++; // |this| 正确地指向了 person 对象
            }, 1000);
        }
    }
    let p = new Persion();

    let simple = a => a > 15 ? 15 : a;
    simple(16); // 15
    simple(10); // 10

    let max = (a, b) => a > b ? a : b;

    let arr = [5, 6, 13, 0, 1, 18, 23];
    let sum = arr.reduce((a, b) => a + b); // 66
    let even = arr.filter(item => item % 2 ==0); // [6, 0, 18]
    let double = arr.map(item => item * 2); // [10, 12, 26, 0, 2, 36, 46]

    // 更多简明的promise链
    promise.then(a => {
        // ...
    }).then(b => {
        // ...
    });

    var PageHandler = {

        id: "123456",

        init: function() {
            document.addEventListener("click", (function(event) {
                this.doSomething(event.type);
            }).bind(this), false);
        },

        doSomething: function(type) {
            console.log("Handling " + type + " for " + this.id);
        }
    };

    var PageHandler2 = {

        id : "123456",

        init : function() {
            document.addEventListener("click",
                event => this.doSomething(event.type), false);
        },

        doSomething : function(type) {
            console.log("Handling " + type + " for " + this.id);
        }
    };

});
