import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Cadastro from "../views/Cadastro.vue";
import Admin from "../views/Admin.vue";
import Painel from "../views/Painel.vue";
import Perfil from "../views/Perfil.vue";

import { useLoadingStore } from "../stores/loading";
import { useUsuariosStore } from "../stores/usuarios";
import { useSementesStore } from "../stores/sementes";
import { useUserStore } from "../stores/user";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

import { getAuth, onAuthStateChanged } from "@firebase/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Home,
    },

    {
      path: "/perfil",
      component: Perfil,
      meta: { requiresAuth: true },
    },
    {
      path: "/painel",
      component: Painel,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      component: Login,
      meta: { requiresDeslogado: true },
    },
    {
      path: "/cadastro",
      component: Cadastro,
      meta: { requiresDeslogado: true },
    },
    {
      path: "/admin",
      name: "Admin",
      component: Admin,
      meta: { requiresAdmin: true },
    },
  ],
});

const getCurrentUser = () => {
  /* console.log(getAuth().currentUser); */
  return new Promise((resolve, reject) => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        resolve(user);
      } else {
        reject("Usuário não logado");
      }
    });
  });
};

const getDetalhesUsuario = (id) => {
  return new Promise((resolve, reject) => {
    onSnapshot(doc(db, "usuarios", id), (doc) => {
      if (doc.exists()) {
        resolve(doc.data());
      } else {
        reject("Usuário não encontrado");
      }
    });
  });
};

const setDetalhesUser = () => {
  return new Promise((resolve, reject) => {
    getCurrentUser()
      .then((u) => {
        if (u) {
          getDetalhesUsuario(u.uid).then((doc) => {
            if (doc) {
              const user = { ...doc.data(), id: u.uid };
              const userStore = useUserStore();
              userStore.setUser(user);
              resolve(user);
            } else {
              reject("Erro ao buscar detalhes do usuário");
            }
          });
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
};

router.beforeEach(async (to, from, next) => {
  const loadingStore = useLoadingStore();
  loadingStore.loading = true;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    //console.log('requiresauth');
    await getCurrentUser()
      .then((u) => {
        if (u) {
          /*  const userStore = useUserStore();
          userStore.setAuthUser(u); */

          next();
        } else {
          alert("Você não está logado");
          next("/login");
        }
        /* loadingStore.loading = false; */
      })
      .catch((e) => {
        console.log(e);
        alert(e);
        next("/login");
        /*  loadingStore.loading = false; */
      });
  } else if (to.matched.some((record) => record.meta.requiresDeslogado)) {
    await getCurrentUser()
      .then((u) => {
        if (u) {
          alert("Você já está logado");
          next("/");
        } else {
          next();
        }
      })
      .catch((e) => {
        console.log(e);
        next();
      });
    /* loadingStore.loading = false; */
  } else if (to.matched.some((record) => record.meta.requiresAdmin)) {
    await getIsAdmin()
      .then((isAdmin) => {
        if (isAdmin) {
          next();
        } else {
          next("/");
          alert("Você não é admin");
        }
      })
      .catch((e) => {
        alert(e);
        next("/");
      });
  } else {
    next();
  }
  loadingStore.loading = false;
});

/* router.afterEach(() => {
  const loadingStore = useLoadingStore();
  loadingStore.loading = false;
}); */

export default router;
