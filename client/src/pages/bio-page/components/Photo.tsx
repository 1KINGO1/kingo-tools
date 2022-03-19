import {FC} from "react";
import styled from "styled-components";

const PhotoImage = styled.img`
  width: 100px;
  height: 100px;
  margin: 0 0 0 auto;
  object-fit: cover;
`;

export const Photo: FC<{src: string}> = ({src}) => {
    return(
        <PhotoImage src={src}/>
    )
}
