<?php
namespace Api\Model;
use Think\Model\RelationModel;
class OrderModel extends RelationModel{
	protected $_link = array(
				'_as'=>'o',    
				'Account_log'=>array(        
					'mapping_type'      => self::BELONGS_TO,       
					'class_name'    => 'Account_log',        
					'foreign_key'   => 'pay_id',
					'mapping_name'  => 'log',
					'condition ' => 'pay_id = log_id',	        
					'as_fields' => 'account_sn,ac_id,pay_type,total_money,online_pay,recharge_pay,coupon_pay,change_time,change_desc,change_type,pay_status,pay_time',        
					),);
}