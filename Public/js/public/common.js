'use strict';

/**
 * 获取URL请求参数 (适用于常规url, http://localhost:8062/pms-report/html/main.html?userId=1537&id=123)
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

/**
 * 获取URL请求参数 (适用于report单页面url, http://localhost:8062/pms-report/html/main.html#/openDoor?userId=1537)
 * @param name
 * @returns {null}
 */
function getReportQueryString(name) {
    var url = window.location.href;
    // url = url.replace('#/', '/');    // 这一步可省略

    var arr = url.split('?');           // 获取 `?` 后面的字符串, 即(location)hash值
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');

    var result = arr[1].match(reg);
    if (result != null) {
        return unescape(result[2]);
    }
    return null;
}

/** 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
 Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1,                                      //月份
        "d+": this.getDate(),                                           //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,    //小时
        "H+": this.getHours(),                                          //小时
        "m+": this.getMinutes(),                                        //分
        "s+": this.getSeconds(),                                        //秒
        "q+": Math.floor((this.getMonth() + 3) / 3),                    //季度
        "S": this.getMilliseconds()                                     //毫秒
    };
    var week = {"0": "/u65e5", "1": "/u4e00", "2": "/u4e8c", "3": "/u4e09", "4": "/u56db", "5": "/u4e94", "6": "/u516d"};

    var $1Len = RegExp.$1.length;

    if (/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - $1Len));
    }

    if (/(E+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (($1Len > 1) ? ($1Len > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }

    for (var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, ($1Len == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }

    return fmt;
};

/**
 * 日期输出字符串，重载了系统的toString方法
 * @param showWeek
 * @returns {string}
 */
Date.prototype.toString = function(showWeek) {
    var myDate = this,
        str ='';     // var str = myDate.toLocaleDateString();

    if (showWeek) {
        var Week = ['日','一','二','三','四','五','六'];
        str += ' 星期' + Week[myDate.getDay()] + ' ';
    }

    return str;
};

/**
 * 货币格式化输出
 * @param places
 * @param symbol
 * @param thousand
 * @param decimal
 * @returns {string}
 */
Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "";           //symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";

    var number = this,
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "";

    var j = i.length;
    j = j > 3 ? j % 3 : 0;

    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
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
 * 判断数字是否 正整数 或 0
 * @param num
 * @returns {boolean}
 */
function isNotNegativeInt(num) {
    if (num == null) {
        return false;
    } else if (num == '0' ) {
        return true;
    }
    //else if (num == '0' || num == '0.5' || num == '1.5') return true;
    var reg = /^[0-9]*[1-9][0-9]*$/;        //正整数
    return reg.test(num);
}

/**
 * 根据对象属性值获取对象属性
 * @param obj
 * @param val
 * @returns {*}
 */
function getKeyByValue(obj, val){
    if(!obj){
        return null;
    }

    for(var k in obj){
        if(obj[k] == val){
            return k;
            break;
        }
    }

    return null;
}

/**
 * 判断是否为数组
 * @param obj
 * @returns {boolean}
 */
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function isEmail(strEmail) {
    if (strEmail.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1) {
        return true;
    }

    return false;
}

function isMobile(mobile){
    var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
    if (reg.test(mobile)) {
        return true;
    }

    return false;
}

/**
 * 判断是否属于IP地址
 * @param addr
 * @returns {boolean}
 */
function isIp(addr){
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
    if(addr.match(reg)){
        return true;
    }

    return false;
}

/**
 * 检验大于0且小数为两位的浮点数 或 小数为0的整数
 * @param num
 * @returns {boolean}
 * @constructor
 */
function isFloatNum(num){
    if (num == null) {
        return false;
    }else if (num <= 0) {
        return false;
    }

    /*大小写字母个数
    var alphaNum = (num.replace(/[^a-zA-Z]/g, '')).length;
    if (alphaNum > 0) {
        return false;
    }

    空格个数
    var spaceCnt = (num.replace(/\S/g, '')).length;
    if (spaceCnt > 0) {
        return false;
    }*/

	/*var floatReg = /^\d+(\d|(\.[0-9]{0,2}))$/;      //两位小数
	var intReg = /^[0-9]*[1-9][0-9]*$/;             //正整数
    var intReg = /^[0-9]+.?[0-9]*$/
	return floatReg.test(num) || intReg.test(num);*/

    var test = /^-?\d+(\.?\d{0,2})?$/;
    return test.test(num)
}

