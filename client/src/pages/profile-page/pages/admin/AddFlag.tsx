import React, {FC} from "react";
import styled from "styled-components";
import {Checkbox, Tag} from "antd";
import {addFlag, removeFlag} from "../../../../utils/adminAPI";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

const StyledAddFlag = styled.div<StyledProps>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 200px;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  display: ${props => props.isShow ? "block" : "none"};
  background-color: ${props => props.theme.colors.darkPrimary};
  box-shadow: 0px 0px 12px ${props => props.theme.colors.dark};
  z-index: 99999999999;
`;

export interface Flag {
  id: number,
  title: string,
  color: string
}

interface StyledProps {
  x: number,
  y: number,
  isShow: boolean,
  onClick: any
}

interface AddFlagProps extends StyledProps {
  flags: Array<Flag>,
  includedFlags: Array<number>,
  updateUsers: Function,
  login: string,
}

export const AddFlag: FC<AddFlagProps> = ({ x,
                                            y,
                                            isShow,
                                            flags,
                                            includedFlags,
                                            updateUsers,
                                            login,
                                            onClick }
) => {

  const changeHandler = (e: CheckboxChangeEvent, flag: Flag) => {
    if (e.target.checked){
      addFlag(login, flag.id).then(() =>  {
        updateUsers();
      })
    }
    else{
      removeFlag(login, flag.id).then(() =>  {
        updateUsers();
      });
    }
  }

  return (
    <StyledAddFlag x={x} y={y} isShow={isShow} onClick={onClick}>
      {flags.map(flag => {
        return (
          <Checkbox key={flag.id}
                    style={{margin: "4px auto"}}
                    checked={flags.some(() => includedFlags.includes(flag.id))}
                    onChange={(e: CheckboxChangeEvent) => changeHandler(e, flag)}
          >
            <Tag color={flag.color} key={flag.id}>{flag.title}</Tag>
          </Checkbox>)
      })}
    </StyledAddFlag>
  )
}