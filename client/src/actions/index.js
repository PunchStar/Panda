import http from "./http-common";

export const xmit_event = (event_name, partner, user, interview, partner_userID) => {
    return http.post("/event", {
        e: event_name,
        p: partner,
        u: user,
        i: interview,
        q: '',
        c: '',
        pu: partner_userID
    });
}
export const log_event = (event_name, question_number, code, partner, interview, user) => {
    return http.post("/event", {
        e: event_name,
        p: partner,
        u: user,
        i: interview,
        q: question_number,
        c: code
    });
}
export const debug_console = (console_type, console_content) =>{
    if(process.env.NODE_ENV === 'development')
        console.log(console_type,console_content);
}