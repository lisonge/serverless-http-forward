/*
 * @Date: 2021-03-19 00:37:41
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-03-19 00:37:49
 */

export class BaseError extends Error {
    readonly status: number;
    constructor(status: number, message?: string) {
        super(message);
        this.status = status;
    }
    stringify() {
        return BaseError.stringify(this);
    }
    static stringify(e: Error) {
        const { message } = e;
        return JSON.stringify({ message });
    }
    static from(status: number, message?: string) {
        return new BaseError(status, message);
    }
}
