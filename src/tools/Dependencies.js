import text from "./Dependencies.json";
class Dependencies {
    branchesName(ids,fullBranches){
        let id_name = {};
        fullBranches.map((branch)=>{
            id_name[branch._id] = branch
        })
        let names = [];
        ids.map((id)=>{
            names.push(id_name[id].name)
        })
        return names
    }



    getUserData(){
        return JSON.parse(localStorage.userData)
    }
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
    typeName(type){
        if(text[localStorage.lang].types[type]){
            return text[localStorage.lang].types[type];
        }else{
            return type;
        }
    }
    branchTypeName(type){
        if(text[localStorage.lang].branch_types && text[localStorage.lang].branch_types[type]){
            return text[localStorage.lang].branch_types[type];
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
    order_status(status){
        if(text[localStorage.lang].order_status[status]){
            return text[localStorage.lang].order_status[status];
        }else{
            return status;
        }
    }
    custom_status(status){
        if(text[localStorage.lang].custom_status[status]){
            return text[localStorage.lang].custom_status[status];
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
    
    permsName(perm){
        return text[localStorage.lang]["perms"][perm]? text[localStorage.lang]["perms"][perm] : perm
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
        // var d = this.ParseFullDate(input_date);
        // var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        // if( localStorage.lang == "ar" ){
        //   month = ['يناير','فبراير','مارس','ابريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
        // }
        // var output_time = d.toLocaleTimeString().toLowerCase().replace(/([\d]+:[\d]+):[\d]+(\s\w+)/g, "$1$2");
        // if( localStorage.lang == "ar"){
        //     output_time = output_time.replace(/am/g,"صباحا");
        //     output_time = output_time.replace(/pm/g,"مساءً");
        // }
        // var output_date =  d.getDate() + ' - ' + month[d.getMonth()] + ' - ' + d.getFullYear() + ', ' + output_time;
        
        // //return d.toISOString().split('T')[0]
        // return output_date
        return new Date(input_date).toLocaleString("en-NZ")
    }
    boolName(bool){
        let str = bool;
        if(localStorage.lang === "ar"){
            if(bool == true || bool == "true"){
                str = "نعم"
            }else{
                str = "لا"
            }
        }else{
            if(bool == true || bool == "true"){
                str = "Yes"
            }else{
                str = "No"
            }
        }
        return str
    }
    isLiveName(bool){
        let str = bool;
        if(localStorage.lang === "ar"){
            if(bool == true || bool == "true"){
                str = "نشط"
            }else{
                str = "اختبار"
            }
        }else{
            if(bool == true || bool == "true"){
                str = "Live"
            }else{
                str = "Test"
            }
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
        if(amount === "-"){
            amount = 0;
        }
        return (amount/1) + " " + this.currencyName(currency);
    }
    convertCentsAmountFull(amount,currency){
        if(amount === "-"){
            amount = 0;
        }
        if(currency === "JOD"){
            return dependencies.numberWithCommas(amount/1000) + " " + this.currencyName(currency)
        }else{
            return dependencies.numberWithCommas(amount/100) + " " + this.currencyName(currency)
        }
    }
    convertCentsAmountFullNoCurr(amount){
        return dependencies.numberWithCommas(amount/100)
    }
    getCurrentLang =() =>{
        if (localStorage.lang) {
            return localStorage.lang
        } else {
            return "en"
        }
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
    convertAmountFullNoCurr(amount){
        return dependencies.numberWithCommas(amount)
    }
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

export let dependencies = new Dependencies();
