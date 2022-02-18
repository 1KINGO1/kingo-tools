import TextArea from "antd/lib/input/TextArea";
import {ChangeEvent, FC, useState} from "react";
import styled from "styled-components";
import {Text} from "../../../../components/Text";
import {Typography} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setBody} from "../../../../store/actions/dbcActions";
import {RootState} from "../../../../store/store";

const StyledJSON = styled.div`
  width: 500px; 
  margin: 0 0 0 20px;
`

export const JsonEnter: FC = () => {

  const [jsonError, setJsonError] = useState(false);

  const body = useSelector<RootState>(state => state.dcb.body);

  const dispatch = useDispatch();

  const changeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setBody(e.target.value));
    try{
      JSON.parse(e.target.value);
      setJsonError(false);
    } catch (err){
      if (e.target.value.length === 0){
        setJsonError(false);
      }
      setJsonError(true);
    }
  }

  return(
    <StyledJSON>
      <Text style={{margin: "10px 0"}}>
        Body (in JSON) {jsonError ? <Typography.Text type="danger" style={{display: "inline-block"}}>Неправильный формат JSON</Typography.Text> : ""}
      </Text>
      <TextArea style={{resize: "none"}} value={JSON.stringify(body)} onChange={changeHandler} placeholder="Request body object in JSON format" />
    </StyledJSON>
  )
}