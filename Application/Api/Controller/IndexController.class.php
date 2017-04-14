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
			echo '您请求的参数为:<br/>';

			$str = '';
			foreach ($data as $k => $val){
                $str .= '<tr><td>'. $k .'</td><td>'. $val .'</td></tr>';
            }

            echo '<style>#table-5 thead th {background-color: rgb(156, 186, 95);color: #fff;border-bottom-width: 0;}#table-5 td {color: #000;}#table-5 tr, #table-5 th {border: 1px solid rgb(156, 186, 95);}#table-5 td, #table-5 th {padding: 5px 10px;font-size: 12px;font-family: Verdana;font-weight: bold;}#table-5 tr:nth-child(even){background: rgb(230, 238, 214)}#table-5 tr:nth-child(odd){background: #FFF}</style>'.
                '<table id="table-5"><thead><tr><td>参数</td><td>值</td></tr></thead><tbody>'. $str .'</tbody></table>';
		}
	}

?>

