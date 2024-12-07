<template>
    <div class="container py-4">
      <Navigation />
      <h1 class="text-center mb-4">Список всех брокеров</h1>
  
      <div v-if="visible" class="toast-notification m-0">
        <p class="m-0">Торги начались</p>
      </div>
  
      <div v-if="visibleOff" class="toast-notification-off m-0">
        <p class="m-0">Торги завершились</p>
      </div>
  
      <div v-for="(broker, index) in brokers" :key="index">
        <div class="card p-4">
          <div>
            <h2>Имя брокера: <span class="fw-bold">{{ broker.name }}</span></h2>
            <p class="fs-3">
              Баланс:
              <span class="fs-4 text-success fw-bold">
                {{ broker.balance.toLocaleString('en-US') }} $
              </span>
            </p>
          </div>
          <div>
            <h3>Акции в наличии</h3>
            <div v-for="(stock, index) in broker.stocks" :key="index" class="row mb-3">
              <div class="col-12">

                <div class="card p-3">
                  <h5 class="card-title pb-1">{{ stock.label }}</h5>
                  <p class="card-text">Количество: {{ stock.amount }}</p>
                  <p class="card-text">Цена одной акции: {{ stock.price.toLocaleString('en-US') }} $</p>
                  <p class="card-text">На момент: {{ stock.date_buy }}</p>
                  <p class="card-text">
                    Общая стоимость: {{ (stock.amount * stock.price).toLocaleString('en-US') }} $
                  </p>
                  <p v-if="!isStartTrading" class="card-text">Торги не начались!</p>
                  <p v-if="isStartTrading" class="card-text">
                    <p v-if="checkInTrading(stock.label)">Выгода: {{ (startBalanceBroker[broker.id][stock.label] - (stock.price * stock.amount)).toLocaleString('en-US') }} $ </p>
                    <p v-if="!checkInTrading(stock.label)">Данная акция не участвует в торгах</p>
                  </p>
                </div>

                


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup>
import { ref } from 'vue';
import { BASE_API } from '../constants';
import Navigation from './Navigation.vue';
import axios from 'axios';
import { io } from 'socket.io-client';

const isStartTrading = ref(false);
const brokers = ref([]);
let stocksList;
const visible = ref(false);
const visibleOff = ref(false);
const currentDate = ref(null);
let pricesList;
let lastStatePrices;
let startBalanceBroker = {};



const getBrokersData = async () => {
  const response = await axios.get(BASE_API + 'list-brokers');
  for (let broker of response.data) {
    if (!(broker.id in startBalanceBroker)) {
        startBalanceBroker[broker.id] = [];
    }
    for (let stock of broker.stocks) {
      startBalanceBroker[broker.id][stock.label] = stock.price * stock.amount
    }
  }
  brokers.value = response.data;
};

const checkInTrading = (label) => {
    for (let obj of stocksList) {
        if (obj == label)
            return true
    }
    return false
}

const getPrice = (label) => {
    for (let stock in pricesList) {
        if (stock == label)
            return pricesList[stock]
    }
}

const socket = io('http://localhost:4001', { transports: ['websocket'] });
socket.emit('connectAdminClient');

socket.on('startTrading', (data) => {
  console.log('Торги начались!');
  isStartTrading.value = true;
  
  stocksList = data.stocksList.split(',');
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, 3000);
});


socket.on('closeTrading', () => {
  console.log('Торги завершились!');
  isStartTrading.value = false;
  visibleOff.value = true;
  setTimeout(() => {
    visibleOff.value = false;
  }, 3000);
});


socket.on('tradeUpdate', (data) => {
  if (isStartTrading.value == false) {
    stocksList = Object.keys(data.stockPrices)
    isStartTrading.value = true
  }
    
  console.log(data);
  currentDate.value = data.currentDate

  if (Object.keys(data.stockPrices).length != 0) {
    pricesList = data.stockPrices
    lastStatePrices = data.stockPrices
  } else {
    pricesList = lastStatePrices
  }
  for (let broker of brokers.value) {
    for (let stock of broker.stocks) {
        if (checkInTrading(stock.label)) {
            if (pricesList)
                stock.price = getPrice(stock.label)
            stock.date_buy = currentDate.value
        }
    }
  }
    
});

getBrokersData();
</script>

  
  <style scoped>
  .toast-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px;
    background-color: #28a745;
    color: #fff;
    border-radius: 8px;
    animation: fadeIn 0.5s ease-out;
  }
  
  .toast-notification-off {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px;
    background-color: #ff0000;
    color: #fff;
    border-radius: 8px;
    animation: fadeIn 0.5s ease-out;
  }
  </style>
  