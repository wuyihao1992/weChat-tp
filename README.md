﻿---
This is a ThinkPHP project for weChat <br/>
@author wuyihao,840461198@qq.com
---

#### 1. 安装
*   运行环境：php + apache + mysql
*   构建工具：node + npm + gulp + bower + sass

#### 2. `hostname` 域名/ip地址
*   开发环境：hostname = http://localhost:8088
*   生产环境：

#### 3. `Home` 模块，前端模块
*   首页地址：
        
        {{hostname}}/weChat/
        
*   测试页面 `test.html` ，访问地址：
        
        {{hostname}}/weChat/index.php/Home/Index/test
        
#### 4. `API` 模块，前端 ajax 请求 API 模块
*   `API` 统一接口地址：

        {{hostname}}/weChat/index.php/Api/Index/index
        
*   请求方式：
        
        POST

*   请求参数：

        {
            "tranCode" : 0,
            "data" : {
                "id" : 1,
                "name" : 123
            }
        }

*   参数说明：
  
        "tranCode" : 业务操作码
        "data"  : 业务操作对应参数

#### 5. `Admin` 模块，后台管理模块
*   首页地址：

        {{hostname}}/weChat/index.php/Admin/Index