/**
 * 判断域名
 * @param str_url
 * @returns {boolean}
 */
function isURL(str_url){
    /*var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"    // ftp的user@
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}"                                // IP形式的URL- 199.194.52.184
        + "|"                                                           // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*"                                      // 域名- www.
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\."                        // 二级域名
        + "[a-z]{2,6})"                                                 // first level domain- .com or .museum
        + "(:[0-9]{1,4})?"                                              // 端口- :80
        + "((/?)|"                                                      // a slash isn't required if there is no file name
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re = new RegExp(strRegex);
    if (re.test(str_url)){
        return true;
    }*/

    var reg = /((https|http|ftp|rtsp|mms):\/\/)?(([0-9a-z_!~*'().&=+$%-]+:)?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)/g;
    if(str_url.match(reg)){
        return true;
    }

    return false;
}

/**
 * 开始时间小于结束时间
 * @param startTime
 * @param endTime
 * @param obj
 * @returns {boolean}
 */
function checkDate(startTime, endTime, obj){
    var tem1 = new Date(startTime.replace('/-/g','\/')).getTime(),
        tem2 = new Date(endTime.replace('/-/g','\/')).getTime();
    if (tem1 != NaN && tem2 != NaN) {
        if (tem1 >= tem2) {
            console.log('结束时间不能小于或等于起始时间！');
            obj.val('');
            return false;
        }
    }
}

/**
 * 身份证验证
 * @param idCard
 * @returns {boolean}
 */
function validateIdCard(idCard){
    //15位和18位身份证号码的正则表达式
    var msg = false;
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

    //如果通过该验证，说明身份证格式正确，但准确性还需计算
    if(regIdCard.test(idCard)){
        if(idCard.length == 18){
            var idCardWi = new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 );  //将前17位加权因子保存在数组里
            var idCardY = new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 );                      //这是除以11后，可能产生的11位余数、验证码，也保存成数组
            var idCardWiSum = 0;                                                              //用来保存前17位各自乖以加权因子后的总和
            for(var i= 0; i < 17; i++){
                idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
            }

            var idCardMod = idCardWiSum % 11;                                                   //计算出校验码所在数组的位置
            var idCardLast = idCard.substring(17);                                              //得到最后一位身份证号码

            //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
            if(idCardMod == 2){
                if(idCardLast == "X" || idCardLast == "x"){
                    msg = true;
                }else{
                    msg = false;
                }
            }else{
                //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                if(idCardLast == idCardY[idCardMod]){
                    msg = true;
                }else{
                    msg = false;
                }
            }
        }
    }else{
        msg = false;
    }
    return msg;
}

/**
 * 保留两位小数
 * 调用：changeTwoDecimal(1.2);
 * @param v 数字
 * @returns {*}
 */
function changeTwoDecimal(v) {
    if (isNaN(v)) {
        return '0.00';
    }

    var fv = parseFloat(v);
    fv = Math.round(fv * 100) / 100;        //四舍五入，保留两位小数

    var fs = fv.toString();
    var fp = fs.indexOf('.');
    if (fp < 0) {
        fp = fs.length;
        fs += '.';
    }
    while (fs.length <= fp + 2) {
        fs += '0';                          //小数位小于两位，则补0
    }

    return fs;
}

function moutip(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) * mul(b, e)) / e;
}

function add(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}

function sub(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}

function mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

function div(a, b) {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}

/**
 * 去掉字符串头尾空格
 * @param str
 * @returns {string|*|void|XML}
 */
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 正则表达式 替换括号,尖括号等
 * @param str
 * @returns {string|*|void|XML}
 */
function toCode(str) {
    var RexStr = /\&lt;|\&gt;|\&quot;|\&#39;|\&amp;|\+/g;   // var RexStr = /\&lt;|\&gt;|\&quot;|\&#39;|\&amp;/g;
    str = str.replace(RexStr, function(MatchStr) {
        switch (MatchStr) {
            case "&lt;":
                return "<";
                break;
            case "&gt;":
                return ">";
                break;
            case "&quot;":
                return "\"";
                break;
            case "&#39;":
                return "'";
                break;
            case "&amp;":
                return "&";
                break;
            case "+":
                return "&nbsp;";
                break;
            default:
                break;
        }
    });

    return str;
}

/**
 * 动态输入框的评论限制
 * @param testarea
 * @param message
 * @param discussMaxLen
 */
