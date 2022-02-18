import styled from "styled-components";
import {FC} from "react";

const StyledTags = styled.div`
  margin: 0 auto 0 15px;
`

export const Tags: FC = ({ children }) => {
  return(
    <StyledTags>
      {children}
    </StyledTags>
  )
}