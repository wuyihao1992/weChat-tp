/**
 * Created by wuyihao on 2017/4/25.
 */
!define(['api'], function (api) {
    var View = function () {
        var _this = this;

        this.getBanner = function () {
            var param = {
                "tranCode" : 1000,
                "data" : {
                    "id" : 1,
                    "name" : 123
                }
            };
            api(param).then(function (result) {

            });
        };

        this.slider = function () {
            var control = navigator.control || {};
            if (control.gesture) {
                control.gesture(false);
            }

            var page = 'pageNav',
                slide = 'slider',
                currentIndex = 0;

            var touch = new TouchSlider({
                id: slide,
                // auto: true, // '-1'
                autoplay:true,
                begin: 0,
                fx: 'ease-out',
                direction: 'left',
                duration:600,
                interval:3000,
                speed: 600,
                timeout: 3000,
                before: function(newIndex, oldSlide){
                    var list = document.getElementById(this.page).getElementsByTagName('li');
                    list = $(list);
                    // list[this.p].className = '';
                    // list[index].className = 'active';
                    list.eq(this.p).removeClass('active');
                    list.eq(newIndex).addClass('active');

                    this.p = newIndex;
                },
                after: function (newIndex, newSlide) {
                    if(currentIndex == newIndex){
                        return;
                    }else{
                        currentIndex = newIndex;
                        // do something
                    }
                }
            });

            touch.page = page;
            touch.p = 0;
        };

        this.scroller = function () {
            var $document = $(document),
                $body = $('body', $document),
                $searchWrap = $('.searchWrap', $body);
            var ticking = false; // rAF 触发锁
            
            var onScroller = function(cb){
                if (!ticking) {
                    requestAnimationFrame(cb); // 滚动防抖
                    ticking = true;
                }
            };

            var callback = function(){
                var topHeight = $document.scrollTop();
                if (topHeight > $searchWrap.height()) {
                    if (!$searchWrap.hasClass('fixed')) {
                        $searchWrap.addClass('fixed');
                        $body.addClass('padTop-searchHeight');
                    }
                }else {
                    if ($searchWrap.hasClass('fixed')) {
                        $searchWrap.removeClass('fixed');
                        $body.removeClass('padTop-searchHeight');
                    }
                }

                ticking = false;
            };

            $document.on('scroll', function (e) {
                onScroller(callback);
            }).on('scrollstart', function(){
                $body.addClass('disable-hover');
            }).on('scrollstop', function(){
                $body.removeClass('disable-hover');
            }).on('focus', '.searchWrap input' , function () {
                console.log('aaa');
                // $searchWrap.css("top", $(window).scrollTop());
            }).on('click', '#boxTest', function (e) {
                $.box({
                    message: "亲，注册下吧！",
                    tip: "tips_none", // tips_answer
                    ok: function () {
                        // location.href = "";
                        layer.msg('ok')
                    },
                    close: function () {

                    },
                    okName: "立即注册",
                    closeName: "暂不注册",
                    cancelName: "sss"
                });
            });
        };

        this.init = function () {
            _this.getBanner();
            _this.slider();
            _this.scroller();
        }
    };

    var view = new View();
    view.init();
});