function discussLimit(testarea, message, discussMaxLen){
    var texts = $("#"+testarea).val();
    var textsLen = texts.length;
    $("#"+message).find('var').text(discussMaxLen-textsLen);
    $("#"+testarea).focus(function(){
        $(document).keyup(function(){
            var newTexts = $("#"+testarea).val();
            var newtextsLen = newTexts.length;
            if(newtextsLen <= discussMaxLen){
                $("#"+message).html('您还可以输入<var style="color: #01AADD;font-size:22px;font-weight:800;">'+ (discussMaxLen-newtextsLen) +'</var>个字符');
            }else{
                $("#"+message).html('已超出<var style="color: red;font-size:22px;font-weight:800;">'+ (newtextsLen-discussMaxLen) +'</var>个字符');
            }
        });
    });
}

/**
 * 将URL中的UTF-8字符串转成中文字符串
 * 调用：getCharFromUtf8(str);
 * @param str
 * @returns {*}
 */
function getCharFromUtf8(str) {
    var cstr = "";
    var nOffset = 0;
    if (str == "")
        return "";
    str = str.toLowerCase();
    nOffset = str.indexOf("%e");
    if (nOffset == -1)
        return str;
    while (nOffset != -1) {
        cstr += str.substr(0, nOffset);
        str = str.substr(nOffset, str.length - nOffset);
        if (str == "" || str.length < 9)
            return cstr;
        cstr += utf8ToChar(str.substr(0, 9));
        str = str.substr(9, str.length - 9);
        nOffset = str.indexOf("%e");
    }
    return cstr + str;
}

//将编码转换成字符
function utf8ToChar(str) {
    var iCode, iCode1, iCode2;
    iCode = parseInt("0x" + str.substr(1, 2));
    iCode1 = parseInt("0x" + str.substr(4, 2));
    iCode2 = parseInt("0x" + str.substr(7, 2));
    return String.fromCharCode(((iCode & 0x0F) << 12) | ((iCode1 & 0x3F) << 6) | (iCode2 & 0x3F));
}

/**
 * 检验座机
 * @param str
 * @returns {boolean}
 */
function checkPhone(str){
    var re = /^0\d{2,3}-?\d{7,8}$/;                     //座机,区号3-4位
    if(re.test(str)){
        return true;
    }

    return false;
}
function istell(str){
    var result=str.match(/\d{3}-\d{8}|\d{4}-\d{7}/);    //座机，区号3位
    if(result==null){
        return false;
    }

    return true;
}

/**
 * 验证是否中文
 * @param str
 * @returns {boolean}
 */
function isChn(str){
    var reg = /^[\u4E00-\u9FA5]+$/;
    if(!reg.test(str)){
        return false;
    }

    return true;
}

/**
 * 浏览器阻止默认弹窗
 * @param url
 */
function openwin(url) {
    var a = document.createElement("a");
    a.setAttribute("href", url);        // url = "http://www.baidu.com";
    a.setAttribute("target", "_blank");
    a.setAttribute("id", "openwin");
    document.body.appendChild(a);
    a.click();
}

/**
 * for循环sleep
 * @param numberMillis
 */
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime) {
            return;
        }
    }
}

/**
 * 判断数组是否有相同，包括某一项
 * @param arr1
 * @param arr2
 * @returns {boolean}
 */
function sameArr(arr1, arr2){
    var temArr1 = [], temArr2 = [], flag = false;
    var len1 = arr1.length, len2 = arr2.length;

    if (len1 <= 0 || len2 <= 0) {
        flag = true;
    }else if (len1 > 0 && len2 <= 0) {
        flag = false;
    }else if (len1 <= 0 && len2 > 0) {
        flag = false;
    }else {
        temArr1 = $.unique(arr1);
        temArr2 = $.unique(arr2);

        for (var i in temArr1) {
            for (var j in temArr2) {
                if (temArr1[i] == temArr1[j]) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                //表示temArr1的这个值没有重复的，放到CountArr列表中
                //CountArr.push(temArr1[i]);
                break;
            }
        }
    }

    return flag;
}

/**
 * 加入收藏夹
 * @param title
 * @param url
 * @constructor
 */
function AddFavorite(title, url) {
    try{
        window.external.addFavorite(url, title);
    } catch (e) {
        try {
            window.sidebar.addPanel(title, url, "");
        } catch (e) {
            console.log("抱歉，您所使用的浏览器无法完成此操作。\n请使用  Ctrl+D 进行添加!", {icon: 0});
        }
    }
}

