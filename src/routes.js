import React from 'react';

const Home = React.lazy(() => import('./views/Pages/Home/Home'));
const Branch = React.lazy(() => import('./views/Pages/Branch/Branch'));
const Staff = React.lazy(() => import('./views/Pages/Staff/Staff'));
const Category = React.lazy(() => import('./views/Pages/Category/Category'));
const Feature = React.lazy(() => import('./views/Pages/Feature/Feature'));
const Product = React.lazy(() => import('./views/Pages/Product/Product'));
const Material = React.lazy(() => import('./views/Pages/Material/Material'));
const Custom_products = React.lazy(() => import('./views/Pages/Custom_products/Custom_products'));
const Custom_products_staff = React.lazy(() => import('./views/Pages/Custom_products_staff/Custom_products_staff'));
const Custom_product_full = React.lazy(() => import('./views/Pages/Custom_product_full/Custom_product_full'));
const Order = React.lazy(() => import('./views/Pages/Order/Order'));
const Payment = React.lazy(() => import('./views/Pages/Payment/Payment'));
const Customer = React.lazy(() => import('./views/Pages/Customer/Customer'));
const Transfers = React.lazy(() => import('./views/Pages/Transfers/Transfers'));
const Promo = React.lazy(() => import('./views/Pages/Promo/Promo'));
// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/home', name: 'Home', component: Home },
  { path: '/branch', name: 'Branch', component: Branch },
  { path: '/staff', name: 'Staff', component: Staff },
  { path: '/category', name: 'Category', component: Category },
  { path: '/feature', name: 'Feature', component: Feature },
  { path: '/product', name: 'Product', component: Product },
  { path: '/Material', name: 'Material', component: Material },
  { path: '/custom/products', exact: true , name: 'Custom_products', component: Custom_products },
  { path: '/custom/products/staff', exact: true , name: 'Custom_products_staff', component: Custom_products_staff },
  { path: '/custom/products/details/:id?', exact: true , name: 'Custom_product_full', component: Custom_product_full },
  { path: '/order', name: 'Order', component: Order },
  { path: '/payment', name: 'Payment', component: Payment },
  { path: '/customer', name: 'Customer', component: Customer },
  { path: '/transfers', name: 'Transfers', component: Transfers },
  // { path: '/promo', name: 'Promo', component: Promo },
];

export default routes;
