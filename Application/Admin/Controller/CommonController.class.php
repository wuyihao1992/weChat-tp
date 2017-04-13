<?php
namespace Admin\Controller;
use Think\Controller;
class CommonController extends Controller{
	protected function set_url_encode($data, $user_id){
		if (empty($data['user_name']) || empty($data['access_token'])) {
			$user = M('user');
			$user_info = $user->where("user_id = ".$user_id)->field("user_name, access_token")->find();
			$data['user_name'] = $user_info['user_name'];
			$data['access_token']  = $user_info['access_token'];
		}
		
	    foreach ($data as $key => $value) {
	        $str .=$key."=".urlencode($value)."&";
	    }
	    return trim($str,"&");
	}

	protected function jret($ret = 0, $msg = "", $data = array(),$pager=array()){
		echo json_encode(array(
				"ret" => $ret,
				"msg" => $msg,
				"data" => $data,
				"pager" => $pager
		));
	}

	/**
	 * 获取产品定价(代理商->模板系统)
	 * @param $agentId
	 * @return array
	 */
	protected function getMemberRate($agentId){
		$where = "user_id = ".$agentId;
		$member_rate = M('member_rate')->where($where)->find();
		if(empty($member_rate)){
			return false;
			exit;
		}else{
			return $member_rate;
			exit;
		}
	}

	/**
	 * 同步配置到模板系统
	 * @param $in, $agentId
	 * @return array
	 */
	public function set_tmp($in = false, $agentId){
		$user_id = $agentId;
		$data = array();
		$base_info = M('user_setting')->where('user_id = '.$user_id)->find();
		$user_info = M('user')->where('user_id = '.$user_id)->find();
		$base_info['user_name'] = $user_info['user_name'];
		$token_info = $user_info['access_token'];

		if(!empty($base_info))
		{
			if(!empty($base_info['site_logo']))
			{
				$base_info['site_logo'] = PHOTO_URL.$base_info['site_logo'];
			}
			if(!empty($base_info['qrcode']))
			{
				$base_info['qrcode'] = PHOTO_URL.$base_info['qrcode'];
			}
			if(!empty($token_info)){
				$base_info['access_token'] = $token_info;
			}
		}else{
			$this->jret(1,'获取基本信息失败');
			exit;
		}
// 		$Product = M('user_product');
// 		$productlist =  $Product->where('user_id = '.get_session('user_id').' AND is_set = 1')->order('product_id ASC')->select();
// 		if(empty($productlist)){
// 			$this->jret(1,'获取失败');
// 			exit;
// 		}
// 		$pro = array();
// 		foreach ($productlist as $val){
// 			$data['product_'.$val['pr_id']] = json_encode($val);
// 		}
		
		$HostModel = M('user_host');
		$hostinfo = $HostModel->where('user_id = '.$user_id)->find();
		if(empty($hostinfo)){
			$this->jret(1,'获取域名设置失败');
			exit;
		}else{
			$hostinfo['complete_domain'] = $hostinfo['sys_domain'].'.'.$hostinfo['sys_host'];
		}

		$member_rate = $this->getMemberRate($user_id);
		if(!empty($member_rate)){
			unset($member_rate['user_id']);
			$data['member_rate'] = json_encode($member_rate);
		}

		$data['base_info'] = json_encode($base_info);
		//$data['productlist']=json_encode($productlist);
		$data['hostinfo'] = json_encode($hostinfo);
		$pram = $this->set_url_encode($data);
		if(TEST){
			$url = "http://127.0.0.1/account/index.php/Api/System/getSetting?".$pram;
			// $url = "http://192.168.89.244/tpl/account/index.php/Api/System/getSetting?".$pram;
		}else{
			$url = "http://".$hostinfo['sys_domain'].'.'.$hostinfo['sys_host']."/account/index.php/Api/System/getSetting?".$pram;
		}

		$content = file_get_contents($url);
		if (empty($in)){
			echo $content;
			exit;
		}else{
			return $content;
		}
	}

	
}