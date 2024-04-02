<template>
    <!-- <h1>Entre {{ $route.params.id }} </h1> -->

    <div>
        <Card class="Cadastre-se">
            <template #header>
                <img src="../assets/486-4864616_generic-company-logo-png-example-logo-png-transparent.png" />

            </template>
            <!--  <template #title>
                Entre
            </template> -->
            <!-- <template #subtitle>
                Conclua o cadastro para participar do bolão
            </template> -->
            <template #content>
                <div class="formularioDiv">
                    <InputText class="formulario" id="email" type="text" v-model="email" placeholder="E-mail" />
                    <p></p>
                    <Password class="formulario" v-model="password" toggleMask placeholder="Senha" :feedback="false" />
                    <p v-if="errMsg"></p>
                    <Password class="formulario" v-model="passwordConfirmation" toggleMask placeholder="Confirme senha"
                        :feedback="false" />
                    <p v-if="errMsg"></p>
                    <InlineMessage class="formulario" severity="error" v-if="errMsg">{{ errMsg }}</InlineMessage>
                </div>
            </template>
            <template #footer>
                <Button icon="pi pi-check" label="Entrar" @click="register" />
            </template>
        </Card>
    </div>



</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import router from '@/router';

import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import InlineMessage from 'primevue/inlinemessage';


import { registrar } from '@/services/firebase';

import { useUserStore } from "../stores/user";


const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const errMsg = ref()
const register = () => {
    if (password.value = passwordConfirmation.value) {
        createUserWithEmailAndPassword(getAuth(), email.value, password.value)
            .then((data) => {
                console.log("Registrado com Sucesso")
                router.push('/feed')
            })
    }
    else {
        console.log('senhas diferentes')
    }

};


</script>