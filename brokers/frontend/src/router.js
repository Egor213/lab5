import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import Profile from './components/Profile.vue';

const routes = [
    { path: '/', component: Login, name: 'Login' },
    { path: '/login', component: Login, name: 'Login' },
    {
    path: '/profile',
    component: Profile,
    name: 'Profile',
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' }); 
  } else {
    next();
  }
});

export default router;
