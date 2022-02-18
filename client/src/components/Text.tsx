import styled from "styled-components";
import {FC} from "react";

const StyledText = styled.p<any>`
  margin: ${props => props.margin};
  font-size: ${props => props.fontSize};
  color: ${props => {
    if (props.color in props.theme.colors){
      return props.theme.colors[props.color];
    }
    else{
      return props.color;
    }
  }};
  font-weight: ${props => props.fontWeight};
  padding: ${props => props.padding};
  text-align: ${props => props.textAlign};
`

export const Text:FC<any> = ({children, style}) => {
  return (
    <StyledText {...style}>
      {children}
    </StyledText>
  )
}