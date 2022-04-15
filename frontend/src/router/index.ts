import { createWebHistory, createRouter } from 'vue-router';
import Home from '@/components/Home.vue';
import Game from '@/components/Game.vue';
import Debug from '@/components/debug/Debug.vue';
import PageNotFound from '@/components/PageNotFound.vue';
import Login from '@/components/Login.vue';
import Chat from '@/components/Chat.vue';
import Toto from '@/components/Toto.vue';
import Setting from '@/components/Setting.vue';
import Register from '@/components/Register.vue';
import { useUserStore } from '@/stores/user';
import { Get } from '@/services/requests';
import { storeToRefs } from 'pinia';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/game',
    name: 'Game',
    // beforeEnter: routeGuard,
    component: Game
  },
  {
    path: '/debug',
    name: 'Debug',
    component: Debug
  },
  {
    path: '/toto',
    name: 'TOTO',
    component: Toto
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
    // beforeEnter: routeGuard,
    component: Chat
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting
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

// function routeGuard(to: any, from: any, next: any) {
//   const userStore = useUserStore();
//   const { isAuthenticated } = userStore;
//   if (isAuthenticated) {
//     next(); // allow to enter route
//   } else {
//     next('/login'); // go to '/login';
//   }
// }

router.beforeEach(() => {
  console.log(document.cookie);
  Get('/auth/status').then(res => {
    if (res.status != 403) {
      const userStore = useUserStore();
      const { isAuthenticated } = storeToRefs(userStore);
      isAuthenticated.value = true;
    }
  });
});

export default router;
