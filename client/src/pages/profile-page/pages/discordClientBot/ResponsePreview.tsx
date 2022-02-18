import {FC} from "react";
import styled from "styled-components";
import TextArea from "antd/lib/input/TextArea";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/store";

const StyledResponse = styled.div`
  margin: 10px 0;
  height: 10%;
`

export const ResponsePreview: FC = () => {

  const response = useSelector<RootState>(state => state.dcb.response) as string;

  return(
    <StyledResponse>
      <TextArea
        style={{resize: "none"}}
        placeholder="Discord API Response"
        disabled
        value={response}
      />
    </StyledResponse>
  )
}