import {FC} from "react";
import styled from "styled-components";
import {Menu} from "antd";
import {CrownOutlined} from "@ant-design/icons";
import {Link, Navigate, useNavigate} from "react-router-dom";
import config from "../../../../config/config";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/store";
import {User} from "../../../../store/actions/authActions";

const StyledNavigation = styled.nav`
  width: 20%;
  padding: 20px;
  height: 100%;
  border-right: 10px solid ${props => props.theme.colors.grayBlack};
`

export const NavigationBar: FC = () => {

  const navigator = useNavigate();

  const user = useSelector<RootState>(state => state.auth.user) as User;

  return(
    <StyledNavigation>
      <Menu
        defaultSelectedKeys={['0']}
        mode="inline"
        theme="dark"
        selectedKeys={[config.pages.filter(page => "/profile/" + page.link === window.location.pathname).map(page => page.key).join("") || "0"]}
        style={{backgroundColor: "#1F1B24", width: "100%"}}
      >
        <Menu.Item key="0" icon={<CrownOutlined />}>
          <Link to="/profile/intro">Introduction</Link>
        </Menu.Item>
        {
          config.pages.map((page,  index) => {
            const isAllow = user.flags.some((flag: { id: number; }) => page.allowed.includes(flag.id));
            if (isAllow){
              return (
                <Menu.Item key={page.key} icon={page.icon} onClick={() => {navigator(`/profile/${page.link}`)}}>
                  {page.name}
                </Menu.Item>)
            }
            else {return (<></>)};
          })
        }
      </Menu>
    </StyledNavigation>
  )
}