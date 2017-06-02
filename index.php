<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2014 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

	// error_reporting(E_ALL^E_NOTICE);

	 // 关闭错误报告
	 error_reporting(0);

	 // 报告 runtime 错误
	 // error_reporting(E_ERROR | E_WARNING | E_PARSE);
	
	// 应用入口文件
	$noCheckLogin = array(
		'/Index',
	    '/Index/index',
	    '/Home/Public/login',
	    '/Public/register',
	
	    '/Home/Public/verify_c',
	    '/Home/Public/doLogin',
	    '/Home/Public/has_login',
	    '/Home/Public/get_industry',
	    '/Home/Public/doRegister',
	
	    '/Home/Cron/auto_date_charing',
	    '/Home/Cron/auto_expire_handle',
	    '/Home/Callback/returnResponse',
	    '/Home/Callback/payResponse',
	    '/Home/Cron/tplCrontab',
	    '/Home/Public/sendWarnEmail',
	    '/Home/Cron/date_warning_notice',
		'/Home/Cron/deadline_warnning',
	);
	array_walk($noCheckLogin, function(&$v, $k){
	    $v = strtoupper($v);
	});
	
	session_start();
	if( !in_array(strtoupper($_SERVER['PATH_INFO']), $noCheckLogin) ){
		//echo strtoupper($_SERVER['PATH_INFO']);	
	
		/*
	    if(empty($_SESSION['user_id'])){
	    	$HOME = str_replace("/index.php", "", $_SERVER['SCRIPT_NAME']);
	        echo '<script type="text/javascript">top.location=\''.$HOME.'/Home/Public/login\';</script>';
	        exit;
	    }
		*/
	}
	session_write_close();
	
	// 检测PHP环境
	if(version_compare(PHP_VERSION,'5.3.0','<'))  die('require PHP > 5.3.0 !');
	// 开启调试模式 建议开发阶段开启 部署阶段注释或者设为false
	define('TEST', 1);
	define('APP_DEBUG',True);
	if(TEST){
		define('API_URL','http://192.168.89.244/api'); //API调用地址 /api/VMPowerStateOpt.php
		define('PAYAPI','http://test.api.efly.cc/RJ_CHECKSTAND/consume.php');
		define('VM_URL',API_URL.'/Vm'); //调用VM的信息
		define('SYSTEM_URL',API_URL.'/System'); //调用VM的信息
		define('UPLOADPATH','./data');
		define('WEBSITE', 'http://localhost/agent');
		define('PHOTO_URL','http://192.168.89.244/agent/data');
	}else{
		define('API_URL','http://121.201.6.84/api'); //API调用地址 /api/VMPowerStateOpt.php
		define('PAYAPI','http://test.api.efly.cc/RJ_CHECKSTAND/consume.php');
		define('VM_URL',API_URL.'/Vm'); //调用VM的信息
		define('UPLOADPATH','./data');
		define('WEBSITE', 'http://agent.eflycloud.com');
		define('PHOTO_URL','http://agent.eflycloud.com/data');
	}
	
	// 定义应用目录
	define('APP_PATH','./Application/');
	
	// 引入ThinkPHP入口文件
	require './ThinkPHP/ThinkPHP.php';