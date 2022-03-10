import http from "./http-common";

export const xmit_event = (data) => {
    return http.post("/event", data);
}
export const log_event = (data) => {
    return http.post("/event", data);
}
