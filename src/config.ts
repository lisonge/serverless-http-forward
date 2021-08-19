/*
 * @Date: 2021-02-22 20:22:14
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-08-19 15:46:45
 */

import TOML from '@iarna/toml';
import { readFileSync } from 'fs';
import { join } from 'path';

type Config = {
    author: string;
    forward_url: string;
    allow_route_list: string[];
};

export const config = TOML.parse(
    readFileSync(join(process.cwd(), '/config.toml'), 'utf-8')
) as unknown as Config;

