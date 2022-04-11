import {FC, useState} from "react";
import styled from "styled-components";
import {Switch} from "antd";
import {defineCommandProperty} from "../../../../../../utils/api";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/store";
import {SettingOutlined} from "@ant-design/icons";

interface CommandProps{
    name: string,
    description: string,
    on: boolean,
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
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.03);
`;

export const Command: FC<CommandProps> = ({name, description, on, options}) => {

    const guildId = useSelector<RootState>(state => state.bot.currentGuild) as string;

    const [isOn, setIsOn] = useState(on);
    const [load, setLoad] = useState(false);

    const switchHandler = () => {
        setLoad(true);
        defineCommandProperty(!isOn, guildId, "commands", "on", name).then(() => {
            setLoad(false);
            setIsOn(!isOn)
        }).catch(() => setLoad(false));
    };

    return(
        <CommandWrapper on={isOn}>
            <CommandTitle>
                {name}
            </CommandTitle>
            <CommandDescription>
                {description}
            </CommandDescription>
            <ControlBar>
                <Switch checked={isOn} onChange={switchHandler} loading={load}/>
                <SettingOutlined />
            </ControlBar>
        </CommandWrapper>
    )
}