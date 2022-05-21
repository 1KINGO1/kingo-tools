import {FC} from "react";
import styled from "styled-components";
import {Result} from "antd";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

export const SocketError: FC = () => {

  return (
    <Wrapper>
      <Result
        status="error"
        title="Связь потеряна"
        subTitle="Скорее всего пропало ваше интернет-соединение или вы открыли новую вкладку с сайтом."
      />
    </Wrapper>
  )
} 