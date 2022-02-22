import {FC, useEffect, useRef} from "react";
import {Form} from "./components/Form";
import styled from "styled-components";
import {BackgroundEffect} from "./BackgroundEffect/background-effectV2";
import {motion} from "framer-motion";

const LoginSection = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const StyledBackground = styled(motion.canvas)`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`;

export const LoginPage: FC = () => {

    let canvas = useRef<any>(null);

    useEffect(() => {
      if(canvas){
        const background = new BackgroundEffect(canvas.current);
        background.init();
        return () => {
          background.destroy();
        }
      }
    }, [canvas])

    return(
        <LoginSection>
            <StyledBackground ref={canvas} width={window.innerWidth} height={window.innerHeight} initial={{opacity: "0"}} animate={{opacity: "1"}}/>
            <Form />
        </LoginSection>
    )
}