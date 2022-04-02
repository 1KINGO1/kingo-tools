import React, {FC} from "react";
import styled from "styled-components";
import {LoadingOutlined} from "@ant-design/icons";

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Loading: FC = () => {
    return(
        <LoadingWrapper>
            <LoadingOutlined style={{fontSize: 120}} spin/>
        </LoadingWrapper>
    )
}