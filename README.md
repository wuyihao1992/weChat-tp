---
This is a ThinkPHP project for weChat
---

#### {{hostname}} 域名/ip地址
*   运行环境：php + apache + mysql
*   构建工具：node + npm + gulp + bower + sass
*   开发环境：http://localhost:8088

#### 首页地址
*   {{hostname}}/weChat/

#### 前端 `API` 统一接口路径
*   请求地址：

        {{hostname}}/weChat/index.php/Api/Index/index

*   请求参数：

        {
            "tranCode" : 0,
            "data" : {
                "id" : 1,
                "name" : 123
            }
        }

*   参数说明：
  
        `tranCode` : 业务操作码
        `data`  : 业务操作对应参数


#### 后台管理地址
*   {{hostname}}/weChat/index.php/Admin
