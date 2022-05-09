import { createWebHistory, createRouter } from 'vue-router';
import Home from '@/components/Home.vue';
import Game from '@/components/game/Game.vue';
import Matchmaking from '@/components/game/Matchmaking.vue';
import Debug from '@/components/debug/Debug.vue';
import PageNotFound from '@/components/PageNotFound.vue';
import Login from '@/components/Login.vue';
import Chat from '@/components/chat/Chat.vue';
import Setting from '@/components/Setting.vue';
import Register from '@/components/Register.vue';
import Toto from '@/components/Toto.vue';
import { useUserStore } from '@/stores/user';
import { Get } from '@/services/requests';
import { storeToRefs } from 'pinia';
import Authenticate2fa from '@/components/Authenticate2fa.vue';
import MatchHistory from '@/components/profile/MatchHistory.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    beforeEnter: routeGuard,
    component: Home
  },
  {
    path: '/game',
    name: 'Game',
    beforeEnter: routeGuard,
    component: Game
  },
  {
    path: '/matchmaking',
    name: 'Matchmaking',
    beforeEnter: routeGuard,
    component: Matchmaking
  },
  {
    path: '/toto',
    name: 'Toto',
    component: Toto
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
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/chat',
    name: 'Chat',
    beforeEnter: routeGuard,
    component: Chat
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
    beforeEnter: routeGuard
  },
  {
    path: '/twofactorauth',
    name: 'Authenticate2fa',
    component: Authenticate2fa
  },
  {
    path: '/history',
    name: 'History',
    component: MatchHistory,
    beforeEnter: routeGuard
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

async function routeGuard(to: any, from: any, next: any) {
  let response;
  try {
    response = await Get('/auth/jwt-status');
    if (response.status != 401) {
      next(); // allow to enter route
    } else {
      next('/login'); // go to '/login';
    }
  } catch (error: any) {
    next('/login'); // go to '/login';
  }
}

export default router;
