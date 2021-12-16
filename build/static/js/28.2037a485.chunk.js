(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{1087:function(e,t,a){e.exports=a.p+"static/media/logo.287bcb16.png"},1481:function(e,t,a){},1665:function(e,t,a){"use strict";a.r(t);var n=a(144),r=a(145),l=a(240),c=a(239),u=a(241),o=a(2),s=a.n(o),i=a(911),m=a(906),d=(a(1481),a(913)),g=a(1087),y=a.n(g),v=a(1482),f=a.n(v),h=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(l.a)(this,Object(c.a)(t).call(this,e))).state={waiting:!0,order:{},publicError:!1,logout:!1},a}return Object(u.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){this.requestOrders()}},{key:"requestOrders",value:function(){var e=this,t={headers:{"Content-Type":"application/json"},params:{_id:this.props.match.params.id}};i.a.get("/api/order/bill",t,function(t){e.setState({waiting:!1,order:t.data.data})},function(t){e.setState({publicError:!0})})}},{key:"render",value:function(){return s.a.createElement("div",{className:"bill-page"},s.a.createElement("div",{className:"bill-head"},s.a.createElement("img",{src:y.a})),s.a.createElement("div",{class:"invoice-box"},this.state.publicError?s.a.createElement("div",{className:"alert alert-danger"},"Please check your internet connection and try again later."):s.a.createElement(s.a.Fragment,null,this.state.waiting?s.a.createElement(d.a,{height:"400px"}):s.a.createElement(s.a.Fragment,null,s.a.createElement("table",{cellpadding:"0",cellspacing:"0"},s.a.createElement("tr",{class:"information"},s.a.createElement("td",{colspan:"2"},s.a.createElement("table",null,s.a.createElement("tr",null,s.a.createElement("td",null,s.a.createElement("b",null,"Type:")," ",this.state.order.type,s.a.createElement("br",null),s.a.createElement("b",null,"Status:")," ",this.state.order.status,s.a.createElement("br",null),s.a.createElement("b",null,"Date:")," ",m.a.custom_date_format(this.state.order.createdDate),s.a.createElement("br",null),s.a.createElement("b",null,"ID:")," ",this.state.order.id,s.a.createElement("br",null)),s.a.createElement("td",null,s.a.createElement("b",null,"Customer:")," ",this.state.order.customer.name,s.a.createElement("br",null),s.a.createElement("b",null,"Phone:")," ",this.state.order.customer.phoneNumber,s.a.createElement("br",null)))))),s.a.createElement("tr",{class:"heading"},s.a.createElement("td",null,"Item"),s.a.createElement("td",null,"Price")),this.state.order.bill.map(function(e){return s.a.createElement("tr",{class:"item"},s.a.createElement("td",null,e.name),s.a.createElement("td",null,e.price," * ",e.quantity," = ",e.total))}),s.a.createElement("tr",{class:"total"},s.a.createElement("td",null),s.a.createElement("td",null,"Payed: ",m.a.convertAmountFullNoCurr(this.state.order.payed)," EGP")),s.a.createElement("tr",{class:"total"},s.a.createElement("td",null),s.a.createElement("td",null,"Debt: ",m.a.convertAmountFullNoCurr(this.state.order.debt)," EGP")),s.a.createElement("tr",{class:"total"},s.a.createElement("td",null),s.a.createElement("td",null,"Total: ",m.a.convertAmountFullNoCurr(this.state.order.total)," EGP"))),s.a.createElement("div",{className:"qrcode"},s.a.createElement(f.a,{value:this.state.order.id}))))))}}]),t}(o.Component);t.default=h},906:function(e,t,a){"use strict";a.d(t,"a",function(){return c});var n=a(144),r=a(145),l=a(935),c=new(function(){function e(){Object(n.a)(this,e),this.getCurrentLang=function(){return localStorage.lang?localStorage.lang:"en"}}return Object(r.a)(e,[{key:"branchesName",value:function(e,t){var a={};t.map(function(e){a[e._id]=e});var n=[];return e.map(function(e){n.push(a[e].name)}),n}},{key:"getUserData",value:function(){return JSON.parse(localStorage.userData)}},{key:"currencyName",value:function(e){return l[localStorage.lang].currencies[e]?l[localStorage.lang].currencies[e]:e}},{key:"integrationsName",value:function(e){return l[localStorage.lang].integrations[e]?l[localStorage.lang].integrations[e]:e}},{key:"paymentTypeName",value:function(e){return l[localStorage.lang].types[e]?l[localStorage.lang].types[e]:e}},{key:"typeName",value:function(e){return l[localStorage.lang].types[e]?l[localStorage.lang].types[e]:e}},{key:"branchTypeName",value:function(e){return l[localStorage.lang].branch_types&&l[localStorage.lang].branch_types[e]?l[localStorage.lang].branch_types[e]:e}},{key:"statusName",value:function(e){return l[localStorage.lang].status[e]?l[localStorage.lang].status[e]:e}},{key:"order_status",value:function(e){return l[localStorage.lang].order_status[e]?l[localStorage.lang].order_status[e]:e}},{key:"custom_status",value:function(e){return l[localStorage.lang].custom_status[e]?l[localStorage.lang].custom_status[e]:e}},{key:"bsMerchantStatus",value:function(e){return l[localStorage.lang].bs_status&&l[localStorage.lang].bs_status[e]?l[localStorage.lang].bs_status[e]:e}},{key:"permsName",value:function(e){return l[localStorage.lang].perms[e]?l[localStorage.lang].perms[e]:e}},{key:"parseDate",value:function(e,t){t=t||"yyyy-mm-dd";var a=e.match(/(\d+)/g),n=0,r={};return t.replace(/(yyyy|dd|mm)/g,function(e){r[e]=n++}),new Date(a[r.yyyy],a[r.mm]-1,a[r.dd])}},{key:"pad",value:function(e){return e<10?"0"+e.toString():e.toString()}},{key:"getNextDayDate",value:function(e){var t=this.parseDate(e);t.setDate(t.getDate()+1);var a=t.getMonth()+1;return t.getFullYear()+"-"+this.pad(a)+"-"+this.pad(t.getDate())}},{key:"ParseFullDate",value:function(e){var t=e.match(/(\d+)/g),a=0,n={};return"yyyy-mm-dd hh:mn:ss".replace(/(yyyy|dd|mm|hh|mn|ss)/g,function(e){n[e]=a++}),new Date(t[n.yyyy],t[n.mm]-1,t[n.dd],t[n.hh],t[n.mn],t[n.ss])}},{key:"IeDateFormate",value:function(e){return e.slice(0,19)}},{key:"custom_date_format",value:function(e){return new Date(e).toLocaleString("en-NZ")}},{key:"boolName",value:function(e){return"ar"===localStorage.lang?1==e||"true"==e?"\u0646\u0639\u0645":"\u0644\u0627":1==e||"true"==e?"Yes":"No"}},{key:"isLiveName",value:function(e){return"ar"===localStorage.lang?1==e||"true"==e?"\u0646\u0634\u0637":"\u0627\u062e\u062a\u0628\u0627\u0631":1==e||"true"==e?"Live":"Test"}},{key:"getLastName",value:function(e){var t=e.trim().split(" ");return t[t.length-1]}},{key:"getFirstName",value:function(e){return e.trim().split(" ")[0]}},{key:"convertAmount",value:function(e,t){return"-"===e&&(e=0),e/1+" "+this.currencyName(t)}},{key:"convertCentsAmountFull",value:function(e,t){return"-"===e&&(e=0),"JOD"===t?c.numberWithCommas(e/1e3)+" "+this.currencyName(t):c.numberWithCommas(e/100)+" "+this.currencyName(t)}},{key:"convertCentsAmountFullNoCurr",value:function(e){return c.numberWithCommas(e/100)}},{key:"convertCentsAmount",value:function(e,t){return"JOD"===t?e/1e3+" "+this.currencyName(t):e/100+" "+this.currencyName(t)}},{key:"convertCentsAmountNoCurr",value:function(e,t){return"JOD"===t?e/1e3:e/100}},{key:"convertAmountFullNoCurr",value:function(e){return c.numberWithCommas(e)}},{key:"numberWithCommas",value:function(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}}]),e}())},911:function(e,t,a){"use strict";a.d(t,"a",function(){return o});var n=a(144),r=a(145),l=a(998),c=a.n(l),u=a(917),o=new(function(){function e(){Object(n.a)(this,e)}return Object(r.a)(e,[{key:"get",value:function(e,t,a,n){var r=u.a.getServerUrl()+e;t.timeout=1e5,c.a.get(r,t).then(a).catch(n)}},{key:"post",value:function(e,t,a,n,r){var l=u.a.getServerUrl()+e;t.timeout=1e5,c.a.post(l,a,t).then(n).catch(r)}}]),e}())},913:function(e,t,a){"use strict";var n=a(2),r=a.n(n),l=a(923),c=a.n(l);a(924);t.a=function(e){return r.a.createElement("div",{className:"waitingComponent",style:{height:e.height}},r.a.createElement("div",{className:"waitingContent"},e.width?r.a.createElement("img",{className:"loading",src:c.a,alt:"waiting icone.",style:{width:e.width}}):r.a.createElement("img",{className:"loading",src:c.a,alt:"waiting icone."})))}},917:function(e,t,a){"use strict";a.d(t,"a",function(){return l});var n=a(144),r=a(145),l=new(function(){function e(){Object(n.a)(this,e)}return Object(r.a)(e,[{key:"getServerUrl",value:function(){return"https://tradket.com"}}]),e}())},923:function(e,t,a){e.exports=a.p+"static/media/loading.5afb8fe9.svg"},924:function(e,t,a){},935:function(e){e.exports={en:{currencies:{EGP:"EGP",USD:"USD"},types:{card:"Card",aggregator:"Accept Kiosk",wallet:"Wallet",cash:"Cash",premium:"Premium",valu:"valU"},integrations:{VPC:"Credit Card",CASH:"Cash Collection",UIG:"Wallet",CAGG:"Accept Kiosk",PREMIUM:"Premium",VALU:"valU"},status:{Pending:"Pending",Approved:"Approved",Successful:"Successful"},perms:{100:"Can View Staff",101:"Can Create Staff",102:"Can Edit Staff",103:"Can Deactivate Staff",104:"Can View Branch",105:"Can Create Branch",106:"Can Edit Branch",107:"Can Deactivate Branch",108:"Can Create Category",109:"Can Edit Category",110:"Can Delete Category",111:"Can View Feature",112:"Can Create Feature",113:"Can Edit Feature",114:"Can Delete Feature",115:"Can View Product",116:"Can Create Product",117:"Can Edit Product",118:"Can Deactivate Product",119:"Can View Transfer",120:"Can Create Transfer",121:"Can accept Transfer",122:"Can Cancel Transfer",123:"Can View Order",124:"Can Create Order",125:"Can Cancel Order",126:"Can return Order",127:"Can View Promo",128:"Can Create Promo",129:"Can Activate Promo",130:"Can Deactivate Promo"}},ar:{currencies:{EGP:"\u062c\u0646\u064a\u0629 \u0645\u0635\u0631\u0649",USD:"\u062f\u0648\u0644\u0627\u0631 \u0627\u0645\u0631\u064a\u0643\u0649"},types:{in:"\u062f\u062e\u0644",out:"\u0645\u0635\u0631\u0648\u0641\u0627\u062a",cash:"\u0643\u0627\u0634",card:"\u0628\u0637\u0627\u0642\u0629 \u0628\u0646\u0643\u064a\u0629"},branch_types:{branch:"\u0641\u0631\u0639",warehouse:"\u0645\u062e\u0632\u0646",factory:"\u0645\u0635\u0646\u0639"},integrations:{VPC:"\u0628\u0637\u0627\u0642\u0629 \u0627\u0626\u062a\u0645\u0627\u0646",CASH:"\u0643\u0627\u0634 \u0639\u0646\u062f \u0627\u0644\u062a\u0648\u0635\u064a\u0644",UIG:"\u0645\u062d\u0641\u0638\u0629",CAGG:"\u0627\u0643\u0633\u0628\u062a \u0643\u064a\u0648\u0633\u0643",PREMIUM:"\u0628\u0631\u064a\u0645\u064a\u0648\u0645",VALU:"\u0641\u0627\u0644\u064a\u0648"},status:{inProgress:"\u0642\u064a\u062f \u0627\u0644\u0625\u0646\u062a\u0638\u0627\u0631",canceled:"\u0645\u0631\u0641\u0648\u0636",completed:"\u0645\u0642\u0628\u0648\u0644"},order_status:{success:"\u0646\u0627\u062c\u062d",canceled:"\u0645\u0644\u063a\u064a",returned:"\u0645\u0631\u062a\u062c\u0639"},custom_status:{created:"\u0644\u0645 \u064a\u0643\u062a\u0645\u0644 \u0627\u0644\u0637\u0644\u0628",assigned:"\u0627\u0646\u062a\u0638\u0627\u0631 \u0627\u0644\u0628\u062f\u0627\u064a\u0629",accepted:"\u062c\u0627\u0631\u064a \u0627\u0644\u0639\u0645\u0644",ready:"\u062c\u0627\u0647\u0632 \u0644\u0644\u062a\u0633\u0644\u064a\u0645",delivered:"\u062a\u0645 \u0627\u0644\u062a\u0633\u0644\u064a\u0645",canceled:"\u062a\u0645 \u0627\u0644\u0625\u0644\u063a\u0627\u0621"},bs_status:{Pending:"\u0642\u064a\u062f \u0627\u0644\u0625\u0646\u062a\u0638\u0627\u0631",Approved:"\u0645\u0635\u062f\u0642 \u0639\u0644\u064a\u0647",Rejected:"\u0645\u0631\u0641\u0648\u0636",Deactivated:"\u0645\u0639\u0637\u0644"},perms:{100:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0645\u0634\u0627\u0647\u062f\u0629 \u0627\u0644\u0645\u0648\u0638\u0641\u064a\u0646",101:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0646\u0634\u0627\u0621 \u0645\u0648\u0638\u0641 \u062c\u062f\u064a\u062f",102:"\u064a\u0633\u062a\u0637\u064a\u0639 \u062a\u0639\u062f\u064a\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0645\u0648\u0638\u0641",103:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u064a\u0642\u0627\u0641/\u062a\u0634\u063a\u064a\u0644 \u0645\u0648\u0638\u0641",104:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0645\u0634\u0627\u0647\u062f\u0629 \u0627\u0644\u0641\u0631\u0648\u0639",105:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0646\u0634\u0627\u0621 \u0641\u0631\u0639 \u062c\u062f\u064a\u062f",106:"\u064a\u0633\u062a\u0637\u064a\u0639 \u062a\u0639\u062f\u064a\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0641\u0631\u0639",107:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u064a\u0642\u0627\u0641/\u062a\u0634\u063a\u064a\u0644 \u0641\u0631\u0639",108:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0646\u0634\u0627\u0621 \u0642\u0633\u0645 \u062c\u062f\u064a\u062f",109:"\u064a\u0633\u062a\u0637\u064a\u0639 \u062a\u0639\u062f\u064a\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0642\u0633\u0645",110:"\u064a\u0633\u062a\u0637\u064a\u0639 \u062d\u0630\u0641 \u0642\u0633\u0645",111:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0645\u0634\u0627\u0647\u062f\u0629 \u0627\u0644\u062e\u0635\u0627\u0626\u0635",112:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0646\u0634\u0627\u0621 \u062e\u0627\u0635\u064a\u0629 \u062c\u062f\u064a\u062f\u0629",113:"\u064a\u0633\u062a\u0637\u064a\u0639 \u062a\u0639\u062f\u064a\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u062e\u0627\u0635\u064a\u0629",114:"\u064a\u0633\u062a\u0637\u064a\u0639 \u062d\u0630\u0641 \u062e\u0627\u0635\u064a\u0629",115:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0645\u0634\u0627\u0647\u062f\u0629 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a",116:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0646\u0634\u0627\u0621 \u0645\u0646\u062a\u062c \u062c\u062f\u064a\u062f",117:"\u064a\u0633\u062a\u0637\u064a\u0639 \u062a\u0639\u062f\u064a\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0645\u0646\u062a\u062c",118:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u064a\u0642\u0627\u0641/\u062a\u0634\u063a\u064a\u0644 \u0645\u0646\u062a\u062c",119:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0645\u0634\u0627\u0647\u062f\u0629 \u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0646\u0642\u0644",120:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0646\u0634\u0627\u0621 \u0637\u0644\u0628 \u0646\u0642\u0644",121:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0642\u0628\u0648\u0644 \u0637\u0644\u0628 \u0646\u0642\u0644",122:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0644\u063a\u0627\u0621 \u0637\u0644\u0628 \u0646\u0642\u0644",123:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0645\u0634\u0627\u0647\u062f\u0629 \u0627\u0644\u0637\u0644\u0628\u0627\u062a",124:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0646\u0634\u0627\u0621 \u0637\u0644\u0628 \u062c\u062f\u064a\u062f",125:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0644\u063a\u0627\u0621 \u0637\u0644\u0628",126:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0631\u062c\u0627\u0639 \u0637\u0644\u0628",127:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0645\u0634\u0627\u0647\u062f\u0629 \u0627\u0643\u0648\u0627\u062f \u0627\u0644\u062e\u0635\u0645",128:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0646\u0634\u0627\u0621 \u0627\u0643\u0648\u0627\u062f \u0627\u0644\u062e\u0635\u0645",129:"\u064a\u0633\u062a\u0637\u064a\u0639 \u062a\u0634\u063a\u064a\u0644 \u0627\u0643\u0648\u0627\u062f \u0627\u0644\u062e\u0635\u0645",130:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u064a\u0642\u0627\u0641 \u0627\u0643\u0648\u0627\u062f \u0627\u0644\u062e\u0635\u0645",131:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0645\u0634\u0627\u0647\u062f\u0629 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0645\u062e\u0635\u0648\u0635\u0629",132:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0645\u0634\u0627\u0647\u062f\u0629 \u0643\u0644 \u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0645\u062e\u0635\u0648\u0635\u0629",133:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0625\u0646\u0634\u0627\u0621 \u0645\u0646\u062a\u062c \u0645\u062e\u0635\u0648\u0635 \u062c\u062f\u064a\u062f",134:"\u064a\u0633\u062a\u0637\u064a\u0639 \u0627\u0644\u0639\u0645\u0644 \u0639\u0644\u064a \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0645\u062e\u0635\u0648\u0635\u0629",135:"\u064a\u0633\u062a\u0637\u064a\u0639 \u062a\u0639\u062f\u064a\u0644 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0645\u062e\u0635\u0648\u0635\u0629"}}}}}]);
//# sourceMappingURL=28.2037a485.chunk.js.map