import {FC} from "react";
import styled from "styled-components";
import {Text} from "../../../../components/Text";
import {Routes, Route, Outlet} from "react-router-dom";

const StyledViewContent = styled.div`
  padding: 20px;
  width: 80%;
`

export const ViewContent: FC = () => {
  return (
    <StyledViewContent>
      <Outlet />
    </StyledViewContent>
  )
}