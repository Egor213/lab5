<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div class="container-fluid">
        <div class="navbar-nav mx-auto">
          <router-link to="/profile" class="nav-link">Профиль</router-link>
          <router-link v-if="admin" to="/admin" class="nav-link">Список всех участников</router-link>
          <router-link to="/profile" class="nav-link">Торги</router-link>
          <router-link to="/login" @click="logout" class="nav-link">Выйти</router-link>
        </div>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const admin = ref(null)

const logout = () => {
  localStorage.removeItem('user');
};

defineOptions({
  name: 'Navigation'
});

const setAdmin = () => {
  if (localStorage.getItem('user') == 2 || localStorage.getItem('user') == 6) {
    admin.value = true
  }
}
setAdmin();
</script>

<style scoped>
nav {
  border-radius: 8px;
  margin-bottom: 20px;
}

.navbar-brand {
  font-weight: bold;
}

.nav-link {
  color: #000000;
  font-weight: 600;
  font-size: 16px;
}

.nav-link:hover {
  color: #757575;
}
</style>
