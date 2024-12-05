<template>
    <div>
        <Navigation/>
        <h1>Profile Page</h1>
        <p>Welcome to your profile!</p>
    </div>
  </template>
  
  <script>
  import Navigation from './Navigation.vue';

export default {
  name: 'ParentComponent',
  components: {
    Navigation
  }
}
  </script>
  
  <style >
  </style>
  