'use strict';

/**
 * 获取url参数
 * @param name
 * @returns {null}
 */
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

/** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
 Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for (var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};

/**
 * (1)增长率计算
 * @param Float a 本期
 * @param Float b 上期
 * @param Int type 1
 * 1.当上期数据为正数时，公式：利润增长率=（本期/上期-1）*100%，应用于企业非亏损状态。
 * 2.当上期数据为负数时，公式：亏损增长率=[1-(本期/上期)]*100%，应用于企业亏损状态或亏转盈状态。
 *
 * (2)当期平均值计算
 * @param Float a 完成数
 * @param Float b 总数
 * @param Int type 2
 * 公式：完成数/总数
 *
 * return float rate
 */
function getRate(a,b,type) {
    var rate = 0;
    a = parseFloat(a);
    b = parseFloat(b);
    var aIsNaN = a==null || a==undefined || isNaN(a),
        bIsNaN = b==0 || b==null || b==undefined || isNaN(b);
    if (bIsNaN){
        rate = type==1 ? '--' : 0;
    }else {
        if (aIsNaN){
            rate = 0;
        }else {
            if (type == 1){
                if (b > 0){
                    rate = a/b-1;
                }else {
                    rate = 1- (a/b);
                }
            }else {
                rate = a/b;
            }
        }
    }

    return rate;
}

/**
 * 时间长度转换
 * @param Int a 单位秒
 * return string hh:mm:ss
 */
function longTime(a) {
    a = Math.round(a);

    if (a <= 0) {
        return "00:00:00";
    }

    var hh = parseInt(a / 3600);
    if(hh < 10) {
        hh = "0" + hh;
    }

    var mm = parseInt((a - hh*3600) / 60);
    if(mm < 10) {
        mm = "0" + mm;
    }

    var ss = parseInt((a - hh*3600) % 60);
    if(ss < 10) {
        ss = "0" + ss;
    }

    var length = hh + ":" + mm + ":" + ss;

    return length;
}

/**
 * 时间节点计算
 * @param Int type 类型 {1:当期,2:上期}
 * @param Int dateType 日期类型 {1:日,2:周,3:月}
 * return object {begin:"2016-01-01",end:"2016-01-02"}
 */
