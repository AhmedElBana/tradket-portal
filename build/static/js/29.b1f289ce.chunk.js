(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{1581:function(e,t,a){},1670:function(e,t,a){"use strict";a.r(t);var n=a(144),i=a(145),r=a(240),s=a(239),l=a(241),c=a(2),o=a.n(c),u=a(1560),m=a(1658),d=(a(1405),a(909)),p=(a(1581),a(911)),h=a(115),f=JSON.parse(localStorage.userData).permissions,g=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(r.a)(this,Object(s.a)(t).call(this,e))).load_info=function(){var e={headers:{"Content-Type":"application/json","x-auth":h.a.getMerchantToken()}};d.a.get("/api/store/info",e,function(e){a.setState({waiting:!1,info:e.data.data})},function(e){e.response&&401===e.response.status?a.setState({logout:!0}):a.setState({publicError:!0})})},a.state={waiting:!0,info:{},error:!1,errorMessage:""},a}return Object(l.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){f.includes("136")&&this.load_info()}},{key:"render",value:function(){return o.a.createElement("div",{className:"Home"},o.a.createElement(u.a,null,f.includes("136")&&o.a.createElement("div",{className:"home_headers"},this.state.publicError?o.a.createElement(m.a,{color:"danger"},"Oops! Something went wrong. If this problem persists, please contact your service provider."):this.state.waiting?o.a.createElement(p.a,{height:"100px",width:"50px"}):o.a.createElement("div",null,o.a.createElement("div",{className:"insights_head_div"},o.a.createElement("p",null,"Store Resources")),o.a.createElement("div",{className:"insights_body_div"},o.a.createElement("div",null,o.a.createElement("p",null,"Storage Limit"),o.a.createElement("span",null,this.state.info.imagesStorageLimit.toFixed(2),"MB")),o.a.createElement("div",null,o.a.createElement("p",null,"Used Storage"),o.a.createElement("span",null,this.state.info.imagesStorage.toFixed(2),"MB")),o.a.createElement("div",null,o.a.createElement("p",null,"Available SMS"),o.a.createElement("span",null,this.state.info.availableSMS)),o.a.createElement("div",null,o.a.createElement("p",null,"Used SMS"),o.a.createElement("span",null,this.state.info.usedSMS)))))))}}]),t}(c.Component);t.default=g},909:function(e,t,a){"use strict";a.d(t,"a",function(){return c});var n=a(144),i=a(145),r=a(969),s=a.n(r),l=a(914),c=new(function(){function e(){Object(n.a)(this,e)}return Object(i.a)(e,[{key:"get",value:function(e,t,a,n){var i=l.a.getServerUrl()+e;t.timeout=1e5,s.a.get(i,t).then(a).catch(n)}},{key:"post",value:function(e,t,a,n,i){var r=l.a.getServerUrl()+e;t.timeout=1e5,s.a.post(r,a,t).then(n).catch(i)}}]),e}())},911:function(e,t,a){"use strict";var n=a(2),i=a.n(n),r=a(916),s=a.n(r);a(917);t.a=function(e){return i.a.createElement("div",{className:"waitingComponent",style:{height:e.height}},i.a.createElement("div",{className:"waitingContent"},e.width?i.a.createElement("img",{className:"loading",src:s.a,alt:"waiting icone.",style:{width:e.width}}):i.a.createElement("img",{className:"loading",src:s.a,alt:"waiting icone."})))}},914:function(e,t,a){"use strict";a.d(t,"a",function(){return r});var n=a(144),i=a(145),r=new(function(){function e(){Object(n.a)(this,e)}return Object(i.a)(e,[{key:"getServerUrl",value:function(){return"https://tradket.com"}}]),e}())},916:function(e,t,a){e.exports=a.p+"static/media/loading.5afb8fe9.svg"},917:function(e,t,a){}}]);
//# sourceMappingURL=29.b1f289ce.chunk.js.map