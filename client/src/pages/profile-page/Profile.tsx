import {FC} from "react";
import styled from "styled-components";
import {Container} from "./components/Container";
import {Header} from "./components/header/Header";
import {Main} from "./components/main/Main";

const StyledProfile = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Profile: FC = () => {
  return (
    <StyledProfile>
      <Container>
        <Header/>
        <Main />
      </Container>
    </StyledProfile>
  )
}