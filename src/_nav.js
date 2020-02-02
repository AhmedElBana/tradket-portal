

const perms = JSON.parse(localStorage.userData).permissions;

//Branch
let branchObj = []
if(perms.includes("104") || perms.includes("105") || perms.includes("106") || perms.includes("107")){
  branchObj.push({
    name: 'Branches',
    url: '/branch',
    icon: 'icon-layers',
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
    name: 'Category',
    url: '/category',
    icon: 'icon-grid',
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
  ...categoryObj
]

export default {
  items: listData
};
