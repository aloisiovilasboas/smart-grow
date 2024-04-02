import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

import Feed from "../views/Feed.vue";
import Signin from "../views/Signin.vue";
import Register from "../views/Register.vue";

import { useLoadingStore } from "../stores/loading";
import { useUsuariosStore } from "../stores/usuarios";
import { useUserStore } from "../stores/user";

import { getAuth, onAuthStateChanged } from "@firebase/auth";

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/Feed",
      name: "Feed",
      component: Feed,
      meta: { requiresAuth: true },
    },
    {
      path: "/Signin",
      Signin: "home",
      component: Signin,
      meta: { requiresDeslogado: true },
    },
    {
      path: "/Register",
      Register: "home",
      component: Register,
      meta: { requiresDeslogado: true },
    },
    {
      path: "/home",
      name: "homeold",
      component: HomeView,
    },
    {
      path: "/admin",
      name: "Admin",
      component: () => import("../views/AdminView.vue"),
      meta: { requiresAdmin: true },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const loadingStore = useLoadingStore();
  loadingStore.loading = true;
  // console.log(loadingStore.loading)
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    //console.log('requiresauth');
    const u = await getCurrentUser();
    if (u) {
      /*       const apostasStore = useApostasStore();
      await apostasStore.fetchApostaById(u.uid); */
      const userStore = useUserStore();
      userStore.setAuthUser(u);
      next();
    } else {
      alert("Você não está logado");
      next("/");
    }
  } else if (to.matched.some((record) => record.meta.requiresDeslogado)) {
    if (await getCurrentUser()) {
      alert("Você já está logado");
      next("/");
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresAdmin)) {
    //console.log('requiresauth');
    const u = await getCurrentUser();
    if (u) {
      const userStore = useUserStore();
      userStore.setAuthUser(u);
      const usuariosStore = useUsuariosStore();
      console.log(usuariosStore.isAdmin);

      if (usuariosStore.isAdmin) {
        next();
      } else {
        alert("Não autorizado");
        next("/");
      }
    } else {
      alert("Você não está logado");
      next("/");
    }
  } else {
    next();
  }
});

router.afterEach(() => {
  const loadingStore = useLoadingStore();
  loadingStore.loading = false;
});

export default router;
