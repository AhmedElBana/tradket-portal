(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{1087:function(e,t,a){e.exports=a.p+"static/media/logo.287bcb16.png"},1301:function(e,t,a){(function(t){var a="[object AsyncFunction]",n="[object Function]",r="[object GeneratorFunction]",i="[object Null]",o="[object Proxy]",s="[object Undefined]",l="object"==typeof t&&t&&t.Object===Object&&t,c="object"==typeof self&&self&&self.Object===Object&&self,d=l||c||Function("return this")(),u=Object.prototype,m=u.hasOwnProperty,f=u.toString,h=d.Symbol,p=h?h.toStringTag:void 0;function g(e){return null==e?void 0===e?s:i:p&&p in Object(e)?function(e){var t=m.call(e,p),a=e[p];try{e[p]=void 0;var n=!0}catch(i){}var r=f.call(e);n&&(t?e[p]=a:delete e[p]);return r}(e):function(e){return f.call(e)}(e)}e.exports=function(e){if(!function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}(e))return!1;var t=g(e);return t==n||t==r||t==a||t==o}}).call(this,a(116))},1332:function(e,t,a){"use strict";var n=a(144),r=a(145),i=a(240),o=a(239),s=a(241),l=a(2),c=a.n(l),d=a(1087),u=a.n(d),m=function(e){function t(){return Object(n.a)(this,t),Object(i.a)(this,Object(o.a)(t).apply(this,arguments))}return Object(s.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){return c.a.createElement("div",{className:"LogoutHeader"},c.a.createElement("a",{href:"/"},c.a.createElement("img",{className:"logo",alt:"logo",src:u.a})),c.a.createElement("div",{className:"btns_div"},"/portal/login"!==window.location.pathname?c.a.createElement("a",{href:"/portal/login",className:"btn_w"},"Log In"):null,"/portal/register"!==window.location.pathname?c.a.createElement("a",{href:"/portal/register",className:"btn_w"},"Sign Up"):null))}}]),t}(l.Component);t.a=m},1399:function(e,t,a){"use strict";var n=a(35),r=a(101),i=a(2),o=a.n(i),s=a(100),l=a.n(s),c=a(897),d=a.n(c),u=a(898),m={tag:u.m,fluid:l.a.bool,className:l.a.string,cssModule:l.a.object},f=function(e){var t=e.className,a=e.cssModule,i=e.fluid,s=e.tag,l=Object(r.a)(e,["className","cssModule","fluid","tag"]),c=Object(u.i)(d()(t,i?"container-fluid":"container"),a);return o.a.createElement(s,Object(n.a)({},l,{className:c}))};f.propTypes=m,f.defaultProps={tag:"div"},t.a=f},1495:function(e,t,a){},1666:function(e,t,a){"use strict";a.r(t);var n=a(144),r=a(145),i=a(240),o=a(239),s=a(243),l=a(241),c=a(2),d=a.n(c),u=a(1399),m=a(1560),f=a(1561),h=a(1667),p=a(1409),g=a.n(p),b=a(911),v=a(1332),w=a(1e3),E=a.n(w),y=(a(1495),a(913)),j=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(i.a)(this,Object(o.a)(t).call(this,e))).state={waiting:!1,error:!1,errorMessage:"",email:"",firstEmail:!0,password:"",firstPassword:!0},a.handleEmailChange=a.handleEmailChange.bind(Object(s.a)(a)),a.handlePasswordChange=a.handlePasswordChange.bind(Object(s.a)(a)),a.handleFormValidate=a.handleFormValidate.bind(Object(s.a)(a)),a.handleFormValidateChange=a.handleFormValidateChange.bind(Object(s.a)(a)),a.removeFormErr=a.removeFormErr.bind(Object(s.a)(a)),a.login=a.login.bind(Object(s.a)(a)),a}return Object(l.a)(t,e),Object(r.a)(t,[{key:"handleEmailChange",value:function(e){var t=this;this.setState({email:e.target.value},function(){t.state.firstEmail||t.handleFormValidateChange("email")})}},{key:"handlePasswordChange",value:function(e){var t=this;this.setState({password:e.target.value},function(){t.state.firstPassword||t.handleFormValidateChange("password")})}},{key:"removeFormErr",value:function(e){this.setState({email:e.target.value,error:!1,errorMessage:""})}},{key:"handleFormValidate",value:function(e){"email"===e&&this.state.firstEmail?""===this.state.email?this.setState({firstEmail:!1,error:!0,errorMessage:"Email field is required."}):E.a.isEmail(this.state.email)?this.setState({firstEmail:!1,error:!1,errorMessage:""}):this.setState({firstEmail:!1,error:!0,errorMessage:"Please enter valid email."}):"password"===e&&this.state.firstPassword&&(""===this.state.password?this.setState({firstPassword:!1,error:!0,errorMessage:"Password field is required."}):this.state.password.length<6?this.setState({firstPassword:!1,error:!0,errorMessage:"Password must be more than 6 letters."}):this.setState({firstPassword:!1,error:!1,errorMessage:""}))}},{key:"handleFormValidateChange",value:function(e){"email"!==e||this.state.firstEmail?"password"!==e||this.state.firstPassword||(""===this.state.password?this.setState({error:!0,errorMessage:"Password field is required."}):this.state.password.length<6?this.setState({error:!0,errorMessage:"Password must be more than 6 letters."}):this.setState({error:!1,errorMessage:""})):""===this.state.email?this.setState({error:!0,errorMessage:"Email field is required."}):E.a.isEmail(this.state.email)?this.setState({error:!1,errorMessage:""}):this.setState({error:!0,errorMessage:"Please enter valid email."})}},{key:"login",value:function(){var e=this;this.setState({waiting:!0},function(){var t={email:e.state.email,password:e.state.password},a=JSON.stringify(t);b.a.post("/api/users/login",{headers:{"Content-Type":"application/json"}},a,function(e){localStorage.token=e.data.data.token,localStorage.userData=JSON.stringify(e.data.data.userData),window.location.reload()},function(t){t.response&&401===t.response.status?e.setState({waiting:!1,error:!0,errorMessage:"Email or password is wrong."}):e.setState({waiting:!1,error:!0,errorMessage:"Oops! Something went wrong. If this problem persists, please contact your service provider."})})})}},{key:"render",value:function(){var e=this;return d.a.createElement("div",{className:"Login"},d.a.createElement(v.a,null),d.a.createElement(u.a,null,d.a.createElement(m.a,{className:"justify-content-center"},d.a.createElement(f.a,{xs:"12",md:"9",lg:"8",xl:"7"},d.a.createElement("div",{className:"tradket_model"},d.a.createElement("div",{className:"head"},d.a.createElement("p",null,"LOG IN")),d.a.createElement("div",{className:"body"},this.state.waiting?d.a.createElement(y.a,{height:"190px"}):d.a.createElement("div",null,d.a.createElement(g.a,{label:"Email",type:"email",required:!0,className:"tradket_input",floatingLabel:!0,autoFocus:!0,value:this.state.email,onChange:this.handleEmailChange,onBlur:function(){return e.handleFormValidate("email")}}),d.a.createElement(g.a,{label:"Password",type:"password",required:!0,minLength:6,className:"tradket_input",floatingLabel:!0,value:this.state.password,onChange:this.handlePasswordChange,onBlur:function(){return e.handleFormValidate("password")}}),this.state.error?d.a.createElement(h.a,{color:"danger",className:"sm_alert"},this.state.errorMessage):null,d.a.createElement("br",null),""===this.state.email||""===this.state.password||this.state.error?d.a.createElement("button",{disabled:!0,className:"btn"},"Log In"):d.a.createElement("button",{className:"btn",onClick:this.login},"Log In"),d.a.createElement("div",{className:"login-signup-forget"},d.a.createElement(m.a,null,d.a.createElement(f.a,{xs:"12",sm:"6",md:"6",lg:"6",xl:"6"},d.a.createElement("a",{href:"/portal/register"},"Not a member? Sign up")),d.a.createElement(f.a,{xs:"12",sm:"6",md:"6",lg:"6",xl:"6"},d.a.createElement("a",{href:"/portal/forget"},"I can't remember my password")))))))))))}}]),t}(c.Component);t.default=j},897:function(e,t,a){var n;!function(){"use strict";var a={}.hasOwnProperty;function r(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var i=typeof n;if("string"===i||"number"===i)e.push(n);else if(Array.isArray(n)&&n.length){var o=r.apply(null,n);o&&e.push(o)}else if("object"===i)for(var s in n)a.call(n,s)&&n[s]&&e.push(s)}}return e.join(" ")}e.exports?(r.default=r,e.exports=r):void 0===(n=function(){return r}.apply(t,[]))||(e.exports=n)}()},898:function(e,t,a){"use strict";a.d(t,"l",function(){return o}),a.d(t,"g",function(){return s}),a.d(t,"e",function(){return l}),a.d(t,"i",function(){return c}),a.d(t,"j",function(){return d}),a.d(t,"k",function(){return u}),a.d(t,"n",function(){return f}),a.d(t,"m",function(){return p}),a.d(t,"c",function(){return g}),a.d(t,"a",function(){return b}),a.d(t,"b",function(){return v}),a.d(t,"h",function(){return w}),a.d(t,"d",function(){return E}),a.d(t,"f",function(){return y});a(1301);var n,r=a(100),i=a.n(r);function o(e){document.body.style.paddingRight=e>0?e+"px":null}function s(){var e=window.getComputedStyle(document.body,null);return parseInt(e&&e.getPropertyValue("padding-right")||0,10)}function l(){var e=function(){var e=document.createElement("div");e.style.position="absolute",e.style.top="-9999px",e.style.width="50px",e.style.height="50px",e.style.overflow="scroll",document.body.appendChild(e);var t=e.offsetWidth-e.clientWidth;return document.body.removeChild(e),t}(),t=document.querySelectorAll(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top")[0],a=t?parseInt(t.style.paddingRight||0,10):0;document.body.clientWidth<window.innerWidth&&o(a+e)}function c(e,t){return void 0===e&&(e=""),void 0===t&&(t=n),t?e.split(" ").map(function(e){return t[e]||e}).join(" "):e}function d(e,t){var a={};return Object.keys(e).forEach(function(n){-1===t.indexOf(n)&&(a[n]=e[n])}),a}function u(e,t){for(var a,n=Array.isArray(t)?t:[t],r=n.length,i={};r>0;)i[a=n[r-=1]]=e[a];return i}var m={};function f(e){m[e]||("undefined"!==typeof console&&console.error(e),m[e]=!0)}var h="object"===typeof window&&window.Element||function(){};i.a.oneOfType([i.a.string,i.a.func,function(e,t,a){if(!(e[t]instanceof h))return new Error("Invalid prop `"+t+"` supplied to `"+a+"`. Expected prop to be an instance of Element. Validation failed.")},i.a.shape({current:i.a.any})]);var p=i.a.oneOfType([i.a.func,i.a.string,i.a.shape({$$typeof:i.a.symbol,render:i.a.func}),i.a.arrayOf(i.a.oneOfType([i.a.func,i.a.string,i.a.shape({$$typeof:i.a.symbol,render:i.a.func})]))]),g={Fade:150,Collapse:350,Modal:300,Carousel:600},b=["in","mountOnEnter","unmountOnExit","appear","enter","exit","timeout","onEnter","onEntering","onEntered","onExit","onExiting","onExited"],v={ENTERING:"entering",ENTERED:"entered",EXITING:"exiting",EXITED:"exited"},w={esc:27,space:32,enter:13,tab:9,up:38,down:40,home:36,end:35,n:78,p:80},E=!("undefined"===typeof window||!window.document||!window.document.createElement);var y=["a[href]","area[href]","input:not([disabled]):not([type=hidden])","select:not([disabled])","textarea:not([disabled])","button:not([disabled])","object","embed","[tabindex]:not(.modal)","audio[controls]","video[controls]",'[contenteditable]:not([contenteditable="false"])']},911:function(e,t,a){"use strict";a.d(t,"a",function(){return l});var n=a(144),r=a(145),i=a(998),o=a.n(i),s=a(917),l=new(function(){function e(){Object(n.a)(this,e)}return Object(r.a)(e,[{key:"get",value:function(e,t,a,n){var r=s.a.getServerUrl()+e;t.timeout=1e5,o.a.get(r,t).then(a).catch(n)}},{key:"post",value:function(e,t,a,n,r){var i=s.a.getServerUrl()+e;t.timeout=1e5,o.a.post(i,a,t).then(n).catch(r)}}]),e}())},913:function(e,t,a){"use strict";var n=a(2),r=a.n(n),i=a(923),o=a.n(i);a(924);t.a=function(e){return r.a.createElement("div",{className:"waitingComponent",style:{height:e.height}},r.a.createElement("div",{className:"waitingContent"},e.width?r.a.createElement("img",{className:"loading",src:o.a,alt:"waiting icone.",style:{width:e.width}}):r.a.createElement("img",{className:"loading",src:o.a,alt:"waiting icone."})))}},917:function(e,t,a){"use strict";a.d(t,"a",function(){return i});var n=a(144),r=a(145),i=new(function(){function e(){Object(n.a)(this,e)}return Object(r.a)(e,[{key:"getServerUrl",value:function(){return"https://tradket.com"}}]),e}())},923:function(e,t,a){e.exports=a.p+"static/media/loading.5afb8fe9.svg"},924:function(e,t,a){}}]);
//# sourceMappingURL=26.e5924942.chunk.js.map