/*
 * @Date: 2021-02-22 19:30:45
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-06-14 15:20:22
 */
import 'source-map-support/register';
// exnext
import 'core-js';
// exnext
import { aliyunReq2nodeReq, nodeResp2aliyunResp } from './core/util';
import { AliyunContext, AliyunRequest, AliyunResponse } from './@types/aliyun';
import {
  BeforeForwardFunc,
  AfterForwardFunc,
  End,
  Next,
} from './core/middleware';
import fetch, { Request } from 'node-fetch';
import { BaseError } from './core/error';
import { corsAfterFunc, routeFilterFunc, corsBeforFunc } from './interceptor';

export const handler = async (
  aliyunReq: AliyunRequest,
  aliyunResp: AliyunResponse,
  aliyunCtx: AliyunContext
) => {
  try {
    const oldestReq = await aliyunReq2nodeReq(aliyunReq);
    let latestReq = oldestReq.clone();
    {
      const beforeFuncList: BeforeForwardFunc[] = [
        routeFilterFunc,
        corsBeforFunc,
      ];
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
      const afterFuncList: AfterForwardFunc[] = [corsAfterFunc];
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
    aliyunResp.setStatusCode(500);
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    } as { [key: string]: string };
    for (const key in headers) {
      aliyunResp.setHeader(key, headers[key]);
    }
    aliyunResp.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (error instanceof Error) {
      if (error instanceof BaseError) {
        aliyunResp.setStatusCode(error.status);
        aliyunResp.send(error.stringify());
      } else {
        const { message, stack, name } = error;
        aliyunResp.send(JSON.stringify({ message, name, stack }, undefined, 2));
      }
    } else {
      aliyunResp.send(
        JSON.stringify({ message: 'unknown error', error }, undefined, 2)
      );
    }
  }
};
