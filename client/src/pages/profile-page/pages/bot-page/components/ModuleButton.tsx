import {FC, useState} from "react";
import styled from "styled-components";
import {Text} from "../../../../../components/Text";
import {useNavigate} from "react-router-dom";
import {SettingOutlined} from "@ant-design/icons";
import {Switch} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/store";
import {toggleModule} from "../../../../../utils/api";

interface Props{
    title: string,
    link: string,
    checked?: boolean,
    value: string,
    canCheck: boolean
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

export const ModuleButton: FC<Props> = ({title, link, checked, value, canCheck}) => {

    const guild_id = useSelector<RootState>(state => state.bot.currentGuild) as string;

    const [isChecked, setCheck] = useState(checked);
    const [load, setLoad] = useState(false);
    const navigator = useNavigate();

    const changeHandler = () => {
        setLoad(true);
        if (!isChecked){
            toggleModule(value, guild_id, "on_module").then(data => {
                setLoad(false);
                if (!data.err){
                    setCheck(true)
                }
            });
        }
        else{
            toggleModule(value, guild_id, "off_module").then(data => {
                setLoad(false);
                if (!data.err){
                    setCheck(false)
                }
            });
        }
    }

    return(
        <StyledButton>
            <Text style={{fontSize: "16px", fontWeight: "500"}}>
                {title}
            </Text>
            {canCheck ? <Switch checked={isChecked} onChange={changeHandler} loading={load} style={{margin: "0 0 0 10px"}}/> : "" }
            <SettingOutlined style={{margin: "0 0 0 auto"}} onClick={() => navigator("/profile/" + link)}/>
        </StyledButton>
    )
}