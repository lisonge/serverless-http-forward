/*
 * @Date: 2021-02-22 23:23:46
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-08-19 15:52:25
 */

import fetch from 'node-fetch';

async function main() {
    const resp = await fetch('http://47.103.215.184:8888');
    console.log(await resp.text());
}
main();
