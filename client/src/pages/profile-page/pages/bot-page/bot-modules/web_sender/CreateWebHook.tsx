import {FC, useState} from "react";
import styled from "styled-components";
import {Button, Input, message, Modal} from "antd";
import {RightOutlined} from "@ant-design/icons";
import {motion} from "framer-motion";
import {socket} from "../../../../../../App";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/store";
import {Guild} from "../../../../../../types/Guild";

const Wrapper = styled(motion.div)`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 100%;
  cursor: pointer;
  z-index: 1;
  
  position: relative;
  
  &:hover:before{
    position: relative;
    content: "Добавте изображение";
    width: 150px;
    height: 150px;
    background-color: #000c17;
    z-index: 9999999999999;
  }
`;

const Username = styled.input`
  width: 100%;
  font-size: 45px;
  margin: 0 10px 0 20px;
  color: white;
  border: none;
  outline: none;
  background-color: transparent;
`;

const UserWrapper = styled.div`
  display: flex;
`;

const Box = styled.div`
  background-color: #18191c;
  width: 60%;
  padding: 25px;
  border-radius: 5px;
`;

interface Props{
  setWebhookVisible: Function
}

export const CreateWebHook: FC<Props> = ({setWebhookVisible}) => {

  const guild = useSelector<RootState>(state => state.bot.guildData) as Guild;
  const [isVisible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const clickHandler = () => {
    if (!name){
      message.error("Укажите имя вебхука");
      return;
    }
    setWebhookVisible(false);
    socket.emit("load_webhook_data", {name, image: image || "", guild: guild.id})
  }

  return(
    <Wrapper initial={{y: 1000}} animate={{y: 0}}>
      <Modal title="Укажите ссылку на изображение" visible={isVisible} onOk={() => {setVisible(false)}} onCancel={() => {setVisible(false); setImage("")}}>
        <Input placeholder="Введите ссылку" style={{width: "100%"}} value={image} onChange={(e) => setImage(e.target.value)}/>
      </Modal>
      <Box>
        <UserWrapper>
          <Avatar src={image || "https://indiaatoz.in/wp-content/uploads/2021/09/6138f89602459-384x384.png"} onClick={() => setVisible(true)}/>
          <Username placeholder="Введите никнейм" value={name} onChange={(e) => setName(e.target.value)}/>
        </UserWrapper>
        <Button style={{display: "block", margin: "15px 0 0 auto", textAlign: "center"}} type="primary" onClick={clickHandler}>Дальше <RightOutlined /></Button>
      </Box>
    </Wrapper>
  )
}