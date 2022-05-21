import {FC, useEffect, useState} from "react";
import {Routes, Route, Navigate, useNavigate} from "react-router-dom";
import {LoginPage, Profile, Introduction, RegistrationPage, Bio} from "./pages";
import {useSelector} from "react-redux";
import {RootState} from "./store/store";
import config from "./config/config";
import {User} from "./store/actions/authActions";
import {AnimatePresence} from "framer-motion";
import {useLocation} from 'react-router-dom';
import {BioButton} from "./components/BioButton";
import {SocketError} from "./pages/socket-error-page/SocketError";
import webSocket from "./utils/webSocket";
import {message} from "antd";
import {Socket} from "socket.io-client";

import newMessageSound from "./assets/new-message.mp3";

import useSound from "use-sound";

export let socket: Socket;

export const App: FC = () => {
    const location = useLocation();

    const isAuth = useSelector<RootState>(state => state.auth.isAuth);
    const user = useSelector<RootState>(state => state.auth.user) as User;
    const guildId = useSelector<RootState>(state => state.bot.currentGuild);

    const [connected, setConnect] = useState(false);

    let navigator = useNavigate();

    useEffect(() => {
        socket = webSocket();

        socket.on("connect", () => {
            setConnect(true);
        });
        socket.on("disconnect", () => {
            setConnect(false);
            navigator("/socket-error");
        });

        socket.on("modal_create", ({text}) => {
            message.info(text);
        })

        return () => {
            socket.disconnect();
        }
    }, [])

    return (
        <>
            <AnimatePresence exitBeforeEnter initial={false}>
                <Routes location={location} key={location.pathname}>
                    {isAuth ? (
                      <>
                          <Route path="/profile" element={<Profile/>}>
                              <Route path="intro" element={<Introduction/>}/>
                              {config.pages.map(page => {
                                  const isAllow = user.flags.some((flag: { id: number; }) => page.allowed.includes(flag.id));
                                  if (isAllow) {
                                      return (<Route path={page.link} element={page.component}/>)
                                  } else {
                                      return <></>
                                  }
                                  ;
                              })}
                              {guildId ? config.botSubPages.map(page => {
                                  return (<Route path={page.link} element={page.component}/>)
                              }) : ""}
                          </Route>
                      </>

                    ) : (
                        <>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/registration" element={<RegistrationPage/>}/>
                            <Route path="/bio" element={<Bio/>}/>
                        </>
                    )}
                    <Route path="*" element={<Navigate to={isAuth ? "/profile/intro" : "/login"}/>}/>
                    {connected ? "" : <Route path="/socket-error" element={<SocketError/>} />}
                </Routes>
            </AnimatePresence>
            {
                ["/login", "/password", "/bio"].includes(location.pathname) ? <BioButton /> : ""
            }
        </>
    )
}