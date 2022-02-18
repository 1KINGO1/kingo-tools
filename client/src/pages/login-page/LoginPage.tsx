import {FC} from "react";
import {Form} from "./components/Form";
import styled from "styled-components";

const LoginSection = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const LoginPage: FC = () => {
    return(
        <LoginSection>
            <Form />
        </LoginSection>
    )
}