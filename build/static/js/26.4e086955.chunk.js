(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{1015:function(e,t,a){e.exports=a.p+"static/media/logo.287bcb16.png"},1481:function(e,t,a){},1656:function(e,t,a){"use strict";a.r(t);var n=a(144),r=a(145),c=a(240),l=a(239),i=a(241),u=a(2),o=a.n(u),s=a(909),m=a(905),d=(a(1481),a(911)),g=a(1015),f=a.n(g),p=a(1482),v=a.n(p),y=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(c.a)(this,Object(l.a)(t).call(this,e))).state={waiting:!0,order:{},publicError:!1,logout:!1},a}return Object(i.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){this.requestOrders()}},{key:"requestOrders",value:function(){var e=this,t={headers:{"Content-Type":"application/json"},params:{_id:this.props.match.params.id}};s.a.get("/api/order/bill",t,function(t){e.setState({waiting:!1,order:t.data.data})},function(t){e.setState({publicError:!0})})}},{key:"render",value:function(){return o.a.createElement("div",{className:"bill-page"},o.a.createElement("div",{className:"bill-head"},o.a.createElement("img",{src:f.a})),o.a.createElement("div",{class:"invoice-box"},this.state.publicError?o.a.createElement("div",{className:"alert alert-danger"},"Please check your internet connection and try again later."):o.a.createElement(o.a.Fragment,null,this.state.waiting?o.a.createElement(d.a,{height:"400px"}):o.a.createElement(o.a.Fragment,null,o.a.createElement("table",{cellpadding:"0",cellspacing:"0"},o.a.createElement("tr",{class:"information"},o.a.createElement("td",{colspan:"2"},o.a.createElement("table",null,o.a.createElement("tr",null,o.a.createElement("td",null,o.a.createElement("b",null,"Type:")," ",this.state.order.type,o.a.createElement("br",null),o.a.createElement("b",null,"Date:")," ",m.a.custom_date_format(this.state.order.createdDate),o.a.createElement("br",null),o.a.createElement("b",null,"ID:")," ",this.state.order._id,o.a.createElement("br",null)),o.a.createElement("td",null,o.a.createElement("b",null,"Customer:")," ",this.state.order.customer_name,o.a.createElement("br",null),o.a.createElement("b",null,"Phone:")," ",this.state.order.customer_phoneNumber,o.a.createElement("br",null)))))),o.a.createElement("tr",{class:"heading"},o.a.createElement("td",null,"Item"),o.a.createElement("td",null,"Price")),this.state.order.bill.map(function(e){return o.a.createElement("tr",{class:"item"},o.a.createElement("td",null,e.name),o.a.createElement("td",null,e.price," * ",e.quantity," = ",e.total))}),o.a.createElement("tr",{class:"total"},o.a.createElement("td",null),o.a.createElement("td",null,"Sub Total: ",this.state.order.subTotal,o.a.createElement("br",null))),o.a.createElement("tr",{class:"total"},o.a.createElement("td",null),o.a.createElement("td",null,"Discount: ",this.state.order.discountValue,o.a.createElement("br",null))),o.a.createElement("tr",{class:"total"},o.a.createElement("td",null),o.a.createElement("td",null,"Total: ",this.state.order.total," EGP"))),o.a.createElement("div",{className:"qrcode"},o.a.createElement(v.a,{value:this.state.order._id}))))))}}]),t}(u.Component);t.default=y},905:function(e,t,a){"use strict";a.d(t,"a",function(){return l});var n=a(144),r=a(145),c=a(920),l=new(function(){function e(){Object(n.a)(this,e),this.getCurrentLang=function(){return localStorage.lang?localStorage.lang:"en"}}return Object(r.a)(e,[{key:"branchesName",value:function(e,t){var a={};t.map(function(e){a[e._id]=e});var n=[];return e.map(function(e){n.push(a[e].name)}),n}},{key:"getUserData",value:function(){return JSON.parse(localStorage.userData)}},{key:"currencyName",value:function(e){return c[localStorage.lang].currencies[e]?c[localStorage.lang].currencies[e]:e}},{key:"integrationsName",value:function(e){return c[localStorage.lang].integrations[e]?c[localStorage.lang].integrations[e]:e}},{key:"paymentTypeName",value:function(e){return c[localStorage.lang].types[e]?c[localStorage.lang].types[e]:e}},{key:"statusName",value:function(e){return c[localStorage.lang].status[e]?c[localStorage.lang].status[e]:e}},{key:"bsMerchantStatus",value:function(e){return c[localStorage.lang].bs_status&&c[localStorage.lang].bs_status[e]?c[localStorage.lang].bs_status[e]:e}},{key:"permsName",value:function(e){return c.perms[e]?c.perms[e]:e}},{key:"parseDate",value:function(e,t){t=t||"yyyy-mm-dd";var a=e.match(/(\d+)/g),n=0,r={};return t.replace(/(yyyy|dd|mm)/g,function(e){r[e]=n++}),new Date(a[r.yyyy],a[r.mm]-1,a[r.dd])}},{key:"pad",value:function(e){return e<10?"0"+e.toString():e.toString()}},{key:"getNextDayDate",value:function(e){var t=this.parseDate(e);t.setDate(t.getDate()+1);var a=t.getMonth()+1;return t.getFullYear()+"-"+this.pad(a)+"-"+this.pad(t.getDate())}},{key:"ParseFullDate",value:function(e){var t=e.match(/(\d+)/g),a=0,n={};return"yyyy-mm-dd hh:mn:ss".replace(/(yyyy|dd|mm|hh|mn|ss)/g,function(e){n[e]=a++}),new Date(t[n.yyyy],t[n.mm]-1,t[n.dd],t[n.hh],t[n.mn],t[n.ss])}},{key:"IeDateFormate",value:function(e){return e.slice(0,19)}},{key:"custom_date_format",value:function(e){var t=this.ParseFullDate(this.IeDateFormate(e)),a=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];"ar"==localStorage.lang&&(a=["\u064a\u0646\u0627\u064a\u0631","\u0641\u0628\u0631\u0627\u064a\u0631","\u0645\u0627\u0631\u0633","\u0627\u0628\u0631\u064a\u0644","\u0645\u0627\u064a\u0648","\u064a\u0648\u0646\u064a\u0648","\u064a\u0648\u0644\u064a\u0648","\u0623\u063a\u0633\u0637\u0633","\u0633\u0628\u062a\u0645\u0628\u0631","\u0623\u0643\u062a\u0648\u0628\u0631","\u0646\u0648\u0641\u0645\u0628\u0631","\u062f\u064a\u0633\u0645\u0628\u0631"]);var n=t.toLocaleTimeString().toLowerCase().replace(/([\d]+:[\d]+):[\d]+(\s\w+)/g,"$1$2");return"ar"==localStorage.lang&&(n=(n=n.replace(/am/g,"\u0635\u0628\u0627\u062d\u0627")).replace(/pm/g,"\u0645\u0633\u0627\u0621\u064b")),t.getDate()+" - "+a[t.getMonth()]+" - "+t.getFullYear()+", "+n}},{key:"boolName",value:function(e){return"ar"===localStorage.lang?1==e||"true"==e?"\u0646\u0639\u0645":"\u0644\u0627":1==e||"true"==e?"Yes":"No"}},{key:"isLiveName",value:function(e){return"ar"===localStorage.lang?1==e||"true"==e?"\u0646\u0634\u0637":"\u0627\u062e\u062a\u0628\u0627\u0631":1==e||"true"==e?"Live":"Test"}},{key:"getLastName",value:function(e){var t=e.trim().split(" ");return t[t.length-1]}},{key:"getFirstName",value:function(e){return e.trim().split(" ")[0]}},{key:"convertAmount",value:function(e,t){return"-"===e&&(e=0),e/1+" "+this.currencyName(t)}},{key:"convertCentsAmountFull",value:function(e,t){return"-"===e&&(e=0),"JOD"===t?l.numberWithCommas(e/1e3)+" "+this.currencyName(t):l.numberWithCommas(e/100)+" "+this.currencyName(t)}},{key:"convertCentsAmountFullNoCurr",value:function(e){return l.numberWithCommas(e/100)}},{key:"convertCentsAmount",value:function(e,t){return"JOD"===t?e/1e3+" "+this.currencyName(t):e/100+" "+this.currencyName(t)}},{key:"convertCentsAmountNoCurr",value:function(e,t){return"JOD"===t?e/1e3:e/100}}]),e}())},909:function(e,t,a){"use strict";a.d(t,"a",function(){return u});var n=a(144),r=a(145),c=a(966),l=a.n(c),i=a(914),u=new(function(){function e(){Object(n.a)(this,e)}return Object(r.a)(e,[{key:"get",value:function(e,t,a,n){var r=i.a.getServerUrl()+e;t.timeout=1e5,l.a.get(r,t).then(a).catch(n)}},{key:"post",value:function(e,t,a,n,r){var c=i.a.getServerUrl()+e;t.timeout=1e5,l.a.post(c,a,t).then(n).catch(r)}}]),e}())},911:function(e,t,a){"use strict";var n=a(2),r=a.n(n),c=a(916),l=a.n(c);a(917);t.a=function(e){return r.a.createElement("div",{className:"waitingComponent",style:{height:e.height}},r.a.createElement("div",{className:"waitingContent"},e.width?r.a.createElement("img",{className:"loading",src:l.a,alt:"waiting icone.",style:{width:e.width}}):r.a.createElement("img",{className:"loading",src:l.a,alt:"waiting icone."})))}},914:function(e,t,a){"use strict";a.d(t,"a",function(){return c});var n=a(144),r=a(145),c=new(function(){function e(){Object(n.a)(this,e)}return Object(r.a)(e,[{key:"getServerUrl",value:function(){return"https://tradket.com"}}]),e}())},916:function(e,t,a){e.exports=a.p+"static/media/loading.5afb8fe9.svg"},917:function(e,t,a){},920:function(e){e.exports={perms:{100:"Can View Staff",101:"Can Create Staff",102:"Can Edit Staff",103:"Can Deactivate Staff",104:"Can View Branch",105:"Can Create Branch",106:"Can Edit Branch",107:"Can Deactivate Branch",108:"Can Create Category",109:"Can Edit Category",110:"Can Delete Category",111:"Can View Feature",112:"Can Create Feature",113:"Can Edit Feature",114:"Can Delete Feature",115:"Can View Product",116:"Can Create Product",117:"Can Edit Product",118:"Can Deactivate Product",119:"Can View Transfer",120:"Can Create Transfer",121:"Can accept Transfer",122:"Can Cancel Transfer",123:"Can View Order",124:"Can Create Order",125:"Can Cancel Order",126:"Can return Order",127:"Can View Promo",128:"Can Create Promo",129:"Can Activate Promo",130:"Can Deactivate Promo"},en:{currencies:{EGP:"EGP",USD:"USD"},types:{card:"Card",aggregator:"Accept Kiosk",wallet:"Wallet",cash:"Cash",premium:"Premium",valu:"valU"},integrations:{VPC:"Credit Card",CASH:"Cash Collection",UIG:"Wallet",CAGG:"Accept Kiosk",PREMIUM:"Premium",VALU:"valU"},status:{Pending:"Pending",Approved:"Approved",Successful:"Successful"}},ar:{currencies:{EGP:"\u062c\u0646\u064a\u0629 \u0645\u0635\u0631\u0649",USD:"\u062f\u0648\u0644\u0627\u0631 \u0627\u0645\u0631\u064a\u0643\u0649"},types:{card:"\u0628\u0637\u0627\u0642\u0629",aggregator:"\u0627\u0643\u0633\u0628\u062a \u0643\u064a\u0648\u0633\u0643",wallet:"\u0645\u062d\u0641\u0638\u0647",cash:"\u0643\u0627\u0634",premium:"\u0628\u0631\u064a\u0645\u064a\u0648\u0645",valu:"\u0641\u0627\u0644\u064a\u0648"},integrations:{VPC:"\u0628\u0637\u0627\u0642\u0629 \u0627\u0626\u062a\u0645\u0627\u0646",CASH:"\u0643\u0627\u0634 \u0639\u0646\u062f \u0627\u0644\u062a\u0648\u0635\u064a\u0644",UIG:"\u0645\u062d\u0641\u0638\u0629",CAGG:"\u0627\u0643\u0633\u0628\u062a \u0643\u064a\u0648\u0633\u0643",PREMIUM:"\u0628\u0631\u064a\u0645\u064a\u0648\u0645",VALU:"\u0641\u0627\u0644\u064a\u0648"},status:{Pending:"\u0642\u064a\u062f \u0627\u0644\u0625\u0646\u062a\u0638\u0627\u0631",Approved:"\u0645\u0635\u062f\u0642 \u0639\u0644\u064a\u0647",Successful:"\u0646\u0627\u062c\u062d"},bs_status:{Pending:"\u0642\u064a\u062f \u0627\u0644\u0625\u0646\u062a\u0638\u0627\u0631",Approved:"\u0645\u0635\u062f\u0642 \u0639\u0644\u064a\u0647",Rejected:"\u0645\u0631\u0641\u0648\u0636",Deactivated:"\u0645\u0639\u0637\u0644"},perms:{"can create orders":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0646\u0634\u0627\u0621 \u0637\u0644\u0628\u0627\u062a","can view orders":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0639\u0631\u0636 \u0627\u0644\u0637\u0644\u0628\u0627\u062a","can update orders":"\u064a\u0633\u062a\u0637\u064a\u0639 \u062a\u062d\u062f\u064a\u062b \u0627\u0644\u0637\u0644\u0628\u0627\u062a","can delete orders":"\u064a\u0633\u062a\u0637\u064a\u0639 \u062d\u0630\u0641 \u0627\u0644\u0637\u0644\u0628\u0627\u062a","can view products":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0639\u0631\u0636 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a","can create products":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a","can update products":"\u064a\u0633\u062a\u0637\u064a\u0639 \u062a\u062d\u062f\u064a\u062b \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a","can delete products":"\u064a\u0633\u062a\u0637\u064a\u0639 \u062d\u0630\u0641 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a","can view transactions":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0639\u0631\u0636 \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0627\u062a","can capture transactions":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0633\u062d\u0628 \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0627\u062a","can void transactions":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0628\u0637\u0627\u0644 \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0627\u062a","can refund transactions":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0627\u062a","can create transactions":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0627\u062a","can delete transactions":"\u064a\u0633\u062a\u0637\u064a\u0639 \u062d\u0630\u0641 \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0627\u062a","can view payment integration":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0639\u0631\u0636 \u062a\u0643\u0627\u0645\u0644 \u0627\u0644\u062f\u0641\u0639","can create payment integration":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0646\u0634\u0627\u0621 \u062a\u0643\u0627\u0645\u0644 \u0627\u0644\u062f\u0641\u0639","can update payment integration":"\u064a\u0633\u062a\u0637\u064a\u0639 \u062a\u062d\u062f\u064a\u062b \u062a\u0643\u0627\u0645\u0644 \u0627\u0644\u062f\u0641\u0639","can view iframe":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0639\u0631\u0636 \u0627\u064a \u0641\u0631\u064a\u0645","can create iframe":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0646\u0634\u0627\u0621 \u0627\u064a \u0641\u0631\u064a\u0645","can update iframe":"\u064a\u0633\u062a\u0637\u064a\u0639 \u062a\u062d\u062f\u064a\u062b \u0627\u064a \u0641\u0631\u064a\u0645","can delete iframe":"\u064a\u0633\u062a\u0637\u064a\u0639 \u062d\u0630\u0641 \u0627\u064a \u0641\u0631\u064a\u0645","can view staff":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0639\u0631\u0636 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646","can create staff":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646","can update staff":"\u064a\u0633\u062a\u0637\u064a\u0639 \u062a\u062d\u062f\u064a\u062b \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646","can delete staff":"\u064a\u0633\u062a\u0637\u064a\u0639 \u062d\u0630\u0641 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646","can view transfers":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0639\u0631\u0636 \u0627\u0644\u062a\u062d\u0648\u064a\u0644\u0627\u062a","can view plugins":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0639\u0631\u0636 \u0627\u0644\u0625\u0636\u0627\u0641\u0627\u062a","can view notifications":"\u064a\u0633\u062a\u0637\u064a\u0639 \u0639\u0631\u0636 \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a"}}}}}]);
//# sourceMappingURL=26.4e086955.chunk.js.map