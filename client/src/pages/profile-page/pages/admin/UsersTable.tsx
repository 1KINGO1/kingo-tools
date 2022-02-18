import React, {MouseEvent, FC, useEffect, useState} from "react";
import styled from "styled-components";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {Button, Input, message, Space, Table, Tag} from "antd";
import {createUser, deleteUser, getFlags, getUsers} from "../../../../utils/adminAPI";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/store";
import {AddFlag, Flag} from "./AddFlag";

interface User {
  login: string,
  password: string,
  flags: Array<any>
}

const StyledTable = styled.div`

`;

const StyledTableFooter = styled.div`
  display: flex;
  justify-content: space-between;

  > * {
    margin: 0px 10px;
  }
`;

const AddTag = styled.div`
  cursor: pointer;
  display: inline-block;
  align-items: center;

`;

export const UsersTable: FC = () => {

  const [fetchedUsers, fetchUsers] = useState<User[] | null>(null);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const currentLogin = useSelector<RootState>(state => state.auth.user.login);

  //Add Tag Menu

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [isVisible, setVisible] = useState(false);
  const [flags, setFlags] = useState<Flag[] | null>(null);
  const [flagLogin, setFlagLogin] = useState("");
  const [includedFlags, setIncludedFlags] = useState<number[]>([]);

  useEffect(() => {
    getUsers().then((data) => {
      if (!data.err) {
        fetchUsers(data.users)
      } else {
        fetchUsers(null);
      }
    })
  }, []);

  useEffect(() => {
    getFlags().then(data => {
      if (!data.err) {
        setFlags(data)
      } else {
        setFlags(null);
      }
    })
  }, [])

  return (
    <StyledTable onClick={() => {setVisible(false)}}>

      <AddFlag onClick={(e: MouseEvent<HTMLDivElement>) => {setVisible(false);e.stopPropagation()}}
               x={x}
               y={y}
               isShow={isVisible}
               flags={flags || []}
               includedFlags={includedFlags}
               login={flagLogin}
               updateUsers={() => {
                 getUsers().then((data) => {
                   if (!data.err) {
                     fetchUsers(data.users)
                   } else {
                     fetchUsers(null);
                   }
                 })
               }}/>

      {!fetchedUsers ?
        <LoadingOutlined style={{fontSize: 24}} spin/> :

        <Table<User> dataSource={fetchedUsers} footer={() => {

          const onClick = () => {
            createUser(login, password).then((data) => {
              if (data.err) {
                message.error(data.message);
              } else {
                message.success("Успешно!");
                getUsers().then((data) => {
                  if (!data.err) {
                    fetchUsers(data.users)
                  } else {
                    fetchUsers(null);
                  }
                })
              }
              ;
            });
          }

          return (
            <StyledTableFooter>
              <Input size="large" placeholder="login" value={login} onChange={(e) => setLogin(e.target.value)}/>
              <Input size="large" placeholder="password" value={password}
                     onChange={(e) => setPassword(e.target.value)}/>
              <Button size="large" onClick={onClick}>Add user</Button>
            </StyledTableFooter>
          )
        }}>

          <Table.Column key="login" title="Login" dataIndex="login"/>

          <Table.Column key="password" title="Password" dataIndex="password"/>

          <Table.Column key="flags" title="Flags" dataIndex="flags" render={(items, record: any) => {


            const clickHandler = (e: MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              setX(e.clientX);
              setY(e.clientY);
              setVisible(true);
              setIncludedFlags(items.map((item: { color: string, id: number, title: string }) => item.id));
              setFlagLogin(record.login);
            }

            return (
              <>
                {items.map((item: { color: string, id: number, title: string }) => (
                  <Tag color={item.color} key={item.id}>{item.title}</Tag>))}
                <AddTag onClick={clickHandler}>
                  <Tag color="default"><PlusOutlined/></Tag>
                </AddTag>
              </>
            )

          }}/>

          <Table.Column key="action" title="Actions" dataIndex="action" render={(text, record: User) => {

            const onClick = () => {
              deleteUser(record.login).then((data) => {
                if (data.err) {
                  message.error(data.message);
                } else {
                  message.success("Успешно!");
                  getUsers().then((data) => {
                    if (!data.err) {
                      fetchUsers(data.users)
                    } else {
                      fetchUsers(null);
                    }
                  })
                }
                ;
              })
            }

            return (
              <>
                {currentLogin === record.login ? "" :
                  <Space size="middle">
                    <a onClick={onClick}>Delete {record.login}</a>
                  </Space>}
              </>
            )
          }

          }/>

        </Table>
      }
    </StyledTable>
  )
}