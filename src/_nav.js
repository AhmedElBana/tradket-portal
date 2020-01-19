

const perms = JSON.parse(localStorage.userData).permissions;

//Staff
let staffObj = []
if(perms.includes("100") || perms.includes("101") || perms.includes("102") || perms.includes("103")){
  staffObj.push({
    name: 'Staff',
    url: '/staff',
    icon: 'icon-people',
    });
}

const listData = [
  {
    name: 'Home',
    url: '/home',
    icon: 'icon-home',
  },
  ...staffObj
]

export default {
  items: listData
};
