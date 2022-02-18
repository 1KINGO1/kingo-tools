"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[419],{419:function(n,e,t){t.r(e),t.d(e,{Admin:function(){return G}});var r,i,u,a,s,o=t(168),c=t(5751),l=t(9439),d=t(2791),f=t(7106),p=t(9286),x=t(6848),h=t(8947),g=t(177),Z=t(4964),m=t(7528),v=t(2312),w=t(5861),j=t(7757),k=t.n(j),C=t(4569),y=t.n(C),P=t(2524),b=function(){var n=(0,w.Z)(k().mark((function n(){var e,t;return k().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,y().get(P.Z.API_URL+"/admin/users",{withCredentials:!0});case 2:return e=n.sent,t=e.data,n.abrupt("return",t);case 5:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}(),S=function(){var n=(0,w.Z)(k().mark((function n(e,t){var r,i;return k().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(e&&t){n.next=2;break}return n.abrupt("return",{err:!0,message:"\u0417\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u0435 \u0432\u0441\u0435 \u043f\u043e\u043b\u044f!"});case 2:return n.next=4,y().post(P.Z.API_URL+"/admin/create",{login:e,password:t},{withCredentials:!0});case 4:return r=n.sent,i=r.data,n.abrupt("return",i);case 7:case"end":return n.stop()}}),n)})));return function(e,t){return n.apply(this,arguments)}}(),I=function(){var n=(0,w.Z)(k().mark((function n(e){var t,r;return k().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,y().post(P.Z.API_URL+"/admin/delete",{login:e},{withCredentials:!0});case 2:return t=n.sent,r=t.data,n.abrupt("return",r);case 5:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}(),A=function(){var n=(0,w.Z)(k().mark((function n(e,t){var r,i;return k().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,y().post(P.Z.API_URL+"/admin/addFlag",{login:e,flagID:t},{withCredentials:!0});case 2:return r=n.sent,i=r.data,n.abrupt("return",i);case 5:case"end":return n.stop()}}),n)})));return function(e,t){return n.apply(this,arguments)}}(),U=function(){var n=(0,w.Z)(k().mark((function n(e,t){var r,i;return k().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,y().post(P.Z.API_URL+"/admin/removeFlag",{login:e,flagID:t},{withCredentials:!0});case 2:return r=n.sent,i=r.data,n.abrupt("return",i);case 5:case"end":return n.stop()}}),n)})));return function(e,t){return n.apply(this,arguments)}}(),F=function(){var n=(0,w.Z)(k().mark((function n(){var e,t;return k().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,y().get(P.Z.API_URL+"/admin/flags",{withCredentials:!0});case 2:return e=n.sent,t=e.data,n.abrupt("return",t);case 5:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}(),L=t(6030),z=t(2014),R=t(184),_=c.ZP.div(r||(r=(0,o.Z)(["\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n  width: 200px;\n  top: ","px;\n  left: ","px;\n  display: ",";\n  background-color: ",";\n  box-shadow: 0px 0px 12px ",";\n  z-index: 99999999999;\n"])),(function(n){return n.y}),(function(n){return n.x}),(function(n){return n.isShow?"block":"none"}),(function(n){return n.theme.colors.darkPrimary}),(function(n){return n.theme.colors.dark})),D=function(n){var e=n.x,t=n.y,r=n.isShow,i=n.flags,u=n.includedFlags,a=n.updateUsers,s=n.login,o=n.onClick;return(0,R.jsx)(_,{x:e,y:t,isShow:r,onClick:o,children:i.map((function(n){return(0,R.jsx)(z.Z,{style:{margin:"4px auto"},checked:i.some((function(){return u.includes(n.id)})),onChange:function(e){e.target.checked?A(s,n.id).then((function(){a()})):U(s,n.id).then((function(){a()}))},children:(0,R.jsx)(m.Z,{color:n.color,children:n.title},n.id)},n.id)}))})},E=c.ZP.div(i||(i=(0,o.Z)(["\n\n"]))),X=c.ZP.div(u||(u=(0,o.Z)(["\n  display: flex;\n  justify-content: space-between;\n\n  > * {\n    margin: 0px 10px;\n  }\n"]))),Y=c.ZP.div(a||(a=(0,o.Z)(["\n  cursor: pointer;\n  display: inline-block;\n  align-items: center;\n\n"]))),q=function(){var n=(0,d.useState)(null),e=(0,l.Z)(n,2),t=e[0],r=e[1],i=(0,d.useState)(""),u=(0,l.Z)(i,2),a=u[0],s=u[1],o=(0,d.useState)(""),c=(0,l.Z)(o,2),w=c[0],j=c[1],k=(0,L.v9)((function(n){return n.auth.user.login})),C=(0,d.useState)(0),y=(0,l.Z)(C,2),P=y[0],A=y[1],U=(0,d.useState)(0),z=(0,l.Z)(U,2),_=z[0],q=z[1],B=(0,d.useState)(!1),G=(0,l.Z)(B,2),H=G[0],J=G[1],K=(0,d.useState)(null),M=(0,l.Z)(K,2),N=M[0],O=M[1],Q=(0,d.useState)(""),T=(0,l.Z)(Q,2),V=T[0],W=T[1],$=(0,d.useState)([]),nn=(0,l.Z)($,2),en=nn[0],tn=nn[1];return(0,d.useEffect)((function(){b().then((function(n){n.err?r(null):r(n.users)}))}),[]),(0,d.useEffect)((function(){F().then((function(n){n.err?O(null):O(n)}))}),[]),(0,R.jsxs)(E,{onClick:function(){J(!1)},children:[(0,R.jsx)(D,{onClick:function(n){J(!1),n.stopPropagation()},x:P,y:_,isShow:H,flags:N||[],includedFlags:en,login:V,updateUsers:function(){b().then((function(n){n.err?r(null):r(n.users)}))}}),t?(0,R.jsxs)(x.Z,{dataSource:t,footer:function(){return(0,R.jsxs)(X,{children:[(0,R.jsx)(g.Z,{size:"large",placeholder:"login",value:a,onChange:function(n){return s(n.target.value)}}),(0,R.jsx)(g.Z,{size:"large",placeholder:"password",value:w,onChange:function(n){return j(n.target.value)}}),(0,R.jsx)(Z.Z,{size:"large",onClick:function(){S(a,w).then((function(n){n.err?h.ZP.error(n.message):(h.ZP.success("\u0423\u0441\u043f\u0435\u0448\u043d\u043e!"),b().then((function(n){n.err?r(null):r(n.users)})))}))},children:"Add user"})]})},children:[(0,R.jsx)(x.Z.Column,{title:"Login",dataIndex:"login"},"login"),(0,R.jsx)(x.Z.Column,{title:"Password",dataIndex:"password"},"password"),(0,R.jsx)(x.Z.Column,{title:"Flags",dataIndex:"flags",render:function(n,e){return(0,R.jsxs)(R.Fragment,{children:[n.map((function(n){return(0,R.jsx)(m.Z,{color:n.color,children:n.title},n.id)})),(0,R.jsx)(Y,{onClick:function(t){t.stopPropagation(),A(t.clientX),q(t.clientY),J(!0),tn(n.map((function(n){return n.id}))),W(e.login)},children:(0,R.jsx)(m.Z,{color:"default",children:(0,R.jsx)(p.Z,{})})})]})}},"flags"),(0,R.jsx)(x.Z.Column,{title:"Actions",dataIndex:"action",render:function(n,e){return(0,R.jsx)(R.Fragment,{children:k===e.login?"":(0,R.jsx)(v.Z,{size:"middle",children:(0,R.jsxs)("a",{onClick:function(){I(e.login).then((function(n){n.err?h.ZP.error(n.message):(h.ZP.success("\u0423\u0441\u043f\u0435\u0448\u043d\u043e!"),b().then((function(n){n.err?r(null):r(n.users)})))}))},children:["Delete ",e.login]})})})}},"action")]}):(0,R.jsx)(f.Z,{style:{fontSize:24},spin:!0})]})},B=c.ZP.div(s||(s=(0,o.Z)(["\n  padding: 10px;\n"]))),G=function(){return(0,R.jsx)(B,{children:(0,R.jsx)(q,{})})}}}]);
//# sourceMappingURL=419.6f852a4b.chunk.js.map