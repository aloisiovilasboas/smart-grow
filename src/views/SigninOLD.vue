<template>
    <main>
        <h1>Criar Conta</h1>
        <p><input type="text" placeholder="email" v-model="email"></p>
        <p><input type="password" placeholder="senha" v-model="password"></p>
        <p><button @click="register">Entrar</button></p>

    </main>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import router from '@/router';

const email = ref('')
const password = ref('')
const register = () => {
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((data) => {
            console.log('Logado com sucesso')
            router.push('/feed')
        }).catch((error) => {
            console.log('Erro ao registrar', error)
        })

}

//import TheWelcome from '../components/TheWelcome.vue'
</script>