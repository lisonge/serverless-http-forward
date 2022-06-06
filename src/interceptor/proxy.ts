import { Response, Request, Headers } from 'node-fetch';
import { URL } from 'url';
import { config } from '../config';
import { BeforeForwardHook, Next } from '../core/middleware';

const proxyUrl = new URL(config.forward_url ?? 'http://127.0.0.1/');

export const proxyHook: BeforeForwardHook = (req) => {
    const u = new URL(req.url);
    u.protocol = proxyUrl.protocol;
    u.hostname = proxyUrl.hostname;
    u.port = proxyUrl.port;
    u.username = proxyUrl.username;
    u.password = proxyUrl.password;
    proxyUrl.searchParams.forEach((v, n) => {
        u.searchParams.set(n, v);
    });
    if (proxyUrl.pathname != '/') {
        if (proxyUrl.pathname.endsWith('/')) {
            u.pathname = proxyUrl.pathname + u.pathname.slice(1);
        } else {
            u.pathname = proxyUrl.pathname + u.pathname;
        }
    }
    return Next.from(new Request(u, req));
};

export const refererHook: BeforeForwardHook = (req) => {
    const headers = new Headers(req.headers);
    headers.set('origin', proxyUrl.origin);
    headers.set('referer', proxyUrl.origin);
    return Next.from(new Request(req, { headers }));
};
