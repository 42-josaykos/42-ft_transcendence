import { createWebHistory, createRouter } from 'vue-router';
import Home from '@/components/Home.vue';
import Game from '@/components/Game.vue';
import Debug from '@/components/debug/Debug.vue';
import PageNotFound from '@/components/PageNotFound.vue';
import Login from '@/components/Login.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/game',
    name: 'Game',
    component: Game
  },
  {
    path: '/debug',
    name: 'Debug',
    component: Debug
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'PageNotFound',
    component: PageNotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
