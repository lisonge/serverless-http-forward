/*
 * @Date: 2021-03-05 14:23:03
 * @lastEditors: lisonge
 * @Author: lisonge
 * @lastEditTime: 2021-03-05 18:08:10
 */
import { Request, Response } from 'node-fetch';

type ReqResp = Response | Request;
type IPromise<T> = T | Promise<T>;

class PayLoad<T extends ReqResp> {
  readonly value: T;
  constructor(value: T) {
    this.value = value;
  }
}

export class Next<T extends ReqResp> extends PayLoad<T> {}
export class End<T extends ReqResp> extends PayLoad<T> {}

export interface BeforeForwardFunc {
  (latestReq: Request, oldestReq: Request): IPromise<
    Next<Request> | End<ReqResp> | void
  >;
}

export interface AfterForwardFunc {
  (
    latestResp: Response,
    oldestResp: Response,
    latestReq: Request,
    oldestReq: Request
  ): IPromise<Next<Response> | End<Response> | void>;
}

