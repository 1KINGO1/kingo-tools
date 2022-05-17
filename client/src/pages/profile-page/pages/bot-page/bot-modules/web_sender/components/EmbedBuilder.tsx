import {FC} from "react";
import {Input, Modal} from "antd";
import styled from "styled-components";
import {DiscordMessage, DiscordMessages} from "@skyra/discord-components-react";
import {Embed} from "../../../../../../../components/Embed";
import {APIEmbed} from "discord-api-types/v10";
import TextArea from "antd/lib/input/TextArea";

const ModalContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Preview = styled.div`
  width: 45%;
`;

const Settings = styled.div`
  width: 50%;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  
  *{
    margin: 5px 0;
  }
`;

const Label= styled.p`
  font-weight: 500;
  font-size: 20px;
  margin: 5px 0 2px;
`;

interface Props {
  isVisible: boolean,
  embed: APIEmbed,
  setEmbed: any,
  name: string,
  avatar: string,
  setVisible: any
}

export const EmbedBuilder: FC<Props> = ({isVisible, setVisible, embed, setEmbed, name, avatar}) => {
  return (
    <Modal title="Создайте embed" visible={isVisible} onOk={() => {
      setVisible(false);
    }} onCancel={() => {
      setEmbed({
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
      });
      setVisible(false);
    }} width="90%">
      <ModalContent>
        <Settings>
          <Label>
            Заголовок
          </Label>
          <Flex>
            <Input placeholder="Введите заголовок"
                   onChange={(e) =>
                     setEmbed((embed: APIEmbed) => {
                       let copy = JSON.parse(JSON.stringify(embed))
                       copy.title = e.target.value;
                       return copy
                     })}
            />
            <Input placeholder="Введите ссылку"
                   onChange={(e) =>
                     setEmbed((embed: APIEmbed) => {
                       let copy = JSON.parse(JSON.stringify(embed))
                       copy.url = e.target.value;
                       return copy
                     })}
            />
          </Flex>
          <Label>Цвет</Label>
          <Input placeholder="Введите HEX цвет (без #)"
                 onChange={(e) =>
                   setEmbed((embed: APIEmbed) => {
                     let copy = JSON.parse(JSON.stringify(embed))
                     copy.color = parseInt(e.target.value, 16) || "0";
                     return copy
                   })}
          />
          <Label>Автор</Label>
          <Flex>
            <Input placeholder="Введите ник автора"
                   onChange={(e) =>
                     setEmbed((embed: APIEmbed) => {
                       let copy = JSON.parse(JSON.stringify(embed))
                       copy.author.name = e.target.value;
                       return copy
                     })}
            />
            <Input placeholder="Введите ссылку на иконку автора"
                   onChange={(e) =>
                     setEmbed((embed: APIEmbed) => {
                       let copy = JSON.parse(JSON.stringify(embed))
                       copy.author.icon_url = e.target.value;
                       return copy
                     })}
            />
            <Input placeholder="Введите ссылку автора"
                   style={{margin: "5px 0"}}
                   onChange={(e) =>
                     setEmbed((embed: APIEmbed) => {
                       let copy = JSON.parse(JSON.stringify(embed))
                       copy.author.url = parseInt(e.target.value, 16) || "0";
                       return copy
                     })}
            />
          </Flex>
          <Label>Картинки</Label>
          <Flex>
            <Input placeholder="Введите ссылку image"
                   onChange={(e) =>
                     setEmbed((embed: APIEmbed) => {
                       let copy = JSON.parse(JSON.stringify(embed))
                       copy.image.url = e.target.value;
                       return copy
                     })}
            />
            <Input placeholder="Введите ссылку thumbnail"
                   onChange={(e) =>
                     setEmbed((embed: APIEmbed) => {
                       let copy = JSON.parse(JSON.stringify(embed))
                       copy.thumbnail.url = e.target.value;
                       return copy
                     })}
            />
          </Flex>
          <Label>Описание</Label>
          <TextArea style={{margin: "5px 0"}}
                    placeholder="Введите описание"
                    autoSize={{minRows: 3, maxRows: 3}}
                    onChange={(e) => setEmbed((embed: APIEmbed) => {
                      let copy = JSON.parse(JSON.stringify(embed))
                      copy.description = e.target.value;
                      return copy
                    })}
          />
          <Label>Footer</Label>
          <Flex>
            <Input placeholder="Введите Footer текст"
                   onChange={(e) =>
                     setEmbed((embed: APIEmbed) => {
                       let copy = JSON.parse(JSON.stringify(embed))
                       copy.footer.text = e.target.value;
                       return copy
                     })}
            />
            <Input placeholder="Введите ссылку на иконку Footer"
                   onChange={(e) =>
                     setEmbed((embed: APIEmbed) => {
                       let copy = JSON.parse(JSON.stringify(embed))
                       copy.footer.icon_url = e.target.value;
                       return copy
                     })}
            />
          </Flex>
          {/*<Flex>*/}
          {/*  <Input placeholder="Заголовок field"*/}
          {/*         style={{margin: "5px 0"}}*/}
          {/*         onChange={(e) =>*/}
          {/*           setEmbed((embed: APIEmbed) => {*/}
          {/*             let copy = JSON.parse(JSON.stringify(embed))*/}
          {/*             copy.footer.text = e.target.value;*/}
          {/*             return copy*/}
          {/*           })}*/}
          {/*  />*/}
          {/*  <Input placeholder="Текст field"*/}
          {/*         style={{margin: "5px 0"}}*/}
          {/*         onChange={(e) =>*/}
          {/*           setEmbed((embed: APIEmbed) => {*/}
          {/*             let copy = JSON.parse(JSON.stringify(embed))*/}
          {/*             copy.footer.icon_url = e.target.value;*/}
          {/*             return copy*/}
          {/*           })}*/}
          {/*  />*/}
          {/*</Flex>*/}
        </Settings>
        <Preview>
          <DiscordMessages style={{border: "none", height: "100%"}}>
            <DiscordMessage author={name}
                            avatar={avatar}
                            timestamp={new Date()}
                            bot={true}
            >
              <Embed color={"#" + (embed?.color?.toString(16) || "000000")}
                     embedTitle={embed.title || ""}
                     description={embed?.description || ""}
                     fields={embed.fields || []}
                     authorName={embed.author?.name}
                     authorUrl={embed.author?.url}
                     authorImage={embed.author?.icon_url}
                     footer={{text: embed.footer?.text, icon_url: embed.footer?.icon_url}}
                     image={embed.image?.url || ""}
                     thumbnail={embed.thumbnail?.url || ""}
                     url={embed.url || ""}
              />
            </DiscordMessage>
          </DiscordMessages>
        </Preview>
      </ModalContent>
    </Modal>
  )
}