<template>
  <div class="login-container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4" style="max-width: 400px; width: 100%;">
      <h1 class="text-center mb-4">Вход</h1>
      <div class="mb-3">
        <select v-model="username" class="form-control">
          <option disabled value="">Выберите имя</option>
          <option v-for="user in nameUsers" :key="user" :value="user"> {{ user.name }}</option>
        </select>
      </div>
      <button @click="login" class="btn btn-primary w-100">Войти</button>
    </div>
  </div>
</template>

<script setup>
import { ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import {BASE_API} from '../constants'


const nameUsers = ref(null);

const fetchData = async () => {
  const response = await axios.get(BASE_API + 'list-brokers');
  nameUsers.value = response.data;
};



const username = ref('');
const router = useRouter();

const login = () => {
  if (username.value) {
    localStorage.setItem('user', username.value.id);
    router.push({ name: 'Profile' }); 
  } else {
    alert('Неверное значение');
  }
};


fetchData();
</script>

<style scoped>
.login-container {
  height: 100vh;
}



.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button {
  font-size: 16px;
}
</style>
