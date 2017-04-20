<?php
return array(
	'LOG_RECORD' => true, // 开启日志记录
	'LOG_LEVEL'  =>'EMERG,ALERT,CRIT,ERR,NOTICE,INFO', // 只记录EMERG ALERT CRIT ERR 错误
	
	//'配置项'=>'配置值'
    'MODULE_ALLOW_LIST'    =>    array('Home','Admin','Api'),
    'DEFAULT_MODULE'        =>  'Home',
    'URL_CASE_INSENSITIVE'  =>  true,
    'URL_MODEL' => 2,
    'SESSION_AUTO_START' => false,
    
	//配置代理商host
	'AGENT_SYS_HOST' => 'agent.eflycloud.com',
	
	//分页的条数
	'page' => '20',
	'page_10' => '10',

	//支付信息
	//在线支付方式
	'pay_type' => array(
			'alipay' => 1, //支付宝支付
			'weipay' => 2,	//微信支付
	),
	
	//支付提示信息
	'pay_notice' => array(
			'recharge' => '用户充值账号',
			'buy' => '购买产品',
	),
	
	//支付类型
	'change_type' => array(
			'recharge' 	=> 1, //用户充值
			'withdraw'  => 2, //用户提现
			'buy'	=> 3, //购买产品
			'back'	=> 4, //平台返还
	),
	//支付状态
	'pay_status' => array(
			'no' => 1, //未支付
			'yes' => 2,	//已支付
	),

	//添加自己的模板变量规则
	'TMPL_PARSE_STRING' => [
        '__TEST__' => 'TMPL TEST',
        '__VERSION__' => '1.0',
        '__HOME_NAME__' => 'weChat' // 前端web主页模版名称
    ],
		
	// 业务操作码对应接口
	'url_trancode' 	=> [
		0 => 'Index/test',
		1003 => 'Test/index'
	],

    // reCAPTCHA 验证码
    'reCaptcha' => [
        'siteKey' => '6LdzrhsUAAAAAH3pl7Mbb4lZuRA_G5QVjFHFVUCF',
        'secretKey' => '6LdzrhsUAAAAAG96wkqRcGJkBgvasruf7G-IzMbQ'
    ]
		
);
