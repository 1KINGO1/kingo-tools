import {FC} from "react";
import styled from "styled-components";
import {UsersTable} from "./UsersTable";

const StyledAdmin = styled.div`
  padding: 10px;
`;

export const Admin: FC = () => {
  return(
    <StyledAdmin>
      <UsersTable/>
    </StyledAdmin>
  )
}