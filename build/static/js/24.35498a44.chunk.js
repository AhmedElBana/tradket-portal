(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{1001:function(e,t,a){"use strict";var n=a(144),r=a(145),i=a(239),o=a(238),s=a(240),l=a(2),c=a.n(l),u=a(950),d=a.n(u),f=function(e){function t(){return Object(n.a)(this,t),Object(i.a)(this,Object(o.a)(t).apply(this,arguments))}return Object(s.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){return c.a.createElement("div",{className:"LogoutHeader"},c.a.createElement("a",{href:"/"},c.a.createElement("img",{className:"logo",alt:"logo",src:d.a})),c.a.createElement("div",{className:"btns_div"},"/portal/login"!==window.location.pathname?c.a.createElement("a",{href:"/portal/login",className:"btn_w"},"Log In"):null,"/portal/register"!==window.location.pathname?c.a.createElement("a",{href:"/portal/register",className:"btn_w"},"Sign Up"):null))}}]),t}(l.Component);t.a=f},1037:function(e,t,a){"use strict";var n=a(35),r=a(101),i=a(2),o=a.n(i),s=a(100),l=a.n(s),c=a(897),u=a.n(c),d=a(898),f={tag:d.p,fluid:l.a.bool,className:l.a.string,cssModule:l.a.object},m=function(e){var t=e.className,a=e.cssModule,i=e.fluid,s=e.tag,l=Object(r.a)(e,["className","cssModule","fluid","tag"]),c=Object(d.l)(u()(t,i?"container-fluid":"container"),a);return o.a.createElement(s,Object(n.a)({},l,{className:c}))};m.propTypes=f,m.defaultProps={tag:"div"},t.a=m},1363:function(e,t,a){},1665:function(e,t,a){"use strict";a.r(t);var n=a(144),r=a(145),i=a(239),o=a(238),s=a(241),l=a(240),c=a(2),u=a.n(c),d=a(1037),f=a(908),m=a(910),h=a(1264),p=a(1252),g=a.n(p),b=a(909),v=a(1001),w=a(951),y=a.n(w),E=(a(1363),a(911)),j=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(i.a)(this,Object(o.a)(t).call(this,e))).state={waiting:!1,error:!1,errorMessage:"",email:"",firstEmail:!0,password:"",firstPassword:!0},a.handleEmailChange=a.handleEmailChange.bind(Object(s.a)(a)),a.handlePasswordChange=a.handlePasswordChange.bind(Object(s.a)(a)),a.handleFormValidate=a.handleFormValidate.bind(Object(s.a)(a)),a.handleFormValidateChange=a.handleFormValidateChange.bind(Object(s.a)(a)),a.removeFormErr=a.removeFormErr.bind(Object(s.a)(a)),a.login=a.login.bind(Object(s.a)(a)),a}return Object(l.a)(t,e),Object(r.a)(t,[{key:"handleEmailChange",value:function(e){var t=this;this.setState({email:e.target.value},function(){t.state.firstEmail||t.handleFormValidateChange("email")})}},{key:"handlePasswordChange",value:function(e){var t=this;this.setState({password:e.target.value},function(){t.state.firstPassword||t.handleFormValidateChange("password")})}},{key:"removeFormErr",value:function(e){this.setState({email:e.target.value,error:!1,errorMessage:""})}},{key:"handleFormValidate",value:function(e){"email"===e&&this.state.firstEmail?""===this.state.email?this.setState({firstEmail:!1,error:!0,errorMessage:"Email field is required."}):y.a.isEmail(this.state.email)?this.setState({firstEmail:!1,error:!1,errorMessage:""}):this.setState({firstEmail:!1,error:!0,errorMessage:"Please enter valid email."}):"password"===e&&this.state.firstPassword&&(""===this.state.password?this.setState({firstPassword:!1,error:!0,errorMessage:"Password field is required."}):this.state.password.length<6?this.setState({firstPassword:!1,error:!0,errorMessage:"Password must be more than 6 letters."}):this.setState({firstPassword:!1,error:!1,errorMessage:""}))}},{key:"handleFormValidateChange",value:function(e){"email"!==e||this.state.firstEmail?"password"!==e||this.state.firstPassword||(""===this.state.password?this.setState({error:!0,errorMessage:"Password field is required."}):this.state.password.length<6?this.setState({error:!0,errorMessage:"Password must be more than 6 letters."}):this.setState({error:!1,errorMessage:""})):""===this.state.email?this.setState({error:!0,errorMessage:"Email field is required."}):y.a.isEmail(this.state.email)?this.setState({error:!1,errorMessage:""}):this.setState({error:!0,errorMessage:"Please enter valid email."})}},{key:"login",value:function(){var e=this;this.setState({waiting:!0},function(){var t={email:e.state.email,password:e.state.password},a=JSON.stringify(t);b.a.post("/api/users/login",{headers:{"Content-Type":"application/json"}},a,function(e){localStorage.token=e.data.data.token,localStorage.userData=JSON.stringify(e.data.data.userData),window.location.reload()},function(t){t.response&&401===t.response.status?e.setState({waiting:!1,error:!0,errorMessage:"Email or password is wrong."}):e.setState({waiting:!1,error:!0,errorMessage:"Oops! Something went wrong. If this problem persists, please contact your service provider."})})})}},{key:"render",value:function(){var e=this;return u.a.createElement("div",{className:"Login"},u.a.createElement(v.a,null),u.a.createElement(d.a,null,u.a.createElement(f.a,{className:"justify-content-center"},u.a.createElement(m.a,{xs:"12",md:"9",lg:"8",xl:"7"},u.a.createElement("div",{className:"tradket_model"},u.a.createElement("div",{className:"head"},u.a.createElement("p",null,"LOG IN")),u.a.createElement("div",{className:"body"},this.state.waiting?u.a.createElement(E.a,{height:"190px"}):u.a.createElement("div",null,u.a.createElement(g.a,{label:"Email",type:"email",required:!0,className:"tradket_input",floatingLabel:!0,autoFocus:!0,value:this.state.email,onChange:this.handleEmailChange,onBlur:function(){return e.handleFormValidate("email")}}),u.a.createElement(g.a,{label:"Password",type:"password",required:!0,minLength:6,className:"tradket_input",floatingLabel:!0,value:this.state.password,onChange:this.handlePasswordChange,onBlur:function(){return e.handleFormValidate("password")}}),this.state.error?u.a.createElement(h.a,{color:"danger",className:"sm_alert"},this.state.errorMessage):null,u.a.createElement("br",null),""===this.state.email||""===this.state.password||this.state.error?u.a.createElement("button",{disabled:!0,className:"btn"},"Log In"):u.a.createElement("button",{className:"btn",onClick:this.login},"Log In"),u.a.createElement("div",{className:"login-signup-forget"},u.a.createElement(f.a,null,u.a.createElement(m.a,{xs:"12",sm:"6",md:"6",lg:"6",xl:"6"},u.a.createElement("a",{href:"/portal/register"},"Not a member? Sign up")),u.a.createElement(m.a,{xs:"12",sm:"6",md:"6",lg:"6",xl:"6"},u.a.createElement("a",{href:"/portal/forget"},"I can't remember my password")))))))))))}}]),t}(c.Component);t.default=j},897:function(e,t,a){var n;!function(){"use strict";var a={}.hasOwnProperty;function r(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var i=typeof n;if("string"===i||"number"===i)e.push(n);else if(Array.isArray(n)&&n.length){var o=r.apply(null,n);o&&e.push(o)}else if("object"===i)for(var s in n)a.call(n,s)&&n[s]&&e.push(s)}}return e.join(" ")}e.exports?(r.default=r,e.exports=r):void 0===(n=function(){return r}.apply(t,[]))||(e.exports=n)}()},898:function(e,t,a){"use strict";a.d(t,"o",function(){return l}),a.d(t,"i",function(){return c}),a.d(t,"g",function(){return u}),a.d(t,"l",function(){return d}),a.d(t,"m",function(){return f}),a.d(t,"n",function(){return m}),a.d(t,"r",function(){return p}),a.d(t,"a",function(){return b}),a.d(t,"q",function(){return v}),a.d(t,"p",function(){return w}),a.d(t,"e",function(){return y}),a.d(t,"c",function(){return E}),a.d(t,"d",function(){return j}),a.d(t,"k",function(){return O}),a.d(t,"b",function(){return S}),a.d(t,"f",function(){return N}),a.d(t,"j",function(){return C}),a.d(t,"h",function(){return k});var n,r=a(940),i=a.n(r),o=a(100),s=a.n(o);function l(e){document.body.style.paddingRight=e>0?e+"px":null}function c(){var e=window.getComputedStyle(document.body,null);return parseInt(e&&e.getPropertyValue("padding-right")||0,10)}function u(){var e=function(){var e=document.createElement("div");e.style.position="absolute",e.style.top="-9999px",e.style.width="50px",e.style.height="50px",e.style.overflow="scroll",document.body.appendChild(e);var t=e.offsetWidth-e.clientWidth;return document.body.removeChild(e),t}(),t=document.querySelectorAll(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top")[0],a=t?parseInt(t.style.paddingRight||0,10):0;document.body.clientWidth<window.innerWidth&&l(a+e)}function d(e,t){return void 0===e&&(e=""),void 0===t&&(t=n),t?e.split(" ").map(function(e){return t[e]||e}).join(" "):e}function f(e,t){var a={};return Object.keys(e).forEach(function(n){-1===t.indexOf(n)&&(a[n]=e[n])}),a}function m(e,t){for(var a,n=Array.isArray(t)?t:[t],r=n.length,i={};r>0;)i[a=n[r-=1]]=e[a];return i}var h={};function p(e){h[e]||("undefined"!==typeof console&&console.error(e),h[e]=!0)}var g="object"===typeof window&&window.Element||function(){};function b(e,t,a){if(!(e[t]instanceof g))return new Error("Invalid prop `"+t+"` supplied to `"+a+"`. Expected prop to be an instance of Element. Validation failed.")}var v=s.a.oneOfType([s.a.string,s.a.func,b,s.a.shape({current:s.a.any})]),w=s.a.oneOfType([s.a.func,s.a.string,s.a.shape({$$typeof:s.a.symbol,render:s.a.func}),s.a.arrayOf(s.a.oneOfType([s.a.func,s.a.string,s.a.shape({$$typeof:s.a.symbol,render:s.a.func})]))]),y={Fade:150,Collapse:350,Modal:300,Carousel:600},E=["in","mountOnEnter","unmountOnExit","appear","enter","exit","timeout","onEnter","onEntering","onEntered","onExit","onExiting","onExited"],j={ENTERING:"entering",ENTERED:"entered",EXITING:"exiting",EXITED:"exited"},O={esc:27,space:32,enter:13,tab:9,up:38,down:40,home:36,end:35,n:78,p:80},S=["auto-start","auto","auto-end","top-start","top","top-end","right-start","right","right-end","bottom-end","bottom","bottom-start","left-end","left","left-start"],N=!("undefined"===typeof window||!window.document||!window.document.createElement);function x(e){return null!==e&&(Array.isArray(e)||N&&"number"===typeof e.length)}function C(e){var t=function(e){if(function(e){return!(!e||"object"!==typeof e)&&"current"in e}(e))return e.current;if(i()(e))return e();if("string"===typeof e&&N){var t=document.querySelectorAll(e);if(t.length||(t=document.querySelectorAll("#"+e)),!t.length)throw new Error("The target '"+e+"' could not be identified in the dom, tip: check spelling");return t}return e}(e);return x(t)?t[0]:t}var k=["a[href]","area[href]","input:not([disabled]):not([type=hidden])","select:not([disabled])","textarea:not([disabled])","button:not([disabled])","object","embed","[tabindex]:not(.modal)","audio[controls]","video[controls]",'[contenteditable]:not([contenteditable="false"])']},909:function(e,t,a){"use strict";a.d(t,"a",function(){return l});var n=a(144),r=a(145),i=a(945),o=a.n(i),s=a(912),l=new(function(){function e(){Object(n.a)(this,e)}return Object(r.a)(e,[{key:"get",value:function(e,t,a,n){var r=s.a.getServerUrl()+e;t.timeout=1e5,o.a.get(r,t).then(a).catch(n)}},{key:"post",value:function(e,t,a,n,r){var i=s.a.getServerUrl()+e;t.timeout=1e5,o.a.post(i,a,t).then(n).catch(r)}}]),e}())},911:function(e,t,a){"use strict";var n=a(2),r=a.n(n),i=a(914),o=a.n(i);a(915);t.a=function(e){return r.a.createElement("div",{className:"waitingComponent",style:{height:e.height}},r.a.createElement("div",{className:"waitingContent"},e.width?r.a.createElement("img",{className:"loading",src:o.a,alt:"waiting icone.",style:{width:e.width}}):r.a.createElement("img",{className:"loading",src:o.a,alt:"waiting icone."})))}},912:function(e,t,a){"use strict";a.d(t,"a",function(){return i});var n=a(144),r=a(145),i=new(function(){function e(){Object(n.a)(this,e)}return Object(r.a)(e,[{key:"getServerUrl",value:function(){return"https://tradket.com"}}]),e}())},914:function(e,t,a){e.exports=a.p+"static/media/loading.5afb8fe9.svg"},915:function(e,t,a){},940:function(e,t,a){(function(t){var a="[object AsyncFunction]",n="[object Function]",r="[object GeneratorFunction]",i="[object Null]",o="[object Proxy]",s="[object Undefined]",l="object"==typeof t&&t&&t.Object===Object&&t,c="object"==typeof self&&self&&self.Object===Object&&self,u=l||c||Function("return this")(),d=Object.prototype,f=d.hasOwnProperty,m=d.toString,h=u.Symbol,p=h?h.toStringTag:void 0;function g(e){return null==e?void 0===e?s:i:p&&p in Object(e)?function(e){var t=f.call(e,p),a=e[p];try{e[p]=void 0;var n=!0}catch(i){}var r=m.call(e);n&&(t?e[p]=a:delete e[p]);return r}(e):function(e){return m.call(e)}(e)}e.exports=function(e){if(!function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}(e))return!1;var t=g(e);return t==n||t==r||t==a||t==o}}).call(this,a(114))},950:function(e,t,a){e.exports=a.p+"static/media/logo.287bcb16.png"}}]);
//# sourceMappingURL=24.35498a44.chunk.js.map