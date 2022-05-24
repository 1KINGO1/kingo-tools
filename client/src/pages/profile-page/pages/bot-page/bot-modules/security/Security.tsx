import {FC, useState} from "react";
import {PageHeader} from "antd";
import styled from "styled-components";
import {SelectButton} from "./components/SelectButton";
import {UserControl} from "./modules/UserControl";

const SecurityWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SettingWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.15);
  border: 3px solid rgba(0, 0, 0, 0.25);
`;

const NavBar = styled.div`
  width: 15%;
  height: 100%;
  padding: 5px 15px 5px 5px;
  border-right: 3px solid rgba(0, 0, 0, 0.25);
`;

const ContentBar = styled.div`
  width: 84%;
  padding: 5px 5px 5px 15px;
  display: flex;
  flex-direction: column;
`;

export const Security: FC = () => {

  // USER_CONTROL
  const [currentPage, setCurrentPage] = useState("USER_CONTROL");

  let pageComponent = (<></>);

  switch (currentPage){
    case "USER_CONTROL":
      pageComponent = (<UserControl />)
      break;
  }

  return (
      <SecurityWrapper>
        <PageHeader
          onBack={() => window.history.back()}
          title={<>
            Безопасность
          </>}
          subTitle="Настройка"
        />
        <SettingWrapper>
          <NavBar>
            <SelectButton value="USER_CONTROL" setCurrent={setCurrentPage}>
              User Control
            </SelectButton>
          </NavBar>
          <ContentBar>
            {pageComponent}
          </ContentBar>
        </SettingWrapper>
      </SecurityWrapper>
  )
}