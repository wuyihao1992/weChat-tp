<?php
	define(TEST, "TEST");
	define(EMAIL_LAN_ADD, "尊敬的%s客户,您好,您在中山电信云平台注册的云主机业务，购买的CPU%u核,内存%uG,硬盘%uG,BGP带宽%uM的云主机,已于%s开通计费，当前费用%.2f元/月,请您核对资源及电信计费账单的变化！【中山电信公有云平台】");
	define(EMAIL_LAN_DELETE, "尊敬的%s客户,您好,您在中山电信云平台注册的云主机(CPU%u核,内存%uG,硬盘%uG,BGP带宽%uM)已于%s注销并停止计费,请您核对资源及电信计费账单的变化！【中山电信公有云平台】");
	define(EMAIL_LAN_CHANGE, "尊敬的%s客户,您好,您在中山电信云平台注册的云主机资源发生变更，当前云主机配置为CPU%u核,内存%uG,硬盘%uG,BGP带宽%uM已于%s开通计费,请您核对资源及电信计费账单的变化！【中山电信公有云平台】");
	define(EMAIL_WINDOWS, "你好，中山电信云平台有云主机客户需要重装系统，麻烦帮忙操作：<br>主机编号：%s<br>安装系统：Windows2008R2<br>安装方式：全格重装<br>重装完成后，请通过技术支撑账号登陆中山云管理平台确认，谢谢。<br>(如有任何问题请及时联络研发部相关负责人)");
	if(defined(TEST)){
		define(CLOUD_AGENT,"http://192.168.89.244/zstelapi/");
		define(VER, false);
		define(SNEDSMS, false);
		define(SNEDMAIL, false);
	}else{
		define(CLOUD_AGENT,"http://121.201.6.84/zstelapi/");
		define(VER, true);
		define(SNEDSMS, true);
		define(SNEDMAIL, true);
	}
?>