function duringDate(type,dateType) {
    var obj = {begin:"",end:""},
        nowDate = new Date(), //now = 2017/02/23
        desc = {"0":"01","1":"02","2":"03","3":"04","4":"05","5":"06","6":"07","7":"08","8":"09","9":"10","10":"11","11":"12",undefined:""};

    nowDate.setDate(nowDate.getDate() - 1); //2017/02/22

    var thisYear = nowDate.getFullYear(), //2017
        thisMonth = nowDate.getMonth(), //02
        thisDay = nowDate.getDay(); //0~6 星期

    var nowDayStr = (new Date(nowDate)).pattern("yyyy-MM-dd"); //昨天时间 2017/02/22
    var nowDateCount = parseInt((nowDayStr.split('-'))[2]); // 当前天数 22

    var getFullDays = function (y,m) {
        m = m + 1;
        if(m == 2){
            return y % 4 == 0 ? 29 : 28;
        }else if(m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12){
            return 31;
        }else{
            return 30;
        }
    };

    var thisMonthDays = getFullDays(thisYear,thisMonth); //28

    if (type == 1){
        switch (dateType) {
            case 1:
                obj.begin = nowDayStr;
                break;
            case 2:
                var temT = thisDay==0 ? (nowDate.getTime() - 24*3600*1000*7) : (nowDate.getTime() - 24*3600*1000*thisDay);
                obj.begin = (new Date(temT)).pattern("yyyy-MM-dd");
                break;
            case 3:
                obj.begin = thisYear+'-'+ desc[thisMonth] +'-01';
                break;
            default:
                break;
        }
        obj.end = nowDayStr;
    }else {
        switch (dateType) {
            case 1:
                //日: 前天 - 前天
                var lastDayDate = new Date(nowDate.setDate(nowDate.getDate() - 1));
                var lastDayStr = (new Date(lastDayDate)).pattern("yyyy-MM-dd"); //前天时间 2017/02/21
                obj.begin = lastDayStr;
                obj.end = lastDayStr;
                break;
            case 2:
                //周: 上上周六 - 上周的今天
                var lastWeekDate = new Date(nowDate.setDate(nowDate.getDate() - 7)); //上一周的今天
                var lastWeekDay = new Date(lastWeekDate).getDay();
                var lastWeekDayStr = lastWeekDate.pattern("yyyy-MM-dd");

                var temT = lastWeekDay==0 ? (lastWeekDate.getTime() - 24*3600*1000*7) : (lastWeekDate.getTime() - 24*3600*1000*lastWeekDay);
                obj.begin = (new Date(temT)).pattern("yyyy-MM-dd");
                obj.end = lastWeekDayStr;
                break;
            case 3:
                //月: 上一月1号 - 上月的今天
                // thisMonth = parseInt(thisMonth)+1;
                var lastMonthDate = new Date(thisYear+'/'+thisMonth+'/'+'01'); //new Date(thisYear,thisMonth,0); 月份已经减了1 -> 02
                // lastMonthDate.setMonth(lastMonthDate.getMonth()-1);

                var lastMonthYear = lastMonthDate.getFullYear(),
                    lastMonthMonth = lastMonthDate.getMonth();

                var lastMonthDays = getFullDays(lastMonthYear,lastMonthMonth),
                    lastMonthDayStr = '';
                if(nowDateCount > lastMonthDays){
                    //当期的月份天数大于上期月份总天数
                    lastMonthDayStr = lastMonthYear+'-'+ desc[lastMonthMonth] +'-' + lastMonthDays; //取上个月最后一天
                }else{
                    //当期的月份天数小于上期月份总天数，判断当前时间是否为当期月份最后一天
                    var endDate;
                    if(nowDateCount == thisMonthDays){
                        endDate = new Date(nowDate.setDate(nowDate.getDate() - nowDateCount));
                    }else {
                        endDate = new Date(nowDate.setDate(nowDate.getDate() - lastMonthDays));
                    }

                    lastMonthDayStr = endDate.pattern("yyyy-MM-dd"); //上个月的今天
                }

                obj.begin = lastMonthYear+'-'+ desc[lastMonthMonth]+'-01';
                obj.end = lastMonthDayStr;
                break;
            default:
                break;
        }
    }

    return obj;
}

/**
 * js周描述 return string
 */
function weekMap(week) {
    var desc = {"1":"一", "2":"二", "3":"三", "4":"四", "5":"五", "6":"六", "0":"日", undefined:""};
    return desc[week];
}

/**
 * js月描述 return string
 *  @param int month
 *  @param int type 【0:小写，1：大写】
 */
function monthMap(month, type) {
    var desc = [
        {"0":"01", "1":"02", "2":"03", "3":"04", "4":"05", "5":"06", "6":"07", "7":"08", "8":"09", "9":"10", "10":"11", "11":"12", undefined:""},
        {"0":"一", "1":"二", "2":"三", "3":"四", "4":"五", "5":"六", "6":"七", "7":"八", "8":"九", "9":"十", "10":"十一", "11":"十二", undefined:""}
    ];
    return desc[type][month];
}

