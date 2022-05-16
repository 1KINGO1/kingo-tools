import {
  DiscordEmbed,
  DiscordEmbedDescription,
  DiscordEmbedField, DiscordEmbedFields,
  DiscordEmbedFooter
} from "@skyra/discord-components-react";
import {FC} from "react";

interface EmbedProps {
  authorImage?: string,
  authorName?: string,
  authorUrl?: string,
  color: string,
  embedTitle?: string,
  image?: string,
  thumbnail?: string,
  url?: string,
  description?: string,
  footer?: {
    icon_url?: string,
    text?: string
  },
  fields?: {name: string, value: string, inline: boolean}[]
}

export const Embed: FC<EmbedProps> = ({
                                        authorImage,
                                        authorName,
                                        authorUrl,
                                        color,
                                        embedTitle,
                                        image,
                                        thumbnail,
                                        url,
                                        description,
                                        footer,
                                        fields
                                      }) => {
  return (
    <div>
      <DiscordEmbed
        slot="embeds"
        authorImage={authorImage || ""}
        authorName={authorName || ""}
        authorUrl={authorUrl || ""}
        color={color || "#ffffff"}
        embedTitle={embedTitle || ""}
        image={image || ""}
        thumbnail={thumbnail || ""}
        url={url || ""}
      >

        {description ?
          <DiscordEmbedDescription slot="description">
            {description || ""}
          </DiscordEmbedDescription> : ""
        }

        {fields?.length !== 0 ?
          <DiscordEmbedFields slot="fields">
            {fields?.map((field, index) => {
              return <DiscordEmbedField fieldTitle={field.name} inline={field.inline}>
                {field.value}
              </DiscordEmbedField>
            })}
          </DiscordEmbedFields>
          : ""}

        {footer ? <DiscordEmbedFooter
          slot="footer"
          footerImage={footer?.icon_url}
        >
          {footer?.text}
        </DiscordEmbedFooter> : ""}

      </DiscordEmbed>
    </div>
  )
}