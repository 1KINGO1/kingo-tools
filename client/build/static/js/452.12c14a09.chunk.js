"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[452],{1452:function(n,e,t){t.r(e),t.d(e,{BotPage:function(){return U}});var i=t(168),o=t(6030),r=t(7063),c=t(7309),l=t(1413),a=t(2791),s={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M300 328a60 60 0 10120 0 60 60 0 10-120 0zM852 64H172c-17.7 0-32 14.3-32 32v660c0 17.7 14.3 32 32 32h680c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-32 660H204V128h616v596zM604 328a60 60 0 10120 0 60 60 0 10-120 0zm250.2 556H169.8c-16.5 0-29.8 14.3-29.8 32v36c0 4.4 3.3 8 7.4 8h729.1c4.1 0 7.4-3.6 7.4-8v-36c.1-17.7-13.2-32-29.7-32zM664 508H360c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"}}]},name:"robot",theme:"outlined"},u=t(4291),d=function(n,e){return a.createElement(u.Z,(0,l.Z)((0,l.Z)({},n),{},{ref:e,icon:s}))};d.displayName="RobotOutlined";var h,g,x,m=a.forwardRef(d),f=t(6273),p=t(9439),v=t(6478),k=t(5751),b=t(2196),j=t(371),Z=t(3329),y=k.ZP.div(h||(h=(0,i.Z)(["\n  margin: 20px 40px;\n  width: 200px;\n  max-height: 250px;\n"]))),w=k.ZP.div(g||(g=(0,i.Z)(["\n  width: 160px;\n  height: 160px;\n  border-radius: 100%;\n  margin: 20px;\n  background-color: ",";\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: cover;\n  background-image: url(",");\n\n  cursor: pointer;\n  transition: all 0.1s ease-in-out;\n\n  &:hover {\n    transform: scale(1.02);\n  }\n"])),(function(n){return n.theme.colors.dark}),(function(n){return n.guildIcon?"https://cdn.discordapp.com/icons/".concat(n.guildId,"/").concat(n.guildIcon,".png"):"https://play-lh.googleusercontent.com/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ"})),C=function(n){var e=(0,o.I0)();return(0,Z.jsxs)(y,{children:[(0,Z.jsx)(w,(0,l.Z)((0,l.Z)({},n),{},{onClick:function(){e((0,j.vu)(n.guildId))}})),(0,Z.jsx)(b.x,{style:{textAlign:"center",color:"white",fontSize:"12px",fontWeight:500},children:n.title})]})},S=t(5413),z=t(1110),P=(0,k.ZP)(z.E.div)(x||(x=(0,i.Z)(["\n  display: flex;\n  justify-content: center;\n  flex-wrap: wrap;\n"]))),I=function(){var n=(0,a.useState)(!0),e=(0,p.Z)(n,2),t=e[0],i=e[1],o=(0,a.useState)([]),r=(0,p.Z)(o,2),c=r[0],l=r[1];return(0,a.useEffect)((function(){(0,v.M1)().then((function(n){n.err||l(n.guilds),i(!1)}))}),[]),t?(0,Z.jsx)(S.g,{}):(0,Z.jsx)(P,{initial:{opacity:0},animate:{opacity:1},children:c.map((function(n,e){return(0,Z.jsx)(C,{guildId:n.id,guildIcon:n.icon,title:n.name},e)}))})},H={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M464 720a48 48 0 1096 0 48 48 0 10-96 0zm16-304v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8zm475.7 440l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zm-783.5-27.9L512 239.9l339.8 588.2H172.2z"}}]},name:"warning",theme:"outlined"},E=function(n,e){return a.createElement(u.Z,(0,l.Z)((0,l.Z)({},n),{},{ref:e,icon:H}))};E.displayName="WarningOutlined";var D,O,R,A,B=a.forwardRef(E),M=t(1532),W=t(419),G=t(2649),_=t(6871),L=t(2414),N=t(5581),V=k.ZP.div(D||(D=(0,i.Z)(["\n  padding: 10px 20px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  background-color: ",";\n  border-radius: 10px;\n  margin: 10px;\n"])),(function(n){return n.theme.colors.grayBlack})),Q=function(n){var e=n.title,t=n.link,i=n.checked,r=n.value,c=n.canCheck,l=(0,o.v9)((function(n){return n.bot.currentGuild})),s=(0,a.useState)(i),u=(0,p.Z)(s,2),d=u[0],h=u[1],g=(0,a.useState)(!1),x=(0,p.Z)(g,2),m=x[0],f=x[1],k=(0,_.s0)();return(0,Z.jsxs)(V,{children:[(0,Z.jsx)(b.x,{style:{fontSize:"16px",fontWeight:"500"},children:e}),c?(0,Z.jsx)(N.Z,{checked:d,onChange:function(){f(!0),d?(0,v.A4)(r,l,"off_module").then((function(n){f(!1),n.err||h(!1)})):(0,v.A4)(r,l,"on_module").then((function(n){f(!1),n.err||h(!0)}))},loading:m,style:{margin:"0 0 0 10px"}}):"",(0,Z.jsx)(L.Z,{style:{margin:"0 0 0 auto"},onClick:function(){return k("/profile/"+t)}})]})},q=t(9372),F=k.ZP.div(O||(O=(0,i.Z)(["\n  padding: 10px;\n  display: flex;\n  align-items: center;\n  border-bottom: 3px solid ","\n"])),(function(n){return n.theme.colors.grayBlack})),J=k.ZP.div(R||(R=(0,i.Z)(["\n  width: 100%;\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-gad: 20px;\n"]))),T=function(){var n=(0,o.I0)(),e=(0,o.v9)((function(n){return n.bot.currentGuild})),t=(0,o.v9)((function(n){return n.bot.guildData})),i=(0,a.useState)(!0),l=(0,p.Z)(i,2),s=l[0],u=l[1],d=(0,a.useState)(!1),h=(0,p.Z)(d,2),g=h[0],x=h[1];return(0,a.useEffect)((function(){e&&(0,v.dS)(e).then((function(e){e.err?(W.ZP.error(e.message),u(!1)):null!==e&&void 0!==e&&e.guild?(n((0,j.aw)({guild:e.guild,channels:e.channels,roles:e.roles})),u(!1)):(x(!0),u(!1))}))}),[e]),s?(0,Z.jsx)(S.g,{}):g?(0,Z.jsx)(r.ZP,{status:"warning",title:"\u0414\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u0431\u043e\u0442\u0430 \u043d\u0430 \u0432\u0430\u0448 \u0441\u0435\u0440\u0432\u0435\u0440",extra:(0,Z.jsxs)(Z.Fragment,{children:[(0,Z.jsxs)(c.Z,{type:"primary",onClick:function(){return window.location.href="https://discord.com/oauth2/authorize?client_id=956507803395178549&permissions=8&scope=bot%20applications.commands"},children:["\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c ",(0,Z.jsx)(m,{})]},"console"),(0,Z.jsxs)(c.Z,{onClick:function(){return n((0,j.vu)(""))},children:["\u041d\u0430\u0437\u0430\u0434 ",(0,Z.jsx)(q.Z,{})]},"console")]})}):(0,Z.jsxs)(z.E.div,{initial:{opacity:0},animate:{opacity:1},children:[(0,Z.jsxs)(F,{children:[(0,Z.jsx)(G.C,{size:32,src:null===t||void 0===t?void 0:t.data.avatar}),(0,Z.jsx)(b.x,{style:{fontWeight:500,fontSize:"14px",margin:"0 0 0 10px"},children:null===t||void 0===t?void 0:t.data.name}),null!==t&&void 0!==t&&t.options.allowed?"":(0,Z.jsx)(B,{style:{margin:"0 0 0 10px",color:"yellow"}}),(0,Z.jsx)(M.Z,{style:{margin:"0 0 0 auto"},onClick:function(){return n((0,j.yp)())}})]}),(0,Z.jsxs)(J,{children:[(0,Z.jsx)(Q,{title:"Commands",value:"commands",canCheck:!1,link:"commands"}),(0,Z.jsx)(Q,{title:"Level System",value:"levelSystem",checked:(null===t||void 0===t?void 0:t.options.levelSystem.on)||!1,canCheck:!0,link:"levels"}),(0,Z.jsx)(Q,{title:"Economy System",value:"economy",checked:(null===t||void 0===t?void 0:t.options.economy.on)||!1,canCheck:!0,link:"economy"}),(0,Z.jsx)(Q,{title:"Logger",value:"logger",checked:(null===t||void 0===t?void 0:t.options.logger.on)||!1,canCheck:!0,link:"logger"}),(0,Z.jsx)(Q,{title:"Reaction Roles",value:"reactionRole",checked:!1,canCheck:!1,link:"rr"}),(0,Z.jsx)(Q,{title:"Custom Commands",value:"customCommands",checked:!1,canCheck:!1,link:"cc"}),(0,Z.jsx)(Q,{title:"Web Sender",value:"webSender",checked:!1,canCheck:!1,link:"webSender"})]})]})},K=k.ZP.div(A||(A=(0,i.Z)(["\n  width: 100%;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: auto; \n  &::-webkit-scrollbar {\n    width: 10px;\n  }\n \n  /* Track */\n  &::-webkit-scrollbar-track {\n    background: transparent;\n  }\n\n  /* Handle */\n  &::-webkit-scrollbar-thumb {\n    background: #121212;\n    border-radius: 15px;\n  }\n\n  /* Handle on hover */\n  &::-webkit-scrollbar-thumb:hover {\n    background: #070707;\n  }\n"]))),U=function(){var n=(0,o.v9)((function(n){return n.auth.user.discord})),e=(0,o.v9)((function(n){return n.bot.currentGuild}));return 0===Object.keys(n||{}).length?(0,Z.jsx)(r.ZP,{status:"warning",title:"\u041f\u0435\u0440\u0435\u0434 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435\u043c \u0434\u0430\u043d\u043d\u043e\u0433\u043e \u0444\u0443\u043d\u043a\u0446\u0438\u043e\u043d\u0430\u043b\u0430 \u0432\u043e\u0439\u0434\u0438\u0442\u0435 \u0432 \u0441\u0432\u043e\u0439 \u0430\u043a\u043a\u0430\u0443\u043d\u0442 Discord",extra:(0,Z.jsxs)(c.Z,{type:"primary",onClick:function(){window.location.href=f.Z.DISCORD_LOGIN_PAGE},children:["\u0412\u043e\u0439\u0442\u0438 ",(0,Z.jsx)(m,{})]},"console")}):(0,Z.jsx)(K,{children:e?(0,Z.jsx)(T,{}):(0,Z.jsx)(I,{})})}}}]);
//# sourceMappingURL=452.12c14a09.chunk.js.map