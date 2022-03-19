import {FC} from "react";
import styled from "styled-components";
import {Skill} from "./Skill";

const StyledSkillsWrapper = styled.div`
  width: 18%;
  padding: 10px;
`;

export const Skills: FC = () => {
    return (
        <StyledSkillsWrapper>
            <Skill text="HTML" point={9}/>
            <Skill text="CSS" point={8}/>
            <Skill text="JavaScript" point={10}/>
            <Skill text="TypeScript" point={5}/>
            <Skill text="React" point={8}/>
            <Skill text="Redux" point={6}/>
            <Skill text="StyledComponents" point={8}/>
            <Skill text="Sass" point={3}/>
        </StyledSkillsWrapper>
    )
}