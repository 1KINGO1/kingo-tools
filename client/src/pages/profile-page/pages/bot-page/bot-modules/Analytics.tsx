import {FC} from "react";
import styled from "styled-components";
import {PageHeader} from "antd";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/store";
import {Guild} from "../../../../../types/Guild";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts';

const AnalyticsWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  display: flex;
  font-size: 25px;
  align-items: center;
  margin: 0 0 10px;
  text-align: center;
`;
export const Analytics: FC = () => {

  const guild = useSelector<RootState>(state => state.bot.guildData) as Guild;

  return (
    <AnalyticsWrapper>
      <PageHeader
        onBack={() => window.history.back()}
        title={<>
          Аналитика
        </>}
        subTitle="Просмотр"
      />

      <Header>
        Количество пользователей
      </Header>
      <LineChart width={1000}
                 height={600}
                 data={guild.options.stats.members.map(stat => {
                   let date = new Date(stat.date)
                   return {name: date.getDate() + "." + date.getMonth() + "." + date.getFullYear(), count: stat.value}
                 })} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
        <Line type="monotone" dataKey="count" stroke="#8884d8"/>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Tooltip/>
      </LineChart>

    </AnalyticsWrapper>
  )
}