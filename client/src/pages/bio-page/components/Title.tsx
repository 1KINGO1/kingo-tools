import {FC} from "react";
import styled from "styled-components";

const BioTitle = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
`

export const Title: FC = ({children}) => {
    return (
        <BioTitle>
            {children}
        </BioTitle>
    )
}