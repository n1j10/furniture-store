type NavBarLinks = {
  href: string;
  name: string;
};

export const dropDownMenuLinks: NavBarLinks[] = [
  { href: '/', name: 'home' },
  { href: '/about', name: 'about' },
  { href: '/products', name: 'products' },
  { href: '/favorites', name: 'favorites' },
  { href: '/cart', name: 'cart' },
  { href: '/orders', name: 'orders' },
  { href: '/admin/sales', name: 'dashboard' },
  { href: '/reviews', name: 'reviews' },


];

export let links = {
  HOME: { href: '/', name: 'Home' },
  ABOUT: { href: '/about', name: 'About' },
  CART: { href: '/cart', name: 'Cart' },
  PRODUCTS: { href: '/products', name: 'Products' },
  AdminProducts: { href: '/admin/products', name: 'Products' },


} as const


export const adminLinks: NavBarLinks[] = [
  { href: '/admin/sales', name: 'sales' },
  { href: '/admin/products', name: 'my products' },
  { href: '/admin/products/create', name: 'create product' },
];
