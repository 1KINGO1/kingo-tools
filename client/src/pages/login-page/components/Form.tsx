import {ChangeEvent, FC, useState, MouseEvent, useEffect} from "react";
import styled from "styled-components";
import {Button, Input, message} from "antd";
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import {Text} from "../../../components/Text";
import {login as accountLogin, verifyToken} from "../../../utils/api";
import {useDispatch} from "react-redux";
import {auth, setToken} from "../../../store/actions/authActions";
import {cookieService} from "../../../utils/cookie";

const StyledForm = styled.div`

  width: 600px;
  padding: 20px 40px;
  margin: 20px;
  border-radius: 15px;
  position: relative;
  z-index: 999999999;
  
  background-color: ${props => props.theme.colors.darkPrimary};
`;

export const Form: FC = () => {

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const token = cookieService.getCookie("token");
    if (token){
      setIsLoading(true);
      verifyToken(token).then(ver => {
        if (!ver.err){
          dispatch(setToken(token));
          dispatch(auth());
          setIsLoading(false);
        }
        else{
          cookieService.deleteCookie("token");
          setIsLoading(false);
        }
      });
    }
  }, [])

  const clickHandler = async (e: MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    const res = await accountLogin(login, password);
    if (res.err){
      message.error(res.message);
      setIsLoading(false);
      return
    }
    else{
      setIsLoading(false);
      if (res.token){
        dispatch(setToken(res.token));
        cookieService.setCookie("token", res.token);
        message.success("Добро пожаловать!");
        dispatch(auth());
      }
    }
  }

  const onLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
  }

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const isButtonEnable = !(login && password);

  return (
    <StyledForm>

      <Text style={{padding: "5px 0 15px 5px", color: "mainWhite", fontSize: "22px", fontWeight: "500" }}>
        Войдите
      </Text>

      <Input
        style={{margin: "5px 0"}}
        size="large"
        placeholder="Login"
        prefix={<UserOutlined />}
        onChange={onLoginChange}
        value={login}
      />

      <Input.Password
        style={{margin: "5px 0"}}
        size="large"
        placeholder="Password"
        prefix={<LockOutlined/>}
        onChange={onPasswordChange}
        value={password}
      />

      <Button
        style={{margin: "10px 0"}}
        type="primary"
        disabled={isButtonEnable || isLoading}
        loading={isLoading}
        onClick={clickHandler}
      >
        Войти
      </Button>
    </StyledForm>
  )
}