import { motion } from "framer-motion";
import {FC} from "react";
import styled from "styled-components";
import {Text} from "../../../../components/Text";

const StyledSkill = styled.div<any>`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background-color: ${props => props.theme.colors.grayBlack};
  position: relative;
`;

const StyledSkillBox = styled<any>(motion.div)`
  height: 100%;
  width: ${props => props.point * 10 + "%"};
  position: absolute;
  top: 0;
  left: ${props => -props.point * 10 + "%"};
  border-radius: inherit;
  background-color: ${props => props.theme.colors.cyanWhite};
`;

interface Props{
    text: string,
    point: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
}

export const Skill: FC<Props> = ({text, point}) => {

    return (
        <div style={{margin: "10px 0 0 4px"}}>
            <Text style={{fontSize: "10px", padding: "5px"}}>{text}</Text>
            <StyledSkill>
                <StyledSkillBox point={point}
                                layout
                                animate={{left: 0, transition: {delay: 0.9, duration: 1}}}
                                exit={{left: -point * 10 + "%", transition: {duration: 1}}}
                />
            </StyledSkill>
        </div>
    )
};