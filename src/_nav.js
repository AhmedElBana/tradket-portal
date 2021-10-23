

const perms = JSON.parse(localStorage.userData).permissions;

//Branch
let branchObj = []
if(perms.includes("104") || perms.includes("105") || perms.includes("106") || perms.includes("107")){
  branchObj.push({
    name: 'Branches',
    url: '/branch',
    icon: 'icon-grid',
    });
}
//Staff
let staffObj = []
if(perms.includes("100") || perms.includes("101") || perms.includes("102") || perms.includes("103")){
  staffObj.push({
    name: 'Staff',
    url: '/staff',
    icon: 'icon-people',
    });
}
//Category
let categoryObj = []
if(perms.includes("108") || perms.includes("109") || perms.includes("110")){
  categoryObj.push({
    name: 'Categories',
    url: '/category',
    icon: 'icon-layers',
    });
}
//Feature
let featureObj = []
if(perms.includes("111") || perms.includes("112") || perms.includes("113") || perms.includes("114")){
  featureObj.push({
    name: 'Features',
    url: '/feature',
    icon: 'fa fa-puzzle-piece',
    });
}
//Product
let productObj = []
if(perms.includes("115") || perms.includes("116") || perms.includes("117") || perms.includes("118")){
  productObj.push({
    name: 'Products',
    url: '/product',
    icon: 'fa fa-barcode',
    });
}
//Material
let materialObj = []
if(perms.includes("115") || perms.includes("116") || perms.includes("117") || perms.includes("118")){
  materialObj.push({
    name: 'Materials',
    url: '/material',
    icon: 'fa fa-cubes',
    });
}
//order
let orderObj = []
if(perms.includes("123")){
  orderObj.push({
    name: 'Orders',
    url: '/order',
    icon: 'fa fa-qrcode',
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
    name: 'Home',
    url: '/home',
    icon: 'icon-home',
  },
  ...branchObj,
  ...staffObj,
  ...categoryObj,
  ...featureObj,
  ...materialObj,
  ...productObj,
  ...orderObj,
  ...promoObj
]

export default {
  items: listData
};
