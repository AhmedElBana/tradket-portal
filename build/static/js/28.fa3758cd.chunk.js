(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{1581:function(e,t,a){},1666:function(e,t,a){"use strict";a.r(t);var n=a(144),i=a(145),r=a(239),l=a(238),c=a(240),s=a(2),o=a.n(s),u=a(1560),m=a(1654),d=(a(1399),a(907)),h=(a(1581),a(909)),f=a(115),p=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(r.a)(this,Object(l.a)(t).call(this,e))).load_info=function(){var e={headers:{"Content-Type":"application/json","x-auth":f.a.getMerchantToken()}};d.a.get("/api/store/info",e,function(e){a.setState({waiting:!1,info:e.data.data})},function(e){e.response&&401===e.response.status?a.setState({logout:!0}):a.setState({publicError:!0})})},a.state={waiting:!0,info:{},error:!1,errorMessage:""},a}return Object(c.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){this.load_info()}},{key:"render",value:function(){return o.a.createElement("div",{className:"Home"},o.a.createElement(u.a,null,o.a.createElement("div",{className:"home_headers"},this.state.publicError?o.a.createElement(m.a,{color:"danger"},"Oops! Something went wrong. If this problem persists, please contact your service provider."):this.state.waiting?o.a.createElement(h.a,{height:"100px",width:"50px"}):o.a.createElement("div",null,o.a.createElement("div",{className:"insights_head_div"},o.a.createElement("p",null,"Store Resources")),o.a.createElement("div",{className:"insights_body_div"},o.a.createElement("div",null,o.a.createElement("p",null,"Storage Limit"),o.a.createElement("span",null,this.state.info.imagesStorageLimit.toFixed(2),"MB")),o.a.createElement("div",null,o.a.createElement("p",null,"Used Storage"),o.a.createElement("span",null,this.state.info.imagesStorage.toFixed(2),"MB")),o.a.createElement("div",null,o.a.createElement("p",null,"Available SMS"),o.a.createElement("span",null,this.state.info.availableSMS)),o.a.createElement("div",null,o.a.createElement("p",null,"Used SMS"),o.a.createElement("span",null,this.state.info.usedSMS)))))))}}]),t}(s.Component);t.default=p},907:function(e,t,a){"use strict";a.d(t,"a",function(){return s});var n=a(144),i=a(145),r=a(951),l=a.n(r),c=a(911),s=new(function(){function e(){Object(n.a)(this,e)}return Object(i.a)(e,[{key:"get",value:function(e,t,a,n){var i=c.a.getServerUrl()+e;t.timeout=1e5,l.a.get(i,t).then(a).catch(n)}},{key:"post",value:function(e,t,a,n,i){var r=c.a.getServerUrl()+e;t.timeout=1e5,l.a.post(r,a,t).then(n).catch(i)}}]),e}())},909:function(e,t,a){"use strict";var n=a(2),i=a.n(n),r=a(914),l=a.n(r);a(915);t.a=function(e){return i.a.createElement("div",{className:"waitingComponent",style:{height:e.height}},i.a.createElement("div",{className:"waitingContent"},e.width?i.a.createElement("img",{className:"loading",src:l.a,alt:"waiting icone.",style:{width:e.width}}):i.a.createElement("img",{className:"loading",src:l.a,alt:"waiting icone."})))}},911:function(e,t,a){"use strict";a.d(t,"a",function(){return r});var n=a(144),i=a(145),r=new(function(){function e(){Object(n.a)(this,e)}return Object(i.a)(e,[{key:"getServerUrl",value:function(){return"https://tradket.com"}}]),e}())},914:function(e,t,a){e.exports=a.p+"static/media/loading.5afb8fe9.svg"},915:function(e,t,a){}}]);
//# sourceMappingURL=28.fa3758cd.chunk.js.map