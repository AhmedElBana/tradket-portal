

const perms = JSON.parse(localStorage.userData).permissions;

//Branch
let branchObj = []
if(perms.includes("104") || perms.includes("105") || perms.includes("106") || perms.includes("107")){
  branchObj.push({
    name: 'الفروع',
    url: '/branch',
    icon: 'icon-grid',
    });
}
//Staff
let staffObj = []
if(perms.includes("100") || perms.includes("101") || perms.includes("102") || perms.includes("103")){
  staffObj.push({
    name: 'الموظفين',
    url: '/staff',
    icon: 'icon-people',
    });
}
//Category
let categoryObj = []
if(perms.includes("108") || perms.includes("109") || perms.includes("110")){
  categoryObj.push({
    name: 'الاقسام',
    url: '/category',
    icon: 'icon-layers',
    });
}
//Feature
let featureObj = []
if(perms.includes("111") || perms.includes("112") || perms.includes("113") || perms.includes("114")){
  featureObj.push({
    name: 'الخصائص',
    url: '/feature',
    icon: 'fa fa-puzzle-piece',
    });
}
//Product
let productObj = []
if(perms.includes("115") || perms.includes("116") || perms.includes("117") || perms.includes("118")){
  productObj.push({
    name: 'المنتجات',
    url: '/product',
    icon: 'fa fa-barcode',
    });
}
//Material
let materialObj = []
if(perms.includes("115") || perms.includes("116") || perms.includes("117") || perms.includes("118")){
  materialObj.push({
    name: 'الخامات',
    url: '/material',
    icon: 'fa fa-cubes',
    });
}
//Custom_products
let Custom_productsObj = []
if(perms.includes("131") && perms.includes("132")){
  Custom_productsObj.push({
    name: 'المنتجات المخصوصة',
    url: '/custom/products',
    icon: 'fa fa-newspaper-o',
    });
}else if(perms.includes("131") && !perms.includes("132")){
  Custom_productsObj.push({
    name: 'المنتجات المخصوصة',
    url: '/custom/products/staff',
    icon: 'fa fa-newspaper-o',
    });
}
//order
let orderObj = []
if(perms.includes("123")){
  orderObj.push({
    name: 'الطلبات',
    url: '/order',
    icon: 'fa fa-qrcode',
    });
}
//OrderNew
let OrderNewObj = []
if(perms.includes("123")){
  orderObj.push({
    name: 'طلب جديد',
    url: '/new/order',
    icon: 'fa fa-qrcode',
    });
}
//payment
let paymentObj = []
if(perms.includes("139")){
  paymentObj.push({
    name: 'المدفوعات',
    url: '/payment',
    icon: 'fa fa-money',
  });
}
//Customer
let customerObj = []
if(perms.includes("139")){
  customerObj.push({
    name: 'العملاء',
    url: '/customer',
    icon: 'fa fa-users',
  });
}
//Transfers
let TransfersObj = []
if(perms.includes("120") || perms.includes("121") || perms.includes("122")){
  TransfersObj.push({
    name: 'طلبات نقل المنتجات',
    url: '/transfers',
    icon: 'fa fa-exchange',
    });
}
//promo
let promoObj = []
if(perms.includes("127") || perms.includes("127") || perms.includes("128") || perms.includes("129") || perms.includes("130")){
  promoObj.push({
    name: 'Gifts',
    url: '/promo',
    icon: 'fa fa-gift',
    });
}

const listData = [
  {
    name: 'الرئيسية',
    url: '/home',
    icon: 'icon-home',
  },
  ...branchObj,
  ...staffObj,
  ...categoryObj,
  ...featureObj,
  ...materialObj,
  ...productObj,
  ...Custom_productsObj,
  ...TransfersObj,
  ...orderObj,
  ...paymentObj,
  ...customerObj,
  // ...promoObj
]

export default {
  items: listData
};
