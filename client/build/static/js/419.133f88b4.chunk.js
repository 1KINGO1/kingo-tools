"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[419],{419:function(n,e,t){t.r(e),t.d(e,{Admin:function(){return G}});var r,i,a,u,s,o=t(168),c=t(5751),l=t(9439),d=t(2791),f=t(9286),p=t(145),x=t(3695),h=t(177),g=t(7309),Z=t(7528),m=t(5303),v=t(5861),w=t(7757),j=t.n(w),k=t(4569),C=t.n(k),P=t(6700),y=function(){var n=(0,v.Z)(j().mark((function n(){var e,t;return j().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,C().get(P.Z.API_URL+"/admin/users",{withCredentials:!0});case 2:return e=n.sent,t=e.data,n.abrupt("return",t);case 5:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}(),b=function(){var n=(0,v.Z)(j().mark((function n(e,t){var r,i;return j().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(e&&t){n.next=2;break}return n.abrupt("return",{err:!0,message:"\u0417\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u0435 \u0432\u0441\u0435 \u043f\u043e\u043b\u044f!"});case 2:return n.next=4,C().post(P.Z.API_URL+"/admin/create",{login:e,password:t},{withCredentials:!0});case 4:return r=n.sent,i=r.data,n.abrupt("return",i);case 7:case"end":return n.stop()}}),n)})));return function(e,t){return n.apply(this,arguments)}}(),S=function(){var n=(0,v.Z)(j().mark((function n(e){var t,r;return j().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,C().post(P.Z.API_URL+"/admin/delete",{login:e},{withCredentials:!0});case 2:return t=n.sent,r=t.data,n.abrupt("return",r);case 5:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}(),I=function(){var n=(0,v.Z)(j().mark((function n(e,t){var r,i;return j().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,C().post(P.Z.API_URL+"/admin/addFlag",{login:e,flagID:t},{withCredentials:!0});case 2:return r=n.sent,i=r.data,n.abrupt("return",i);case 5:case"end":return n.stop()}}),n)})));return function(e,t){return n.apply(this,arguments)}}(),A=function(){var n=(0,v.Z)(j().mark((function n(e,t){var r,i;return j().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,C().post(P.Z.API_URL+"/admin/removeFlag",{login:e,flagID:t},{withCredentials:!0});case 2:return r=n.sent,i=r.data,n.abrupt("return",i);case 5:case"end":return n.stop()}}),n)})));return function(e,t){return n.apply(this,arguments)}}(),U=function(){var n=(0,v.Z)(j().mark((function n(){var e,t;return j().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,C().get(P.Z.API_URL+"/admin/flags",{withCredentials:!0});case 2:return e=n.sent,t=e.data,n.abrupt("return",t);case 5:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}(),F=t(6030),L=t(2014),R=t(3329),_=c.ZP.div(r||(r=(0,o.Z)(["\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n  width: 200px;\n  top: ","px;\n  left: ","px;\n  display: ",";\n  background-color: ",";\n  box-shadow: 0px 0px 12px ",";\n  z-index: 99999999999;\n"])),(function(n){return n.y}),(function(n){return n.x}),(function(n){return n.isShow?"block":"none"}),(function(n){return n.theme.colors.darkPrimary}),(function(n){return n.theme.colors.dark})),z=function(n){var e=n.x,t=n.y,r=n.isShow,i=n.flags,a=n.includedFlags,u=n.updateUsers,s=n.login,o=n.onClick;return(0,R.jsx)(_,{x:e,y:t,isShow:r,onClick:o,children:i.map((function(n){return(0,R.jsx)(L.Z,{style:{margin:"4px auto"},checked:i.some((function(){return a.includes(n.id)})),onChange:function(e){return function(n,e){n.target.checked?I(s,e.id).then((function(){u()})):A(s,e.id).then((function(){u()}))}(e,n)},children:(0,R.jsx)(Z.Z,{color:n.color,children:n.title},n.id)},n.id)}))})},D=t(5413),E=c.ZP.div(i||(i=(0,o.Z)([""]))),X=c.ZP.div(a||(a=(0,o.Z)(["\n  display: flex;\n  justify-content: space-between;\n\n  > * {\n    margin: 0px 10px;\n  }\n"]))),Y=c.ZP.div(u||(u=(0,o.Z)(["\n  cursor: pointer;\n  display: inline-block;\n  align-items: center;\n"]))),q=function(){var n=(0,d.useState)(null),e=(0,l.Z)(n,2),t=e[0],r=e[1],i=(0,d.useState)(""),a=(0,l.Z)(i,2),u=a[0],s=a[1],o=(0,d.useState)(""),c=(0,l.Z)(o,2),v=c[0],w=c[1],j=(0,F.v9)((function(n){return n.auth.user.login})),k=(0,d.useState)(0),C=(0,l.Z)(k,2),P=C[0],I=C[1],A=(0,d.useState)(0),L=(0,l.Z)(A,2),_=L[0],q=L[1],B=(0,d.useState)(!1),G=(0,l.Z)(B,2),H=G[0],J=G[1],K=(0,d.useState)(null),M=(0,l.Z)(K,2),N=M[0],O=M[1],Q=(0,d.useState)(""),T=(0,l.Z)(Q,2),V=T[0],W=T[1],$=(0,d.useState)([]),nn=(0,l.Z)($,2),en=nn[0],tn=nn[1],rn=function(){y().then((function(n){n.err?r(null):r(n.users)}))};return(0,d.useEffect)(rn,[]),(0,d.useEffect)((function(){U().then((function(n){n.err?O(null):O(n)}))}),[]),(0,R.jsxs)(E,{onClick:function(){J(!1)},children:[(0,R.jsx)(z,{onClick:function(n){J(!1),n.stopPropagation()},x:P,y:_,isShow:H,flags:N||[],includedFlags:en,login:V,updateUsers:rn}),t?(0,R.jsxs)(p.Z,{dataSource:t,footer:function(){return(0,R.jsxs)(X,{children:[(0,R.jsx)(h.Z,{size:"large",placeholder:"login",value:u,onChange:function(n){return s(n.target.value)}}),(0,R.jsx)(h.Z,{size:"large",placeholder:"password",value:v,onChange:function(n){return w(n.target.value)}}),(0,R.jsx)(g.Z,{size:"large",onClick:function(){b(u,v).then((function(n){n.err?x.ZP.error(n.message):(x.ZP.success("\u0423\u0441\u043f\u0435\u0448\u043d\u043e!"),rn())}))},children:"Add user"})]})},children:[(0,R.jsx)(p.Z.Column,{title:"Login",dataIndex:"login"},"login"),(0,R.jsx)(p.Z.Column,{title:"Password",dataIndex:"password"},"password"),(0,R.jsx)(p.Z.Column,{title:"Flags",dataIndex:"flags",render:function(n,e){return(0,R.jsxs)(R.Fragment,{children:[n.map((function(n){return(0,R.jsx)(Z.Z,{color:n.color,children:n.title},n.id)})),(0,R.jsx)(Y,{onClick:function(t){t.stopPropagation(),I(t.clientX),q(t.clientY),J(!0),tn(n.map((function(n){return n.id}))),W(e.login)},children:(0,R.jsx)(Z.Z,{color:"default",children:(0,R.jsx)(f.Z,{})})})]})}},"flags"),(0,R.jsx)(p.Z.Column,{title:"Actions",dataIndex:"action",render:function(n,e){return(0,R.jsx)(R.Fragment,{children:j===e.login?"":(0,R.jsx)(m.Z,{size:"middle",children:(0,R.jsxs)("a",{onClick:function(){S(e.login).then((function(n){n.err?x.ZP.error(n.message):(x.ZP.success("\u0423\u0441\u043f\u0435\u0448\u043d\u043e!"),rn())}))},children:["Delete ",e.login]})})})}},"action")]}):(0,R.jsx)(D.g,{})]})},B=c.ZP.div(s||(s=(0,o.Z)(["\n  padding: 10px;\n"]))),G=function(){return(0,R.jsx)(B,{children:(0,R.jsx)(q,{})})}}}]);
//# sourceMappingURL=419.133f88b4.chunk.js.map