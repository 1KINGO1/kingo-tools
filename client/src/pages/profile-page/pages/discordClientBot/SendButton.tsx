import React, {FC} from "react";
import {Button, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/store";
import axios from "axios";
import {dcbSend} from "../../../../utils/api";
import {setResponse} from "../../../../store/actions/dbcActions";

export const SendButton: FC = () => {

  const authToken = useSelector<RootState>(state => state.dcb.token) as string;
  const endPoint = useSelector<RootState>(state => state.dcb.endpoint) as string;
  const currentMethod = useSelector<RootState>(state => state.dcb.method) as string;
  const currentBody = useSelector<RootState>(state => state.dcb.body) as object;

  const dispatch = useDispatch();

  const clickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!authToken || !endPoint || !currentMethod){
      message.error("Ошибка");
    }
    else{
      const res = await dcbSend(currentMethod, endPoint, currentBody, authToken);
      dispatch(setResponse(res.message.message || res.message));
    }
  }

  return (
    <Button size="large" type="primary" onClick={clickHandler}>
      Отправить
    </Button>
  )
}