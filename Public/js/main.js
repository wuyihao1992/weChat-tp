/**
 * 程序主入口
 */
!require(['conf'], function($conf) {

	require.config({
		paths: {
			"text": "//cdn.bootcss.com/require-text/2.0.12/text.min",
			"json": "//cdn.bootcss.com/requirejs-plugins/1.0.3/json.min",
			"css": "//cdn.bootcss.com/require-css/0.1.8/css.min"
		}
	});

	require.config({
		urlArgs: $conf.version,
		basePath: $conf.PUBLIC + '/js/',
		paths: {
			"easyuiOption": $conf.path + '/js/easyuiCustomOptions'
		}
	});

//	require(['menu'],function( menu ){ menu() });

	require(['controller', 'conf'], function(controller, $conf) {
        // TODO: 加载js模块
        var paths = location.pathname.replace(/^\//, '').replace(/;.*$/, '').split(/(?!^)\//)
        var tab = paths[paths.length - 1],
            module = paths[paths.length - 2],
            pModule = paths[paths.length - 3];
        /*
        console.group('main');
        console.log(window.location);
        console.log(paths);
        console.log(tab);
        console.log(module);
        console.log(pModule);
        console.groupEnd();
        */
        if(['login', 'main'].indexOf(tab) > -1){
            require(['m_' + tab]);
        }else{
            require([$conf.PUBLIC + '/js/models/' + pModule + '/' + module + '/' + tab + '.js']);
        }

		// NProgress = parent.NProgress;
		NProgress.count = 0;
        NProgress.configure({
            trickleRate: 0.01,
            trickleSpeed: 800
		});

		$(document).on('click', '[data-url]', function() {
			controller.request($(this).data());
		}).on('ajaxStart', function(){
			NProgress.start();
			NProgress.count++;
		}).on('ajaxStop', function(){
			NProgress.count--;
			NProgress.count < 0 && (NProgress.count = 0);
			NProgress.count == 0 && NProgress.done();
		});

		if(!$conf.isFrame){
            return;
        }

		param = controller.getParam();

		$.get( `${$conf.path}/html/${param.url}.html`).done(function(html){
            var $html = $(html);
            checkUserApi($html).then(function(){
				$('#main-content').html($html);
	            require([ `${$conf.path}/js/${param.module}.js` ],function(func){
	                func && func.call(this,$html,param);
	            });
            });
        });
	});

	require(['conf'],function($conf){
		$(document).on('dblclick','.tabs li',function(){
			let index = $(this).parent().children().index(this);
			if( index == -1 )return;
			let src = $('.tabs-panels>div').eq(index).find('iframe').prop('src');
			if( !src )return;
			window.open(src,'_blank');
		}).on('click','.btn.reload',function(){
			location.reload();
		});
	});
});