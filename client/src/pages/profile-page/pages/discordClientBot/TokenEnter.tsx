import {ChangeEvent, FC, useState} from "react";
import styled from "styled-components";
import {ApiOutlined, CheckOutlined, InfoCircleOutlined, UserOutlined} from "@ant-design/icons";
import {Button, Input, Tooltip, message} from "antd";
import {dcbLogin} from "../../../../utils/api";
import {useDispatch} from "react-redux";
import {setToken, removeToken} from "../../../../store/actions/dbcActions";

const StyledTokenEnter = styled.div`
  display: flex;
  justify-content: space-between;
  height: 40px;
`

export const TokenEnter:FC = () => {

  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [isSuccess, setSuccess] = useState(false);

  const dispatch = useDispatch();

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setSuccess(false);
    dispatch(removeToken());
  }

  const clickHandler = async () => {
    setLoading(true);
    const res = await dcbLogin(value);
    if (res.err){
      message.error(res.message);
      setLoading(false);
      dispatch(removeToken());
    }
    else{
      setSuccess(true);
      dispatch(setToken(value));
      setLoading(false);
    }
  }

  return(
    <StyledTokenEnter>
      <Input
        value={value}
        onChange={changeHandler}
        size="large"
        placeholder="Введите токен клиента"
        prefix={<UserOutlined className="site-form-item-icon" />}
        suffix={
          <Tooltip title="Гайд, как получить этот токен, находится на GitHub">
            <InfoCircleOutlined style={{ color: 'rgba(255,255,255,0.45)' }} />
          </Tooltip>
        }
      />
      <Button
        type="primary"
        icon={isSuccess ? <CheckOutlined style={{ color: 'rgba(255,255,255,0.45)' }}/> : <ApiOutlined style={{ color: 'rgba(255,255,255,0.45)' }}/>}
        style={{height: "100%"}}
        loading={isLoading}
        onClick={clickHandler}
      >
        {isSuccess ? "Подключено" : "Подключится"}
      </Button>
    </StyledTokenEnter>
  )
}