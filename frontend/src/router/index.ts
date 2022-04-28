import { createWebHistory, createRouter } from "vue-router";
import Home from "@/components/Home.vue";
import Game from "@/components/Game.vue";
import Matchmaking from "@/components/Matchmaking.vue";
import Debug from "@/components/debug/Debug.vue";
import PageNotFound from "@/components/PageNotFound.vue";
import Login from "@/components/Login.vue";
import Chat from "@/components/Chat.vue";
import Toto from "@/components/Toto.vue";
import Setting from "@/components/Setting.vue";
import Register from "@/components/Register.vue";
import { useUserStore } from "@/stores/user";
import { Get } from "@/services/requests";
import { storeToRefs } from "pinia";
import Authenticate2fa from "@/components/Authenticate2fa.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/game",
    name: "Game",
    beforeEnter: routeGuard,
    component: Game,
  },
  {
    path: "/matchmaking",
    name: "Matchmaking",
    beforeEnter: routeGuard,
    component: Matchmaking,
  },
  {
    path: "/debug",
    name: "Debug",
    component: Debug,
  },
  {
    path: "/toto",
    name: "TOTO",
    component: Toto,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/chat",
    name: "Chat",
    beforeEnter: routeGuard,
    component: Chat,
  },
  {
    path: "/setting",
    name: "Setting",
    component: Setting,
  },
  {
    path: "/twofactorauth",
    name: "Authenticate2fa",
    component: Authenticate2fa,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "PageNotFound",
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function routeGuard(to: any, from: any, next: any) {
  const userStore = useUserStore();
  const { isAuthenticated } = userStore;
  if (isAuthenticated) {
    next(); // allow to enter route
  } else {
    Get("/auth/jwt-status")
      .then((res) => {
        if (res.status != 401) {
          const userStore = useUserStore();
          const { isAuthenticated } = storeToRefs(userStore);
          isAuthenticated.value = true;
          next(); // allow to enter route
        }
        next("/login"); // go to '/login';
      })
      .catch((err) => {
        next("/login"); // go to '/login';
      });
  }
}

export default router;
