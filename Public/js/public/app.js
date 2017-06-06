/**
 * 全局表格初始化样式
 */
!define(['conf'], function($conf){
    var globe = {
        loadTable :     '<tr style="height: 200px;" bgcolor="#FFFFFF">'+
                            '<td colspan="15"  align="center">'+
                                '<p ><img src="'+ $conf.PUBLIC +'/assets/layer/skin/default/loading-0.gif" style="margin: 0 auto;"/></p>'+
                                '<p style="font-size: 16px;color: #666;">正在加载数据</p>'+
                            '</td>'+
                        '</tr>',
        loadTableYun :  '<tr style="height: 200px;" bgcolor="#FFFFFF">'+
                            '<td colspan="15"  align="center">'+
                                '<p ><img src="'+ $conf.PUBLIC +'/assets/layer/skin/default/loading-0.gif"/></p>'+
                                '<p style="font-size: 16px;color: #666;">正在加载数据</p>'+
                            '</td>'+
                        '</tr>',
        emptyTable :	'<tr style="height: 200px;" bgcolor="#FFFFFF">'+
                            '<td colspan="15"  align="center">'+
                                '<p style="font-size: 20px;color: #666;"><img src="'+ $conf.PUBLIC +'/img/default_icon.png"></p>'+
                            '</td>'+
                        '</tr>',
        emptyPage :     '<p>'+
                            '<span  style="display: inline-block;width: 100%;text-align: right;">'+
                            '<span>总记录数：<span  class="num">0</span></span>'+
                            '<span style="display: inline-block;margin: 0px 8px;">本页记录数：<span  class="num">0</span></span>'+
                            '<span class="payBtn" >首页</span>'+
                            '<span class="payBtn" >上一页</span>'+
                            '<span class="payBtn1"> <span >1</span> / <span >1</span></span>'+
                            '<span class="payBtn" >下一页</span>'+
                            '<span class="payBtn">末页</span>'+
                            '</span>'+
                        '</p>' ,
        layerLoadYun :  '<p >'+
                            '<img style="display:inline-block;float:left;" src="'+ $conf.PUBLIC +'/assets/layer/skin/default/loading-0.gif"/>'+
                            '<span style="height:98px;line-height:98px;vertical-align: middle;display:inline-block;">等待跳转支付页面...</span>'+
                        '</p>',
        smallLoad :     '<img src="'+ $conf.PUBLIC +'/js/layer/skin/default/small-2.gif"/>',
        textLoad :      '<span style="margin-left:10px;"><img style="display:inline-block;" src="'+ $conf.PUBLIC +'/assets/layer/skin/default/loading-2.gif"/></span>',
        loadWait : function(descript){
            /**
             * 生成系统：正在生成系统...
             * 配置同步：正在同步配置...
             * 支付跳转：等待跳转支付页面...
             * **/
            return	'<p >'+
                        '<img style="display:inline-block;float:left;" src="'+ $conf.PUBLIC +'/assets/layer/skin/default/loading-0.gif"/>'+
                        '<span style="height:60px;line-height:60px;vertical-align: middle;display:inline-block;">'+ descript +'</span>'+
                    '</p>';
        }
    };

    return globe;
});
