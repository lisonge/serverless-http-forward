/*
 * @Author: lisonge
 * @Date: 2021-08-19 15:44:02
 * @LastEditTime: 2021-08-19 15:44:24
 * @LastEditors: lisonge
 */
import { Response } from 'node-fetch';
import { URL } from 'url';
import { config } from '../config';
import {
    BeforeForwardHook,
    End
} from '../core/middleware';

/**
 * 控制路由访问
 * @param resp
 * @returns
 */
export const routeFilterHook: BeforeForwardHook = (resp) => {
    const u = new URL(resp.url);
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