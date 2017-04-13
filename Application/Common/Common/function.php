<?php
/**
 * 判断公司是否唯一  true表示已经存在
 */
	function uniqueCompany($company){
		$where = "company = '{$company}'";
		$name = M('User')->where($where)->getField('company');
		if($name)
		{
			return true;
		}else{
			return false;
		}
	}
	/**
	 * 验证公司名称
	 * @param string $company
	 */
	function checkCompany($company)
	{
		if(!empty($company))
		{
			$reg = '/^[\x{4e00}-\x{9fa5}0-9a-zA-Z]+$/u';
			if(!preg_match($reg,$company))
			{
				return false;
			}else{
				//验证公司是否已经注册,已注册返回假
				if(uniqueCompany($company))
				{
					return false;
				}else{
					return true;
				}
			}
		}else{
			return false;
		}
	}
	
	/**
	 * 验证手机号码
	 */
	function checkTel($tel)
	{
		$reg = '/^1[3|4|5|8][0-9]{9}$/';
		if(!preg_match($reg,$tel))
		{
			return false;
		}else{
			return true;
		}
	}
	
	/**
	 * 验证邮箱
	 */
	function checkEmail($email)
	{
		$reg = ' /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/';
		if(!preg_match($reg,$email))
		{
			return false;
		}else{
			//判断是否邮箱已使用
			if(uniqueEmail($email))
			{
				return false;
			}else{
				return true;
			}
		}
	}
	/**
	 * 判断邮箱是否唯一,如果表中已拥有返回true
	 */
	function uniqueEmail($email)
	{
		$where = "email = '{$email}'";
		$email = M('User')->where($where)->getField('email');
		if($email)
		{
			return true;
		}else{
			return false;
		}
	}
// 检测输入的验证码是否正确，$code为用户输入的验证码字符串
	function check_verify($code, $id = ''){    
		 $verify = new \Think\Verify(); 
		return $verify->check($code, $id);
	}
	/**
	 * 判断密码是否符合格式
	 * 开头字母只能是字母,密码字母数字下划线#@6-18位
	 * @return boolean
	 */
	function checkpwd($password)
	{
		if(!empty($password))
		{
			$reg = '/^[a-zA-Z][a-zA-Z0-9#@_]{5,17}$/';
			if(!preg_match($reg,$password)){
				return false;
			}else{
				return true;
			}
		}else{
			return false;
		}
	}
//获取session的值	
	function get_session($key){
		session_start();
		if(empty($key))
		{
			$data = session();
			session_write_close();
			return $data;
		}else{
			if(session('?'.$key))
			{
				$data = session($key);
				session_write_close();
				return $data;
			}else{
				session_write_close();
				return false;
			}
		}
	}
//写入session的值
	function set_session($key=null,$value=null){
		session_start();
		if(!empty($key))
		{
			session($key,$value);
		}else{
			session(null);
		}
		session_write_close();
	}
/**
 * 判断是否够钱
 */
