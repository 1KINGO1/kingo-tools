import {FC} from "react";
import styled from "styled-components";
import {MessageI} from "./Messages";

const Wrapper = styled.div`
  display: flex;
  margin: 15px 0;
`;

const Avatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 100%;
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 0 0 15px;
`;
const Nickname = styled.p`
  font-size: 16px;
  font-weight: 400;
  margin-top: 2px;
`;
const Content = styled.p`
  font-size: 16px;
  margin-top: 7px;
`;

export const Message: FC<MessageI> = ({authorImageURL, authorName, content}) => {
  return (
    <Wrapper>
      <Avatar src={authorImageURL || "https://indiaatoz.in/wp-content/uploads/2021/09/6138f89602459-384x384.png"}/>
      <ContentWrapper>
        <Nickname>
          {authorName}
        </Nickname>
        <Content>
          {content}
        </Content>
      </ContentWrapper>
    </Wrapper>
  )
}