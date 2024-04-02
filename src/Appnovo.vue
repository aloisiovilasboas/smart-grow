<template>

    <div class="cssrouterview">
        <div v-if="loadingstore.loading">
            <h3>Carregando...</h3>
            <ProgressSpinner />
        </div>
        <router-view v-else />
    </div>

</template>

<script setup>

import Navbar from './Navbar.vue'

import ProgressSpinner from 'primevue/progressspinner';

import Toolbar from 'primevue/toolbar';

import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "@firebase/auth";
import { useUserStore } from "./stores/user"
import { useUsuariosStore } from "./stores/usuarios"
import { useLoadingStore } from "./stores/loading"
import router from "./router";
import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';
/* import { useApostasStore } from './stores/apostas'; */
//import { useGabaritoStore } from './stores/apostas';

const visibleLeft = ref(false);
const isLoggedIn = ref(false);
const userStore = useUserStore();
const usuariosStore = useUsuariosStore();
/* const apostasStore = useApostasStore(); */
//const gabaritoStore = useGabaritoStore();
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
        /*     apostasStore.setCampeao([])
            apostasStore.setGrupos([])
            apostasStore.setMatamata([])
            apostasStore.setApostasRAW({ grupos: null }) */
        usuariosStore.setUsuarios([])
        usuariosStore.setIsAdmin(false)
        router.push("/");
        visibleLeft.value = !visibleLeft.value
    });
};

</script>

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
