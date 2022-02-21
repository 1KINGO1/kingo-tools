import {FC} from "react";
import styled from "styled-components";
import {Avatar, Tag} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {Text} from "../../../../components/Text";
import {Tags} from "./Tags";
import {Exit} from "./Exit";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/store";
import {User} from "../../../../store/actions/authActions";
import {motion} from "framer-motion";

const StyledHeader = styled(motion.header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  height: 9%;
  border-bottom: 10px solid ${props => props.theme.colors.grayBlack};
  position: relative;
`

export const Header: FC = () => {

  const user = useSelector<RootState>(state => state.auth.user) as User;

  return(
    <StyledHeader>
      <Avatar icon={<UserOutlined />} />

      <Text style={{fontSize: "18px", color: "mainWhite", margin: "0 0 0 10px"}}>
        {user.login || "Загрузка..."}
      </Text>

      <Tags>
        {user.flags.map(flag => {
          return(
            <Tag color={flag.color} key={flag.id}>{flag.title}</Tag>
          )
        })}
      </Tags>

      <Exit />
    </StyledHeader>
  )
}