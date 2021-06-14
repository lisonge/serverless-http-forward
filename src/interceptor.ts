/*
 * @Date: 2021-03-18 15:48:07
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-06-14 15:10:06
 */

import {
  AfterForwardFunc,
  BeforeForwardFunc,
  End,
  Next,
} from './core/middleware';
import { config } from './config';
import { URL } from 'url';
import { BaseError } from './core/error';
import { Response } from 'node-fetch';

/**
 * 控制路由访问
 * @param latestResp
 * @returns
 */
export const routeFilterFunc: BeforeForwardFunc = (latestResp) => {
  const u = new URL(latestResp.url);
  if (
    config.allow_route_list.length > 0 &&
    !config.allow_route_list.some((v) => RegExp(v).test(u.pathname))
  ) {
    return End.from(
      new Response(
        JSON.stringify({ message: 'block invalid path' }, undefined, 2),
        {
          status: 403,
        }
      )
    );
  }
};

/**
 * 控制预检请求
 * @param latestReq
 * @returns
 */
export const corsBeforFunc: BeforeForwardFunc = (latestReq) => {
  if (latestReq.method === 'OPTIONS') {
    return End.from(
      new Response(undefined, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*',
        },
      })
    );
  }
};

/**
 * 跨域控制
 * @param latestResp
 * @returns
 */
export const corsAfterFunc: AfterForwardFunc = (latestResp) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
  } as { [key: string]: string };
  for (const key in headers) {
    latestResp.headers.set(key, headers[key]);
  }
  return Next.from(latestResp);
};
