import {FC, useState} from "react";
import styled from "styled-components";
import {socket} from "../../../../../../../App";
import {ControlOutlined, SendOutlined} from "@ant-design/icons";
import {EmbedBuilder} from "./EmbedBuilder";

import {APIEmbed} from "discord-api-types/v10";

const Flex = styled.div`
  height: 5%;
  width: 97%;
  padding: 5px 20px;
  margin: 0 auto 10px;
  background-color: #4f545c;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SendPanelWrapper = styled.input`
  height: 100%;
  width: 100%;
  background-color: transparent;
  display: block;
  border: none;
  outline: none;
`;

const ToolsBar = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  * {
    margin: 0 0 0 7px;
    cursor: pointer;
  }

  *:hover {
    transform: scale(1.03);
  }
`;

export const SendPanel: FC<{ name: string, avatar: string }> = ({name, avatar}) => {

  let [message, setMessage] = useState("");
  let [isEBVisible, setEBVisible] = useState(false);

  let [embed, setEmbed] = useState<APIEmbed>({
    title: "",
    color: 0,
    description: "",
    url: "",
    fields: [],
    image: {
      url: ""
    },
    thumbnail: {
      url: ""
    },
    author: {
      name: "",
      icon_url: "",
      url: ""
    },
    footer: {
      icon_url: "",
      text: ""
    }
  })

  return (
    <>
      <EmbedBuilder isVisible={isEBVisible} embed={embed} setEmbed={setEmbed} name={name} avatar={avatar}
                    setVisible={setEBVisible}/>
      <Flex>
        <SendPanelWrapper placeholder="Введите сообщение" value={message} onChange={(e) => setMessage(e.target.value)}
                          onKeyUp={(e) => {
                            if (e.key === "Enter") {
                              socket.emit("sendMessage", {
                                content: message,
                                embeds: [embed]
                              });
                              setMessage("")
                            }
                          }}/>
        <ToolsBar>
          <ControlOutlined size={24} onClick={() => setEBVisible(true)}/>
          <SendOutlined size={24} onClick={() => {
            socket.emit("sendMessage", {
              content: message,
              embeds: [embed]
            });
            setMessage("")
          }}/>
        </ToolsBar>
      </Flex>
    </>
  )
}