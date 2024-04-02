import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";

import { getCurrentUser } from "./services/firebase.js";

import Home from "../views/Home.vue";
import Feed from "../views/Feed.vue";

import Register from "../views/Register.vue";

import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { useLoadingStore } from "../stores/loading";
import { useUsuariosStore } from "../stores/usuarios";
import { useUserStore } from "../stores/user";
import { s } from "vite/dist/node/types.d-aGj9QkWt";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      beforeEnter: async (to, from) => {
        const userStore = useUserStore();
        const u = await getCurrentUser();
        if (u != null) {
          userStore.setAuthUser(u);
          /*   const apostasStore = useApostasStore();
          await apostasStore.fetchApostaById(u.uid); */
          console.log(userStore.authuser);
        } else {
          userStore.setAuthUser(null);
        }
      },
      component: () => import("../views/Home.vue"),
    },
    { path: "/Feed", name: "Feed", component: Feed },
    { path: "/Signin", Signin: "home", component: Signin },
    { path: "/Register", Register: "home", component: Register },
    {
      path: "/home",
      name: "homeold",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
    },
  ],
});

export default router;
