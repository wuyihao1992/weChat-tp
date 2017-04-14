!define(['conf'] , function($conf){
	var unSerial = function(key){
		var data = location.hash.replace(/^#/,'').split('!');
		if( data.length < 3 )return {};
		var tab = {tabs:{},active:data[0]};
		return {
			url:data[0],
			title:data[1],
			module:data[2]
		};
    };

	var serial = function(data){
		location.hash = data.url + '!' + data.title + '!' + data.module;
	};

	var Controller = function(){

		this.request = function( param ){
            if( !param.url || !param.module ){
                return false;
			}

			serial(param);

			if(param.title){
//				$tab.tabs('select', param.title );
				return ;
			}
        };

		this.reload = function(){
			location.reload();
		};

		this.getParam = function(name){
			return unSerial(name);
		};

		this.back = function(){
			history.back();
			this.reload();
		};
	};

	return new Controller;
});

