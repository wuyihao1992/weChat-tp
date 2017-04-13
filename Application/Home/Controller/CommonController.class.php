<?php
namespace Home\Controller;
use Think\Controller;
class CommonController extends Controller{
	protected function send_email($to,$title,$body,$from="睿江代理商服务系统",$user_name = '',$access_token = ''){
		if(empty($to) || empty($title) || empty($body) || empty($from)){
			return false;
		}else{
			$data['To'] = $to;
			$data['From'] = $from;
			$data['Title'] = $title;
			$data['Body'] = $body;
			if(!empty($user_name) && !empty($access_token)){
				$data['username'] = $user_name;
				$data['access_token']  = $access_token;
			}
			$pram = $this->set_url_encode($data);
			$url = VM_URL.'/sendMail.php?'.$pram;
			//0.5秒返回成功
			file_get_contents($url,$this->get_content_cfg(0.5));
			return true;
		}
	}
	protected function jret($ret = 0, $msg = "", $data = array(),$pager=array()){
		echo json_encode(array(
				"ret" => $ret,
				"msg" => $msg,
				"data" => $data,
				"pager" => $pager
		));
	}

	protected function set_url_encode($data){
		$Db = M('');
		if(empty($data['username']) || empty($data['access_token']))
		{
			$user_info = get_session('user_info');
	   		$data['username'] = $user_info['user_name'];
			$data['access_token']  = get_session('access_token');
		}
	    foreach ($data as $key => $value) {
	        $str .=$key."=".urlencode($value)."&";
	    }
	    return trim($str,"&");
	}

	protected function get_content_cfg($time){
		$get_cfg = array(   
	        'http'=>array(   
	        'method'=>"GET",   
	        'timeout'=>$time,//单位秒  
   			 )   
   	 	);
		return stream_context_create($get_cfg);
	}
	/**
	 * 获取member的费率
	 */
	protected function getMemberRate(){
		$user_id = get_session('user_id');
		$where = "user_id = ".$user_id;
		$member_rate = M('member_rate')->where($where)->find();
		if(empty($member_rate)){
			return false;
			exit;
		}else{
			return $member_rate;
			exit;
		}
	}

	protected function get_day($time,$count,$deadline = 0){
		if($deadline == 0){
			$date = date("Y-m-d");
		}else{
			$date = date("Y-m-d",$deadline);
		}
		if(preg_match('/^(月)|(年)|(天)$/i',$time,$match)){
			switch ($time) {
		        case '月':
		            $date2 = date("Y-m-d",strtotime("$date   +$count   month"));
		            break;
		        case '天':
		            $date2 = date("Y-m-d",strtotime("$date   +$count   day"));
		            break;
		        case '年':
		            $date2 = date("Y-m-d",strtotime("$date   +$count   year"));
		            break;
		        default:
		            $date2 = $time;
		            break;
	    	}
			$datetime1 = strtotime($date)/24/60/60;
		    $datetime2 = strtotime($date2)/24/60/60;
		    $day = ceil($datetime2-$datetime1);
		}else{
		  	if($deadline == 0){
				$datetime1 = strtotime(date("Y-m-d"));
			}else{
				$datetime1 = $deadline;
			}
		    $datetime2 = strtotime(date($time));
		    if (empty($datetime2) || $datetime1 >= $datetime2) {
		    }else{
		        $day = (int)ceil((($datetime2 - $datetime1) / (60 * 60 *24)));
		    }
		}
		return $day;
	}


	public function send_post($url, $post_data) {  
		  $postdata = http_build_query($post_data);  
		  $options = array(  
			    'http' => array(  
			      'method' => 'POST',  
			      'header' => 'Content-type:application/x-www-form-urlencoded',  
			      'content' => $postdata,  
			      'timeout' => 15 * 60 // 超时时间（单位:s）  
			    )  
		  );  
		  $context = stream_context_create($options);  
		  $result = file_get_contents($url, false, $context);   
		  return $result;  
	}
	
}