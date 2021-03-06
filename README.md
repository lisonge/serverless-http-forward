<!--
 * @Date: 2021-02-22 19:36:04
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-02-23 18:45:05
-->

# serverless-http-forward

阿里云 函数计算 HTTP 转发

## 说明

转发 HTTP 请求

### 不会转发的 HTTP Request Header 字段

- host

### 不会转发的 HTTP Response Header 字段

- connection
- content-encoding
- content-length
- date
- keep-alive
- transfer-encoding

### 使用

更改 `/config.toml` 中的 `forward_url` 为要转发的 HTTP URL

## 用途

当 访问 <https://i.songe.li> 时

会调用 阿里云的HTTP函数(香港地区) 转发 此HTTP请求

到 (上海地区)服务器的 <http://47.103.215.184:8888>，然后转发回复

以 较低廉/零 的价格实现 无备案域名解析到 内地服务器

## 延迟

测试访问延迟

```shell
❯ curl -o /dev/null -s -w %{time_namelookup}:%{time_connect}:%{time_starttransfer}:%{time_total} 'http://47.103.215.184:8888'
0.000018:0.052224:0.252735:0.252797%
❯ curl -o /dev/null -s -w %{time_namelookup}:%{time_connect}:%{time_starttransfer}:%{time_total} 'https://i.songe.li'
0.115642:0.159558:0.509337:0.509372%
```

在只作为 API 接口的情况下 延迟在可接受范围内
