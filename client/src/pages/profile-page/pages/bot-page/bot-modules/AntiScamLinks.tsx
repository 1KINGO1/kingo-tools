import {ChangeEvent, FocusEvent, FC, useState} from "react";
import {ModuleHeader} from "../components/ModuleHeader";
import styled from "styled-components";
import TextArea from "antd/lib/input/TextArea";
import {Checkbox, Input, InputNumber, Radio, RadioChangeEvent} from "antd";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/store";
import {Guild} from "../../../../../types/Guild";
import {defineProperty} from "../../../../../utils/api";
import {CheckboxChangeEvent} from "antd/lib/checkbox";

interface BoxProps{
    height: string,
    width: string
}

interface LabelProps{
    textAlign?: string,
    fontSize?: string
}

const Flex = styled.div` 
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
`;

const Label = styled.p<LabelProps>`
  color: ${props => props.theme.colors.cyanWhite};
  font-size: ${props => props.fontSize || "17px"};
  font-weight: 500;
  padding: 5px 0;
  text-align: ${props => props?.textAlign || "left"};
`;

const Box = styled.div<BoxProps>`
  background-color: ${props => props.theme.colors.grayBlack};
  height: ${props => props.height};
  width: ${props => props.width};
  border-radius: 15px;
  padding: 10px;
`;

const CheckBoxWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 5px 0;
`;

const MODULE_NAME = "antiScamLinks";

export const AntiScamLinks: FC = () => {

    const guild = useSelector<RootState>(state => state.bot.guildData) as Guild;

    //States
    const [blackListWords, setBlackListWords] =
        useState<string>(guild.options.antiScamLinks.blackListWords.join(", "));
    const [inSiteTitleBlackWordsList, setInSiteTitleBlackWordsList] =
        useState<string>(guild.options.antiScamLinks.inSiteTitleBlackWordsList.join(", "));
    const [inSiteBlackWordsList, setInSiteBlackWordsList] =
        useState<string>(guild.options.antiScamLinks.inSiteBlackWordsList.join(", "));

    const [cssChecker, setCssChecker] = useState(guild.options.antiScamLinks.cssChecker);
    const [websiteIconChecker, setWebsiteIconChecker] = useState(guild.options.antiScamLinks.websiteIconChecker);

    //Handles
    const blackListChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>, targetType: string) => {
        switch(targetType){
            case "blackListWords":
                setBlackListWords(e.target.value);
                break;
            case "inSiteTitleBlackWordsList":
                setInSiteTitleBlackWordsList(e.target.value);
                break;
            case "inSiteBlackWordsList":
                setInSiteBlackWordsList(e.target.value);
                break;
        }
    };
    const blackListBlurHandler = (e: FocusEvent<HTMLTextAreaElement>, targetType: string) => {
        switch(targetType){
            case "blackListWords":
                defineProperty(blackListWords.split(",").map(word => word.trim()), guild.id, MODULE_NAME, targetType);
                break;
            case "inSiteTitleBlackWordsList":
                defineProperty(inSiteTitleBlackWordsList.split(",").map(word => word.trim()), guild.id, MODULE_NAME, targetType);
                break;
            case "inSiteBlackWordsList":
                defineProperty(inSiteBlackWordsList.split(",").map(word => word.trim()), guild.id, MODULE_NAME, targetType);
                break;
        }
    };

    const checkBoxChangeHandler = (e: CheckboxChangeEvent, targetType: string) => {
        switch (targetType){
            case "cssChecker":
                setCssChecker(e.target.checked);
                break;
            case "websiteIconChecker":
                setWebsiteIconChecker(e.target.checked);
                break;
        };
        defineProperty(e.target.checked, guild.id, MODULE_NAME, targetType);
    };

    const punishmentNameChangeHandler = (e: RadioChangeEvent) => {
        defineProperty({name: e.target.value}, guild.id, MODULE_NAME, "punishment");
    };
    const punishmentDurationBlurHandler = (e: FocusEvent<HTMLInputElement>) => {
        defineProperty({duration: e.target.value + ""}, guild.id, MODULE_NAME, "punishment");
    };
    const punishmentReasonBlurHandler = (e: FocusEvent<HTMLInputElement>) => {
        defineProperty({reason: e.target.value}, guild.id, MODULE_NAME, "punishment");
    }

    return (
        <div style={{height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
            <ModuleHeader title="Anti Scam Links"
                          description="Данная функция поможет обезопасить ваш сервер от вредоносных ссылок.
                    В основном функция ориентирована на защиту от фишинг сайтов с бесплатным Discord Nitro."/>

            <Flex>
                <Box height="100%"  width="49.3%">

                    <Label>
                        Запрещённые слова в сообщении пользователя
                    </Label>
                    <TextArea style={{margin: "0 0 10px 0",  padding: "4px 0"}}
                              placeholder="Напишите запрещённые слова через запетую"
                              autoSize={{ minRows: 3, maxRows: 3 }}
                              bordered={false}
                              value={blackListWords}
                              onChange={(e) => blackListChangeHandler(e, "blackListWords")}
                              onBlur={(e) => blackListBlurHandler(e, "blackListWords")}
                    />

                    <Label>
                        Запрещённые слова в заголовке сайта
                    </Label>
                    <TextArea style={{margin: "0 0 10px 0",  padding: "4px 0"}}
                              placeholder="Напишите запрещённые слова через запетую"
                              autoSize={{ minRows: 3, maxRows: 3 }}
                              bordered={false}
                              value={inSiteTitleBlackWordsList}
                              onChange={(e) => blackListChangeHandler(e, "inSiteTitleBlackWordsList")}
                              onBlur={(e) => blackListBlurHandler(e, "inSiteTitleBlackWordsList")}
                    />

                    <Label>
                        Запрещённые слова в контенте сайта
                    </Label>
                    <TextArea style={{margin: "0 0 10px 0", padding: "4px 0"}}
                              placeholder="Напишите запрещённые слова через запетую"
                              autoSize={{ minRows: 3, maxRows: 3}}
                              bordered={false}
                              value={inSiteBlackWordsList}
                              onChange={(e) => blackListChangeHandler(e, "inSiteBlackWordsList")}
                              onBlur={(e) => blackListBlurHandler(e, "inSiteBlackWordsList")}
                    />

                </Box>
                <div style={{height: "100%", width: "49%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                    <Box height="49%" width="100%">
                        <CheckBoxWrapper>
                            <Checkbox style={{margin: "-6px 7px 0px 0px"}}
                                      checked={cssChecker}
                                      onChange={(e) => checkBoxChangeHandler(e, "cssChecker")}/>
                            CSS Checker
                        </CheckBoxWrapper>
                        <CheckBoxWrapper>
                            <Checkbox style={{margin: "-6px 7px 0px 0px"}}
                                      checked={websiteIconChecker}
                                      onChange={(e) => checkBoxChangeHandler(e, "websiteIconChecker")}/>
                            Website Icon Checker
                        </CheckBoxWrapper>
                    </Box>
                    <Box height="49%" width="100%">

                        <Label textAlign="center">
                            Наказание
                        </Label>

                        <Radio.Group defaultValue={guild.options.antiScamLinks.punishment.name}
                                     buttonStyle="solid"
                                     style={{display: "block", textAlign: "center", margin: "0 0 5px 0"}}
                                     onChange={punishmentNameChangeHandler}
                        >

                            <Radio.Button value="none">Ничего</Radio.Button>
                            <Radio.Button value="ban">Ban</Radio.Button>
                            <Radio.Button value="timeout">Timeout</Radio.Button>

                        </Radio.Group>

                        <Label textAlign="center">
                            Длительность
                        </Label>
                        <InputNumber style={{width: "100%", margin: "0 0 5px 0"}}
                                     min={1}
                                     max={525948}
                                     defaultValue={guild.options.antiScamLinks.punishment.duration}
                                     placeholder="Введите длительность наказания в минутах (Только для Timeout)"
                                     onBlur={punishmentDurationBlurHandler}
                        />
                        <Label textAlign="center">
                            Причина
                        </Label>
                        <Input placeholder="Введите причину"
                               style={{width: "100%", margin: "0 0 5px 0"}}
                               defaultValue={guild.options.antiScamLinks.punishment.reason}
                               onBlur={punishmentReasonBlurHandler}/>
                    </Box>
                </div>
            </Flex>

        </div>
    )
}