'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

    (function (a) {
        return a + 1;
    });

    var f1 = function f1() {
        return { a: 1 };
    };
    f1();

    var f2 = function f2() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [1, 2],
            _ref2 = _slicedToArray(_ref, 2),
            a = _ref2[0],
            b = _ref2[1];

        var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { x: a + b },
            c = _ref3.x;

        return a + b + c;
    };
    f2();

    function Persion() {
        var _this = this;

        this.age = 0;
        if (this.age < 10) {
            setInterval(function () {
                _this.age++; // |this| 正确地指向了 person 对象
            }, 1000);
        }
    }
    var p = new Persion();

    var simple = function simple(a) {
        return a > 15 ? 15 : a;
    };
    simple(16); // 15
    simple(10); // 10

    var max = function max(a, b) {
        return a > b ? a : b;
    };

    var arr = [5, 6, 13, 0, 1, 18, 23];
    var sum = arr.reduce(function (a, b) {
        return a + b;
    }); // 66
    var even = arr.filter(function (item) {
        return item % 2 == 0;
    }); // [6, 0, 18]
    var double = arr.map(function (item) {
        return item * 2;
    }); // [10, 12, 26, 0, 2, 36, 46]

    // 更多简明的promise链
    promise.then(function (a) {
        // ...
    }).then(function (b) {
        // ...
    });

    var PageHandler = {

        id: "123456",

        init: function init() {
            document.addEventListener("click", function (event) {
                this.doSomething(event.type);
            }.bind(this), false);
        },

        doSomething: function doSomething(type) {
            console.log("Handling " + type + " for " + this.id);
        }
    };

    var PageHandler2 = {

        id: "123456",

        init: function init() {
            var _this2 = this;

            document.addEventListener("click", function (event) {
                return _this2.doSomething(event.type);
            }, false);
        },

        doSomething: function doSomething(type) {
            console.log("Handling " + type + " for " + this.id);
        }
    };
});