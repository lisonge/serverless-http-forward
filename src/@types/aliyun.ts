/*
 * @Date: 2021-02-21 19:52:00
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-03-18 12:49:27
 */

import stream from 'stream';
import internal from 'stream';

/**
 * @see <https://help.aliyun.com/document_detail/156876.html>
 */
export interface AliyunContext {
  requestId: string;
  credentials: Credentials;
  function: Function;
  service: Service;
  region: string;
  accountId: string;
}
interface Credentials {
  accessKeyId: string;
  accessKeySecret: string;
  securityToken: string;
}
interface Service {
  name: string;
  logProject: string;
  logStore: string;
  qualifier: string;
  versionId: string;
}

/**
 * @see <https://help.aliyun.com/document_detail/74757.html>
 */
export interface AliyunRequest extends internal.Readable {
  headers: { [key: string]: string };
  path: string;
  queries: { [key: string]: string };
  url: string;
  clientIP: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH';
}

export interface AliyunResponse {
  setStatusCode: (statusCode: number) => void;
  setHeader: (headerKey: string, headerValue: string) => void;
  deleteHeader: (headerKey: string) => void;
  send: (body: string | stream.Readable | Buffer) => void;
}

interface HandledInvocationError extends Error {
  // i do not know what its [internal realization] is
}

/**
 * @see <https://help.aliyun.com/document_detail/156876.html>
 */
export interface AliyunCallback {
  (error: null, data: Buffer): Buffer;
  (error: null, data: object): string;
  (error: null, data: Exclude<any, Buffer | object>): string;
  (error: NonNullable<any>, data: any): HandledInvocationError;
}
