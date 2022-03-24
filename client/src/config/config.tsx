import {BugOutlined, FireOutlined, LoadingOutlined, ThunderboltOutlined} from "@ant-design/icons";
import React from "react";

const DiscordClientBot = React.lazy(() =>
    import('../pages/profile-page/pages/discordClientBot/DiscordClientBot')
        .then(({DiscordClientBot}) => ({default: DiscordClientBot})),
);
const Admin = React.lazy(() =>
    import('../pages/profile-page/pages/admin/Admin')
        .then(({Admin}) => ({default: Admin})),
);
const Bot = React.lazy(() =>
    import('../pages/profile-page/pages/bot-page/BotPage')
        .then(({BotPage}) => ({default: BotPage})),
);

export default {
    API_URL: "/api",
    DISCORD_LOGIN_PAGE: "https://discord.com/api/oauth2/authorize?client_id=956507803395178549&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fprofile%2Fintro&response_type=code&scope=identify%20email%20guilds%20guilds.members.read",
    pages: [
        {
            name: "Discord Client Bot",
            key: "1",
            allowed: [1],
            link: "dcb",
            component: <React.Suspense
                fallback={<LoadingOutlined style={{fontSize: 24}} spin/>}><DiscordClientBot/></React.Suspense>,
            icon: <BugOutlined/>
        },
        {
            name: "KiNGO Bot",
            key: "2",
            allowed: [1],
            link: "bot",
            component: <React.Suspense
                fallback={<LoadingOutlined style={{fontSize: 24}} spin/>}><Bot/></React.Suspense>,
            icon: <ThunderboltOutlined/>
        },
        {
            name: "Admin Panel",
            key: "3",
            allowed: [2],
            link: "admin",
            component: <React.Suspense
                fallback={<LoadingOutlined style={{fontSize: 24}} spin/>}><Admin/></React.Suspense>,
            icon: <FireOutlined/>
        }
    ]
}