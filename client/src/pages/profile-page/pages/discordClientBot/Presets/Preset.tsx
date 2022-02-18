import {FC, MouseEvent} from "react";
import {Button} from "antd";
import {useDispatch} from "react-redux";
import {setBody, setEndPoint, setMethod} from "../../../../../store/actions/dbcActions";

interface Preset{
  name: string,
  method: string,
  endpoint: string,
  body: string
};

export const Preset: FC<Preset> = ({name, endpoint, body, method}) => {

  const dispatch = useDispatch();

  const clickHandler = (e: MouseEvent<HTMLButtonElement>) => {
    dispatch(setMethod(method));
    dispatch(setBody(body));
    dispatch(setEndPoint(endpoint));
  }

  return (
    <Button onClick={clickHandler} type="primary" size="large" style={{margin: "10px"}}>
      {name}
    </Button>
  )
}