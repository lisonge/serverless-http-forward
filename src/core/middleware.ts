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

// function from<S extends typeof PayLoad, T extends ReqResp>(
//   _class: S,
//   value: T
// ) {
//   return new _class(value);
// }

export class Next<T extends ReqResp> extends PayLoad<T> {
    static from<T extends ReqResp>(value: T) {
        return new this(value);
    }
}
export class End<T extends ReqResp> extends PayLoad<T> {
    static from<T extends ReqResp>(value: T) {
        return new this(value);
    }
}

export interface BeforeForwardHook {
    (req: Request): IPromise<Next<Request> | End<ReqResp> | void>;
}

export interface AfterForwardHook {
    (resp: Response, req: Request): IPromise<
        Next<Response> | End<Response> | void
    >;
}
