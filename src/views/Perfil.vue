<template>
    <!-- <h1>Entre</h1>

    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Senha" v-model="password" /></p>
    <p><button @click="register">Entrar</button></p>

 -->
    <div>
        <Card class="inscricao">
            <template #header>
                <img src="../assets/cultivesePrancheta.png" width="100%" />

                <h3>{{ userStore.user.nome }}</h3>
                <h3>{{ userStore.user.email }}</h3>
                <h3>{{ userStore.user.telefone }}</h3>

                <!--        <h3>#todo tabela de atividades</h3> -->

            </template>



            <!--  <template #title>
                Entre
            </template> -->
            <!-- <template #subtitle>
                Conclua o cadastro para participar do bolão
            </template> -->


        </Card>
    </div>



</template>

<script setup>

import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import InlineMessage from 'primevue/inlinemessage';
import { onBeforeMount, ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

import { useUserStore } from "../stores/user";
import { auth } from "@/services/firebase";

import { useLoadingStore } from "../stores/loading";

const userStore = useUserStore();
const loadingstore = useLoadingStore();

const email = ref("");
const password = ref("");
const errMsg = ref() // ERROR MESSSAGE
const router = useRouter()

/* onBeforeMount(() => {
    loadingstore.setLoading(true)
    userStore.fetchUsuarioById(auth.currentUser.uid).then(() => {
        loadingstore.setLoading(false)
    });
}) */



</script>