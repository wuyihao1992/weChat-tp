/**
 * Created by wuyihao on 2017/4/25.
 */
!define([], function () {
    var View = function () {
        var _this = this;

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
                    requestAnimationFrame(cb);
                    ticking = true;
                }
            };

            var callback = function(){
                var topHeight = $document.scrollTop();
                if (topHeight > $searchWrap.height()) {
                    $searchWrap.addClass('fixed');
                }else{
                    $searchWrap.removeClass('fixed');
                }

                ticking = false;
            }

            $document.on('scroll', function (e) {
                onScroller(callback);
            }).on('scrollstart', function(){
                $body.addClass('disable-hover');
            }).on('scrollstop', function(){
                $body.removeClass('disable-hover');
            });
        };

        this.init = function () {
            _this.slider();
            _this.scroller();
        }
    };

    var view = new View();
    view.init();

});
