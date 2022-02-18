import {FC, useEffect} from "react";
import styled from "styled-components";
import {NavigationBar} from "./NavigationBar";
import {ViewContent} from "./ViewContent";
import {useDispatch} from "react-redux";
import {loadData} from "../../../../utils/api";
import {setData} from "../../../../store/actions/authActions";
import {message} from "antd";

const StyledMain = styled.main`
  height: 91%;
  display: flex;
  justify-content: space-between;
`

export const Main: FC = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    loadData().then((data) => {
      if ("err" in data){
        message.error("Ошибка получения данных!")
      }
      else{
        dispatch(setData(data));
      }
    });
  }, [])

  return(
    <StyledMain>
      <NavigationBar/>
      <ViewContent/>
    </StyledMain>
  )
}