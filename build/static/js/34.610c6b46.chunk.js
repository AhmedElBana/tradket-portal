(window.webpackJsonp=window.webpackJsonp||[]).push([[34],{1047:function(e,t,a){},1048:function(e,t,a){e.exports=a.p+"static/media/loading.5afb8fe9.svg"},1049:function(e,t,a){},1269:function(e,t,a){"use strict";a.r(t);var r=a(1021),s=a(141),n=a(142),i=a(233),l=a(231),o=a(234),c=a(232),m=a(3),d=a.n(m),h=a(926),u=a(891),g=a(892),f=a(989),p=a(1022),w=a.n(p),b=a(1029),E=a.n(b),v=new(function(){function e(){Object(s.a)(this,e)}return Object(n.a)(e,[{key:"getServerUrl",value:function(){return"https://tradket.com"}}]),e}()),S=new(function(){function e(){Object(s.a)(this,e)}return Object(n.a)(e,[{key:"get",value:function(e,t,a,r){var s=v.getServerUrl()+e;t.timeout=1e5,E.a.get(s,t).then(a).catch(r)}},{key:"post",value:function(e,t,a,r,s){var n=v.getServerUrl()+e;t.timeout=1e5,E.a.post(n,a,t).then(r).catch(s)}}]),e}()),O=a(919),j=a(1050),C=a.n(j),N=(a(1047),a(1048)),y=a.n(N),k=(a(1049),function(e){return d.a.createElement("div",{className:"waitingComponent",style:{height:e.height}},d.a.createElement("div",{className:"waitingContent"},d.a.createElement("img",{className:"loading",src:y.a})))}),P=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(i.a)(this,Object(l.a)(t).call(this,e))).state={waiting:!1,error:!1,errorMessage:"",email:"",firstEmail:!0,password:"",firstPassword:!0},a.handleEmailChange=a.handleEmailChange.bind(Object(o.a)(a)),a.handlePasswordChange=a.handlePasswordChange.bind(Object(o.a)(a)),a.handleFormValidate=a.handleFormValidate.bind(Object(o.a)(a)),a.handleFormValidateChange=a.handleFormValidateChange.bind(Object(o.a)(a)),a.removeFormErr=a.removeFormErr.bind(Object(o.a)(a)),a.login=a.login.bind(Object(o.a)(a)),a}return Object(c.a)(t,e),Object(n.a)(t,[{key:"handleEmailChange",value:function(e){var t=this;this.setState({email:e.target.value},function(){t.state.firstEmail||t.handleFormValidateChange("email")})}},{key:"handlePasswordChange",value:function(e){var t=this;this.setState({password:e.target.value},function(){t.state.firstPassword||t.handleFormValidateChange("password")})}},{key:"removeFormErr",value:function(e){this.setState({email:e.target.value,error:!1,errorMessage:""})}},{key:"handleFormValidate",value:function(e){"email"==e&&this.state.firstEmail?""==this.state.email?this.setState({firstEmail:!1,error:!0,errorMessage:"Email field is required."}):C.a.isEmail(this.state.email)?this.setState({firstEmail:!1,error:!1,errorMessage:""}):this.setState({firstEmail:!1,error:!0,errorMessage:"Please enter valid email."}):"password"==e&&this.state.firstPassword&&(""==this.state.password?this.setState({firstPassword:!1,error:!0,errorMessage:"Password field is required."}):this.state.password.length<6?this.setState({firstPassword:!1,error:!0,errorMessage:"Password must be more than 6 letters."}):this.setState({firstPassword:!1,error:!1,errorMessage:""}))}},{key:"handleFormValidateChange",value:function(e){"email"!=e||this.state.firstEmail?"password"!=e||this.state.firstPassword||(""==this.state.password?this.setState({error:!0,errorMessage:"Password field is required."}):this.state.password.length<6?this.setState({error:!0,errorMessage:"Password must be more than 6 letters."}):this.setState({error:!1,errorMessage:""})):""==this.state.email?this.setState({error:!0,errorMessage:"Email field is required."}):C.a.isEmail(this.state.email)?this.setState({error:!1,errorMessage:""}):this.setState({error:!0,errorMessage:"Please enter valid email."})}},{key:"login",value:function(){var e=this;this.setState({waiting:!0},function(){var t={email:e.state.email,password:e.state.password},a=JSON.stringify(t);S.post("/api/users/login",{headers:{"Cache-Control":"no-cache","Content-Type":"application/json"}},a,function(e){localStorage.token=e.data.data.token,localStorage.userData=JSON.stringify(e.data.data.userData),window.location.reload()},function(t){t.response&&400===t.response.status?e.setState({waiting:!1,error:!0,errorMessage:"Email or password is wrong."}):e.setState({waiting:!1,error:!0,errorMessage:"Oops! Something went wrong. If this problem persists, please contact your service provider."})})})}},{key:"render",value:function(){var e=this;return d.a.createElement("div",{className:"Login"},d.a.createElement(O.a,null),d.a.createElement(h.a,null,d.a.createElement(u.a,{className:"justify-content-center"},d.a.createElement(g.a,Object(r.a)({xl:"12",md:"9",lg:"8"},"xl","7"),d.a.createElement("div",{className:"tradket_model"},d.a.createElement("div",{className:"head"},d.a.createElement("p",null,"LOG IN")),d.a.createElement("div",{className:"body"},this.state.waiting?d.a.createElement(k,{height:"190px"}):d.a.createElement("div",null,d.a.createElement(w.a,{label:"Email",type:"email",required:!0,className:"tradket_input",floatingLabel:!0,autoFocus:!0,value:this.state.email,onChange:this.handleEmailChange,onBlur:function(){return e.handleFormValidate("email")}}),d.a.createElement(w.a,{label:"Password",type:"password",required:!0,minLength:6,className:"tradket_input",floatingLabel:!0,value:this.state.password,onChange:this.handlePasswordChange,onBlur:function(){return e.handleFormValidate("password")}}),this.state.error?d.a.createElement(f.a,{color:"danger",className:"sm_alert"},this.state.errorMessage):null,d.a.createElement("br",null),""==this.state.email||""==this.state.password||this.state.error?d.a.createElement("button",{disabled:!0,className:"btn"},"Log In"):d.a.createElement("button",{className:"btn",onClick:this.login},"Log In"),d.a.createElement("div",{className:"login-signup-forget"},d.a.createElement(u.a,null,d.a.createElement(g.a,Object(r.a)({xl:"12",sm:"6",md:"6",lg:"6"},"xl","6"),d.a.createElement("a",{href:"/portal/register"},"Not a member? Sign up")),d.a.createElement(g.a,Object(r.a)({xl:"12",sm:"6",md:"6",lg:"6"},"xl","6"),d.a.createElement("a",{href:"/404"},"I can't remember my password")))))))))))}}]),t}(m.Component);t.default=P},916:function(e,t,a){e.exports=a.p+"static/media/logo.287bcb16.png"},919:function(e,t,a){"use strict";var r=a(141),s=a(142),n=a(233),i=a(231),l=a(232),o=a(3),c=a.n(o),m=a(916),d=a.n(m),h=function(e){function t(){return Object(r.a)(this,t),Object(n.a)(this,Object(i.a)(t).apply(this,arguments))}return Object(l.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return console.log(window.location),c.a.createElement("div",{className:"LogoutHeader"},c.a.createElement("a",{href:"/"},c.a.createElement("img",{className:"logo",alt:"logo",src:d.a})),c.a.createElement("div",{className:"btns_div"},"/portal/login"!=window.location.pathname?c.a.createElement("a",{href:"/portal/login",className:"btn_w"},"Log In"):null,"/portal/register"!=window.location.pathname?c.a.createElement("a",{href:"/portal/register",className:"btn_w"},"Sign Up"):null))}}]),t}(o.Component);t.a=h}}]);
//# sourceMappingURL=34.610c6b46.chunk.js.map