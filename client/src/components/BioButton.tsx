import {FC, useEffect, useState} from "react";
import styled, {keyframes} from "styled-components";
import {motion} from "framer-motion";
import {CloseOutlined, IdcardOutlined} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";

const StyledBioButton = styled(motion.div)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 20px;
  border-radius: 100%;
  background-color: ${props => props.theme.colors.darkPrimary};
  cursor: pointer;
  box-shadow: 0px 0px 12px ${props => props.theme.colors.dark};
`;

export const BioButton: FC = () => {

    const navigator = useNavigate();
    const location = useLocation();

    const [prevPath, setPrevPath] = useState("/login");

    useEffect(() => {
        if (location.pathname !== "/bio"){
            setPrevPath(location.pathname);
        }
    }, [location]);

    const clickOpenHandler = () => {
        navigator("/bio");
    }

    return (
        <StyledBioButton
            layout
            initial={{
                y: 9999
            }}
            animate={{
                transition: {duration: 1, type: "spring", bounce: .05},
                y: 0,
            }}
            whileHover={{
                scale: 1.1,
                transition: {duration: 0.3, type: "spring", bounce: 0.25},
                boxShadow: "none"
            }}
            whileTap={{
                scale: 1.12,
                transition: {duration: 0.1, type: "ease-in-out"},
            }}

            onClick={window.location.pathname === "/bio" ? () => navigator(prevPath) : clickOpenHandler}
        >
            {
                window.location.pathname === "/bio" ?
                    <CloseOutlined style={{fontSize: "20px"}}/> :
                    <IdcardOutlined style={{fontSize: "20px"}}/>
            }

        </StyledBioButton>
    )
}