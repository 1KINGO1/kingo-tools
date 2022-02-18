import {FC} from "react";
import styled from "styled-components";
import config from "./presets.config";
import {Preset} from "./Preset";
import {Text} from "../../../../../components/Text";

const StyledPresets = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

export const Presets: FC = () => {
  return (
    <>
      <Text style={{margin: "10px 0", fontSize: "25px", textAlign: "center"}}>
        Presets
      </Text>
      <StyledPresets>
        {config.map((item, index) => <Preset key={index} name={item.name} method={item.method} endpoint={item.endpoint} body={item.body}/>)}
      </StyledPresets>
    </>
  )
}