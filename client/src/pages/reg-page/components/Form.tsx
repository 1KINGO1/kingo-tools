import {ChangeEvent, FC, useState, MouseEvent, useEffect} from "react";
import styled from "styled-components";
import {Button, Input, message, Spin} from "antd";
import {UserOutlined, LockOutlined, MailOutlined, LoadingOutlined} from "@ant-design/icons";
import {Text} from "../../../components/Text";
import {login as accountLogin, verifyToken} from "../../../utils/api";
import {useDispatch} from "react-redux";
import {auth, setToken} from "../../../store/actions/authActions";
import {cookieService} from "../../../utils/cookie";
import {motion} from "framer-motion";
import {fade} from "../../../styles/variants/Fade";
import {Link} from "react-router-dom";

const StyledForm = styled(motion.div)`

  width: 600px;
  padding: 20px 40px;
  margin: 20px;
  position: relative;
  z-index: 999999999;

  background-color: ${props => props.theme.colors.darkPrimary};
`;

export const Form: FC = () => {

  const [login, setLogin] = useState("");
  const [main, setMain] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const token = cookieService.getCookie("token");
    if (token) {
      setIsLoading(true);
      verifyToken(token).then(ver => {
        if (!ver.err) {
          dispatch(setToken(token));
          dispatch(auth());
          setIsLoading(false);
        } else {
          cookieService.deleteCookie("token");
          setIsLoading(false);
        }
      });
    }
  }, [])

  const clickHandler = async (e: MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    const res = await accountLogin(login, password);
    if (res.err) {
      message.error(res.message);
      setIsLoading(false);
      return
    } else {
      setIsLoading(false);
      if (res.token) {
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

  const onMailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMain(e.target.value);
  }

  const isButtonEnable = !(login && password);

  return (
    <Spin spinning={true} indicator={<LoadingOutlined />}>
      <StyledForm initial="initial" variants={fade as any} animate="show">

        <Text style={{padding: "5px 0 15px 5px", color: "mainWhite", fontSize: "22px", fontWeight: "500"}}>
          Регистрация
        </Text>

        <Input
          style={{margin: "5px 0"}}
          size="large"
          placeholder="Login"
          prefix={<UserOutlined/>}
          onChange={onLoginChange}
          value={login}
        />

        <Input
          style={{margin: "5px 0"}}
          size="large"
          placeholder="E-mail"
          prefix={<MailOutlined/>}
          onChange={onMailChange}
          value={main}
        />

        <Input.Password
          style={{margin: "5px 0"}}
          size="large"
          placeholder="Password"
          prefix={<LockOutlined/>}
          onChange={onPasswordChange}
          value={password}
        />
        <div style={{display: "flex", alignItems: "center"}}>
          <Button
            style={{margin: "10px 0"}}
            type="primary"
            disabled={isButtonEnable || isLoading}
            loading={isLoading}
            onClick={clickHandler}
          >
            Зарегистрироватся
          </Button>
          <Text style={{margin: "0 20px", fontSize: "15px"}}>Есть аккаунт? <Link
            to="/login">Войти</Link></Text>
        </div>
      </StyledForm>
    </Spin>
  )
}