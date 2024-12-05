<template>
    <div>
      <nav>
        <router-link to="/main">Главная страница</router-link>
        <router-link to="/profile">Profile</router-link>
        <router-link to="/login">Выйти</router-link>
        
      </nav>
      <router-view></router-view>
    </div>
  </template>
  
  <script>
  export default {
    name: 'navigation'
  }
  </script>
  
  <style scoped>
  nav {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }
  </style>
  