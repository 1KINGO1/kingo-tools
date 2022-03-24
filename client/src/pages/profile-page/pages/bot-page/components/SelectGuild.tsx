import {FC, useEffect, useState} from "react";
import {fetchGuilds} from "../../../../../utils/api";
import {LoadingOutlined} from "@ant-design/icons";
import {Guild} from "./Guild";
import styled from "styled-components";

const GuildWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const SelectGuild:FC = () => {

    const [load, setLoad] = useState(true);
    const [guilds, setGuilds] = useState<Array<any>>([]);

    useEffect(() => {
        fetchGuilds().then((data) => {
            if (!data.err){
                setGuilds(data.guilds)
            }
            setLoad(false);
        })
    }, [])

    return (
        load ? <LoadingOutlined /> :
            <GuildWrapper>
                {guilds.map((guild, index) => <Guild key={index}
                                                             guildId={guild.id}
                                                             guildIcon={guild.icon}
                                                             title={guild.name}/>)}
            </GuildWrapper>
    )
}