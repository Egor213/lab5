<template>
  <div class="login-container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4" style="max-width: 400px; width: 100%;">
      <h1 class="text-center mb-4">Вход</h1>
      <div class="mb-3">
        <select v-model="username" class="form-control">
          <option disabled value="">Выберите имя</option>
          <option v-for="user in users" :key="user" :value="user">{{ user }}</option>
        </select>
      </div>
      <button @click="login" class="btn btn-primary w-100">Войти</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const users = ref(['user1', 'user2', 'user3']);  // Список доступных пользователей
const router = useRouter();
const login = () => {
  console.log(username)
}

// const login = () => {
//   if (username.value && password.value === 'password') {
//     localStorage.setItem('isAuthenticated', 'true');
//     router.push({ name: 'Profile' }); 
//   } else {
//     alert('Неверное значение');
//   }
// };
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
