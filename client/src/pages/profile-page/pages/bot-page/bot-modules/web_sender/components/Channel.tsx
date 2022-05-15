import {FC} from "react";
import styled from "styled-components";
import {ChannelI} from "./Channels";
import {CaretDownOutlined, NumberOutlined} from "@ant-design/icons";
import {socket} from "../../../../../../../App";

const ChannelWrapper = styled.div<any>`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  color: rgba(255,255,255,0.55);
  ${props => props.isSelected ? `background-color: rgba(79,84,92,0.6); color: rgba(255,255,255,1);` : `&:hover{
    background-color: rgba(79,84,92,0.4);
  };
  &:active{
    background-color: rgba(79,84,92,0.48);
  }`}
`;

const CategoryWrapper = styled.div`
  font-size: 12px;
  opacity: 0.7;
  display: flex;
  align-items: center;
  padding: 5px 10px;
`;

export const Channel: FC<ChannelI & {isSelected: boolean, setSelectedChannel: Function}> = (
  {name,
    id,
    parentId,
    position,
    type,
    children,
    setSelectedChannel,
    isSelected}) => {

  const clickHandler = () => {
    socket.emit("set_current_channel", id);
    setSelectedChannel(id)
  }

  return(
    type === "GUILD_TEXT" ?
      <ChannelWrapper onClick={clickHandler} isSelected={isSelected}>
        <NumberOutlined style={{margin: "0 10px 0 0"}} /> {name}
      </ChannelWrapper> :
      <CategoryWrapper>
        <CaretDownOutlined style={{margin: "0 10px 0 0"}} /> {name.toUpperCase()}
      </CategoryWrapper>
  )
}