/**
 * jquery 判断变量是否在数组里面
 * 要用 $.inArray(value,array) > -1
 * @returns {boolean}
 */
function inArray(val) {
    var winBlackList = [];
    if ($.inArray(val, winBlackList) > -1){
        return true;
    }

    return false;
}

/**
 * JS版的Server.UrlEncode编码函数
 * 调用： var desc = desc.UrlEncode();
 */
(function () {
    String.prototype.UrlEncodeGB2312 = function () {
        var str = this;
        str = str.replace(/./g, function (sHex) {
            window.EnCodeStr = "";
            window.sHex = sHex;
            window.execScript('window.EnCodeStr=Hex(Asc(window.sHex))', "vbscript");
            return window.EnCodeStr.replace(/../g, "%{blogcontent}amp;");
        });
        return str;
    };
    String.prototype.UrlEncode = function () {
        var s = escape(this);
        var sa = s.split("%");
        var retV = "", retE = "";
        if (sa[0] != "") {
            retV = sa[0];
        }
        for (var i = 1; i < sa.length; i++) {
            if (sa[i].substring(0, 1) == "u") {
                retV += Hex2Utf8(Str2Hex(sa[i].substring(1, 5)));
                if (sa[i].length > 4)
                    retV += sa[i].substring(5);
            }
            else retV += "%" + sa[i];
        }
        return retV;
    };

    function Str2Hex(s) {
        var c = "";
        var n;
        var ss = "0123456789ABCDEF";
        var digS = "";
        for (var i = 0; i < s.length; i++) {
            c = s.charAt(i);
            n = ss.indexOf(c);
            digS += Dec2Dig(eval(n));
        }
        return digS;
    }

    function Dec2Dig(n1) {
        var s = "";
        var n2 = 0;
        for (var i = 0; i < 4; i++) {
            n2 = Math.pow(2,3-i);
            if (n1 >= n2) {
                s += '1';
                n1 = n1-n2;
            }
            else
                s += '0';
        }
        return s;
    }

    function Dig2Dec(s) {
        var retV = 0;
        if (s.length == 4) {
            for (var i = 0; i < 4; i++) {
                retV += eval(s.charAt(i)) * Math.pow(2, 3-i);
            }
            return retV;
        }
        return -1;
    }

    function Hex2Utf8(s) {
        var retS = "";
        var tempS = "";
        var ss = "";
        if (s.length == 16) {
            tempS = "1110" + s.substring(0, 4);
            tempS += "10" + s.substring(4, 10);
            tempS += "10" + s.substring(10, 16);
            var sss = "0123456789ABCDEF";
            for (var i = 0; i < 3; i++) {
                retS += "%";
                ss = tempS.substring(i * 8, (eval(i) + 1) * 8);
                retS += sss.charAt(Dig2Dec(ss.substring(0, 4)));
                retS += sss.charAt(Dig2Dec(ss.substring(4, 8)));
            }
            return retS;
        }
        return "";
    }
})();

(function () {
    /**
     * layer全局化
     * var parents = parent.frames['content'].window.parent.document;
     * var $pa = $(parents);
     */
    if(self != top){
        if (!!layer){
            layer = top.layer;
        }
    }

    /**
     * 回车事件
     * @param e
     */
    document.onkeydown = function (e) {
        var theEvent = window.event || e;
        var code = theEvent.keyCode || theEvent.which;
        if (code == 13) {
            // do something
        }
    };

    /**
     * checkbox 全选/清空
     * @param obj
     */
    var checkAll = function(obj){
        var selected = [];                  //先清空

        var checkObj = $("input[name='selectdDisk']");
        if ($(obj).is(':checked')) {
            checkObj.each(function(i){
                if (!$(this).is(':checked')) {
                    $(this).prop('checked', 'checked');
                    selected.push($(this).val());
                }
            });
        } else{
            checkObj.each(function(){
                if ($(this).is(':checked')) {
                    $(this).removeAttr("checked");
                }
            });
        }
    };

    /**
     * 获取checkbox 选中的项
     * @param checkObj
     */
    var checkSelect = function(checkObj){
        var selected = [];                                  //先清空

        checkObj = $('input[name="selectedVM"]:checked');  //直接拿到选中项
        checkObj.each(function(i){
            if($(this).is(":checked")){
                selected.push($(this).val());
            }
        });
    };

    /**
     * 阻止浏览器默认行为触发的通用方法
     */
    $(window).click(function(e){
        stopDefault(e);
    });
    function stopDefault(e){
        if(e && e.preventDefault){
            e.preventDefault();     //防止浏览器默认行为(W3C)
        } else {
            window.event.returnValue = false;      //IE中组织浏览器行为
        }
        return false;
    }

})();

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
 $.box({message:"hi~ ", tip:"tips_error", ok:function(){alert("ok");}, okName:"gg", close:function(){alert("close")}, closeName:"mm"});
 */
