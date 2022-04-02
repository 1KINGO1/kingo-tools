import styled from "styled-components";
import {FC} from "react";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const Head = styled.div`
  width: 100%;
  border-bottom: 3px solid ${props => props.theme.colors.grayBlack};
  padding: 0 0 10px;
  margin: 0 0 10px 0;
`;

const PageTitle = styled.h2`
  color: ${props => props.theme.colors.white};
  font-size: 22px;
  font-weight: 500;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PageDescription = styled.p`
  color: ${props => props.theme.colors.white};
  font-size: 16px;
  font-weight: 400;
  padding: 0 10px;
`;

interface HeaderProps{
    title: string,
    description: string
}

export const ModuleHeader: FC<HeaderProps> = ({title, description}) => {

    const navigate = useNavigate();

    const clickHandler = () => {
        navigate("/profile/bot");
    }

    return(
        <Head>
            <PageTitle>
                Anti Scam Links
                <ArrowLeftOutlined onClick={clickHandler}/>
            </PageTitle>
            <PageDescription>
                Данная функция поможет обезопасить ваш сервер от вредоносных ссылок.
                В основном функция ориентирована на защиту от фишинг сайтов с бесплатным Discord Nitro.
            </PageDescription>
        </Head>
    )
}