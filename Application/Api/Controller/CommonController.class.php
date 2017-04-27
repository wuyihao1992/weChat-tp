<?php
	namespace Api\Controller;
	use Think\Controller;
	
	class CommonController extends Controller{
		/**
		 * @method json 格式封装
		 * @param int $ret 状态码 {0 : 成功, 1 : 失败}
		 * @param string $msg 状态信息
		 * @param object $data 返回数据
		 * @param object $pager 分页内容
		 */	
		protected function jret($ret = 1, $msg = '暂无数据', $data = array(), $pager = array()){
			echo json_encode(array(
				'ret' => $ret,
				'msg' => $msg,
				'data' => $data,
				'pager' => $pager,
				'time' => time()
			));
		}
		
		/**
		 * @method 获取session
		 * @param string $key session字段
		 */
		protected function getSession(){
			session_start();
			
			session_write_close();
		}
		
		/**
		 * @method 设置session
		 * @param string $key session字段
		 */
		protected function setSession(){
			session_start();
			
			session_write_close();
		}		
		
		/**
		 * @method 列表分页计算
		 * @param int $conut 查询结果总条数
		 * @param int $page 当前页码
		 * @param int $pageSize 每页条数
		 * @return object {'page' : 当前页码, 'pageSize' : 每页条数, 'limit' : limit, 'pages' : 总页数, 'count' : 总条数}
		 */
		protected function pager($conut = 0, $page = 1, $pageSize = 10){
			$start = ($page - 1) * $pageSize;
			$limit = '$start , $pageSize';
			
			if ($conut % $pageSize != 0) {
				$pages = ((int)($conut / $pageSize)) + 1 ;
			}else {
				$pages = ((int)($conut / $pageSize));
			}
			
			return array(
				'page' => $page,
				'pageSize' => $pageSize,
				'limit' => $limit,
				'pages' => $pages,
				'count' => $conut
			);
			//$result = $Db->table('agent_client as client,agent_user as user,agent_client_vm as vm')->field($field)->where($where)->group("client.id")->limit($limit)->order("id desc")->select();
		}
		
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
		
	
	}

?>