/*
 * @Date: 2021-03-18 15:48:07
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-08-19 15:47:10
 */

import { AfterForwardHook, BeforeForwardHook } from '../core/middleware';
import { routeFilterHook } from './route';

import { corsAfterHook, corsPreflightedHook } from './cors';

export const beforeFuncList: BeforeForwardHook[] = [
    routeFilterHook,
    corsPreflightedHook,
];
export const afterFuncList: AfterForwardHook[] = [corsAfterHook];
