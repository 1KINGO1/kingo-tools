import {FC} from "react";
import {Title} from "../components/Title";
import {Checkbox} from "antd";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../../store/store";
import {Guild} from "../../../../../../../types/Guild";
import {defineProperty} from "../../../../../../../utils/api";

export const UserControl: FC = () => {

  const guild = useSelector<RootState>(state => state.bot.guildData) as Guild;

  return(
    <>
      <Checkbox style={{fontSize: "18px", fontWeight: 500, margin: "5px 0"}}
                onClick={(e: any) => {
                  defineProperty(e.target?.checked, guild.id, "secure", "userControl", "kickNewAccount")
                }}
                defaultChecked={guild.options.secure?.userControl?.kickNewAccount || false}>
        Кикать новые аккаунты
      </Checkbox>
      <Checkbox style={{fontSize: "18px", fontWeight: 500, margin: "5px 0"}}
                onClick={(e: any) => {
                  defineProperty(e.target?.checked, guild.id, "secure", "userControl", "kickPinglessNicks")
                }}
                defaultChecked={guild.options.secure?.userControl?.kickPinglessNicks || false}>
        Кикать пользователей с не пингабельными никами
      </Checkbox>
      {/*<Checkbox style={{fontSize: "18px", fontWeight: 500, margin: "5px 0"}}*/}
      {/*          onClick={(e: any) => {*/}
      {/*            defineProperty(e.target?.checked, guild.id, "secure", "userControl", "kickBadWordsNicks")*/}
      {/*          }}*/}
      {/*          defaultChecked={guild.options.secure?.userControl?.kickBadWordsNicks || false}>*/}
      {/*  Кикать пользователей с запрещёнными символами в нике (свастика и тгд)*/}
      {/*</Checkbox>*/}
      {/*<Checkbox style={{fontSize: "18px", fontWeight: 500, margin: "5px 0"}}*/}
      {/*          onClick={(e: any) => {*/}
      {/*            defineProperty(e.target?.checked, guild.id, "secure", "userControl", "kickInviteInclude")*/}
      {/*          }}*/}
      {/*          defaultChecked={guild.options.secure?.userControl?.kickInviteInclude || false}>*/}
      {/*  Кикать пользователей, содержащих инвайт дискорд (в статусе или описании)*/}
      {/*</Checkbox>*/}
    </>
  )
}