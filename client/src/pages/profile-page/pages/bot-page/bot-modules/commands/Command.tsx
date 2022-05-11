import {FC, useState, FocusEvent} from "react";
import styled from "styled-components";
import {Input, Modal, Switch, Tooltip, Typography} from "antd";
import {defineCommandProperty, defineProperty} from "../../../../../../utils/api";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/store";
import {InfoCircleOutlined, SettingOutlined} from "@ant-design/icons";
import {Select} from 'antd';
import {Guild} from "../../../../../../types/Guild";
import {motion} from "framer-motion";

const {Option} = Select;

interface CommandProps {
  name: string,
  description: string,
  on: boolean,
  example: string,
  isSlash?: boolean,
  options: {
    rolesWhiteList: string[],
    channelWhiteList: string[]
  }
}

const CommandWrapper = styled(motion.div)<any>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: #17161a;
  border-top: 3px solid ${props => props.on ? "green" : "red"};
  border-left: 1px solid ${props => props.theme.colors.dark};
  border-bottom: 1px solid ${props => props.theme.colors.dark};
  border-right: 1px solid ${props => props.theme.colors.dark};
  border-radius: 3px;
`;

const CommandTitle = styled.p`
  font-size: 35px;
  font-weight: bold;
  padding: 12px;
  display: flex;
  align-items: center;
`;

const CommandDescription = styled.p`
  font-size: 15px;
  font-weight: 400;
  padding: 0 12px;
  margin: 0 0 auto 0;
`;

const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.03);
`;

const SettingWrapper = styled.div`
  border-radius: 100%;
  transition: all .1s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.03);
    background-color: rgba(255, 255, 255, 0.1);
  }

  & > * {
    width: 100%;
    height: 100%;
  }
;
`;

const Label = styled.p`
  font-size: 20px;
  font-weight: 500;
  text-align: center;

  margin: 10px 0 0 0;

  &:nth-child(1) {
    margin: 0;
  }
`;

const SlashMark = styled.div`
  background-color: #3c9ae8;
  color: white;
  font-weight: 500;
  font-size: 13px;
  margin: 5px 10px 0;
  padding: 5px;
  border-radius: 3px;
`;

export const Command: FC<CommandProps> = ({name, description, on, example, isSlash, options}) => {

  const guildId = useSelector<RootState>(state => state.bot.currentGuild) as string;
  const guild = useSelector<RootState>(state => state.bot.guildData) as Guild;
  const channels = useSelector<RootState>(state => state.bot.guildChannels) as { name: string, id: string }[];
  const roles = useSelector<RootState>(state => state.bot.guildRoles) as { name: string, id: string, color: string }[];

  const [isOn, setIsOn] = useState(on);
  const [load, setLoad] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const [selectedChannels, setSelectedChannels] = useState<string[]>(options.channelWhiteList);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(options.rolesWhiteList);

  const switchHandler = () => {
    setLoad(true);
    defineCommandProperty(!isOn, guildId, "commands", "on", name).then(() => {
      setLoad(false);
      setIsOn(!isOn)
    }).catch(() => setLoad(false));
  };
  const settingsClickHandler = () => {
    setSettingsVisible(state => !state);
  };

  return (
    <CommandWrapper on={isOn} layout transition={{duration: 0.5, type: "ease"}}>
      <CommandTitle>
        {name} {isSlash ? <Tooltip placement="top" title="Команда также может быть использована в качестве слэш команды"
                                   color="#2db7f5"><SlashMark>Slash</SlashMark></Tooltip> : ""}
      </CommandTitle>
      <CommandDescription>
        {description}
      </CommandDescription>
      <ControlBar>
        <Switch checked={isOn} onChange={switchHandler} loading={load}/>
        <SettingWrapper onClick={settingsClickHandler}>
          <SettingOutlined/>
        </SettingWrapper>
      </ControlBar>
      <Modal
        visible={settingsVisible}
        title={`Настройки команды ${name}`}
        onOk={() => {
        }}
        onCancel={() => {
          setSettingsVisible(false)
        }}
        footer={[]}
      >
        <Label>
          Пример использования:
        </Label>
        <Typography.Text code style={{
          fontSize: "20px",
          fontWeight: "500",
          textAlign: "center",
          margin: "0 auto",
          display: "block"
        }}>
          {example}
        </Typography.Text>
        <Label>
          Whitelist роли
        </Label>
        <Select
          mode="multiple"
          defaultValue={selectedRoles}
          placeholder="Нажмите чтобы выбрать"
          optionFilterProp="children"
          style={{width: "100%"}}
          onChange={(selected: string[]) => {
            setSelectedRoles(selected)
          }}
          onBlur={() => {
            defineCommandProperty(selectedRoles, guildId, "commands", "rolesWhiteList", name)
          }}
        >
          {[...roles, {id: "admins", name: "admins", color: "24E7EA"}]
            .map((role, i) => (
              <Option style={{borderLeft: "2px solid " + role.color}} value={role.id} key={i}>{role.name}</Option>))}
        </Select>
        <Label>
          Whitelist каналы
        </Label>
        <Select
          mode="multiple"
          defaultValue={selectedChannels}
          placeholder="Нажмите чтобы выбрать"
          optionFilterProp="children"
          style={{width: "100%"}}
          onChange={(selected: string[]) => {setSelectedChannels(selected)}}
          onBlur={() => {
            defineCommandProperty(selectedChannels, guildId, "commands", "channelWhiteList", name)
          }}
        >
          {[...channels, {id: "all", name: "all"}]
            .map((channel, i) => (<Option value={channel.id} key={i}>{channel.name}</Option>))}
        </Select>
      </Modal>
    </CommandWrapper>
  )
}