<?php
	namespace Api\Controller;
	use Api\Controller\CommonController;
	
	class IndexController extends CommonController {
		public function index(){
			$this -> doAction();
			
			// TODO: 调用类方法
			//$this -> getController('Test/index',['id' => 1, 'name' => 123]);
			
			// TODO： 视图显示
			//$this -> showView();
	    }
		
		/**
		 * @method 封装前端ajax请求地址
		 * @ajax ajax请求统一地址 http://127.0.0.1:8088/weChat/index.php/Api/Index/index
		 * @param int tranCode 业务操作码 eg.1003
		 * @param object data 参数 {'id' : 1, 'name' : 'test'} 
		 */
		public function doAction(){
			$form = file_get_contents("php://input");
	        $param = json_decode($form, true);
	
			$tranCode = $param['tranCode'];
			if (!isset($tranCode)) {
				$trueParam = [
					'tranCode' => 1003,
					'data' => [
						'id' => 1,
						'name' => 'test'
					]
				];
				$this -> jret(1,'参数错误，tranCode丢失。参数列表如下：',$trueParam);
				return;
			}
			
			$url_tranCode = C('url_tranCode');
			R($url_tranCode[$tranCode], array($param['data']));
		}
		
		/**
		 * @method 视图显示
		 * @ajax http://127.0.0.1:8088/weChat/index.php/Api/Index/index
		 * @param int tranCode 业务操作码  eg.1003
		 * @param object data 参数 ['id' => 1, 'name' => 123]
		 */
		public function showView(){
			$form = file_get_contents("php://input");
	        $param = json_decode($form, true);
	
			$tranCode = $param['tranCode'];
			if (!isset($tranCode)) {
				$this -> jret(1,'参数错误，tranCode丢失');
				return;
			}
			
			$url_tranCode = config('url_tranCode');
			return view($url_tranCode[$tranCode],['name'=>'thinkphp']);		
		}
		
		/**
		 * @method 访问其他控制器
		 * @param string $url 控制器/方法
		 * @param object $params ['id' => 1, 'name' => 123]
		 */
		public function getController($url = 'Test/index', $params = ['id' => -1]){
			// FIXME: tp5.0 不能用 R($url, array($params));
			R($url, array($params));
		}
		
		public function test($data){
			echo 'success! welcome to Index/test<br/>';
			echo 'data:';
			var_dump($data);
		}
	}

?>