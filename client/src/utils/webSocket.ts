import {io} from "socket.io-client";
import {cookieService} from "./cookie";

export default function(){
  const socket = io(window.location.hostname,{
    reconnectionDelayMax: 10000,
    // auth: {
    //   token: cookieService.getCookie("token")
    // },
    query: {},
    secure: true
  });
  return socket;
}