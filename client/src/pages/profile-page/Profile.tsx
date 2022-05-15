import {FC, useEffect} from "react";
import styled from "styled-components";
import {Container} from "./components/Container";
import {Header} from "./components/header/Header";
import {Main} from "./components/main/Main";
import webSocket from "../../utils/webSocket";
import {message} from "antd";
import {useNavigate} from "react-router-dom";
import {io} from "socket.io-client";
import {cookieService} from "../../utils/cookie";
import {socket} from "../../App";

const StyledProfile = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Profile: FC = () => {

  useEffect(() => {
    socket.emit("auth", {token: cookieService.getCookie("token")})
  }, [])

  return (
    <StyledProfile>
      <Container>
        <Header/>
        <Main />
      </Container>
    </StyledProfile>
  )
}