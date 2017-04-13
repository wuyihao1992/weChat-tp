<?php
namespace Home\Model;
use Think\Model;
class UserModel extends Model{
	/**
	 * 判断密码是否符合格式
	 * 开头字母只能是字母数字下划线6-18位
	 * @return boolean
	 */
	protected  function checkPwd()
	{
		$password = trim($_POST['password']);
		$reg = '^[a-zA-Z][a-zA-Z0-9#@]{5,17}$';
		if(!ereg($reg,$password))
		{
			return false;
		}else{
			return true;
		}
	}
	/**
	 * 判断用户名是否符合格式
	 */
	protected function checkName()
	{
		$username = trim($_POST['user_name']);
		$reg = "^[0-9a-zA-Z]{6,23}$";
		if(!ereg($reg,$username))
		{
			return false;
		}else{
			return true;
		}
	}
	/**
	 * 验证手机号码
	 */
	protected function checkTel()
	{
		$tel = $_POST['tel'];
		$reg = '^1[3|4|5|8][0-9]{9}$';
		if(!ereg($reg,$tel))
		{
			return false;
		}else{
			return true;
		}
	}
}