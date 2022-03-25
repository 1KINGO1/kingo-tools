import {FC} from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  width: 98vw;
  height: 98vh;

  border-radius: 30px;
  
  background-color: ${props => props.theme.colors.darkPrimary};
  overflow: hidden;
`

export const Container: FC = ({ children }) => {
  return(
    <StyledContainer>
      {children}
    </StyledContainer>
  )
}