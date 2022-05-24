import {FC} from "react";
import styled from "styled-components";

const SelectButtonWrapper = styled.div`
  padding: 8px;
  font-size: 16px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px solid rgb(255, 255, 255, 0.2);
  cursor: pointer;

  &:hover {
    transform: scale(1.01);
  }
  
  &:active{
    transform: scale(1.01);
    background-color: rgba(255, 255, 255, 0.2);
  }

`;

interface Props {
  value: string,
  setCurrent: Function
}

export const SelectButton: FC<Props> = ({value, children, setCurrent}) => {
  return (
    <SelectButtonWrapper onClick={() => setCurrent(value)}>
      {children}
    </SelectButtonWrapper>
  )
}