---
This is a ThinkPHP project for weChat
---

#### 1. 安装
*   运行环境：php + apache + mysql
*   构建工具：node + npm + gulp + bower + sass

#### 2. `hostname` 域名/ip地址
*   开发环境：hostname = http://localhost:8088
*   生产环境：

#### 3. 首页地址
*   {{hostname}}/weChat/

#### 4. 前端 `API` 统一接口路径
*   请求地址：

        {{hostname}}/weChat/index.php/Api/Index/index
        
*   请求方式：POST

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

#### 5. 后台管理地址
*   {{hostname}}/weChat/index.php/Admin
