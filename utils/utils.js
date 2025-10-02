import { BASE_URL_API, TOKEN, KEY, BOARD } from "../utils/config";

export function getEndpoint(id) {
    return `${BASE_URL_API}${BOARD}${id}?key=${KEY}&token=${TOKEN}`;
}
