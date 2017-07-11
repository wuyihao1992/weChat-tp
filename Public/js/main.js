/**
 * 程序主入口
 */
!require(['conf'], function($conf) {

	require.config({
        urlArgs: $conf.version,
        basePath: $conf.PUBLIC + '/js/',
		paths: {
			"text": "//cdn.bootcss.com/require-text/2.0.12/text.min",
			"json": "//cdn.bootcss.com/requirejs-plugins/1.0.3/json.min",
			"css": "//cdn.bootcss.com/require-css/0.1.8/css.min",
            "api": 'public/api',
            "app": 'public/app',
            "fun": 'public/fun'
		}
	});

	require(['controller'], function(controller) {
        // TODO: 加载js模块
        var paths = location.pathname.replace(/^\//, '').replace(/;.*$/, '').split(/(?!^)\//);
        var length = paths.length;
        var tab = paths[length - 1],
            module = paths[length - 2],
            pModule = paths[length - 3];
        var homePath = ['login', 'main', 'Index', $conf.homeName];

        if (!!$conf.dev) {
            console.group('main');
            console.log(location);

            console.group('paths ->');
            console.info(paths);
            console.groupEnd();

            console.log('tab = ' + tab + '; ' + 'module = ' + module + '; ' + 'pModule = ' + pModule);
            console.groupEnd();

            console.group('conf');
            console.info($conf);
            console.groupEnd();
        }

        if (!!length && length < 3){
            var isHome = homePath.indexOf(tab) > -1 ||
                homePath.indexOf(module) > -1 ||
                homePath.indexOf(pModule) > -1;
            if(!!isHome){
                require([$conf.PUBLIC + '/js/models/' + 'Home' + '/' + 'Index' + '/' + 'index' + '.js']);
                // TODO: 实现按需加载css。需要在sass/models/模块下构建相应的scss，如sass/models/Home/Index/view.scss
                // require(['css!' + $conf.PUBLIC + '/css/models/' + 'Home' + '/' + 'Index' + '/' + 'view' + '.css']);
            }
        }else {
            if(homePath.indexOf(tab) > -1){
                require([$conf.PUBLIC + '/js/models/' + 'Home' + '/' + 'Index' + '/' + 'index' + '.js']);
                // require(['css!' + $conf.PUBLIC + '/css/models/' + 'Home' + '/' + 'Index' + '/' + 'view' + '.css']);
            }else{
                require([$conf.PUBLIC + '/js/models/' + pModule + '/' + module + '/' + tab + '.js']);
                // require(['css!' + $conf.PUBLIC + '/css/models/' + pModule + '/' + module + '/' + tab + '.css']);
            }
        }

		// NProgress = parent.NProgress;
		NProgress.count = 0;
        NProgress.configure({
            trickleRate: 0.01,
            trickleSpeed: 800,
            showSpinner: false
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

		var param = controller.getParam();

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

	/*
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
	*/
});