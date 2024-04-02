<script setup>

import { onMounted, ref } from "vue";

import { RouterLink, RouterView } from 'vue-router'
import router from "./router";

import { getAuth, onAuthStateChanged, signOut } from "@firebase/auth";

import Sidebar from 'primevue/sidebar';
import Toolbar from 'primevue/toolbar';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';


import { useLoadingStore } from "./stores/loading"
import { useUserStore } from "./stores/user"
import { useUsuariosStore } from "./stores/usuarios"




const visibleLeft = ref(false);
const isLoggedIn = ref(false);
const userStore = useUserStore();
const usuariosStore = useUsuariosStore();
const loadingstore = useLoadingStore();

const InlineButtonClickHandler = () => {
  visibleLeft.value = !visibleLeft.value
}

let auth;

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      //  apostasStore.fetchApostaById(user.uid)
      usuariosStore.getIsAdmin(user.uid)
      //      console.log('admin: '+usuariosStore.isAdmin);

    } else {
      isLoggedIn.value = false;
    }
  });
});


const handleSignOut = () => {

  signOut(auth).then(() => {
    userStore.setAuthUser(null)
    usuariosStore.setUsuarios([])
    usuariosStore.setIsAdmin(false)
    router.push("/");
    visibleLeft.value = !visibleLeft.value
  });
};

</script>

<template>

  <div class="cssrouterview">
    <div v-if="loadingstore.loading">
      <h3>Carregando...</h3>
      <ProgressSpinner />
    </div>
    <router-view v-else />
  </div>
  <div class="cssmenu">
    <Toolbar fixed class="barra">
      <template #start>
        <Button icon="pi pi-bars" class="p-button-rounded p-button-Primary p-button-text" @click="visibleLeft = true" />
        <h4> Template App </h4>
      </template>
    </Toolbar>
    <div class="card">
      <Sidebar v-model:visible="visibleLeft">
        <div class="card">
          <div class="card-container yellow-container">
            <router-link to="/" @click.native="InlineButtonClickHandler">
              <Button class="p-button-text button-sidebar">
                <span class="p-button-icon p-button-icon-left"><img
                    src="./assets/486-4864616_generic-company-logo-png-example-logo-png-transparent.png"
                    height="50"></span>

              </Button>
            </router-link>
            <router-link to="/Signin" @click.native="InlineButtonClickHandler">
              <Button class="p-button-text button-sidebar" v-if="!isLoggedIn">
                <span class="p-button-label">Logar</span>
              </Button>

            </router-link>

            <router-link to="/Register" @click.native="InlineButtonClickHandler">
              <Button class="p-button-text button-sidebar" v-if="!isLoggedIn">
                <span class="p-button-label"> Registrar </span>
              </Button>

            </router-link>
            <router-link to="/Admin" @click.native="InlineButtonClickHandler">
              <Button class="p-button-text button-sidebar" v-if="usuariosStore.isAdmin">
                <span class="p-button-label"> Admin </span>
              </Button>

            </router-link>

            <Button label="Sair" class="p-button-text button-sidebar"
              icon="pi pi-sign-out                                  " @click="handleSignOut" v-if="isLoggedIn" />
            <!-- <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/Feed">Feed</RouterLink>
            <RouterLink to="/Signin">Sign in</RouterLink>
            <RouterLink to="/Register">Register</RouterLink> -->
          </div>
        </div>
      </Sidebar>
    </div>
  </div>
</template>

<style>
.app {
  width: 100%;
}

.button-sidebar {
  width: 100%;
}

.routerview {
  width: 100%;
}

.cssmenu {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
}
</style>
