import { BASE_URL_API, TOKEN, KEY, BOARD } from "../utils/config";
var randomstring = require("randomstring");

export function getDynamicEndpoint(module, path, query, authorization) {
    let url = `${BASE_URL_API}${module}${path ? path : ''}`;
    const params = [];
    if (Array.isArray(query)) {
        query.forEach(paramName => {
            if (typeof paramName === 'string') {
                const randomValue = randomstring.generate(5);
                params.push(`${paramName}=${randomValue}`);
            }
        });
    }
    if (authorization === true) {
        params.push(`key=${KEY}`);
        params.push(`token=${TOKEN}`);
    }
    if (params.length > 0) {
        url += `?${params.join('&')}`;
    }
    return url;
}