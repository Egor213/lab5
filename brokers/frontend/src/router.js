import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import Admin from './components/Admin.vue';
import MarketPlace from './components/MarketPlace.vue';

const routes = [
    { path: '/', component: Login, name: 'Login' },
    { path: '/login', component: Login, name: 'Login' },
    {
        path: '/admin',
        component: Admin,
        name: 'Admin',
        meta: { requiresAuth: true },
    },
    {
        path: '/market-place',
        component: MarketPlace,
        name: 'market-place',
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user');
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' }); 
  }  else {
    next();
  }
});

export default router;
