import {FC, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {socket} from "../../../../../../../App";
import {Message} from "./Message";
import {SendPanel} from "./SendPanel";

const Flex = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;

const MessagesWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  
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

export interface MessageI{
  authorName: string,
  authorImageURL: string,
  content: string
}

export const Messages: FC<{selectedChannel: string}> = ({selectedChannel}) => {

  let [messages, setMessages] = useState<MessageI[]>([]);
  let wrapperRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    socket.on("messages_fetch", (data: MessageI[]) => {
      setMessages(data);
      // @ts-ignore
      wrapperRef.current.scrollTop = 99999;
    });
    socket.on("new_message", (data: MessageI) => {
      setMessages((messages) => [...messages, data]);
      // @ts-ignore
      wrapperRef.current.scrollTop = 99999;
    })
  }, [])

  return (
    <Flex>
      <MessagesWrapper ref={wrapperRef}>
        {messages.map(message => {
          return (
            <Message authorName={message.authorName} authorImageURL={message.authorImageURL} content={message.content}/>
          )
        })}
      </MessagesWrapper>
      <SendPanel />
    </Flex>
  )
};