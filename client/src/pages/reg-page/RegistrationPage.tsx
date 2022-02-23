import {FC, useEffect, useRef} from "react";
import styled from "styled-components";
import {motion} from "framer-motion";
import {Form} from "./components/Form";
import {BackgroundEffect} from "../../components/BackgroundEffect/background-effect";
import {Background} from "../../components/Background";

const RegSection = styled(motion.section)`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;


export const RegistrationPage: FC = () =>  {

  let canvas = useRef<any>(null);

  useEffect(() => {
    if (canvas) {
      const background = new BackgroundEffect(canvas.current);
      background.init();
      return () => {
        background.destroy();
      }
    }
  }, [canvas])

  return(
    <RegSection initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}>
      <Background ref={canvas}
                  width={window.innerWidth}
                  height={window.innerHeight}
      />
      <Form />
    </RegSection>
  )
}