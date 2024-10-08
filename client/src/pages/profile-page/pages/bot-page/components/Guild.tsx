import {FC} from "react";
import styled from "styled-components";
import {Text} from "../../../../../components/Text";
import {useDispatch} from "react-redux";
import {setGuild} from "../../../../../store/actions/botActions";

const StyledGuildWrapper = styled.div`
  margin: 20px 40px;
  width: 200px;
  max-height: 250px;
`

const StyledGuildBox = styled.div<any>`
  width: 160px;
  height: 160px;
  border-radius: 100%;
  margin: 20px;
  background-color: ${props => props.theme.colors.dark};
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url(${props => props.guildIcon ? `https://cdn.discordapp.com/icons/${props.guildId}/${props.guildIcon}.png` : `https://play-lh.googleusercontent.com/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ`});

  cursor: pointer;
  transition: all 0.1s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
`;

export const Guild: FC<any> = (props) => {

    const dispatch = useDispatch();

    const clickHandler = () => {
        dispatch(setGuild(props.guildId))
    }

    return (
        <StyledGuildWrapper>
            <StyledGuildBox {...props} onClick={clickHandler}/>
            <Text style={{textAlign: "center", color: "white", fontSize: "12px", fontWeight: 500}}>
                {props.title}
            </Text>
        </StyledGuildWrapper>
    )
}