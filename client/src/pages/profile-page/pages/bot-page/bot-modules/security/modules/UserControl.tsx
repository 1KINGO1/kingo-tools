import {FC} from "react";
import {Title} from "../components/Title";
import {Checkbox} from "antd";

export const UserControl: FC = () => {
  return(
    <>
      <Checkbox style={{fontSize: "18px", fontWeight: 500, margin: "5px 0"}}>Кикать новые аккаунты</Checkbox>
      <Checkbox style={{fontSize: "18px", fontWeight: 500, margin: "5px 0"}}>Кикать пользователей с не пингабельными никами</Checkbox>
      <Checkbox style={{fontSize: "18px", fontWeight: 500, margin: "5px 0"}}>Кикать пользователей с запрещёнными символами в нике (свастика и тгд)</Checkbox>
      <Checkbox style={{fontSize: "18px", fontWeight: 500, margin: "5px 0"}}>Кикать пользователей, содержащих инвайт дискорд (в статусе или описании)</Checkbox>
    </>
  )
}