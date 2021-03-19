/*
 * @Date: 2021-02-22 20:22:14
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-03-19 00:33:16
 */

import TOML from '@iarna/toml';
import { readFileSync } from 'fs';
import { join } from 'path';

interface Config {
  author: string;
  forward_url: string;
  allow_route_list: string[];
}

let config: Config = TOML.parse(
  readFileSync(join(process.cwd(), '/config.toml'), 'utf-8')
) as any;

export { config };
