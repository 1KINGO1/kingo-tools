import {FC} from "react";
import styled from "styled-components";
import {CustomCommand as CustomCommandType} from "../../../../../../types/CustomCommand";
import {CloseOutlined} from "@ant-design/icons";
import {removeCommand} from "../../../../../../utils/api";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/store";
import {Guild} from "../../../../../../types/Guild";

const CustomCommandWrapper = styled.div`
  padding: 10px;
  margin: 5px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommandTitle = styled.span`
  display: block;
  font-size: 18px;
`;

export const CustomCommand: FC<CustomCommandType & {setCommands: Function, commands: CustomCommandType[]}> = ({name, text, setCommands, commands}) => {

  const guild = useSelector<RootState>(state => state.bot.guildData) as Guild;

  return(
    <CustomCommandWrapper>
      <CommandTitle>
        {name}
      </CommandTitle>
      <CloseOutlined onClick={() => {
        removeCommand(name, guild.id).then((data) => {
          if (!data.err){
            let arr = [];
            for (let com of commands){
              if (com.name === name) continue;
              arr.push(com);
            }
            setCommands(arr);
          }
        })
      }}/>
    </CustomCommandWrapper>
  )
}