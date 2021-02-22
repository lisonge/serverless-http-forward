<!--
 * @Date: 2021-02-22 19:36:04
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-02-23 01:12:34
-->

# serverless-http-forward

阿里云 函数计算 HTTP 转发

## 用途

当 访问 <https://i.songe.li> 时

会调用 阿里云的HTTP函数 转发 此HTTP请求

到 内地服务器的 <http://47.103.215.184:8888>，然后转发回复

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
