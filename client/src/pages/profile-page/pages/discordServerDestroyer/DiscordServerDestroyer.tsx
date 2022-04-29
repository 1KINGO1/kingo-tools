import {FC} from "react";
import styled from "styled-components";
import {Button} from "antd";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const DangerTitle = styled.h1`
  color: #e53030;
  font-size: 25px;
  font-weight: bolder;
  text-align: center;
`;

const ImageGrid = styled.div`
  width: 100%;
  margin: 20px 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: 230px;
  grid-gap: 20px 20px;
  
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const DiscordServerDestroyer: FC = () => {
  return(
    <Wrapper>
      <DangerTitle>
        Ахтунг! Крайне не рекомендуется использовать данный софт на реальных серверах.
        В некоторых случаях дискорд может скинуть верификацию вашего дискорд аккаунта или забанить его.
        Данная программа в течении короткого времени забанит всех пользователей на сервере (10 человек в секунду).
        Работает с помощью токена аккаунта с правами банить пользователей.
      </DangerTitle>
      <ImageGrid>
        <img src="https://media.discordapp.net/attachments/744895198039113769/969622488382308352/unknown.png" alt="example 1"/>
        <img src="https://media.discordapp.net/attachments/744895198039113769/969622693160820736/unknown.png" alt="example 2"/>
        <img src="https://media.discordapp.net/attachments/744895198039113769/969624002131804180/unknown.png" alt="example 3"/>
      </ImageGrid>
      <Button style={{margin: "20px auto", display: "block"}} type="primary" onClick={() => window.open("https://drive.google.com/file/d/1RQgnueHOfYGqcsc436cR0x2KoLwa7Iwf/view?usp=sharing")}>Скачать</Button>
    </Wrapper>
  )
}