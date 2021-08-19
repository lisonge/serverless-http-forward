/*
 * @Author: lisonge
 * @Date: 2021-08-19 14:48:17
 * @LastEditTime: 2021-08-19 15:47:30
 * @LastEditors: lisonge
 */

import fetch, { BodyInit, Request, Response } from 'node-fetch';
import { afterFuncList, beforeFuncList } from '../interceptor';
import { BaseError } from './error';
import { End, Next } from './middleware';

export const handler = async (req: Request): Promise<Response> => {
    try {
        for (const beforeFunc of beforeFuncList) {
            const result = await beforeFunc(req);
            if (result instanceof Next) {
                req = result.value;
            } else if (result instanceof End) {
                const { value } = result;
                if (value instanceof Request) {
                    req = value;
                    break;
                } else {
                    return value;
                }
            }
        }
        let resp = await fetch(req);
        for (const afterFunc of afterFuncList) {
            const result = await afterFunc(resp, req);
            if (result !== undefined) {
                const { value } = result;
                if (result instanceof Next) {
                    resp = value;
                } else {
                    return value;
                }
            }
        }
        return resp;
    } catch (error) {
        let statusCode = 500;
        let body: BodyInit;
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
            'Content-Type': 'application/json; charset=utf-8',
        } as { [key: string]: string };

        if (error instanceof Error) {
            if (error instanceof BaseError) {
                statusCode = error.status;
                body = error.stringify();
            } else {
                const { message, stack, name } = error;
                body = JSON.stringify({ message, name, stack }, undefined, 2);
            }
        } else {
            body = JSON.stringify(
                { message: 'unknown error', error },
                undefined,
                2
            );
        }
        return new Response(body);
    }
};