(function($){
    'use strict';
    var Box = function(opt, cb) {
        var html = '<div class="box-wrap">'+
                        '<div class="box-wrap__font">'+
                            '<div class="box-wrap__font--tips"></div>'+
                            '<p class="box-wrap__font--content">您还未注册，是否注册？</p>'+
                            '<div class="box-wrap__font--btnGroup">'+
                                '<a data-name="btn" href="javascript:;">立即注册</a>'+
                                '<a data-name="btn" href="javascript:;">暂不注册</a>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
        var $box = $(html);
        var defaultOption = {title: '消息', buttons: [], tip: "tips_answer"};
        var _this = this;

        var $btnGroup = $('.box-wrap__font--btnGroup', $box);

        if( typeof opt == 'string' ){
            opt = {message: opt, close: cb};
        }

        opt = $.extend(defaultOption, opt);
        opt.html = opt.html || opt.message ;

        opt.ok && opt.buttons.push({name: opt.okName || '确定', click: opt.ok});
        opt.close && opt.buttons.push({name: opt.closeName || '关闭', click: opt.close});
        opt.cancel && opt.buttons.push({name: opt.cancelName || '取消', click: opt.cancel});

        $btnGroup.empty();

        $.each(opt.buttons, function(i, btn){
            $btnGroup.append( $('<a data-name="btn" href="javascript:;"></a>').html(btn.name).click(function(e) {
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

        $(".box-wrap__font--tips", $box).addClass( opt.tip );
        $box.hide().appendTo("body");

        this.show = function(html){
            $(".box-wrap__font--content", $box).html(html);
            $box.show();
        };

        this.hide = function(){
            $box.hide();
            setTimeout(function(){$box.remove()},20);
        };
        this.html = function(){return $box;};

        $(".close", $box).click(function(){
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

/**
 * 浏览器版本判断
 */
(function($){
    $.extend({
        NV: function(name){
            var NV = {},
                UA = navigator.userAgent.toLowerCase(),
                br;

            try{
                NV.name = !-[1,] ? 'ie' :
                    (UA.indexOf("firefox") > 0) ? 'firefox' :
                        (UA.indexOf("chrome") > 0) ? 'chrome' :
                            window.opera ? 'opera' :
                                window.openDatabase ? 'safari' :
                                    'unkonw';
            }catch(e){}

            try{
                NV.version = (NV.name == 'ie') ? UA.match(/msie ([\d.]+)/)[1] :
                    (NV.name == 'firefox') ? UA.match(/firefox\/([\d.]+)/)[1] :
                        (NV.name == 'chrome') ? UA.match(/chrome\/([\d.]+)/)[1] :
                            (NV.name == 'opera') ? UA.match(/opera.([\d.]+)/)[1] :
                                (NV.name == 'safari') ? UA.match(/version\/([\d.]+)/)[1] :
                                    '0';
            }catch(e){}

            try{
                NV.shell = (UA.indexOf('360ee') > -1) ? '360极速浏览器' :
                    (UA.indexOf('360se') > -1) ? '360安全浏览器' :
                        (UA.indexOf('se') > -1) ? '搜狗浏览器' :
                            (UA.indexOf('aoyou') > -1) ? '遨游浏览器' :
                                (UA.indexOf('theworld') > -1) ? '世界之窗浏览器' :
                                    (UA.indexOf('worldchrome') > -1) ? '世界之窗极速浏览器' :
                                        (UA.indexOf('greenbrowser') > -1) ? '绿色浏览器' :
                                            (UA.indexOf('qqbrowser') > -1) ? 'QQ浏览器' :
                                                (UA.indexOf('baidu') > -1) ? '百度浏览器' :
                                                    '未知或无壳';
            }catch(e){}

            switch(name) {
                case 'ua':
                case 'UA':
                    br = UA;
                    break;
                case 'name':
                    br = NV.name;
                    break;
                case 'version':
                    br = NV.version;
                    break;
                case 'shell':
                    br=NV.shell;
                    break;
                default:
                    br=NV.name;
            }

            return br;
        }
    });
})(jQuery);