---
title: V2Ray
date: 2018-12-18
categories: 
 - Library
tags: 
 - tool
---

> V2Ray 像是一个集成工具，它集合了多种多样的协议和功能，对个人用户而言像是一个工具箱，可以使用各种各样的工具组合。
对开发者而言像是一个脚手架，可以在此基础上开发扩充自己需要的功能而节省开发时间。

## 使用 v2ray 搭梯子
1. 准备材料： 一台可以访问国外网站的服务器，一台可以上网的电脑

2. 安装服务器上的v2ray(以Centos 7为例)

    最新版的v2ray安装可以说是相当傻瓜式了，执行几行命令就可以把v2ray安装好：
    * 核对系统系统时间，要求服务器与客户端的时间误差不超过1分钟（注意：如果服务器是国外的，则要注意时区的问题）;
    
    * 运行下面的命令。
        下载脚本:
        ``` 
        $ wget https://install.direct/go.sh
        ```
        
        上面命令如果报 wget not found 的错误，则需要执行 wget 的安装命令：
        ``` 
        $ yum -y install wget
        ```
        
        下载好脚本后，执行脚本安装 v2ray:
        ``` 
        $ sudo bash go.sh
        ```
        
        接下来…… 没有了，可以启动了😁
        
        启动 v2ray的命令:
        ``` 
        $ sudo systemctl start v2ray
        ```
        
        停止 v2ray的命令:
        ``` 
        $ sudo systemctl stop v2ray
        ```
        
        重启 v2ray的命令:
        ``` 
        $ sudo systemctl restart v2ray
        ```
        
3. 安装客户端上的v2ray(以Win10为例)
    * Win10上的安装更加简单，就是直接去官网下载个zip包解压就能用，只要运行解压文件里的 v2ray.exe
    * 另外有两种方式设置代理，一种是配置浏览的代理，另一种是使用工具配置系统代理
    
        以firefox 为例, 菜单 -> 选项 -> 网络设置:
        
        ![浏览器设置](/img/firefox_setting.png)
        
    * ps：这里运行v2ray.exe 出现的是命令行，不是很友好。推荐去下载个v2rayN（可视化的工具）;

4. 修改服务器上 v2ray的config.js
    其实如果只是想要跑通，服务器的config.js可以不用改，
    只要去查看这个文件，拿到 `inbound.port` 、`inbound.settings.clients.id`、`inbound.settings.clients.alterId` 后在客户端config.js中填入，具体看下一部分。
    如果你有个性化的设置，记得在设置后，验证config.js 有效性再重启v2ray，命令如下：
    ``` 
    $ /usr/bin/v2ray/v2ray -test -config /etc/v2ray/config.json
    ```
    查看服务器上v2ray的运行状态
   ``` 
   $  service v2ray status
   ``` 
   
    
5. 修改客户端上 v2ray的config.js

    以下是我客户端配置，大伙参考一下就好,主要就修改了四处地方：
    `outbound.settings.vnext[0].address`、`outbound.settings.vnext[0].port`、`outbound.settings.vnext[0].users[0].id`、`outbound.settings.vnext[0].users[0].alterId`

    ``` 
    {
      "log": {
        "access": "",
        "error": "",
        "loglevel": ""
      },
      "inbound": {
        "port": 1080,
        "listen": "0.0.0.0",
        "protocol": "socks",
        "settings": {
          "auth": "noauth",
          "udp": true,
          "ip": "127.0.0.1",
          "clients": null
        },
        "streamSettings": null
      },
      "outbound": {
        "tag": "agentout",
        "protocol": "vmess",
        "settings": {
          "vnext": [
            {
              "address": "服务器ip",
              "port": "服务器上config.js中的port",
              "users": [
                {
                  "id": "服务器上config.js中的id",
                  "alterId": "服务器上config.js中的alterId",
                  "security": "aes-128-gcm"
                }
              ]
            }
          ],
          "servers": null
        },
        "streamSettings": {
          "network": "tcp",
          "security": "",
          "tcpSettings": null,
          "kcpSettings": null,
          "wsSettings": null
        },
        "mux": {
          "enabled": true
        }
      },
      "inboundDetour": null,
      "outboundDetour": [
        {
          "protocol": "freedom",
          "settings": {
            "response": null
          },
          "tag": "direct"
        },
        {
          "protocol": "blackhole",
          "settings": {
            "response": {
              "type": "http"
            }
          },
          "tag": "blockout"
        }
      ],
      "dns": {
        "servers": [
          "8.8.8.8",
          "8.8.4.4",
          "localhost"
        ]
      },
      "routing": {
        "strategy": "rules",
        "settings": {
          "domainStrategy": "IPIfNonMatch",
          "rules": [
            {
              "type": "field",
              "port": null,
              "outboundTag": "direct",
              "ip": [
                "0.0.0.0/8",
                "10.0.0.0/8",
                "100.64.0.0/10",
                "127.0.0.0/8",
                "169.254.0.0/16",
                "172.16.0.0/12",
                "192.0.0.0/24",
                "192.0.2.0/24",
                "192.168.0.0/16",
                "198.18.0.0/15",
                "198.51.100.0/24",
                "203.0.113.0/24",
                "::1/128",
                "fc00::/7",
                "fe80::/10"
              ],
              "domain": null
            }
          ]
        }
      }
    }
    ```

6. 启动客户试试看。更多配置可以参考 [v2ray_配置文件](https://www.v2ray.com/chapter_02/)

## 踩到的坑
1.  其实按照教程一步步往下走并没有其他很大的坑，我配了三次才成功的原因是我理解错了‘时间校准’这一步骤。
    因为v2ray的客户端和服务器端间验证是包括时间的验证的（要求客户端和服务器端时间误差在`一分钟`之内）。
    结果我直接把服务器上的时间改成我电脑（也就是客户端）的时间，结果无论怎么检查都检查不出错在哪了。
    后来重新查看文档，猛然想起我服务器是国外的，有时区的差别，于是将时间改了回去，这才解决问题。
    
    下面是查看系统(linux)时间和修改系统时间的命令：
    
    ``` 
    $ date -R
    Sun, 22 Jan 2017 10:10:36 -0500
    ```
    
    下面是修改系统时间的命令：
    
    ``` 
    $ sudo date --set="2017-01-22 16:16:23"
    Sun 22 Jan 16:16:23 GMT 2017
    ```

## 参考链接
以下地址有可能被墙 ，这就要各位看官自己想办法了😂
1. [官网地址](https://www.v2ray.com/)
2. [V2Ray 配置指南](https://toutyrater.github.io/)
3. [V2ray科学上网](http://www.gonewto.com/?post/gweuy4)
4. [V2Ray完全使用教程](https://yuan.ga/v2ray-complete-tutorial/)