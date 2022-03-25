import {FC, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/store";
import {fetchGuildData} from "../../../../../utils/api";
import {CloseCircleOutlined, LoadingOutlined, RobotOutlined} from "@ant-design/icons";
import {Avatar, Button, message, Result} from "antd";
import styled from "styled-components";
import {Text} from "../../../../../components/Text";
import {Guild} from "../../../../../types/Guild";
import {removeGuild} from "../../../../../store/actions/botActions";
import {ModuleButton} from "./ModuleButton";

const Header = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  border-bottom: 3px solid ${props => props.theme.colors.grayBlack}
`;

const Buttons = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gad: 20px;
`

export const BotControlPage: FC = () => {

    const dispatch = useDispatch();

    const guild_id = useSelector<RootState>(state => state.bot.currentGuild) as string;

    const [load, setLoad] = useState(true);
    const [addError, setAddError] = useState(false);

    const [guild, setGuild] = useState<Guild | undefined>(undefined);

    useEffect(() => {
        if (guild_id){
            fetchGuildData(guild_id).then(data => {
                if (data.err){
                    message.error(data.message);
                    setLoad(false);
                }
                else{
                    if (data?.guild){
                        setGuild(data.guild);
                        setLoad(false);
                    }
                    else{
                        setAddError(true);
                        setLoad(false);
                    }
                }
            });
        }
    }, [guild_id])

    return(
        load ? <LoadingOutlined /> : addError ? <Result
            status="warning"
            title="Добавьте бота на ваш сервер"
            extra={
                <Button type="primary" key="console" onClick={() => window.location.href = "https://discord.com/oauth2/authorize?client_id=956507803395178549&permissions=8&scope=bot%20applications.commands"}>
                    Добавить <RobotOutlined />
                </Button>
            }
        /> : <>

            <Header>
                <Avatar size={32} src={guild?.data.avatar} />
                <Text style={{fontWeight: 500, fontSize: "14px", margin: "0 0 0 10px"}}>{guild?.data.name}</Text>
                <CloseCircleOutlined style={{margin: "0 0 0 auto"}} onClick={() => dispatch(removeGuild())}/>
            </Header>

            <Buttons>
                <ModuleButton title="AntiScamLink" checked={false} link="asl"/>
                <ModuleButton title="AntiScamLink" checked={false} link="asl"/>
                <ModuleButton title="AntiScamLink" checked={false} link="asl"/>
            </Buttons>
        </>
    )
}