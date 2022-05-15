import {io} from "socket.io-client";
import {cookieService} from "./cookie";

export default function(){
  const socket = io(`ws://kingo-tools.herokuapp.com:13329/socket.io/?EIO=4&transport=websocket`, {
    reconnectionDelayMax: 10000,
    // auth: {
    //   token: cookieService.getCookie("token")
    // },
    query: {},
    secure: true
  });
  return socket;
}