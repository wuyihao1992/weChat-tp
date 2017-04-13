<?php
	/**
	 * 管理员记录操作模块
	 * @param $user_id：代理商id, $info：操作信息
	 * @return array
	 */
	function admin_log($user_id,$info)
	{
		if(empty($user_id) || empty($info)){
			return false;
		}else{
			$Admin_log = M('admin_log');
			$admin_id = get_session('admin_id');
			// $admin_id = 1;
			$data = array(
					'admin_id' => $admin_id,
					'user_id' => $user_id,
					'log_info' => $info,
					'create_time' => NOW_TIME,
					);
			if($Admin_log->add($data)){
				return true;
			}else{
				return false;
			}
		}
	}

	/**
	 * 管理员发放代金券
	 * @param $user_id：代理商id, $coupon：发放的代金券
	 * @return array
	 */
	function admin_pay($user_id,$coupon)
	{
    	$admin_pay = M('admin_pay');
		$admin_id = get_session('admin_id');
		// $admin_id = 1;
		$data = array(
				'admin_id' => $admin_id,
				'user_id' => $user_id,
				'coupon' => $coupon,
				'create_time' => NOW_TIME,
				);
		if($admin_pay->add($data)){
			return true;
		}else{
			return false;
		}
	}