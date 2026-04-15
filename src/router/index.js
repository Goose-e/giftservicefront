import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Catalog from '../views/Catalog.vue';
import Wishlist from '../views/Wishlist.vue';
import Friends from '../views/Friends.vue';
import FriendWishlist from '../views/FriendWishlist.vue';
import FriendRecommendations from '../views/FriendRecommendations.vue';
import Victims from '../views/Victims.vue';
import VictimRecommendations from '../views/VictimRecommendations.vue';
import { authStore } from '../store/auth';

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/catalog', component: Catalog, meta: { requiresAuth: true } },
  { path: '/wishlist', component: Wishlist, meta: { requiresAuth: true } },
  { path: '/friends', component: Friends, meta: { requiresAuth: true } },
  { path: '/friends/:login/wishlist', component: FriendWishlist, meta: { requiresAuth: true } },
  { path: '/friends/:login/recommendations', component: FriendRecommendations, meta: { requiresAuth: true } },
  { path: '/victims', component: Victims, meta: { requiresAuth: true } },
  { path: '/victims/:id/recommendations', component: VictimRecommendations, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !authStore.isAuthenticated.value) {
    return '/login';
  }
  if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated.value) {
    return '/dashboard';
  }
  return true;
});

export default router;
