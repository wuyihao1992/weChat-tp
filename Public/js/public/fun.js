define(function (require, exports, module) {
    'use strict';

    /**
     * echarts 默认选项
     * @type {{globalOpt: {title: boolean, noDataLoadingOption: {text: string, textStyle: {fontWeight: string, fontSize: string, color: string}, x: string, y: string, effect: string, effectOption: {effect: {n: number}}}}, loadingOpt: {text: string, x: string, y: string, textStyle: {fontWidth: string, fontSize: string}, effect: string}, listStyle: listStyle}}
     */
    exports.chartOption = {
        globalOpt: {
            title: false,
            noDataLoadingOption: {
                text: '暂无数据',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: '32',
                    color: '#929292'
                },
                x: 'center',
                y: 'center',
                effect: 'spin',
                effectOption: {
                    effect: {
                        n: 0
                    }
                }
            }
        },
        loadingOpt: {
            text: '数据载入中...',
            x: 'center',
            y: 'center',
            textStyle: {
                fontWidth: 'normal',
                fontSize: '24'
            },
            effect: 'spin'
        },
        listStyle: function (color) {
            return '<span style="background-color: '+ color +';display: inline-block;width: 10px;height: 10px;border-radius: 50%;vertical-align: middle;"></span>' + '&ensp;';
        }
    };

    /**
     * 获取树当前选中的节点
     * @returns {{orgId: *, orgGrade}|*}
     */
    exports.getTreeSelectedParam = function (treeWrap) {
        treeWrap = !!treeWrap ? treeWrap : "treeWrap";
        var treeObj = $.fn.zTree.getZTreeObj(treeWrap), params;
        var selected = treeObj.getSelectedNodes();

        if (selected.length <= 0) {
            selected = treeObj.getNodesByFilter(function (node) {
                return node.level == 0;
            });
        }

        selected = selected[0];

        /*if (selected.length > 0) {
            selected = selected[0];
        }else {
            selected = treeObj.getNodesByFilter(function (node) {
                return node.level == 0;
            });

            selected = selected[0];
        }*/

        params = {
            "id": selected.id,
            "orgId": selected.id,
            "bizId": selected.bizId,
            "orgGrade": selected.grade
        };

        return params;
    };

    /**
     * 设置缓存数据,保存对象
     * @param string key
     * @param Array/Object/String val 如果传入字符串,则存入普通字符串.如果传入json,则存入json字符串
     * @param int [type] {0: sessionStorage , 1: localStorage }, 默认为0
     */
    exports.setStorage = function (key, val, type) {
        var getType = Object.prototype.toString;

        var setKey = function (k, v, ty) {
            if (!!ty && ty == 1) {
                localStorage.setItem(k, v);
            }else {
                sessionStorage.setItem(k, v);
            }
        };

        if (getType.call(val) == '[object Object]' || getType.call(val) == '[object Array]') {
            val = JSON.stringify(val);
            setKey(key, val, type);
        }else {
            setKey(key, val, type);
        }
    };

    /**
     * 获取缓存数据
     * @param string key
     * @param int [type] 类型,可选. {0: sessionStorage , 1: localStorage }, 默认为0
     * @param bool [isObject] 是否返回json对象,可选. 默认为true
     */
    exports.getStorage = function (key, type, isObject) {
        var storage;

        var getKey = function (k, ty) {
            if (!!ty && ty == 1) {
                return localStorage.getItem(k);
            }else {
                return sessionStorage.getItem(k);
            }
        };

        if (isObject != undefined && isObject == false) {
            storage = getKey(key, type);
        } else {
            storage = JSON.parse(getKey(key, type));
        }

        return storage;
    };

    /** layer loading */
    exports.layerLoad = function () {
        return layer.load(1, {shade: [0.1, '#fff']});
    };

});