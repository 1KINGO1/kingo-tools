import {FC, useEffect, useState} from "react";
import {fetchGuilds} from "../../../../../utils/api";
import {Guild} from "./Guild";
import styled from "styled-components";
import {Loading} from "../../../../../components/Loading";
import {AnimatePresence, motion} from "framer-motion";

const GuildWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

export const SelectGuild: FC = () => {

  const [load, setLoad] = useState(true);
  const [guilds, setGuilds] = useState<Array<any>>([]);

  useEffect(() => {
    fetchGuilds().then((data) => {
      if (!data.err) {
        setGuilds(data.guilds)
      }
      setLoad(false);
    })
  }, [])

  return (
    load ? <Loading/> :
      <GuildWrapper initial={{opacity: 0}}
                    animate={{opacity: 1}}>
        {guilds.map((guild, index) => <Guild key={index}
                                             guildId={guild.id}
                                             guildIcon={guild.icon}
                                             title={guild.name}/>)}
      </GuildWrapper>
  )
}