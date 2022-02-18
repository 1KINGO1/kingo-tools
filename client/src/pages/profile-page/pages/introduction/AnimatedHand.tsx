import styled, {keyframes} from "styled-components";

const keyframe = keyframes`
  0%{
    transform-origin: 50% 100%;
    transform: rotate(0deg);
  }
  50%{
    transform-origin: 50% 100%;
    transform: rotate(15deg);
  }
  100%{
    transform-origin: 50% 100%;
    transform: rotate(0deg);
  }
`

const StyledHand = styled.div`
  display: inline-block;
  position: absolute;
  animation-name: ${keyframe};
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
`

export const AnimatedHand = () => {
  return(
    <StyledHand>
      🖐
    </StyledHand>
  )
}