import {FC, useState} from "react";
import styled from "styled-components";
import {Button, Input, message, PageHeader, Select} from "antd";
import TextArea from "antd/lib/input/TextArea";
import {addCommand, defineCommandProperty} from "../../../../../../utils/api";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/store";
import {Guild} from "../../../../../../types/Guild";
import {CustomCommand} from "./CustomCommand";

const {Option} = Select;
const CustomCommandsWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SettingsWrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
`;

const AddWrapper = styled.div`
  width: 79%;
  height: 100%;
  padding: 20px;
  background-color: ${props => props.theme.colors.dark};
  border-radius: 10px;
`;

const ListWrapper = styled.div`
  width: 20%;
  height: 100%;
  background-color: ${props => props.theme.colors.dark};
  border-radius: 10px;
`;

const Label = styled.p`
  font-size: 20px;
  font-weight: 500;
  text-align: center;

  margin: 10px 0;
`;

export const CustomCommands: FC = () => {

  const guild = useSelector<RootState>(state => state.bot.guildData) as Guild;
  const channels = useSelector<RootState>(state => state.bot.guildChannels) as { name: string, id: string }[];
  const roles = useSelector<RootState>(state => state.bot.guildRoles) as { name: string, id: string, color: string }[];

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [sendChannel, setSendChannel] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [commands, setCommands] = useState(guild.options.customCommands);

  const addHandler = () => {
    if (!name || !content || !sendChannel || selectedChannels.length === 0 || selectedRoles.length === 0){
      message.error("Заполните все поля!");
      return;
    }
    try{
      JSON.parse(content);
    }catch (e) {
      message.error("Неверный формат JSON!");
      return;
    }
    addCommand({name, text: content, sendChannel, rolesWhiteList: selectedRoles, channelWhiteList: selectedChannels}, guild.id).then(data => {
      if (!data.err){
        setCommands([...commands, {name, text: content, sendChannel, rolesWhiteList: selectedRoles, channelWhiteList: selectedChannels}])
      }
      else{
        message.error(data.message);
      }
    })
  }

  return (
    <CustomCommandsWrapper>
      <PageHeader
        onBack={() => window.history.back()}
        title={<>
          Custom Commands

        </>}
        subTitle="Настройка"
      />
      <SettingsWrapper>
        <AddWrapper>
          <Label>
            Название
          </Label>
          <Input value={name} onChange={(e) => setName(e.target.value)}
                 style={{width: "80%", margin: "0 auto", display: "block"}} addonBefore="+"
                 placeholder="Введите название команды"/>
          <Label>
            Контент
          </Label>
          <TextArea style={{minHeight: 120, maxHeight: 120, width: "80%", margin: "0 auto", display: "block"}}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Введите контент сообщения"/>
          <Label>
            Канал отправки
          </Label>
          <Select
            showSearch
            placeholder="Нажмите чтобы выбрать"
            optionFilterProp="children"
            style={{width: "80%", margin: "0 auto", display: "block"}}
            onSelect={(id: string) => {
              setSendChannel(id);
            }}
          >
            {[...channels, {id: "current", name: "current"}].map((channel, i) => (
              <Option value={channel.id} key={i}>#{channel.name}</Option>))}
          </Select>

          <Label>
            Whitelist Роли
          </Label>
          <Select
            mode="multiple"
            defaultValue={selectedRoles}
            placeholder="Нажмите чтобы выбрать"
            optionFilterProp="children"
            style={{width: "80%", margin: "0 auto", display: "block"}}
            onChange={(selected: string[]) => {
              setSelectedRoles(selected)
            }}
          >
            {[...roles, {id: "admins", name: "admins", color: "24E7EA"}]
              .map((role, i) => (
                <Option style={{borderLeft: "2px solid " + role.color}} value={role.id} key={i}>{role.name}</Option>))}
          </Select>

          <Label>
            Whitelist Каналы
          </Label>
          <Select
            mode="multiple"
            defaultValue={selectedChannels}
            placeholder="Нажмите чтобы выбрать"
            optionFilterProp="children"
            style={{width: "80%", margin: "0 auto", display: "block"}}
            onChange={(selected: string[]) => {
              setSelectedChannels(selected)
            }}
          >
            {[...channels, {id: "all", name: "all"}]
              .map((channel, i) => (<Option value={channel.id} key={i}>{channel.name}</Option>))}
          </Select>
          <Button type="primary" style={{margin: "10px auto", display: "block"}} onClick={addHandler}>Добавить</Button>
        </AddWrapper>
        <ListWrapper>
          {commands.map(c => <CustomCommand name={c.name} text={c.text} sendChannel={c.sendChannel} rolesWhiteList={c.rolesWhiteList} channelWhiteList={c.channelWhiteList} setCommands={setCommands} commands={commands}/>)}
        </ListWrapper>
      </SettingsWrapper>
    </CustomCommandsWrapper>
  );
}