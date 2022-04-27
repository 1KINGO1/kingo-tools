import {FC} from "react";
import styled from "styled-components";
import {LevelSystemRole} from "../../../../../../types/LevelSystemRole";
import {defineLevelsRule} from "../../../../../../utils/api";
import {addLevelsRule, removeLevelsRule} from "../../../../../../store/actions/botActions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../store/store";

const StyledRule = styled.div`
  padding: 10px;
  background-color: ${props => props.theme.colors.dark};
  margin: 0 0 6px 0;
  border-radius: 8px;
  
  p{
    font-size: 16px;
    margin: 3px 0;
  }
  p:first-child{
    margin: 0 0 3px 0;
    font-weight: bold;
  }
`;

const RemoveButton = styled.div`
  cursor: pointer;
  padding: 3px 6px;
  background-color: #4d0000;
  display: inline-block;
  border-radius: 10px;
  margin: 10px 0px 5px;
  
  transition: .1s all ease;
  
  &:hover{
    transform: scale(1.03);
  }
`;

export const Rule: FC<LevelSystemRole>  = ({comment, roleId, levelRequired}) => {

  const guildID = useSelector<RootState>(state => state.bot.guildData?.id) as string;
  const dispatch = useDispatch();
  const roles = useSelector<RootState>(state => state.bot.guildRoles) as { name: string, id: string, color: string }[];

  const onRemove = () => {
    defineLevelsRule(roleId, "remove_levels_rule", guildID).then((data) => {
      if (!data.err){
        dispatch(removeLevelsRule(roleId));
      }
    })
  }

  return(
    <StyledRule>
      <p>
        {levelRequired} уровень - {roles.find(r => r.id === roleId)?.name || roleId}
      </p>
      <p>
        {comment}
      </p>
      <RemoveButton onClick={onRemove}>
        Удалить
      </RemoveButton>
    </StyledRule>
  )
}