import {DiscordMessages} from "@skyra/discord-components-react";
import {FC, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {socket} from "../../../../../../../App";
import {Message} from "./Message";
import {SendPanel} from "./SendPanel";
import {DiscordTimestamp} from "@skyra/discord-components-core/dist/types/util";
import moment, { Moment } from "moment";

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
    background-color: hsl(210, calc(var(--saturation-factor, 1) * 9.8%), 20%);
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

export interface MessageI {
  id: string,
  authorName: string,
  authorImageURL: string,
  content: string,
  timestamp: string,
  attachments: [any],
  embeds: [any],
  deleted: boolean,
  authorBot: boolean,
  displayColor: string
}

export const Messages: FC<{ selectedChannel: string }> = ({selectedChannel}) => {

  let [messages, setMessages] = useState<MessageI[]>([]);
  let wrapperRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    socket.on("messages_fetch", (data: MessageI[]) => {
      setMessages(data);
      setTimeout(() => {
        document.getElementById("message-trigger")?.scrollIntoView({behavior: "smooth", block: "end"});
      }, 200)
    });
    socket.on("new_message", (data: MessageI) => {
      setMessages((messages) => [...messages, data]);
      setTimeout(() => {
        document.getElementById("message-trigger")?.scrollIntoView({behavior: "smooth", block: "end"});
      }, 200)
    });
    socket.on("channel_change", () => {
      setMessages([]);
      setTimeout(() => {
        document.getElementById("message-trigger")?.scrollIntoView({behavior: "smooth", block: "end"});
      }, 200)
    });
    socket.on("message_delete", ({id}) => {
      setMessages((messages) => {
        let result = [];
        for (let mes of messages){
          if (mes.id === id){
            mes.deleted = true;
          }
          result.push(mes);
        }
        return result
      })
      setTimeout(() => {
        document.getElementById("message-trigger")?.scrollIntoView({behavior: "smooth", block: "end"});
      }, 200)
    })
  }, []);

  return (
    <Flex>
      <MessagesWrapper ref={wrapperRef}>
        <DiscordMessages style={{border: "none"}}>
          {messages.length ? messages.map((message, i) => {
            return (
              <>
                <Message authorName={message?.authorName}
                         authorImageURL={message?.authorImageURL}
                         content={message?.content}
                         id={message?.id}
                         attachments={message?.attachments}
                         key={message?.id}
                         deleted={message?.deleted}
                         timestamp={moment(new Date(message?.timestamp),  "DD MM YYYY hh:mm:ss").toString()}
                         authorBot={message?.authorBot}
                         embeds={message?.embeds}
                         displayColor={message?.displayColor}
                />
              </>
            )
          }) : "Загрузка..."}
          <div id="message-trigger" style={{height: "10px"}}> </div>
        </DiscordMessages>
      </MessagesWrapper>
      <SendPanel/>
    </Flex>
  )
};