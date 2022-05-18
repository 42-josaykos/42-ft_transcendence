import { createWebHistory, createRouter } from 'vue-router';
import { Get } from '@/services/requests';
import Home from '@/components/Home.vue';
import Game from '@/components/game/Game.vue';
import Matchmaking from '@/components/game/Matchmaking.vue';
import Pong from '@/components/game/Pong.vue';
import Debug from '@/components/debug/Debug.vue';
import PageNotFound from '@/components/PageNotFound.vue';
import Login from '@/components/Login.vue';
import Chat from '@/components/chat/Chat.vue';
import Setting from '@/components/Setting.vue';
import Register from '@/components/Register.vue';
import Toto from '@/components/Toto.vue';
import Authenticate2fa from '@/components/Authenticate2fa.vue';
import MatchHistory from '@/components/profile/MatchHistory.vue';

const routes = [
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
    path: '/spectate',
    name: 'Spectate',
    beforeEnter: routeGuard,
    component: Pong
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
    path: '/history',
    name: 'History',
    component: MatchHistory,
    beforeEnter: routeGuard
  },
  {
    path: '/login',
    name: 'Login',
    beforeEnter: isNotAuthenticatedGuard,
    component: Login
  },
  {
    path: '/twofactorauth',
    name: 'Authenticate2fa',
    beforeEnter: isNotAuthenticatedGuard,
    component: Authenticate2fa
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

function getCookie(name: string) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

// Block login, register and 2fa page access when already logged in
function isNotAuthenticatedGuard(to: any, from: any, next: any) {
  const token = getCookie('Authentication');
  if (!token) {
    next();
  } else {
    next(from.path);
  }
}

async function routeGuard(to: any, from: any, next: any) {
  let response;
  try {
    response = await Get('/auth/jwt-status');
    if (response.status != 401) {
      next(); // allow to enter route
    } else {
      next('/login');
    }
  } catch (error: any) {
    next('/login');
  }
}

export default router;
