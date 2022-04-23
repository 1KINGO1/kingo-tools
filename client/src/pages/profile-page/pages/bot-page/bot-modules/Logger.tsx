import {FC, FocusEvent} from "react";
import styled from "styled-components";
import {Button, Checkbox, Input, PageHeader, Tabs, Tooltip} from "antd";
import {InfoCircleOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/store";
import {Guild} from "../../../../../types/Guild";
import {defineCheck, defineCommandProperty, defineProperty} from "../../../../../utils/api";

const LoggerWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Flex = styled.div<{margin: string}>`
  width: 100%;
  flex-wrap: wrap;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${props => props.margin};
  
  label{
    margin: 0 0 5px !important;
  }
`;
const FlexBox = styled.div`
  width: 50%;
  padding: 20px;
`;
const Header = styled.div`
  display: flex;
  font-size: 22px;
  align-items: center;
  margin: 0 0 10px;
`;


export const Logger: FC = () => {

  const guild = useSelector<RootState>(state => state.bot.guildData) as Guild;

  const blurHandler = (e: FocusEvent<HTMLInputElement>, type: string) => {
      defineProperty(e.target.value, guild.id, "logger", type)
  };

  const checkHandler = (check: boolean, property: string, value: string) => {
    if (check){
      defineCheck("check_log_property", value, guild.id, property)
    }
    else{
      defineCheck("uncheck_log_property", value, guild.id, property)
    }

  }

  return (
    <LoggerWrapper>
      <PageHeader
        onBack={() => window.history.back()}
        title={<>
          Логер
        </>}
        subTitle="Настройка"
      />
      <Flex margin="0">
        <FlexBox>
          <Header>
            Модерация
          </Header>
          <Input placeholder="Введите айди канала"
                 defaultValue={guild.options.logger.modChannel}
                 onBlur={(e) => blurHandler(e, "modChannel")}
                 suffix={
                   <Tooltip title="В канал будут отправлятся логи">
                     <InfoCircleOutlined style={{ color: "white" }} />
                   </Tooltip>
                 }/>
          <Flex margin="8px 0">
            <Checkbox onChange={(e) => checkHandler(e.target.checked, "modAllow", "BAN")} defaultChecked={guild.options.logger.modAllow.includes("BAN")}>BAN</Checkbox>
            <Checkbox onChange={(e) => checkHandler(e.target.checked, "modAllow", "KICK")} defaultChecked={guild.options.logger.modAllow.includes("KICK")}>KICK</Checkbox>
            <Checkbox onChange={(e) => checkHandler(e.target.checked, "modAllow", "TIMEOUT")} defaultChecked={guild.options.logger.modAllow.includes("TIMEOUT")}>TIMEOUT</Checkbox>
            <Checkbox onChange={(e) => checkHandler(e.target.checked, "modAllow", "BAN_REMOVE")} defaultChecked={guild.options.logger.modAllow.includes("BAN_REMOVE")}>BAN_REMOVE</Checkbox>
            <Checkbox onChange={(e) => checkHandler(e.target.checked, "modAllow", "TIMEOUT_REMOVE")} defaultChecked={guild.options.logger.modAllow.includes("TIMEOUT_REMOVE")}>TIMEOUT_REMOVE</Checkbox>
          </Flex>
        </FlexBox>
        <FlexBox>
          <Header>
            События сообщений
          </Header>
          <Input placeholder="Введите айди канала"
                 defaultValue={guild.options.logger.messageEventsChannel}
                 onBlur={(e) => blurHandler(e, "messageEventsChannel")}
                 suffix={
                   <Tooltip title="В канал будут отправлятся логи">
                     <InfoCircleOutlined style={{ color: "white" }} />
                   </Tooltip>
                 }/>
          <Flex margin="8px 0">
            <Checkbox onChange={(e) => checkHandler(e.target.checked, "messageEventsAllow", "MESSAGE_DELETE")} defaultChecked={guild.options.logger.messageEventsAllow.includes("MESSAGE_DELETE")}>MESSAGE_DELETE</Checkbox>
            <Checkbox onChange={(e) => checkHandler(e.target.checked, "messageEventsAllow", "MESSAGE_EDIT")} defaultChecked={guild.options.logger.messageEventsAllow.includes("MESSAGE_EDIT")}>MESSAGE_EDIT</Checkbox>
            <Checkbox onChange={(e) => checkHandler(e.target.checked, "messageEventsAllow", "MESSAGE_PURGED")} defaultChecked={guild.options.logger.messageEventsAllow.includes("MESSAGE_PURGED")}>MESSAGE_PURGED</Checkbox>
          </Flex>
        </FlexBox>
      </Flex>
      <Flex margin="0">
        <FlexBox>
          <Header>
            События войса
          </Header>
          <Input placeholder="Введите айди канала"
                 defaultValue={guild.options.logger.voiceChannel}
                 onBlur={(e) => blurHandler(e, "voiceChannel")}
                 suffix={
                   <Tooltip title="В канал будут отправлятся логи">
                     <InfoCircleOutlined style={{ color: "white" }} />
                   </Tooltip>
                 }/>
          <Flex margin="8px 0">
            <Checkbox onChange={(e) => checkHandler(e.target.checked, "voiceAllow", "VOICE_JOIN")} defaultChecked={guild.options.logger.voiceAllow.includes("VOICE_JOIN")}>VOICE_JOIN</Checkbox>
            <Checkbox onChange={(e) => checkHandler(e.target.checked, "voiceAllow", "VOICE_LEAVE")} defaultChecked={guild.options.logger.voiceAllow.includes("VOICE_LEAVE")}>VOICE_LEAVE</Checkbox>
            <Checkbox onChange={(e) => checkHandler(e.target.checked, "voiceAllow", "VOICE_CHANGE")} defaultChecked={guild.options.logger.voiceAllow.includes("VOICE_CHANGE")}>VOICE_CHANGE</Checkbox>
          </Flex>
        </FlexBox>
      </Flex>
      <Flex margin="0">
        <FlexBox>
          <Header>
            События участников
          </Header>
          <Input placeholder="Введите айди канала"
                 defaultValue={guild.options.logger.membersChannel}
                 onBlur={(e) => blurHandler(e, "membersChannel")}
                 suffix={
                   <Tooltip title="В канал будут отправлятся логи">
                     <InfoCircleOutlined style={{ color: "white" }} />
                   </Tooltip>
                 }/>
          <Flex margin="8px 0">
            <Checkbox onChange={(e) => checkHandler(e.target.checked, "membersAllow", "MEMBER_JOIN")} defaultChecked={guild.options.logger.membersAllow.includes("MEMBER_JOIN")}>MEMBER_JOIN</Checkbox>
            <Checkbox onChange={(e) => checkHandler(e.target.checked, "membersAllow", "MEMBER_LEAVE")} defaultChecked={guild.options.logger.membersAllow.includes("MEMBER_LEAVE")}>MEMBER_LEAVE</Checkbox>
            <Checkbox onChange={(e) => checkHandler(e.target.checked, "membersAllow", "MEMBER_ROLE_ADD")} defaultChecked={guild.options.logger.membersAllow.includes("MEMBER_ROLE_ADD")}>MEMBER_ROLE_ADD</Checkbox>
            <Checkbox onChange={(e) => checkHandler(e.target.checked, "membersAllow", "MEMBER_ROLE_REMOVE")} defaultChecked={guild.options.logger.membersAllow.includes("MEMBER_ROLE_REMOVE")}>MEMBER_ROLE_REMOVE</Checkbox>
            <Checkbox onChange={(e) => checkHandler(e.target.checked, "membersAllow", "MEMBER_NICKNAME_CHANGE")} defaultChecked={guild.options.logger.membersAllow.includes("MEMBER_NICKNAME_CHANGE")}>MEMBER_NICKNAME_CHANGE</Checkbox>
          </Flex>
        </FlexBox>
      </Flex>
    </LoggerWrapper>
  )
}