function has_enought_money($total_money,$user_id){
	//include 'mysql.php';
	$where = "user_id=".$user_id;
	$account_info = M('user_account')->where($where)->find();
	$data = array();
	if (empty($account_info))
	{
		//验证失败
		return false;
	}else{
		if(price_format($account_info['account']+$account_info['coupon']) >= price_format($total_money)){
			return true;
		}else{
			return false;
		}
	}

}
/**
 * 处理账户金额
 * $user_id 用户id  $ac_id账户id $online_pay 金额  $coupon_pay代金券  $op操作
 * $op操作 参数 ADD_ONLY 增加现金和代金券    			  DEDUCT_ONLY 减少现金和代金券 
 * 			 ADD_FROZEN_ONLY 增加冻结现金和代金券      DEDUCT_FROZEN_ONLY 减少冻结现金和代金券
 * 			 ADD_DEDUCT_FROZEN 增加现金减少冻结资金  DEDUCT_ADD_FROZEN 减少现金增加冻结资金
 */
	function handle_account($user_id,$ac_id = 0,$online_pay = 0,$coupon_pay = 0,$op){
		if($online_pay < 0 || $coupon_pay < 0)
		{
			return false;
		}
		if(empty($user_id) || empty($op))
		{
			return false;
		}else{
			//验证账户
			$Account = M('user_account');
			if(empty($ac_id)){
				$where = ' user_id = '.$user_id;
			}else{
				$where = ' ac_id = '.$ac_id;
			}
			$account_info = $Account->where($where)->find();
			if (empty($account_info))
			{
				//验证失败
				return false;
			}else{
				//根据操作参数处理操作
				switch ($op)
				{
					case 'ADD_ONLY' : 
						$data = array(
							'account' => $account_info['account'] + $online_pay,
							'coupon' =>  $account_info['coupon'] + $coupon_pay,
						);
						if($Account->where($where)->save($data))
						{
							return true;
						}else{
							return false;
						}
					break;
					
					case 'DEDUCT_ONLY' :
						$data = array(
								'account' => $account_info['account'] - $online_pay,
								'coupon' =>  $account_info['coupon'] - $coupon_pay,
						);
						if($Account->where($where)->save($data))
						{
							return true;
						}else{
							return false;
						}
					break;
					
					case 'ADD_FROZEN_ONLY' :
						$data = array(
								'frozen_account' => $account_info['frozen_account'] + $online_pay,
								'frozen_coupon' =>  $account_info['frozen_coupon'] + $coupon_pay,
						);
						if($Account->where($where)->save($data))
						{
							return true;
						}else{
							return false;
						}
					break;
					
					case 'DEDUCT_FROZEN_ONLY' :
						$data = array(
								'frozen_account' => $account_info['frozen_account'] - $online_pay,
								'frozen_coupon' =>  $account_info['frozen_coupon'] - $coupon_pay,
						);
						if($Account->where($where)->save($data))
						{
							return true;
						}else{
							return false;
						}
					break;
					
					case 'ADD_DEDUCT_FROZEN' :
						$data = array(
								'account' => $account_info['account'] + $online_pay,
								'coupon' =>  $account_info['coupon'] + $coupon_pay,
								'frozen_account' => $account_info['frozen_account'] - $online_pay,
								'frozen_coupon' =>  $account_info['frozen_coupon'] - $coupon_pay,
						);
						if($Account->where($where)->save($data))
						{
							return true;
						}else{
							return false;
						}
					break;
					
					case 'DEDUCT_ADD_FROZEN' :
						$data = array(
								'account' => $account_info['account'] - $online_pay,
								'coupon' =>  $account_info['coupon'] - $coupon_pay,
								'frozen_account' => $account_info['frozen_account'] + $online_pay,
								'frozen_coupon' =>  $account_info['frozen_coupon'] + $coupon_pay,
						);
						if($Account->where($where)->save($data))
						{
							return true;
						}else{
							return false;
						}
					break;
					
					default :
						return false;
					break;
				}
				
			}
		}
	}
	
	/**
	 * 记录操作模块
	 * 参数 user_id用户id  info操作信息
	 */
	function user_log($user_id,$info)
	{
		if(empty($user_id) || empty($info)){
			return false;
		}else{
			$User_log = M('user_log');
			$data = array(
					'user_id' => $user_id,
					'log_info' => $info,
					'create_time' => NOW_TIME,
					);
			if($User_log->add($data)){
				return true;
			}else{
				return false;
			}
		}
	}
	/**
	 * 日志记录
	 */
	function logInfo($content,$level = 'INFO'){
		\Think\Log::record($content,$level);
	}
	/**
	 * 生成订单编号 sn为编号前缀  m为查询的数据库,col字段名
	 */
	function get_sn($sn,$m,$col){
		if(empty($sn) || empty($m))
		{
			return false;
		}else{
			$new_sn = uniqid($sn);
			$Mod = M($m);
			$is_has = $Mod->where("'$col' = '".$new_sn."'") ->getField($col);
			if ($is_has)
			{
				get_sn($sn,$m,$col);
			}else{
				return $new_sn;
			}
		}
	}
	/**
	 * 生成4位随机数
	 */
	function get_four_sn($sn,$m,$col){
		if(empty($sn) || empty($m))
		{
			return false;
		}else{
			$num = dechex(mt_rand('10001','99999'));
			
			$new_sn = $sn.strtoupper($num);
			$Mod = M($m);
			$is_has = $Mod->where("'$col' = '".$new_sn."'") ->getField($col);
			if ($is_has)
			{
				get_four_sn($sn,$m,$col);
			}else{
				return $new_sn;
			}
		}
	}

	/**
	 * 获取用户费率（新）
	 */
	function get_rate($user_id){
		if(empty($user_id)){
			return false;
		}else{
			$user = M('user')->where('user_id = '.$user_id)->field('rate,disk_rate')->find();
			if(price_format($user['rate']) == price_format(0.00)){
				$user['rate'] = C('AGENT_DEFAULT_DISCOUNT');
			}
			if(price_format($user['disk_rate']) == price_format(0.00)){
				$user['disk_rate'] = C('AGENT_DISK_DISCOUNT');
			}
			return array(
					"vm_rate" => $user['rate'],
					"disk_rate" => $user['disk_rate'],
			);
		}
	}

	/**
	 * 计算优惠折扣 充值赠送
	 */
	function get_discount($money = 0,$user_id = 0)
	{
		if($money<=0){
			return false;
		}else{
			$i = 1;
			$discount = 0;
			$min_limit = C('min_limit');
			//判断用户是否有独立的计价方式，否则获取系统计价方式
			$recharge_discount = C('recharge_discount');
			$size = count($recharge_discount);
			if($money < $min_limit){
				$discount = 0;
			}else{
				//将阶段由小到大排序
				$recharge_discount = get_sysrecharge_discount($recharge_discount);
				//判断充值金额是否大于最大值，大于最大值的部分按最大值进行计算
				if($money > $recharge_discount[$size-1]['max']){
					$discount = $recharge_discount[$size-1]['discount']*($money-$recharge_discount[$size-1]['max']);
				}
				//由小到大判断，如果比本层对大金额大，则按最大金额-上一层最大金额的差值*折扣，否则现金减去上一层最大金额得到本层金额可获取的折扣
				while($i<$size){
					if($money > $recharge_discount[$i]['max']){
						$discount += $recharge_discount[$i]['discount']*($recharge_discount[$i]['max']-$recharge_discount[$i-1]['max']);
						$i++;
					}else{
						$discount += $recharge_discount[$i]['discount']*($money - $recharge_discount[$i-1]['max']);
						break;
					}
				}
			}
			return array(
					'money' => price_format($money),
					'discount' => price_format($discount),
					'user_id' => $user_id,
					);
		}
	}
	/**
	 * 获取系统充值赠送优惠信息
	 */
	function get_sysrecharge_discount($recharge_discount){
		if(!is_array($recharge_discount)){
			return false;
		}
		foreach ($recharge_discount as $key=>$value){
			$max[$key] = $value['max'];
		}
		array_multisort ( $max ,  SORT_ASC ,  $recharge_discount );
		return $recharge_discount;
	}
	/**
	 * 格式化价格
	 */
	function price_format ($money = 0)
	{
		return number_format ( $money , 2 , '.' , '' );
	}
	