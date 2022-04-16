import {Button, PageHeader, Tabs} from "antd";
import {FC, useState} from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/store";
import {Command as CommandType} from "../../../../../../types/Command";
import { Command } from "./Command";
import {updateCommandsData} from "../../../../../../utils/api";

const CommandsWrapper = styled.div`

  height: 100%;
  display: flex;
  flex-direction: column;

`;

const CommandsGrid = styled.div`
  
  height: auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: 150px;
  grid-gap: 10px 10px;
  overflow-x: hidden;
  overflow-y: auto;
  margin: 10px;
  padding: 8px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 10px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #e6fffb;
  }
    
`;

export const Commands: FC = () => {

    const commands = useSelector<RootState>(state => state.bot.guildData?.options.commands) as CommandType[];
    const guildId = useSelector<RootState>(state => state.bot.guildData?.id) as string;

    const [currentPageId, setCurrentPageId] = useState("1");
    const [isLoading, setLoading] = useState(false);

    const pageChangeHandler = (key: string) => {
        setCurrentPageId(key);
    };
    const updateHandler = () => {
      setLoading(true);
      updateCommandsData(guildId).then(() => {
        window.location = window.location;
      })
    }

    return (
        <CommandsWrapper>
            <PageHeader
                onBack={() => window.history.back()}
                title={<>
                  Команды
                  <Button type="primary" size="small" loading={isLoading} onClick={updateHandler} style={{margin: "0 10px"}}>
                    Update
                  </Button>
                </>}
                subTitle="Настройка"
                footer={
                    <Tabs defaultActiveKey="1" style={{margin: "0 auto", display: "block"}} onChange={pageChangeHandler}>
                        <Tabs.TabPane tab="Moderation" key="1"/>
                        <Tabs.TabPane tab="Fan" key="2" />
                        <Tabs.TabPane tab="Config" key="3" />
                        <Tabs.TabPane tab="Games" key="4" />
                        <Tabs.TabPane tab="Levels" key="5" />
                        <Tabs.TabPane tab="Utils" key="6" />
                    </Tabs>
                }
            />

            {currentPageId === "1" ?
                <CommandsGrid>
                    {commands
                        .filter(command => command.category === "mod")
                        .map(command => <Command on={command.on}
                                                 name={command.name}
                                                 description={command.description}
                                                 example={command.example}
                                                 options={{rolesWhiteList: command.rolesWhiteList,
                                                           channelWhiteList: command.channelWhiteList}}
                                        />
                            )
                    }

                </CommandsGrid> : ""
            }
            {currentPageId === "2" ?
                <CommandsGrid>
                    {commands
                        .filter(command => command.category === "fan")
                        .map(command => <Command on={command.on}
                                                 name={command.name}
                                                 description={command.description}
                                                 example={command.example}
                                                 options={{rolesWhiteList: command.rolesWhiteList,
                                                     channelWhiteList: command.channelWhiteList}}
                            />
                        )
                    }

                </CommandsGrid> : ""
            }
            {currentPageId === "3" ?
                <CommandsGrid>
                    {commands
                        .filter(command => command.category === "config")
                        .map(command => <Command on={command.on}
                                                 name={command.name}
                                                 description={command.description}
                                                 example={command.example}
                                                 options={{rolesWhiteList: command.rolesWhiteList,
                                                     channelWhiteList: command.channelWhiteList}}
                            />
                        )
                    }

                </CommandsGrid> : ""
            }
            {currentPageId === "4" ?
                <CommandsGrid>
                    {commands
                        .filter(command => command.category === "games")
                        .map(command => <Command on={command.on}
                                                 name={command.name}
                                                 description={command.description}
                                                 example={command.example}
                                                 options={{rolesWhiteList: command.rolesWhiteList,
                                                     channelWhiteList: command.channelWhiteList}}
                            />
                        )
                    }

                </CommandsGrid> : ""
            }

          {currentPageId === "5" ?
            <CommandsGrid>
              {commands
                .filter(command => command.category === "levels")
                .map(command => <Command on={command.on}
                                         name={command.name}
                                         description={command.description}
                                         example={command.example}
                                         options={{rolesWhiteList: command.rolesWhiteList,
                                           channelWhiteList: command.channelWhiteList}}
                  />
                )
              }

            </CommandsGrid> : ""
          }

          {currentPageId === "6" ?
            <CommandsGrid>
              {commands
                .filter(command => command.category === "utils")
                .map(command => <Command on={command.on}
                                         name={command.name}
                                         description={command.description}
                                         example={command.example}
                                         options={{rolesWhiteList: command.rolesWhiteList,
                                           channelWhiteList: command.channelWhiteList}}
                  />
                )
              }

            </CommandsGrid> : ""
          }


        </CommandsWrapper>
    )
}