import styled from "styled-components";
import {FC} from "react";
import {useDispatch} from "react-redux";
import {removeAuth, removeToken} from "../../../../store/actions/authActions";
import {cookieService} from "../../../../utils/cookie";

const StyledExit = styled.div`
  min-width: 15px;
  height: 15px;
  border-radius: 100%;
  background-color: ${props  => props.theme.colors.exitRed};
  cursor: pointer;
  transition: .3s linear all;
  &:hover{
    transform: scale(1.04);
  }
`;

export const Exit:FC = () => {

  const dispatch = useDispatch();

  const onClick = () => {
    cookieService.deleteCookie("token");
    dispatch(removeAuth());
    dispatch(removeToken());
  }

  return(
    <StyledExit onClick={onClick}/>
  )
}