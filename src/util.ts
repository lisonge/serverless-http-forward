/*
 * @Date: 2021-02-21 20:23:34
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-02-23 00:33:27
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
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    body = await getRawBody(aliyunReq);
  }
  const h = new Headers(headers);
  ['host'].forEach((v) => {
    h.delete(v);
  });
  const req = new Request(url, { headers: h, method, body });
  return req;
}

export async function nodeResp2aliyunResp(
  resp: Response,
  aliyunResp: AliyunResponse
) {
  const headers = new Headers(resp.headers);
  [
    'connection',
    'content-encoding',
    'content-length',
    'date',
    'keep-alive',
    'transfer-encoding',
  ].forEach((v) => {
    headers.delete(v);
  });
  headers.forEach((value, name) => {
    aliyunResp.setHeader(name, value);
  });
  aliyunResp.setStatusCode(resp.status);
  aliyunResp.send(await resp.buffer());
}
