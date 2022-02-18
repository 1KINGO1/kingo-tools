import {FC} from "react";
import styled from "styled-components";
import {Menu} from "antd";
import {
  BugOutlined,
  ContactsOutlined,
  ContainerOutlined,
  CrownOutlined,
  DesktopOutlined,
  PieChartOutlined
} from "@ant-design/icons";
import {Link, Route} from "react-router-dom";
import config from "../../../../config/config";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/store";

const StyledNavigation = styled.nav`
  width: 20%;
  padding: 20px;
  height: 100%;
  border-right: 10px solid ${props => props.theme.colors.grayBlack};
`

export const NavigationBar: FC = () => {

  const user = useSelector<RootState>(state => state.auth.user);

  return(
    <StyledNavigation>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        style={{backgroundColor: "#1F1B24", width: "100%"}}
      >
        <Menu.Item key="1" icon={<CrownOutlined />}>
          <Link to="/profile/intro">Introduction</Link>
        </Menu.Item>
        {
          config.pages.map((page,  index) => {
            // @ts-ignore
            const isAllow = user.flags.some((flag: { id: number; }) => page.allowed.includes(flag.id));
            if (isAllow){
              return (
                <Menu.Item key={index + 2} icon={page.icon}>
                  <Link to={`/profile/${page.link}`}>{page.name}</Link>
                </Menu.Item>)
            }
            else {return <></>};
          })
        }
      </Menu>
    </StyledNavigation>
  )
}