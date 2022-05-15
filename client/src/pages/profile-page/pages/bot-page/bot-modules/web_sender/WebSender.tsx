import {FC, useState} from "react";
import {PageHeader} from "antd";
import styled from "styled-components";
import {CreateWebHook} from "./CreateWebHook";
import {Sender} from "./Sender";

const WebSenderWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SenderWrapper = styled.div`
  height: 92%;
  background-color: #36393f;
`;

export const WebSender: FC = () => {

  const [webhookVisible, setWebhookVisible] = useState(true);

  return (
    <WebSenderWrapper>
      <PageHeader
        onBack={() => window.history.back()}
        title={<>
          Web Sender
        </>}
        subTitle="Онлайн управление"
      />
      <SenderWrapper>
        {
          webhookVisible ? <CreateWebHook setWebhookVisible={setWebhookVisible}/> : <Sender/>
        }
      </SenderWrapper>
    </WebSenderWrapper>
  )
}