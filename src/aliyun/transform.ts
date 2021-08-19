/*
 * @Date: 2021-02-21 20:23:34
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-08-19 15:31:52
 */

import { Headers, Request, Response } from 'node-fetch';
import getRawBody from 'raw-body';
import { URL } from 'url';
import { AliyunRequest, AliyunResponse } from './types';

/**
 * aliyunReq2nodeReq
 * @param aliyunReq
 * @param useRealPath if true url.pathname=aliyunReq.url else url.pathname=aliyunReq.path
 * @returns
 */
export async function aliyunReq2nodeReq(
    aliyunReq: AliyunRequest,
    useRealPath = false
): Promise<Request> {
    const { path, headers, method, queries } = aliyunReq;
    const url = new URL(
        `${headers['x-forwarded-proto']}://${headers['host']}${aliyunReq.url}`
    );
    for (const k in queries) {
        url.searchParams.set(k, queries[k]);
    }
    if (!useRealPath) {
        url.pathname = path;
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
