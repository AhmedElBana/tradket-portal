import text from "./Dependencies.json";
import cookie from 'react-cookies';
let cookies = cookie.loadAll();
class Dependencies {
    currencyName(currency){
        if(text[localStorage.lang].currencies[currency]){
            return text[localStorage.lang].currencies[currency];
        }else{
            return currency;
        }
    }
    integrationsName(integration){
        if(text[localStorage.lang].integrations[integration]){
            return text[localStorage.lang].integrations[integration];
        }else{
            return integration;
        }
    }
    paymentTypeName(type){
        if(text[localStorage.lang].types[type]){
            return text[localStorage.lang].types[type];
        }else{
            return type;
        }
    }
    statusName(status){
        if(text[localStorage.lang].status[status]){
            return text[localStorage.lang].status[status];
        }else{
            return status;
        }
    }
    bsMerchantStatus(bs_status){
        if(text[localStorage.lang].bs_status && text[localStorage.lang].bs_status[bs_status]){
            return text[localStorage.lang].bs_status[bs_status];
        }else{
            return bs_status;
        }
    }
    getAccountPermNames(list_of_perm_ids){
        let account_perms = [];
        var keys = JSON.parse(cookies.permsDict);
        for(let i=0; i < list_of_perm_ids.length; i++){
          let perm_id = list_of_perm_ids[i]
          let perm_name = keys[perm_id]
          account_perms.push(perm_name);
        }
        return account_perms
    }
   

    getPermsIds(namesList){
        let idsArr = [];
        var keys = cookies.permsDict;
        namesList.map((name)=>{
            Object.keys(keys).map((id)=>{
                if(name === keys[id]){
                    idsArr.push(id);
                }
            });
        });
        return idsArr
    }
    permsName(perm){
        if(localStorage.lang == "ar"){
            if(text[localStorage.lang].perms[perm]){
                return text[localStorage.lang].perms[perm];
            }else{
                return perm;
            }
        }else{
            return perm
        }
    }
     

    parseDate(input, format) {
        format = format || 'yyyy-mm-dd'; // default format
        var parts = input.match(/(\d+)/g), 
            i = 0, fmt = {};
        // extract date-part indexes from the format
        format.replace(/(yyyy|dd|mm)/g, function(part) { fmt[part] = i++; });
  
        return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']]);
    }
    pad(d) {
        return (d < 10) ? '0' + d.toString() : d.toString();
    }
    getNextDayDate(date){
        var nextDay = this.parseDate(date);
        nextDay.setDate(nextDay.getDate() + 1);
        var nextDayMonth = nextDay.getMonth() + 1;
        return nextDay.getFullYear() + '-' + this.pad(nextDayMonth) + '-' + this.pad(nextDay.getDate());
    }
    ParseFullDate(input) {
        let format = 'yyyy-mm-dd hh:mn:ss'; 
        var parts = input.match(/(\d+)/g), 
            i = 0, fmt = {};
        // extract date-part indexes from the format
        format.replace(/(yyyy|dd|mm|hh|mn|ss)/g, function(part) { fmt[part] = i++; });
        return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']], parts[fmt['hh']], parts[fmt['mn']], parts[fmt['ss']] );
    }
    IeDateFormate( input_date ){
        return input_date.slice(0, 19)
    }
    custom_date_format( input_date ){
        var d = this.ParseFullDate(this.IeDateFormate(input_date));
        var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if( localStorage.lang == "ar" ){
          month = ['يناير','فبراير','مارس','ابريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
        }
        var output_time = d.toLocaleTimeString().toLowerCase().replace(/([\d]+:[\d]+):[\d]+(\s\w+)/g, "$1$2");
        if( localStorage.lang == "ar"){
            output_time = output_time.replace(/am/g,"صباحا");
            output_time = output_time.replace(/pm/g,"مساءً");
        }
        var output_date =  d.getDate() + ' - ' + month[d.getMonth()] + ' - ' + d.getFullYear() + ', ' + output_time;
        
        //return d.toISOString().split('T')[0]
        return output_date
    }
    boolName(bool){
        let str = bool;
        if(localStorage.lang === "ar"){
            bool? str = "نعم" : str = "لا"
        }else{
            bool? str = "Yes" : str = "No"
        }
        return str
    }
    isLiveName(bool){
        let str = bool;
        if(localStorage.lang === "ar"){
            bool? str = "نشط" : str = "اختبار"
        }else{
            bool? str = "Live" : str = "Test"
        }
        return str
    }
    getLastName(fullName){
        let str = fullName.trim()
        let array = str.split(' ');
        return array[array.length - 1];
    }
    getFirstName(fullName){
        let str = fullName.trim()
        let array = str.split(' ');
        return array[0];
    }
    convertAmount(amount,currency){
        return (amount/1) + " " + this.currencyName(currency);
    }
    convertCentsAmount(amount,currency){
        if(currency === "JOD"){
            return (amount/1000) + " " + this.currencyName(currency)
        }else{
            return (amount/100) + " " + this.currencyName(currency)
        }
    }
    convertCentsAmountNoCurr(amount,currency){
        if(currency === "JOD"){
            return (amount/1000)
        }else{
            return (amount/100)
        }
    }

    //permissions
    viewIntegrationsPerm(){
        return (cookies.permNames).includes("can view payment integration");
    }
}

export let dependencies = new Dependencies();
