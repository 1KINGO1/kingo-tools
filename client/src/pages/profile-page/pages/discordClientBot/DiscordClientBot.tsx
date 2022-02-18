import {FC} from "react";
import styled from "styled-components";
import {Text} from "../../../../components/Text";
import {ControlForm} from "./ControlForm";

const StyledDiscordClient = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

export const DiscordClientBot: FC = () => {
  return (
    <StyledDiscordClient>
      <div>
        <Text style={{fontSize: "2em", textAlign: "center", margin: "20px 0"}}>
          Данная фича помогает управлять обычным Discord аккаунтом через специальный токен.
          Также на обычном аккаунте можно создать полноценного бота, который даже сможет реагировать на сообщения и команды.
        </Text>
        <Text style={{fontSize: "1.2em", textAlign: "center", margin: "10px 0", color: "grayWhite"}}>
          Сдесь представлено онлайн управление таким аккаунтом. Доступ к исходникам бота у создателя сайта.
        </Text>
      </div>
      <ControlForm />
    </StyledDiscordClient>
  )
}