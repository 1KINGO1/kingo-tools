import {BugOutlined, FireOutlined, LoadingOutlined} from "@ant-design/icons";
import React from "react";
const DiscordClientBot = React.lazy(() =>
  import('../pages/profile-page/pages/discordClientBot/DiscordClientBot')
    .then(({ DiscordClientBot }) => ({ default: DiscordClientBot })),
);
const Admin = React.lazy(() =>
  import('../pages/profile-page/pages/admin/Admin')
    .then(({ Admin }) => ({ default: Admin })),
);

export default {
  API_URL: "http://localhost:3001/api",
  pages: [
    {
      name: "Discord Client Bot",
      allowed: [1],
      link: "dcb",
      component: <React.Suspense fallback={<LoadingOutlined style={{ fontSize: 24 }} spin />}><DiscordClientBot /></React.Suspense>,
      icon: <BugOutlined />
    },
    {
      name: "Admin Panel",
      allowed: [2],
      link: "admin",
      component: <React.Suspense fallback={<LoadingOutlined style={{ fontSize: 24 }} spin />}><Admin/></React.Suspense>,
      icon: <FireOutlined/>
    }
  ]
}