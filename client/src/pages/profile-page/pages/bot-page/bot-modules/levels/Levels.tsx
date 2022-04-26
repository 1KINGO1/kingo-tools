import {ChangeEvent, FC, useState} from "react";
import styled from "styled-components";
import {Button, Checkbox, Input, InputNumber, Modal, PageHeader, Tooltip, Typography} from "antd";
import {Rule} from "./Rule";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../store/store";
import {LevelSystemRole} from "../../../../../../types/LevelSystemRole";
import {defineLevelsRule, defineProperty} from "../../../../../../utils/api";
import {addLevelsRule} from "../../../../../../store/actions/botActions";
import {InfoCircleOutlined} from "@ant-design/icons";
import {message} from "antd";
import {Guild} from "../../../../../../types/Guild";
import {Select} from 'antd';
const {Option} = Select;
const LevelsWrapper = styled.div`
  height: 100%;
  display: flex;
  padding: 0 20px;
  flex-direction: column;
`;
const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
`;
const SettingsWrapper = styled.div`
  width: 70%;
  height: 90%;
`;
const LevelRolesWrapper = styled.div`
  width: 29%;
  height: 90%;
  display: flex;
  flex-direction: column;
`;
const AddButton = styled.div`
  padding: 10px;
  background-color: ${props => props.theme.colors.dark};
  border-radius: 8px;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  margin: 0 0 20px 0;
  cursor: pointer;
  transition: all 0.1s ease;
  
  &:hover{
    transform: scale(1.03);
  }
`;
const RuleListWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 5px;
  border-radius: 8px;
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #121212;
    border-radius: 15px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #070707;
  }
`;

const Label = styled.p`
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  padding: 10px;
  
  margin: 10px 0 0 0;
  
  &:nth-child(1){
    margin: 0;
  }
`;

const CheckBoxWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 5px 0;
`;

export const Levels: FC = () => {

  const levelRoles = useSelector<RootState>(state => state.bot.guildData?.options.levelSystem.levelRoles) as LevelSystemRole[];
  const guildID = useSelector<RootState>(state => state.bot.guildData?.id) as string;
  const guild = useSelector<RootState>(state => state.bot.guildData) as Guild;
  const channels = useSelector<RootState>(state => state.bot.guildChannels) as { name: string, id: string }[];
  const roles = useSelector<RootState>(state => state.bot.guildRoles) as { name: string, id: string, color: string }[];

  const [isVisible, setVisible] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [comment, setComment] = useState("");
  const [requiredLevel, setRequiredLevel] = useState(0);

  const [selectedChannels, setSelectedChannels] = useState<string[]>(guild.options.levelSystem.xpFarmWhiteListChannels);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(guild.options.levelSystem.whiteListRoles);

  const dispatch = useDispatch();

  const ruleAddHandler = () => {
    if (roleId === "" || comment === ""){
      message.error("Заполните все поля");
      return;
    }
    if (levelRoles.some(rule => rule.roleId === roleId)){
      message.error("Айди этой роли уже используется!");
      return;
    }
    defineLevelsRule({roleId, levelRequired: requiredLevel, comment}, "add_levels_rule", guildID).then((data) => {
      if (!data.err){
        dispatch(addLevelsRule({roleId, levelRequired: requiredLevel, comment}));
        setVisible(false);
        setRoleId("");
        setComment("");
        setRequiredLevel(requiredLevel);
      }
    })
  };

  return (
    <LevelsWrapper>
      <PageHeader
        onBack={() => window.history.back()}
        title={<>
          Уровни
        </>}
        subTitle="Настройка"
      />
      <Flex>
        <SettingsWrapper>
          <Flex>
            <div style={{width: "50%"}}>

              <Label>
                Введите коефициент получения опыта
              </Label>
              <InputNumber placeholder="Введите коефициент"
                           style={{display: "block", width: "100%", margin: "5px 0"}}
                           defaultValue={guild.options.levelSystem.xpCoefficient}
                           onBlur={(e) => {
                             defineProperty(+e.target.value, guildID, "levelSystem", "xpCoefficient")
                           }}
              />

              <Label>
                Введите Whitelist каналы
              </Label>
              <Select
                mode="multiple"
                defaultValue={selectedChannels.map(channel => "#" + (channels.find(ch => ch.id === channel)?.name || channel))}
                placeholder="Нажмите чтобы выбрать"
                optionFilterProp="children"
                style={{width: "100%"}}
                onChange={(selected: string[]) => {setSelectedChannels(selected)}}
                onBlur={() => {
                  defineProperty(selectedChannels, guildID, "levelSystem", "xpFarmWhiteListChannels")
                }}
              >
                {[...channels, {id: "all", name: "all"}]
                  .filter(c => !selectedChannels.includes(c.id))
                  .map((channel, i) => (<Option value={channel.id} key={i}>{channel.name}</Option>))}
              </Select>

              <Label>
                Введите Whitelist роли
              </Label>
              <Select
                mode="multiple"
                defaultValue={selectedRoles.map(role => roles.find(r => r.id === role)?.name || role)}
                placeholder="Нажмите чтобы выбрать"
                optionFilterProp="children"
                style={{width: "100%"}}
                onChange={(selected: string[]) => {setSelectedRoles(selected)}}
                onBlur={() => {
                  defineProperty(selectedRoles, guildID, "levelSystem", "whiteListRoles")
                }}
              >
                {roles
                  .filter(c => !selectedRoles.includes(c.id))
                  .map((role, i) => (<Option style={{borderLeft: "2px solid " + role.color}} value={role.id} key={i}>{role.name}</Option>))}
              </Select>
            </div>
            <div style={{width: "48%"}}>
              <CheckBoxWrapper>
                <Checkbox style={{margin: "-6px 7px 0px 0px"}}
                          defaultChecked={guild.options.levelSystem.deleteRolesAfterNewLevel}
                          onChange={(e) => defineProperty(e.target.checked, guildID, "levelSystem", "deleteRolesAfterNewLevel")}/>
                Удалять роли после достижения нового уровня
              </CheckBoxWrapper>
            </div>
          </Flex>
        </SettingsWrapper>
        <LevelRolesWrapper>
          <Modal
            visible={isVisible}
            title={`Добавить награду за роль`}
            onOk={() => {}}
            onCancel={() => {setVisible(false)}}
            footer={[
              <Button key="submit" type="primary" onClick={ruleAddHandler}>
                Добавить
              </Button>
            ]}
          >
            <Label>
              Введите айди роли
            </Label>
            <Input placeholder="Введите айди роли"
                   style={{margin: "5px 0"}}
                   value={roleId}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => setRoleId(e.target.value)}/>
            <Label>
              Введите необходимый уровень
            </Label>
            <InputNumber placeholder="Необходимый уровень"
                         style={{display: "block", width: "100%", margin: "5px 0"}}
                         value={requiredLevel}
                         onChange={(value) => setRequiredLevel(value)}/>
            <Label>
              Введите комментарий
            </Label>
            <Input placeholder="Введите комментарий"
                   value={comment}
                   style={{margin: "5px 0"}}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}/>
          </Modal>
          <AddButton onClick={() => setVisible(true)}>
            Добавить правило
          </AddButton>
          <RuleListWrapper>
            {
              JSON.parse(JSON.stringify(levelRoles)).sort((r1: LevelSystemRole, r2: LevelSystemRole) => {
                return r1.levelRequired - r2.levelRequired
              }).map((rule: LevelSystemRole) => (
                <Rule roleId={rule.roleId} levelRequired={rule.levelRequired} comment={rule.comment} key={rule.roleId}/>
              ))
            }
          </RuleListWrapper>
        </LevelRolesWrapper>
      </Flex>
    </LevelsWrapper>
  )
}