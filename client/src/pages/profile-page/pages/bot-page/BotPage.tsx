import {FC} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/store";
import {Button, Result} from "antd";
import { RobotOutlined } from "@ant-design/icons";
import config from "../../../../config/config";
import {SelectGuild} from "./components/SelectGuild";
import {BotControlPage} from "./components/BotControlPage";
import styled from "styled-components";

const BotPageWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 10px;
  }
 
  /* Track */
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #121212;
    border-radius: 15px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #070707;
  }
`;

export const BotPage: FC = () => {

    const discord = useSelector<RootState>(state => state.auth.user.discord) as Object;
    const guildId = useSelector<RootState>(state => state.bot.currentGuild);

    const discordLogin = () => {
        window.location.href = config.DISCORD_LOGIN_PAGE;
    }

    return (
        Object.keys(discord || {}).length === 0 ? <Result
            status="warning"
            title="Перед использованием данного функционала войдите в свой аккаунт Discord"
            extra={
                <Button type="primary" key="console" onClick={discordLogin}>
                    Войти <RobotOutlined />
                </Button>
            }
        /> : <BotPageWrapper>
            {
                guildId ? <BotControlPage /> : <SelectGuild />
            }
        </BotPageWrapper>
    )
}