/**
* 扩展jQuery scroll事件 , 扩展scroll 滚动开始和停止事件。js调用：
    $(window).bind('scrollstart', function(){
        $body.addClass('disable-hover');
    }).bind('scrollstop', function(){
        $body.removeClass('disable-hover');
    });
*/
(function(){
    var special = jQuery.event.special,
        uid1 = 'D' + (+new Date()),
        uid2 = 'D' + (+new Date() + 1);
 
    special.scrollstart = {
        setup: function() {
 
            var timer,
                handler =  function(evt) {
 
                    var _self = this,
                        _args = arguments;
 
                    if (timer) {
                        clearTimeout(timer);
                    } else {
                        evt.type = 'scrollstart';
                        // FIXME: 高版本jQuery 不能够用 handle
                        // jQuery.event.handle.apply(_self, _args);
                        jQuery.event.dispatch.apply(_self, _args); 
                    }
 
                    timer = setTimeout( function(){
                        timer = null;
                    }, special.scrollstop.latency);
 
                };
 
            jQuery(this).bind('scroll', handler).data(uid1, handler);
 
        },
        teardown: function(){
            jQuery(this).unbind( 'scroll', jQuery(this).data(uid1) );
        }
    };
 
    special.scrollstop = {
        latency: 300,
        setup: function() {
 
            var timer,
                    handler = function(evt) {
 
                    var _self = this,
                        _args = arguments;
 
                    if (timer) {
                        clearTimeout(timer);
                    }
 
                    timer = setTimeout( function(){
 
                        timer = null;
                        evt.type = 'scrollstop';
                        jQuery.event.dispatch.apply(_self, _args);
 
                    }, special.scrollstop.latency);
 
                };
 
            jQuery(this).bind('scroll', handler).data(uid2, handler);
 
        },
        teardown: function() {
            jQuery(this).unbind( 'scroll', jQuery(this).data(uid2) );
        }
    };
})(jQuery);

/**
 * $.box
 {
    message string		打印的信息
    ok 		function	[可选] 确定事件回调函数
    okName  string		[可选] 确定按钮名称
    close 	function	[可选] 关闭事件回调函数
    closeName string	[可选] 关闭按钮名称
    tip 	string		[可选] 窗口图标可为[tips_answer,tips_error,tips_success]
    }

 $.box("hello world");
 $.box("hello world",function(){alert("closed");});
 $.box({message:"hi~ ",tip:"tips_error",ok:function(){alert("ok");},okName:"gg",close:function(){alert("close")},closeName:"mm"});
 */
(function($){
    'use strict';
    var Box = function(opt, cb) {
        var html = '<div class="box-wrap">'+
                        '<div class="box-font-wrap">'+
                            '<div class="box-tips"></div>'+
                            '<p class="box-content">你不是该小区业主，不能使用该服务，是否注册成为业主？</p>'+
                            '<div class="box-btnGroup">'+
                                '<a href="javascript:;">立即注册</a>'+
                                '<a href="javascript:;">暂不注册</a>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
        var $box = $(html);
        var defaultOption = {title: '消息', buttons: [], tip: "tips_answer"};
        var _this = this;

        var $btnGroup = $('.box-btnGroup', $box);

        if( typeof opt == 'string' ){
            opt = {message: opt, close: cb};
        }

        opt = $.extend(defaultOption, opt);
        opt.html = opt.html || opt.message ;

        opt.ok && opt.buttons.push({name: opt.okName || '确定', click: opt.ok});
        opt.close && opt.buttons.push({name: opt.closeName || '关闭', click: opt.close});
        opt.cancel && opt.buttons.push({name: opt.cancelName || '取消', click: opt.cancel});

        $btnGroup.empty();

        $.each(opt.buttons,function(i,btn){
            $btnGroup.append( $('<a href="javascript:;"></a>').html(btn.name).click(function(e){
                var result = btn.click.call(this, e);
                if( result === false ) {
                    return;
                }

                _this.hide();
            }));
        });

        if( !opt.buttons.length ){
            $box.click(function(){
                _this.hide();
            });
        }

        $box.find(".box-tips").addClass( opt.tip );
        $box.hide().appendTo("body");

        this.show = function(html){
            $box.find(".box-content").html(html);
            $box.show();
        };

        this.hide = function(){
            $box.hide();
            setTimeout(function(){$box.remove()},20);
        };
        this.html = function(){return $box;};

        $box.find(".close").click(function(){
            _this.hide();
        });
        this.show(opt.html);

        if($btnGroup.children().length > 0){

        }else{
            $btnGroup.hide();
        }
    };

    $.box = function( option , cb ){
        if( typeof option == 'string' ){
            option = { message: option , close: cb }
        }

        option.close = option.close || function(){};

        if( option.ok ){
            return confirm(option.message) ? option.ok() : option.close();
        }
        return alert( option.message ) && option.close();
    };

    $.box = function(opt, cb){
        var box = new Box(opt, cb);
        return box.html().data('box', box);
    };
})(jQuery);