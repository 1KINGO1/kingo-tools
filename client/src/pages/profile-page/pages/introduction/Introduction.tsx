import {FC} from "react";
import styled from "styled-components";
import {Text} from "../../../../components/Text";
import {AnimatedHand} from "./AnimatedHand";


const StyledIntroduction = styled.div``;

export const Introduction: FC = () => {
  return(
    <StyledIntroduction>
      <Text style={{fontSize: "5em", fontWeight: "500", textAlign: "center"}}>
        Привет! <AnimatedHand />
      </Text>
      <Text style={{fontSize: "2em", textAlign: "center", margin: "20px 0"}}>
        Этот сайт создан в качестве демонстрации разработок KINGO и является удобным онлайн инструментом для их использования.
        Полный доступ доступен только с флагом "User", который вы можете попросить у создателя сайта.
      </Text>
      <Text style={{fontSize: "2em", textAlign: "center", margin: "20px 0"}}>
        Мой Discord: KINGO#9218
      </Text>
    </StyledIntroduction>
  )
}