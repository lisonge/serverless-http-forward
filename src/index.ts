/*
 * @Date: 2021-02-22 19:30:45
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-03-18 12:50:21
 */
// exnext
import 'core-js';
// exnext
import { aliyunReq2nodeReq, nodeResp2aliyunResp } from './util';
import { AliyunContext, AliyunRequest, AliyunResponse } from './@types/aliyun';
import { BeforeForwardFunc, AfterForwardFunc, End, Next } from './interceptor';
import fetch, { Request } from 'node-fetch';

export const handler = async (
  aliyunReq: AliyunRequest,
  aliyunResp: AliyunResponse,
  aliyuncontext: AliyunContext
) => {
  try {
    const oldestReq = await aliyunReq2nodeReq(aliyunReq);
    let latestReq = oldestReq.clone();
    {
      const beforeFuncList: BeforeForwardFunc[] = [];
      for (const beforeFunc of beforeFuncList) {
        const result = await beforeFunc(latestReq, oldestReq.clone());
        if (result instanceof Next) {
          latestReq = result.value;
        } else if (result instanceof End) {
          const { value } = result;
          if (value instanceof Request) {
            latestReq = value;
            break;
          } else {
            nodeResp2aliyunResp(value, aliyunResp);
            return;
          }
        }
      }
    }

    const oldestResp = await fetch(latestReq);
    let latestResp = oldestResp.clone();
    {
      const afterFuncList: AfterForwardFunc[] = [];
      for (const afterFunc of afterFuncList) {
        const result = await afterFunc(
          latestResp,
          oldestResp.clone(),
          latestReq.clone(),
          oldestReq.clone()
        );
        if (result !== undefined) {
          const { value } = result;
          if (result instanceof Next) {
            latestResp = value;
          } else {
            nodeResp2aliyunResp(value, aliyunResp);
            return;
          }
        }
      }
    }

    nodeResp2aliyunResp(latestResp, aliyunResp);
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
