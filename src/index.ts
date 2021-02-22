/*
 * @Date: 2021-02-22 19:30:45
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-02-22 20:34:02
 */
// exnext
import 'core-js';
// exnext
import { aliyunReq2nodeReq, nodeResp2aliyunResp } from './util';
import { AliyunContext, AliyunRequest, AliyunResponse } from './@types/aliyun';
import fetch from 'node-fetch';


export const handler = async (
  aliyunReq: AliyunRequest,
  aliyunResp: AliyunResponse,
  aliyuncontext: AliyunContext
) => {
  try {
    const req = await aliyunReq2nodeReq(aliyunReq);
    const resp = await fetch(req);
    nodeResp2aliyunResp(resp, aliyunResp);
  } catch (error) {
    aliyunResp.setHeader('Content-Type', 'application/json; charset=utf-8');
    aliyunResp.setStatusCode(500);
    if (error instanceof Error) {
      const { message, stack, name } = error;
      aliyunResp.send(JSON.stringify({ message, name, stack }, undefined, 2));
    } else {
      aliyunResp.send(
        JSON.stringify({ message: 'unknown error', error }, undefined, 2)
      );
    }
  }
};
