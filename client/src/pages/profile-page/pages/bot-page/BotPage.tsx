import {FC} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/store";
import {Button, Result} from "antd";
import { RobotOutlined } from "@ant-design/icons";
import config from "../../../../config/config";
import {SelectGuild} from "./components/SelectGuild";
import {BotControlPage} from "./components/BotControlPage";

export const BotPage: FC = () => {

    const discord = useSelector<RootState>(state => state.auth.user.discord) as Object;

    const discordLogin = () => {
        window.location.href = config.DISCORD_LOGIN_PAGE;
    }

    return (
        Object.keys(discord).length === 0 ? <Result
            status="warning"
            title="Перед использованием данного функционала войдите в свой аккаунт Discord"
            extra={
                <Button type="primary" key="console" onClick={discordLogin}>
                    Войти <RobotOutlined />
                </Button>
            }
        /> : <>
            <SelectGuild />
            <BotControlPage />
        </>
    )
}