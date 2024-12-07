import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import Profile from './components/Profile.vue';
import Admin from './components/Admin.vue';

const routes = [
    { path: '/', component: Login, name: 'Login' },
    { path: '/login', component: Login, name: 'Login' },
    {
        path: '/profile',
        component: Profile,
        name: 'Profile',
        meta: { requiresAuth: true },
    },
    {
        path: '/admin',
        component: Admin,
        name: 'Admin',
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
  } else if(to.name == 'Admin' && (isAuthenticated != 2 && isAuthenticated != 6)) {
    next({ name: 'Profile' });
  } else {
    next();
  }
});

export default router;
