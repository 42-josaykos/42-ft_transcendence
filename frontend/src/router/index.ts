import { createWebHistory, createRouter } from 'vue-router';
import Home from '@/components/Home.vue';
import Game from '@/components/Game.vue';
import Debug from '@/components/debug/Debug.vue';
import PageNotFound from '@/components/PageNotFound.vue';
import Login from '@/components/Login.vue';
import Chat from '@/components/Chat.vue';
import { useUserStore } from '@/stores/user';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/game',
    name: 'Game',
    beforeEnter: routeGuard,
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
    path: '/chat',
    name: 'Chat',
    component: Chat
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

function routeGuard(to: any, from: any, next: any) {
  const userStore = useUserStore();
  const { isAuthenticated } = userStore;

  console.log(isAuthenticated);

  if (isAuthenticated) {
    next(); // allow to enter route
  } else {
    next('/login'); // go to '/login';
  }
}

export default router;
