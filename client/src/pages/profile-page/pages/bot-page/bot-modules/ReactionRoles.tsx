import {ChangeEvent, FC, useState} from "react";
import styled from "styled-components";
import {Button, Input, Modal, PageHeader, Tooltip, Typography} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/store";
import {Guild} from "../../../../../types/Guild";
import {addRole, defineCommandProperty, fetchGuildData, removeRole} from "../../../../../utils/api";
import uniq from 'uniqid';
import {Select} from 'antd';
import {message} from "antd";
import {setGuildData} from "../../../../../store/actions/botActions";

const {Option} = Select;

const ReactionRolesWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  height: auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-auto-rows: 150px;
  grid-gap: 10px 10px;
  overflow-x: hidden;
  overflow-y: auto;
  margin: 10px;
  padding: 8px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */

  &::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 10px;
  }

  /* Handle on hover */

  &::-webkit-scrollbar-thumb:hover {
    background: #e6fffb;
  }
`;
const ReactionRole = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: #17161a;
  border-radius: 3px;
  padding: 10px;

  p {
    text-align: center;
  }
`;

export const ReactionRoles: FC = () => {

  const guild = useSelector<RootState>(state => state.bot.guildData) as Guild;
  const channels = useSelector<RootState>(state => state.bot.guildChannels) as { name: string, id: string }[];
  const roles = useSelector<RootState>(state => state.bot.guildRoles) as { name: string, id: string, color: string }[];

  const dispatch = useDispatch();

  const [isVisible, setVisible] = useState(false);

  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [emoji, setEmoji] = useState("");
  const [messageId, setMessageId] = useState("");

  return (
    <ReactionRolesWrapper>

      <PageHeader
        onBack={() => window.history.back()}
        title={<>
          Reaction Roles
          <Button type="primary" size="small" onClick={() => {
            setVisible(true);
          }
          } style={{margin: "0 10px"}}>
            Добавить
          </Button>
        </>}
        subTitle="Настройка"
      />

      <Modal
        visible={isVisible}
        title={`Добавление новой Reaction Role`}
        onCancel={() => {
          setVisible(false);
          setSelectedChannel("");
          setEmoji("");
          setMessageId("");
          setSelectedRole("");
        }}
        footer={[
          <Button key="submit" type="primary" onClick={async () => {
            if (!selectedChannel || !messageId || !selectedRole || !emoji) {
              message.error("Заполните все поля!")
              return;
            }
            await addRole({
              channelId: selectedChannel,
              messageId,
              roleId: selectedRole,
              emoji,
              id: uniq()
            }, guild.id).then((data) => {
              if (!data.err) {
                setVisible(false);
              }
              fetchGuildData(guild.id).then(data => {
                if (data.err) {
                  message.error(data.message);
                } else {
                  if (data?.guild) {
                    dispatch(setGuildData({guild: data.guild, channels: data.channels, roles: data.roles}))
                  }
                }
              });
            })
          }}>
            Submit
          </Button>
        ]}
      >
        <Select
          showSearch
          defaultValue={selectedRole}
          placeholder="Нажмите чтобы выбрать роль"
          optionFilterProp="children"
          style={{width: "100%", margin: "5px 0"}}
          onChange={(selected: string) => {
            setSelectedRole(selected)
          }}
        >
          {roles
            .filter(c => !selectedRole.includes(c.id))
            .map((role, i) => (
              <Option style={{borderLeft: "2px solid " + role.color}} value={role.id} key={i}>{role.name}</Option>))}
        </Select>
        <Select
          showSearch
          defaultValue={selectedChannel}
          placeholder="Нажмите чтобы выбрать канал"
          optionFilterProp="children"
          style={{width: "100%", margin: "5px 0"}}
          onChange={(selected: string) => {
            setSelectedChannel(selected)
          }}
        >
          {channels
            .filter(c => !selectedChannel.includes(c.id))
            .map((channel, i) => (<Option value={channel.id} key={i}>{channel.name}</Option>))}
        </Select>
        <Input placeholder="Введите айди сообщения"
               style={{margin: "5px 0"}}
               value={messageId}
               onChange={(e: ChangeEvent<HTMLInputElement>) => setMessageId(e.target.value)}/>
        <Input placeholder="Введите емодзи"
               style={{margin: "5px 0"}}
               value={emoji}
               onChange={(e: ChangeEvent<HTMLInputElement>) => setEmoji(e.target.value)}/>
      </Modal>

      <Wrapper>
        {guild.options.reactionRole.map(rr => (
          <Tooltip title={<Button key="submit" type="primary" onClick={async () => {
            removeRole(rr.id, guild.id);
            fetchGuildData(guild.id).then(data => {
              if (data.err) {
                message.error(data.message);
              } else {
                if (data?.guild) {
                  dispatch(setGuildData({guild: data.guild, channels: data.channels, roles: data.roles}))
                }
              }
            });
          }}>Удалить</Button>}>
            <ReactionRole key={rr.id}>
              <p>#{channels.find(c => rr.channelId === c.id)?.name}</p>
              <p
                style={{color: roles.find(c => rr.roleId === c.id)?.color}}>@{roles.find(c => rr.roleId === c.id)?.name}</p>
              <p>{rr.messageId}</p>
              <p>{rr.emoji}</p>
            </ReactionRole>
          </Tooltip>
        ))}
      </Wrapper>

    </ReactionRolesWrapper>
  )
}

function uniqid(): string {
  throw new Error("Function not implemented.");
}
