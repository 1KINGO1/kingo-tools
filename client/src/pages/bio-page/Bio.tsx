import {FC} from "react";
import styled from "styled-components";
import {motion} from "framer-motion";
import {Title} from "./components/Title";
import {Text} from "../../components/Text";
import {Photo} from "./components/Photo";
import {Skills} from "./components/Skills/Skills";
import { About } from "./components/About/About";

const BioSection = styled(motion.section)``;

const BioSectionAnimation = styled(motion.div)`
  background-color: ${props => props.theme.colors.dark};
  border-radius: 100%;
  position: absolute;
  bottom: 40px;
  right: 40px;
  z-index: -9999999999;
`

export const Bio: FC = () => {
    return (
        <>
            <BioSectionAnimation initial={{width: "0px", height: "0px"}}
                                 animate={{width: "200vw", height: "200vw", x: "75vw", y: "75vw"}}
                                 exit={{width: "0px", height: "0px", x: 0, y: 0}}
                                 transition={{duration: 0.8, type: "ease-in-out"}}

            />
            <BioSection initial={{opacity: 0}}
                        animate={{opacity: 0.85, transition: {delay: 1.1}}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.5}}>
                <Title>
                    <div>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <Text style={{color: "cyanWhite", fontSize: "30px"}}>
                                XXX XXXXX XXXXXXXXXXXX
                            </Text>
                            <Text style={{color: "cyanWhite", fontSize: "25px", margin: "0 0 0 20px"}}>
                                {new Date().getFullYear() - 2004} лет
                            </Text>
                        </div>
                    </div>
                    <Photo src="data:image/jpeg;base64,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"/>
                </Title>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <Skills />
                    <About />
                </div>
            </BioSection>
        </>
    )
}