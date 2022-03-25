import {FC, useState} from "react";
import styled from "styled-components";
import {Text} from "../../../../../components/Text";
import {useNavigate} from "react-router-dom";
import {SettingOutlined} from "@ant-design/icons";
import {Switch} from "antd";

interface Props{
    title: string,
    link: string,
    checked: boolean
}

const StyledButton = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.colors.grayBlack};
  border-radius: 10px;
  margin: 10px;
`;

export const ModuleButton: FC<Props> = ({title, link, checked}) => {

    const [isChecked, setCheck] = useState(checked);
    const navigator = useNavigate();

    return(
        <StyledButton>
            <Text style={{fontSize: "16px", fontWeight: "500"}}>
                {title}
            </Text>
            <Switch checked={isChecked} onChange={() => setCheck(prev => !prev)} style={{margin: "0 0 0 10px"}}/>
            <SettingOutlined style={{margin: "0 0 0 auto"}} onClick={() => navigator("/profile/" + link)}/>
        </StyledButton>
    )
}