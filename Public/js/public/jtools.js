/*
 * 自定义工具
 */

(function() {
    'use strict';

    var
    /* jStorage version */
        TOOLS_VERSION = '0.0.1',

        /* detect a dollar object or create one if not found */
        $ = window.jQuery || window.$ || (window.$ = {});

//    var a;


    ////////////////////////// PRIVATE METHODS ////////////////////////

    /**
     * Initialization function. Detects if the browser supports DOM Storage
     * or userData behavior and behaves accordingly.
     */
    function _init() {
       
    }

    /**
     * 将数组形式转成树
     * @param list 数组
     * @param parent 根节点
     * @param nodeMapFun
     */
    function _toTree(list, parent, nodeMapFun){

		var subTree = function(parent){
			var sub = [];
			$.each( list , function(i,item){
				if( parent.id == item.pId ){
					sub.push(item);
				}
			});

			$.each(sub , function(i,item){
				subTree(item)
			});
			
			if( parent && sub.length){
				parent.children = sub;
			}
			
			return parent ?  parent : sub;
		};

		list = list.map( item =>{
			item.pId = item.pId || item.parentId;
			nodeMapFun(item);
			return item;
		});

		if( parent )return subTree(parent);

		var parents = [];
		$.each( list , function( i , item ){
			var isParent = true;
			$.each( list , function( j , item2 ){
			    if( item.pId === item2.id )isParent = false;
			});
			if(isParent)parents.push( subTree(item) );
		});
		return parents;

	}
    
    /**
     * 新建选项卡
     * @param target $('.easyui-tabs')对象
     * @param title
     * @param url
     */
    function _addTab(target, title, url){
    	if (target.tabs('exists', title)){
    		target.tabs('select', title);
    	} else {
    		var content = '<iframe scrolling="auto" frameborder="0"  src="'+url+'" style="width:100%;height:99.50%;"></iframe>';
    		var option = {
    			title:title,
    			content:content,
    			closable:true,
    			index: target.tabs('getTabIndex', target.tabs('getSelected')) + 1
    		};
    		target.tabs('add', option);
    	}
    };
    
    /**
     * 关闭当前tab
     * @param target
     * @returns
     */
    function _closeCurrentTab(target){
    	var tab = target.tabs('getSelected');
		if(tab){
			target.tabs('close', target.tabs('getTabIndex', tab));
		}
    }
    
    /**
     * 保存成功时，弹出提示
     * @param target
     * @returns
     */
    function _saveSuccessTip(target){
    	$.messager.confirm({
    		title: '保存成功',
    		content: '保存成功，是否关闭窗口',
    		fn: function(r){
    			if(r){
    				_closeCurrentTab(target);
    			}
    		},
    		ok: '关闭',
    		cancel: '取消'
    	});
    }
    
    /**
     * 表单参数转json
     * @param $form 表单的jquery对象
     */
    function _formToJson($form, callback){
    	var params = $form.serializeArray(),
    		json = {};
    	for(var i in params){
    		var param = params[i],
	    		names = param.name.split('.'),
				curNode = json;
    		for(var j in names){
    			var name = names[j];
    			if(name.indexOf('[') > 0){
    				var tName = name.match(/^.+(?=\[)/)[0],
    					index = name.match(/\d+(?=\])/)[0];
    				curNode[tName] = curNode[tName]||[];
    				curNode = curNode[tName][index] = curNode[tName][index]||(j < names.length - 1 ? {} : param.value);
    			}else{
    				curNode = curNode[name] = curNode[name]||(j < names.length - 1 ? {} : param.value);
    			}
    		}
    	}
    	callback && callback.call(this, json);
    	return _loopJson(json);
    }
    
    /**
     * 遍历json，去掉null值
     */
    function _loopJson(json){
    	if(typeof json == "object"){
    		if(json instanceof Array){
    			json = json.filter(function(obj){
					return typeof obj != "undefined" && obj != null;
    			});
    			for(var i in json){
    				if(typeof json[i] != "undefined"){
    					json[i] = _loopJson(json[i]);
    				}
    			}
    		}else{
    			for(var i in json){
    				json[i] = _loopJson(json[i]);
    			}
    		}
    	}
    	return json;
    }
    
    /**
     * 查找枚举里值对应描述
     */
    function _getDesc(val, arrays){
    	if(!isNaN(val)){
    		return arrays.find(function(obj){
    			return obj.val == val;
    		}).desc;
    	}
    	var vals = val.split(';');
    	var subArray = arrays.filter(function(obj){
    		return vals.includes('' + obj.val);
    	});
    	return subArray.map(function(obj){
    		return obj.desc;
    	}).join(';');
    };
    
    /**
     * 时间统一显示格式
     * @param data 时间戳
     * @returns string 日期+时分
     */
    function _timeFormatter(data){
    	return data ? $.format.date(new Date(data), 'yyyy-MM-dd HH:mm') : '';
    };
    
    /**
     * 日期统一显示格式
     * @param data 时间戳
     * @returns string 日期
     */
    function _dateFormatter(data){
    	return data ? $.format.date(new Date(data), 'yyyy-MM-dd') : '';
    };
    
    /**
     * 获取链接中的参数
     */
    function _getURIParams(){
    	var strs = location.search.substring(1).split('&'),
    		params = {};
    	for(var i in strs){
    		var arrays = strs[i].split('=');
    		params[arrays[0]] = arrays[1];
    	}
    	return params;
    }
    
    /**
     * 将对象转成form表单的对象
     */
    function _toFormData(prefix, data){
    	var newData = {};
    	for(var obj in data){
    		newData[prefix + '.' + obj] = data[obj];
    	}
    	return newData;
    }
    
    /**
     * 获取当前页面的模块
     * @returns
     */
    function _getURIModules(){
    	return location.pathname.replace(/^\//, '').replace(/;.*$/, '').split(/(?!^)\//);
    }
    
    /**
     * 设置当前页面只读
     * @returns
     */
    function _setReadonly($panel){
    	$panel.find('.easyui-textbox').textbox('readonly');
    	$panel.find('.easyui-combobox').combobox('readonly');
    	$panel.find('.easyui-datebox').datebox('readonly');
    	$panel.find('.easyui-datetimebox').datetimebox('readonly');
    	$panel.find('.easyui-switchbutton').switchbutton('readonly');
    }
    ////////////////////////// PUBLIC INTERFACE /////////////////////////

    $.tools = {
        /* Version number */
        version: TOOLS_VERSION,
        
        /**
         * 数组转树
         */
        listToTree: _toTree,
        /**
         * 新建选项卡
         */
        addTab: _addTab,
        /**
         * 表单参数转json
         */
        formToJson:_formToJson,
        /**
         * 查找枚举里值对应描述
         */
        getDesc: _getDesc,
        /**
         * 时间统一显示格式
         */
        timeFormatter: _timeFormatter,
        /**
         * 日期统一显示格式
         */
        dateFormatter: _dateFormatter,
        /**
         * 获取链接中的参数
         */
        getURIParams: _getURIParams,
        /**
         * 将对象转成form表单的对象
         */
        toFormData: _toFormData,
        /**
         * 获取当前页面的模块名
         */
        getURIModules: _getURIModules,
        /**
         * 设置当前页面只读
         */
        setReadonly: _setReadonly,
        /**
         * 关闭当前tab
         */
        closeCurrentTab: _closeCurrentTab,
        /**
         * 保存成功提示
         */
        saveSuccessTip: _saveSuccessTip
    };

    // Initialize tools
    _init();

})();