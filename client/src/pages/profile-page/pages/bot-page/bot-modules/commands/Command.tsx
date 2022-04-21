import {FC, useState, FocusEvent} from "react";
import styled from "styled-components";
import {Input, Modal, Switch, Tooltip, Typography} from "antd";
import {defineCommandProperty} from "../../../../../../utils/api";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/store";
import {InfoCircleOutlined, SettingOutlined} from "@ant-design/icons";

interface CommandProps{
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

const CommandWrapper = styled.div<any>`
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
  };
`;

const Label = styled.p`
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  
  margin: 10px 0 0 0;
  
  &:nth-child(1){
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

    const [isOn, setIsOn] = useState(on);
    const [load, setLoad] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);

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
    const blurHandler = (e: FocusEvent<HTMLInputElement, Element>, value: string) => {
      if (value === "roles"){
        defineCommandProperty(e.target.value.split(",").map(role => role.trim()), guildId, "commands", "rolesWhiteList", name)
      }
      else{
        defineCommandProperty(e.target.value.split(",").map(role => role.trim()), guildId, "commands", "channelWhiteList", name)
      }
    }

    return(
        <CommandWrapper on={isOn}>
            <CommandTitle>
              {name} {isSlash ? <Tooltip placement="top" title="Команда также может быть использована в качестве слэш команды" color="#2db7f5"><SlashMark>Slash</SlashMark></Tooltip> : ""}
            </CommandTitle>
            <CommandDescription>
                {description}
            </CommandDescription>
            <ControlBar>
                <Switch checked={isOn} onChange={switchHandler} loading={load}/>
                <SettingWrapper onClick={settingsClickHandler}>
                  <SettingOutlined />
                </SettingWrapper>
            </ControlBar>
          <Modal
            visible={settingsVisible}
            title={`Настройки команды ${name}`}
            onOk={() => {}}
            onCancel={() => {setSettingsVisible(false)}}
            footer={[]}
          >
            <Label>
              Пример использования:
            </Label>
            <Typography.Text code style={{fontSize: "20px", fontWeight: "500", textAlign: "center", margin: "0 auto", display: "block"}}>
              {example}
            </Typography.Text>
            <Label>
              Whitelist роли
            </Label>
            <Input placeholder="Введите айди ролей через запятую"
                   defaultValue={options.rolesWhiteList.join(", ")}
                   onBlur={(e) => {blurHandler(e, "roles")}}
                   suffix={
                     <Tooltip title="Ключевые слова: everyone, admins">
                       <InfoCircleOutlined style={{ color: "white" }} />
                     </Tooltip>
                   }/>
            <Label>
              Whitelist каналы
            </Label>
            <Input placeholder="Введите айди каналов через запятую"
                   defaultValue={options.channelWhiteList.join(", ")}
                   onBlur={(e) => {blurHandler(e, "channels")}}
                   suffix={
                     <Tooltip title="Ключевые слова: all">
                       <InfoCircleOutlined style={{ color: "white" }} />
                     </Tooltip>
                   }/>
          </Modal>
        </CommandWrapper>
    )
}