import {FC, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/store";
import {fetchGuildData} from "../../../../../utils/api";
import {CloseCircleOutlined, LoadingOutlined, LockOutlined, RobotOutlined, WarningOutlined} from "@ant-design/icons";
import {Avatar, Button, message, Result} from "antd";
import styled from "styled-components";
import {Text} from "../../../../../components/Text";
import {Guild} from "../../../../../types/Guild";
import {removeGuild, setGuild, setGuildData} from "../../../../../store/actions/botActions";
import {ModuleButton} from "./ModuleButton";
import {Loading} from "../../../../../components/Loading";
import {motion} from "framer-motion";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {socket} from "../../../../../App";

const Header = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  border-bottom: 3px solid ${props => props.theme.colors.grayBlack}
`;

const Buttons = styled.div`
  width: 100%;
  display: grid;
  height: 100%;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gad: 20px;
  position: relative;
`;

const LockedBanner = styled.div`
  position: absolute;
  width: 100%;
  top: 10px;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  height: 500px;
  align-items: center;
  justify-content: center;
`;

export const BotControlPage: FC = () => {

  const dispatch = useDispatch();

  const guild_id = useSelector<RootState>(state => state.bot.currentGuild) as string;
  const guild = useSelector<RootState>(state => state.bot.guildData) as Guild;

  const [load, setLoad] = useState(true);
  const [addError, setAddError] = useState(false);

  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (guild?.options){
      setAllowed(guild?.options.allowed || false)
    }
  }, [guild])

  useEffect(() =>  {
    socket.on("guild_allow", (data) => {
      if (guild_id === data){
        setAllowed(true);
      }
    })
    socket.on("guild_deny", (data) => {
      if (guild_id === data){
        setAllowed(false);
      }
    })
  }, [])

  useEffect(() => {
    if (guild_id) {
      fetchGuildData(guild_id).then(data => {
        if (data.err) {
          message.error(data.message);
          setLoad(false);
        } else {
          if (data?.guild) {
            dispatch(setGuildData({guild: data.guild, channels: data.channels, roles: data.roles}))
            setLoad(false);
          } else {
            setAddError(true);
            setLoad(false);
          }
        }
      });
    }
  }, [guild_id])

  return (
    load ? <Loading/> : addError ? <Result
      status="warning"
      title="Добавьте бота на ваш сервер"
      extra={
        <>
          <Button type="primary" key="console"
                  onClick={() => window.location.href = "https://discord.com/oauth2/authorize?client_id=956507803395178549&permissions=8&scope=bot%20applications.commands"}>
            Добавить <RobotOutlined/>
          </Button>
          <Button key="console" onClick={() => dispatch(setGuild(""))}>
            Назад <ArrowLeftOutlined/>
          </Button>
        </>
      }
    /> : <motion.div initial={{opacity: 0}}
                     animate={{opacity: 1}}>

      <Header>
        <Avatar size={32} src={guild?.data.avatar}/>
        <Text style={{fontWeight: 500, fontSize: "14px", margin: "0 0 0 10px"}}>{guild?.data.name}</Text>
        {allowed ? "" : <WarningOutlined style={{margin: "0 0 0 10px", color: "yellow"}}/>}
        <CloseCircleOutlined style={{margin: "0 0 0 auto"}} onClick={() => dispatch(removeGuild())}/>
      </Header>

      <Buttons>
        {!allowed ?
          <LockedBanner>
            <LockOutlined size={128} />
          </LockedBanner> :<>
            <ModuleButton title="Commands"
                          value="commands"
                          canCheck={false}
                          link="commands"
            />
            <ModuleButton title="Level System"
                          value="levelSystem"
                          checked={guild?.options.levelSystem.on || false}
                          canCheck={true}
                          link="levels"
            />
            <ModuleButton title="Economy System"
                          value="economy"
                          checked={guild?.options.economy.on || false}
                          canCheck={true}
                          link="economy"
            />
            <ModuleButton title="Logger"
                          value="logger"
                          checked={guild?.options.logger.on || false}
                          canCheck={true}
                          link="logger"
            />
            <ModuleButton title="Reaction Roles"
                          value="reactionRole"
                          checked={false}
                          canCheck={false}
                          link="rr"
            />
            <ModuleButton title="Custom Commands"
                          value="customCommands"
                          checked={false}
                          canCheck={false}
                          link="cc"
            />
            <ModuleButton title="Web Sender"
                          value="webSender"
                          checked={false}
                          canCheck={false}
                          link="webSender"
            />
            <ModuleButton title="Analytics"
                          value="analytics"
                          checked={false}
                          canCheck={false}
                          link="analytics"
            />
            <ModuleButton title="Security"
                          value="security"
                          checked={false}
                          canCheck={false}
                          link="security"
            />
          </>

        }
        {/*<ModuleButton title="AntiScamLink"*/}
        {/*              value="antiScamLinks"*/}
        {/*              checked={guild?.options.antiScamLinks.on || false}*/}
        {/*              canCheck={true}*/}
        {/*              link="asl"*/}
        {/*/>*/}
      </Buttons>
    </motion.div>
  )
}