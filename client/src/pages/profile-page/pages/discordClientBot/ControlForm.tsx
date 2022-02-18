import {ChangeEvent, FC} from "react";
import styled from "styled-components";
import {TokenEnter} from "./TokenEnter";
import {Input, Popover, Radio} from "antd";
import {Text} from "../../../../components/Text";
import {JsonEnter} from "./JsonEnter";
import {ResponsePreview} from "./ResponsePreview";
import {SendButton} from "./SendButton";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/store";
import {setEndPoint, setMethod} from "../../../../store/actions/dbcActions";
import {Presets} from "./Presets/Presets";

const StyleControlForm = styled.div`
  margin: 20px 0 auto 0;
`

const EndPoint = styled.div`
  margin: 20px 0;
`

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const ControlForm:FC = () => {

  const token = useSelector<RootState>(state => state.dcb.token);

  const endPoint = useSelector<RootState>(state => state.dcb.endpoint);
  const currentMethod = useSelector<RootState>(state => state.dcb.method) as string;

  const dispatch = useDispatch();

  const onMethodChange = (e: any) => {
    dispatch(setMethod(e.target.value));
  }

  const onEndpointChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setEndPoint(e.target.value));
  }

  return(
    <StyleControlForm>
      <TokenEnter />
      {token ?
        <EndPoint>
          <Text style={{margin: "10px 0"}}>
            Discord API endpoint
          </Text>
          <Popover content={"Список всех endpoints - https://discord.com/developers/docs"} trigger="hover">
            <Input size="large" addonBefore="https://discord.com/api/v9/" value={endPoint as string}
                   onChange={onEndpointChange}/>
          </Popover>
          <Flex>
            <div>
              <Text style={{margin: "10px 0"}}>
                Request Method
              </Text>
              <Radio.Group defaultValue="GET" buttonStyle="solid" onChange={onMethodChange} value={currentMethod.toUpperCase()}>
                <Radio.Button value="GET">GET</Radio.Button>
                <Radio.Button value="POST">POST</Radio.Button>
                <Radio.Button value="PUT">PUT</Radio.Button>
                <Radio.Button value="PATCH">PATCH</Radio.Button>
              </Radio.Group>
            </div>
            {currentMethod === "get" ? "" : <JsonEnter/>}
            <SendButton/>
          </Flex>
          <ResponsePreview/>
          <Presets />
        </EndPoint> :
        ""
      }
    </StyleControlForm>
  )
}