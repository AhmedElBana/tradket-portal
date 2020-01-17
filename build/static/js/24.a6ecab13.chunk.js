(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{1051:function(e,t,a){},1234:function(e,t,a){"use strict";a.r(t);var r=a(141),s=a(142),n=a(233),i=a(231),l=a(234),o=a(232),c=a(3),m=a.n(c),d=a(939),h=a(893),u=a(894),g=a(995),f=a(1027),p=a.n(f),w=a(971),E=a(918),v=a(984),b=a.n(v),S=(a(1051),a(941)),O=function(e){function t(e){var a;return Object(r.a)(this,t),(a=Object(n.a)(this,Object(i.a)(t).call(this,e))).state={waiting:!1,error:!1,errorMessage:"",email:"",firstEmail:!0,password:"",firstPassword:!0},a.handleEmailChange=a.handleEmailChange.bind(Object(l.a)(a)),a.handlePasswordChange=a.handlePasswordChange.bind(Object(l.a)(a)),a.handleFormValidate=a.handleFormValidate.bind(Object(l.a)(a)),a.handleFormValidateChange=a.handleFormValidateChange.bind(Object(l.a)(a)),a.removeFormErr=a.removeFormErr.bind(Object(l.a)(a)),a.login=a.login.bind(Object(l.a)(a)),a}return Object(o.a)(t,e),Object(s.a)(t,[{key:"handleEmailChange",value:function(e){var t=this;this.setState({email:e.target.value},function(){t.state.firstEmail||t.handleFormValidateChange("email")})}},{key:"handlePasswordChange",value:function(e){var t=this;this.setState({password:e.target.value},function(){t.state.firstPassword||t.handleFormValidateChange("password")})}},{key:"removeFormErr",value:function(e){this.setState({email:e.target.value,error:!1,errorMessage:""})}},{key:"handleFormValidate",value:function(e){"email"===e&&this.state.firstEmail?""===this.state.email?this.setState({firstEmail:!1,error:!0,errorMessage:"Email field is required."}):b.a.isEmail(this.state.email)?this.setState({firstEmail:!1,error:!1,errorMessage:""}):this.setState({firstEmail:!1,error:!0,errorMessage:"Please enter valid email."}):"password"===e&&this.state.firstPassword&&(""===this.state.password?this.setState({firstPassword:!1,error:!0,errorMessage:"Password field is required."}):this.state.password.length<6?this.setState({firstPassword:!1,error:!0,errorMessage:"Password must be more than 6 letters."}):this.setState({firstPassword:!1,error:!1,errorMessage:""}))}},{key:"handleFormValidateChange",value:function(e){"email"!==e||this.state.firstEmail?"password"!==e||this.state.firstPassword||(""===this.state.password?this.setState({error:!0,errorMessage:"Password field is required."}):this.state.password.length<6?this.setState({error:!0,errorMessage:"Password must be more than 6 letters."}):this.setState({error:!1,errorMessage:""})):""===this.state.email?this.setState({error:!0,errorMessage:"Email field is required."}):b.a.isEmail(this.state.email)?this.setState({error:!1,errorMessage:""}):this.setState({error:!0,errorMessage:"Please enter valid email."})}},{key:"login",value:function(){var e=this;this.setState({waiting:!0},function(){var t={email:e.state.email,password:e.state.password},a=JSON.stringify(t);w.a.post("/api/users/login",{headers:{"Cache-Control":"no-cache","Content-Type":"application/json"}},a,function(e){localStorage.token=e.data.data.token,localStorage.userData=JSON.stringify(e.data.data.userData),window.location.reload()},function(t){t.response&&401===t.response.status?e.setState({waiting:!1,error:!0,errorMessage:"Email or password is wrong."}):e.setState({waiting:!1,error:!0,errorMessage:"Oops! Something went wrong. If this problem persists, please contact your service provider."})})})}},{key:"render",value:function(){var e=this;return m.a.createElement("div",{className:"Login"},m.a.createElement(E.a,null),m.a.createElement(d.a,null,m.a.createElement(h.a,{className:"justify-content-center"},m.a.createElement(u.a,{xs:"12",md:"9",lg:"8",xl:"7"},m.a.createElement("div",{className:"tradket_model"},m.a.createElement("div",{className:"head"},m.a.createElement("p",null,"LOG IN")),m.a.createElement("div",{className:"body"},this.state.waiting?m.a.createElement(S.a,{height:"190px"}):m.a.createElement("div",null,m.a.createElement(p.a,{label:"Email",type:"email",required:!0,className:"tradket_input",floatingLabel:!0,autoFocus:!0,value:this.state.email,onChange:this.handleEmailChange,onBlur:function(){return e.handleFormValidate("email")}}),m.a.createElement(p.a,{label:"Password",type:"password",required:!0,minLength:6,className:"tradket_input",floatingLabel:!0,value:this.state.password,onChange:this.handlePasswordChange,onBlur:function(){return e.handleFormValidate("password")}}),this.state.error?m.a.createElement(g.a,{color:"danger",className:"sm_alert"},this.state.errorMessage):null,m.a.createElement("br",null),""===this.state.email||""===this.state.password||this.state.error?m.a.createElement("button",{disabled:!0,className:"btn"},"Log In"):m.a.createElement("button",{className:"btn",onClick:this.login},"Log In"),m.a.createElement("div",{className:"login-signup-forget"},m.a.createElement(h.a,null,m.a.createElement(u.a,{xs:"12",sm:"6",md:"6",lg:"6",xl:"6"},m.a.createElement("a",{href:"/portal/register"},"Not a member? Sign up")),m.a.createElement(u.a,{xs:"12",sm:"6",md:"6",lg:"6",xl:"6"},m.a.createElement("a",{href:"/404"},"I can't remember my password")))))))))))}}]),t}(c.Component);t.default=O},916:function(e,t,a){e.exports=a.p+"static/media/logo.287bcb16.png"},918:function(e,t,a){"use strict";var r=a(141),s=a(142),n=a(233),i=a(231),l=a(232),o=a(3),c=a.n(o),m=a(916),d=a.n(m),h=function(e){function t(){return Object(r.a)(this,t),Object(n.a)(this,Object(i.a)(t).apply(this,arguments))}return Object(l.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return c.a.createElement("div",{className:"LogoutHeader"},c.a.createElement("a",{href:"/"},c.a.createElement("img",{className:"logo",alt:"logo",src:d.a})),c.a.createElement("div",{className:"btns_div"},"/portal/login"!==window.location.pathname?c.a.createElement("a",{href:"/portal/login",className:"btn_w"},"Log In"):null,"/portal/register"!==window.location.pathname?c.a.createElement("a",{href:"/portal/register",className:"btn_w"},"Sign Up"):null))}}]),t}(o.Component);t.a=h},941:function(e,t,a){"use strict";var r=a(3),s=a.n(r),n=a(942),i=a.n(n);a(943);t.a=function(e){return s.a.createElement("div",{className:"waitingComponent",style:{height:e.height}},s.a.createElement("div",{className:"waitingContent"},s.a.createElement("img",{className:"loading",src:i.a,alt:"waiting icone."})))}},942:function(e,t,a){e.exports=a.p+"static/media/loading.5afb8fe9.svg"},943:function(e,t,a){},971:function(e,t,a){"use strict";var r=a(141),s=a(142),n=a(975),i=a.n(n),l=new(function(){function e(){Object(r.a)(this,e)}return Object(s.a)(e,[{key:"getServerUrl",value:function(){return"https://tradket.com"}}]),e}());a.d(t,"a",function(){return o});var o=new(function(){function e(){Object(r.a)(this,e)}return Object(s.a)(e,[{key:"get",value:function(e,t,a,r){var s=l.getServerUrl()+e;t.timeout=1e5,i.a.get(s,t).then(a).catch(r)}},{key:"post",value:function(e,t,a,r,s){var n=l.getServerUrl()+e;t.timeout=1e5,i.a.post(n,a,t).then(r).catch(s)}}]),e}())}}]);
//# sourceMappingURL=24.a6ecab13.chunk.js.map