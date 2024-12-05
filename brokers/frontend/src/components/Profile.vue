<template>
    <div class="container py-4">
      <Navigation />
      <div class="card p-4">
        <h1 class="text-center mb-4">Профиль</h1>
        <div>
          <h2>Имя брокера: <span class="fw-bold ">Иван Иванов</span></h2>
          <p class="fs-3 ">Баланс: <span class="fs-4 text-success fw-bold">100 000 ₽</span></p>
        </div>
        <div>
          <h3>Акции в наличии</h3>
          <div v-for="(stock, index) in stocks" :key="index" class="row mb-3">
            <div class="col-12">
              <div class="card p-3">
                <h5 class="card-title">{{ stock.name }}</h5>
                <p class="card-text">Количество: {{ stock.quantity }}</p>
                <p class="card-text">Цена: {{ stock.price }} ₽</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import Navigation from './Navigation.vue';
  
  const stocks = [
    { name: 'Газпром', quantity: 10, price: 2500 },
    { name: 'Сбербанк', quantity: 15, price: 300 },
    { name: 'Лукойл', quantity: 5, price: 4000 },
  ];
  </script>
  
