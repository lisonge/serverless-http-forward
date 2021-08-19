/*
 * @Date: 2021-02-21 19:52:00
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-08-19 15:32:45
 */

import stream from 'stream';

/**
 * @see <https://help.aliyun.com/document_detail/156876.htm#section-mcp-kix-v2j>
 */
export type AliyunContext = {
    requestId: string;
    credentials: Credentials;
    function: Function;
    service: Service;
    region: string;
    accountId: string;
};
type Credentials = {
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
};
type Service = {
    name: string;
    logProject: string;
    logStore: string;
    qualifier: string;
    versionId: string;
};

/**
 * @see <https://help.aliyun.com/document_detail/74757.html#section-960-nx8-b4i>
 */
export type AliyunRequest = stream.Readable & {
    headers: { [key: string]: string } & {
        host: string;
        'x-forwarded-proto': 'https' | 'http';
    };
    /**
     * /函数接收路径
     */
    path: string;
    queries: { [key: string]: string };
    /**
     * /服务路径+函数接收路径+查询参数
     */
    url: string;
    clientIP: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH';
};
/**
 * @see <https://help.aliyun.com/document_detail/74757.html#section-t19-6rk-hs5>
 */
export type AliyunResponse = {
    setStatusCode: (statusCode: number) => void;
    setHeader: (headerKey: string, headerValue: string) => void;
    deleteHeader: (headerKey: string) => void;
    send: (body: string | stream.Readable | Buffer) => void;
};

type HandledInvocationError = Error & {
    // i do not know what its [internal realization] is
};

/**
 * @see <https://help.aliyun.com/document_detail/156876.html>
 */
export type AliyunCallback = {
    (error: null, data: Buffer): Buffer;
    (error: null, data: object): string;
    (error: null, data: Exclude<any, Buffer | object>): string;
    (error: NonNullable<any>, data: any): HandledInvocationError;
};
