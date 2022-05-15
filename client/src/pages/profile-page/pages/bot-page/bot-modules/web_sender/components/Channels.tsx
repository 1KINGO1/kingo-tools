import {FC, useEffect, useState} from "react";
import styled from "styled-components";
import {socket} from "../../../../../../../App";
import {Channel} from "./Channel";

const Wrapper = styled.div`
  width: 20%;
  height: 100%;
  background-color: #2f3136;
  top: 0;
  left: 0;

  overflow-x: hidden;
  overflow-y: auto;
  
  padding: 10px 0 0 0;
  
  &::-webkit-scrollbar {
    width: 16px;
    height: 16px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    border: 4px solid transparent;
    background-clip: padding-box;
    border-radius: 8px;
    background-color: hsl(210,calc(var(--saturation-factor, 1)*9.8%),20%);
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    min-height: 40px;
    border-radius: 8px;
    background-clip: padding-box;
    border: 4px solid transparent;
    background-color: #202225;
  }
`;

export interface ChannelI{
  name: string,
  id: string,
  parentId: number,
  position: number,
  type: "GUILD_TEXT" | "GUILD_CATEGORY"
}

export const Channels: FC<{selectedChannel: string, setSelectedChannel: Function}> = ({selectedChannel, setSelectedChannel}) => {

  const [channels, setChannels] = useState<ChannelI[]>([]);

  useEffect(() => {
    socket.on("channels_data", (data) => {
      setChannels(data);
    })
  }, [])

  return(
    <Wrapper>
      {channels.map(channel => (<Channel {...channel} key={channel.id} isSelected={selectedChannel === channel.id} setSelectedChannel={setSelectedChannel}/>))}
    </Wrapper>
  )
}