/*
 * @Date: 2021-02-21 20:23:34
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-02-22 20:39:48
 */
import { AliyunRequest, AliyunResponse } from './@types/aliyun';
import { Request, Response, Headers } from 'node-fetch';
import getRawBody from 'raw-body';
import { URL } from 'url';
import { config } from './config';
import { join } from 'path';


export async function aliyunReq2nodeReq(
  aliyunReq: AliyunRequest
): Promise<Request> {
  const { path, headers, method, queries } = aliyunReq;
  const url = new URL(config.forward_url);
  url.pathname = join(url.pathname, path);
  for (const k in queries) {
    url.searchParams.set(k, queries[k]);
  }
  let body: Buffer | undefined = undefined;
  if (method == 'POST') {
    body = await getRawBody(aliyunReq);
  }
  const req = new Request(url, { headers: new Headers(headers), method, body });
  return req;
}

export async function nodeResp2aliyunResp(
  resp: Response,
  aliyunResp: AliyunResponse
) {
  resp.headers.forEach((value, name) => {
    aliyunResp.setHeader(value, name);
  });
  aliyunResp.setStatusCode(resp.status);
  aliyunResp.send(await resp.buffer());
}
