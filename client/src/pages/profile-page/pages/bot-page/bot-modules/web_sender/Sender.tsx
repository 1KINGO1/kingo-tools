import {FC, useState} from "react";
import styled from "styled-components";
import {Channels} from "./components/Channels";
import {Messages} from "./components/Messages";

const SenderWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  position: relative;
`;

export const Sender: FC = () => {

  const [selectedChannel, setSelectedChannel] = useState("");

  return (
    <SenderWrapper>
      <Channels selectedChannel={selectedChannel} setSelectedChannel={setSelectedChannel}/>
      <Messages selectedChannel={selectedChannel}/>
    </SenderWrapper>
  )
}