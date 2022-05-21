import {FC} from "react";
import styled from "styled-components";
import {MessageI} from "./Messages";
import {
  DiscordAttachment,
  DiscordBold, DiscordInlineCode,
  DiscordItalic,
  DiscordMessage, DiscordQuote, DiscordSpoiler,
  DiscordTenorVideo, DiscordUnderlined
} from "@skyra/discord-components-react";
import {Embed} from "../../../../../../../components/Embed";

let rgbToHex = function (rgb: number) {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
};

function parseContent(content: string){
  let contentArr = [];
  for(let word of content.split(" ")){
    let wordCopy = word;
    //bold
    wordCopy = wordCopy.replace(/\*\*(.+)\*\*/g, (match: string, arg1: string) => {
      contentArr.push(<DiscordBold>{arg1}</DiscordBold>);
      return "";
    })
                       .replace(/\*\*(.+)\*\*/g, "");
    //italic
    wordCopy = wordCopy.replace(/\*(.+)\*/g, (match: string, arg1: string) => {
      contentArr.push(<DiscordItalic>{arg1}</DiscordItalic>);
      return "";
    })
                       .replace(/\*(.+)\*/g, "");

    //spoiler
    wordCopy = wordCopy.replace(/\|\|(.+)\|\|/g, (match: string, arg1: string) => {
      contentArr.push(<DiscordSpoiler>{arg1}</DiscordSpoiler>);
      return "";
    }).replace(/\|\|(.+)\|\|/g, "");

    //underline
    wordCopy = wordCopy.replace(/_(.+)_/g, (match: string, arg1: string) => {
      contentArr.push(<DiscordUnderlined>{arg1}</DiscordUnderlined>);
      return "";
    }).replace(/_(.+)_/g, "");

    //inline code
    wordCopy = wordCopy.replace(/`(.+)`/g, (match: string, arg1: string) => {
      contentArr.push(<DiscordInlineCode>{arg1}</DiscordInlineCode>);
      return "";
    }).replace(/`(.+)`/g, "");

    // //quoted
    // wordCopy = wordCopy.replace(/> (.+)/g, (match: string, arg1: string) => {
    //   contentArr.push(<DiscordQuote>{arg1}</DiscordQuote>);
    //   return "";
    // }).replace(/> (.+)/g, "");

    contentArr.push(
      wordCopy
    )
    contentArr.push(" ")
  }
  return contentArr;
}

export const Message: FC<MessageI> = ({authorImageURL, authorName, content, timestamp, embeds, attachments,edit, deleted, authorBot, displayColor}) => {

  return (
    // @ts-ignore
    <DiscordMessage author={authorName}
                    roleColor={displayColor}
                    avatar={authorImageURL}
                    timestamp={timestamp}
                    bot={authorBot}
                    style={deleted ? {backgroundColor: "rgba(230, 73, 46, 0.3)"} : edit ? {backgroundColor: "rgba(0,197,255,0.1)"} : {}}
    >
      {!content ? "" : parseContent(content)}

      {attachments ?
        attachments.map((attachment, index) => {
          if (attachment?.url?.endsWith(".gif") || content.endsWith(".gif")){
            return <DiscordTenorVideo
              slot="attachments"
              key={index}
              url={attachment?.url}
              style={{objectFit: "cover"}}
              height={attachment?.height}
              width={attachment?.width}
            />
          }
          return (
            <DiscordAttachment
              slot="attachments"
              key={index}
              url={attachment?.url}
              style={{objectFit: "cover"}}
              height={attachment?.height / 2.2 > 400 ? 400 : attachment?.height / 2.2}
              width={attachment?.width /2.2 > 600 ? 600 : attachment?.width /2.2}
              alt={attachment?.filename}
            />
          )
        })
        : ""}

      {embeds ? embeds.map((embed, index) => <Embed key={index} color={"#" + (embed?.color?.toString(16) || "ffffff")}
                                            footer={embed?.footer}
                                            fields={embed?.fields}
                                            description={embed?.description}
                                            embedTitle={embed?.title}
                                            authorName={embed?.author?.name}
                                            authorImage={embed?.author?.icon_url}
                                            authorUrl={embed?.author?.url}
                                            image={embed?.image?.url}
                                            thumbnail={embed?.thumbnail?.url}
      />) : ""}
    </DiscordMessage>
  )
}