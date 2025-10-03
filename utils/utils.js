import { BASE_URL_API, TOKEN, KEY } from "../utils/config";
var randomstring = require("randomstring");

export function getDynamicEndpoint(module, path, query, authorization) {
    let url = `${BASE_URL_API}${module}${path ? path : ''}`;
    const params = [];
    if (query && typeof query === 'object' && !Array.isArray(query)) {
        for (const paramName in query) {
            let paramValue = query[paramName];
            if (paramValue === 'RANDOM') {
                paramValue = randomstring.generate(5);
            }
            if (paramValue === 'EMPTY') {
                params.push(paramName);
            } else {
                params.push(`${paramName}=${paramValue}`);
            }
        }
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