"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[582],{9582:function(n,e,t){t.r(e),t.d(e,{BotPage:function(){return q}});var o,i,r,c,l,s,a,u=t(168),d=t(6030),h=t(7063),x=t(7309),g=t(2616),p=t(5904),f=t(9439),m=t(2791),k=t(6478),v=t(1413),b=t(5751),j=t(2196),Z=t(371),y=t(3329),w=b.ZP.div(o||(o=(0,u.Z)(["\n  margin: 20px 40px;\n  width: 200px;\n  max-height: 250px;\n"]))),C=b.ZP.div(i||(i=(0,u.Z)(["\n  width: 160px;\n  height: 160px;\n  border-radius: 100%;\n  margin: 20px;\n  background-color: ",";\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: cover;\n  background-image: url(",");\n\n  cursor: pointer;\n  transition: all 0.1s ease-in-out;\n\n  &:hover {\n    transform: scale(1.02);\n  }\n"])),(function(n){return n.theme.colors.dark}),(function(n){return n.guildIcon?"https://cdn.discordapp.com/icons/".concat(n.guildId,"/").concat(n.guildIcon,".png"):"https://play-lh.googleusercontent.com/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ"})),S=function(n){var e=(0,d.I0)();return(0,y.jsxs)(w,{children:[(0,y.jsx)(C,(0,v.Z)((0,v.Z)({},n),{},{onClick:function(){e((0,Z.vu)(n.guildId))}})),(0,y.jsx)(j.x,{style:{textAlign:"center",color:"white",fontSize:"12px",fontWeight:500},children:n.title})]})},P=t(5413),I=b.ZP.div(r||(r=(0,u.Z)(["\n  display: flex;\n  justify-content: center;\n  flex-wrap: wrap;\n"]))),D=function(){var n=(0,m.useState)(!0),e=(0,f.Z)(n,2),t=e[0],o=e[1],i=(0,m.useState)([]),r=(0,f.Z)(i,2),c=r[0],l=r[1];return(0,m.useEffect)((function(){(0,k.M1)().then((function(n){n.err||l(n.guilds),o(!1)}))}),[]),t?(0,y.jsx)(P.g,{}):(0,y.jsx)(I,{children:c.map((function(n,e){return(0,y.jsx)(S,{guildId:n.id,guildIcon:n.icon,title:n.name},e)}))})},z=t(398),A=t(1532),E=t(3695),G=t(2649),H=t(6871),O=t(2414),_=t(5581),B=b.ZP.div(c||(c=(0,u.Z)(["\n  padding: 10px 20px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  background-color: ",";\n  border-radius: 10px;\n  margin: 10px;\n"])),(function(n){return n.theme.colors.grayBlack})),R=function(n){var e=n.title,t=n.link,o=n.checked,i=n.value,r=n.canCheck,c=(0,d.v9)((function(n){return n.bot.currentGuild})),l=(0,m.useState)(o),s=(0,f.Z)(l,2),a=s[0],u=s[1],h=(0,m.useState)(!1),x=(0,f.Z)(h,2),g=x[0],p=x[1],v=(0,H.s0)();return(0,y.jsxs)(B,{children:[(0,y.jsx)(j.x,{style:{fontSize:"16px",fontWeight:"500"},children:e}),r?(0,y.jsx)(_.Z,{checked:a,onChange:function(){p(!0),a?(0,k.A4)(i,c,"off_module").then((function(n){p(!1),n.err||u(!1)})):(0,k.A4)(i,c,"on_module").then((function(n){p(!1),n.err||u(!0)}))},loading:g,style:{margin:"0 0 0 10px"}}):"",(0,y.jsx)(O.Z,{style:{margin:"0 0 0 auto"},onClick:function(){return v("/profile/"+t)}})]})},W=b.ZP.div(l||(l=(0,u.Z)(["\n  padding: 10px;\n  display: flex;\n  align-items: center;\n  border-bottom: 3px solid ","\n"])),(function(n){return n.theme.colors.grayBlack})),L=b.ZP.div(s||(s=(0,u.Z)(["\n  width: 100%;\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-gad: 20px;\n"]))),N=function(){var n=(0,d.I0)(),e=(0,d.v9)((function(n){return n.bot.currentGuild})),t=(0,d.v9)((function(n){return n.bot.guildData})),o=(0,m.useState)(!0),i=(0,f.Z)(o,2),r=i[0],c=i[1],l=(0,m.useState)(!1),s=(0,f.Z)(l,2),a=s[0],u=s[1];return(0,m.useEffect)((function(){e&&(0,k.dS)(e).then((function(e){e.err?(E.ZP.error(e.message),c(!1)):null!==e&&void 0!==e&&e.guild?(n((0,Z.aw)({guild:e.guild,channels:e.channels,roles:e.roles})),c(!1)):(u(!0),c(!1))}))}),[e]),r?(0,y.jsx)(P.g,{}):a?(0,y.jsx)(h.ZP,{status:"warning",title:"\u0414\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u0431\u043e\u0442\u0430 \u043d\u0430 \u0432\u0430\u0448 \u0441\u0435\u0440\u0432\u0435\u0440",extra:(0,y.jsxs)(x.Z,{type:"primary",onClick:function(){return window.location.href="https://discord.com/oauth2/authorize?client_id=956507803395178549&permissions=8&scope=bot%20applications.commands"},children:["\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c ",(0,y.jsx)(g.Z,{})]},"console")}):(0,y.jsxs)(y.Fragment,{children:[(0,y.jsxs)(W,{children:[(0,y.jsx)(G.C,{size:32,src:null===t||void 0===t?void 0:t.data.avatar}),(0,y.jsx)(j.x,{style:{fontWeight:500,fontSize:"14px",margin:"0 0 0 10px"},children:null===t||void 0===t?void 0:t.data.name}),null!==t&&void 0!==t&&t.options.allowed?"":(0,y.jsx)(z.Z,{style:{margin:"0 0 0 10px",color:"yellow"}}),(0,y.jsx)(A.Z,{style:{margin:"0 0 0 auto"},onClick:function(){return n((0,Z.yp)())}})]}),(0,y.jsxs)(L,{children:[(0,y.jsx)(R,{title:"Commands",value:"commands",canCheck:!1,link:"commands"}),(0,y.jsx)(R,{title:"Level System",value:"levelSystem",checked:(null===t||void 0===t?void 0:t.options.levelSystem.on)||!1,canCheck:!0,link:"levels"}),(0,y.jsx)(R,{title:"Economy System",value:"economy",checked:(null===t||void 0===t?void 0:t.options.economy.on)||!1,canCheck:!0,link:"economy"}),(0,y.jsx)(R,{title:"Logger",value:"logger",checked:(null===t||void 0===t?void 0:t.options.logger.on)||!1,canCheck:!0,link:"logger"}),(0,y.jsx)(R,{title:"Reaction Roles",value:"reactionRole",checked:!1,canCheck:!1,link:"rr"}),(0,y.jsx)(R,{title:"Custom Commands",value:"customCommands",checked:!1,canCheck:!1,link:"cc"})]})]})},Q=b.ZP.div(a||(a=(0,u.Z)(["\n  width: 100%;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: auto;\n  &::-webkit-scrollbar {\n    width: 10px;\n  }\n \n  /* Track */\n  &::-webkit-scrollbar-track {\n    background: transparent;\n  }\n\n  /* Handle */\n  &::-webkit-scrollbar-thumb {\n    background: #121212;\n    border-radius: 15px;\n  }\n\n  /* Handle on hover */\n  &::-webkit-scrollbar-thumb:hover {\n    background: #070707;\n  }\n"]))),q=function(){var n=(0,d.v9)((function(n){return n.auth.user.discord})),e=(0,d.v9)((function(n){return n.bot.currentGuild}));return 0===Object.keys(n||{}).length?(0,y.jsx)(h.ZP,{status:"warning",title:"\u041f\u0435\u0440\u0435\u0434 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435\u043c \u0434\u0430\u043d\u043d\u043e\u0433\u043e \u0444\u0443\u043d\u043a\u0446\u0438\u043e\u043d\u0430\u043b\u0430 \u0432\u043e\u0439\u0434\u0438\u0442\u0435 \u0432 \u0441\u0432\u043e\u0439 \u0430\u043a\u043a\u0430\u0443\u043d\u0442 Discord",extra:(0,y.jsxs)(x.Z,{type:"primary",onClick:function(){window.location.href=p.Z.DISCORD_LOGIN_PAGE},children:["\u0412\u043e\u0439\u0442\u0438 ",(0,y.jsx)(g.Z,{})]},"console")}):(0,y.jsx)(Q,{children:e?(0,y.jsx)(N,{}):(0,y.jsx)(D,{})})}}}]);
//# sourceMappingURL=582.33ebaa3a.chunk.js.map