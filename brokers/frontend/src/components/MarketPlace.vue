<template>
    <Navigation />
    <div id="app" class="container mt-5">
      <div class="text-center mb-4">
        <h1 class="display-6">Торговая платформа</h1>
      </div>
  
      <div class="d-flex justify-content-between align-items-center border p-3 rounded bg-light mb-4">
        <span><strong>Текущая дата:</strong></span>
        <span v-if="currentDate">{{ currentDate }}</span>
        <span v-else class="text-muted">Дождитесь начала торгов!</span>
      </div>
  
      <div v-if="broker" class="d-flex justify-content-between align-items-center border p-3 rounded bg-light mb-4">
        <span><strong>Доступные средства:</strong></span>
        <span class="fs-5">{{ broker.balance.toLocaleString('en-US') }} USD</span>
      </div>
  
      <div class="stocks-list">
        <h2 class="mb-3">Список акций</h2>

        <span v-if="loaded">
            <span v-if="startTrading">
                <div class="table-responsive">
                <table class="table table-bordered table-hover">
                    <thead class="table-secondary">
                    <tr>
                        <th scope="col">Название</th>
                        <th scope="col">Текущая цена</th>
                        <th scope="col">Выгода</th>
                        <th scope="col" class="text-center">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="([label, price], index) in Object.entries(stocks)" :key="index">
                            <td>{{ label }}</td>
                            <td>{{ price.toLocaleString('en-US') }} $</td>
                            <td>
                                {{ getBenefit(label, price).toLocaleString('en-US') }} $
                            </td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-outline-secondary me-1" @click="showChart(label)">График</button>
                                <button class="btn btn-sm btn-outline-primary me-1" @click="buyStock(label)">Купить</button>
                                <button class="btn btn-sm btn-outline-danger" @click="sellStock(label)">Продать</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </span>
            <h2 v-else class="text-center">
                Торги завершились!
            </h2>
        </span>

      </div>
  
      <!-- <div v-if="selectedStock" class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">График цены: {{ selectedStock.name }}</h5>
              <button type="button" class="btn-close" @click="closeChart"></button>
            </div>
            <div class="modal-body">
              <div class="chart-placeholder text-center bg-light border rounded py-5">
                [График цены акции]
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeChart">Закрыть</button>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </template>
  
<script setup>
import { onUnmounted, ref } from "vue";
import Navigation from "./Navigation.vue";
import axios from "axios";
import { BASE_API } from "../constants";
import { io } from "socket.io-client";
const selectedStock = ref(true)
const startTrading = ref(false)
const loaded = ref(true)
const currentDate = ref(null);
const stocks = ref(null)


let startBalanceBroker;
const broker = ref(null);

const getBenefit = (label, price) => {
    for (let obj of broker.value.stocks) {
        if (obj.label == label) {
            return price - obj.price
        }
    }
    return 0
}

const getBrokersData = async () => {
    const id = localStorage.getItem("user");
    const response = await axios.get(BASE_API + "list-brokers/" + id);
    startBalanceBroker = response.data.stocks;
    broker.value = response.data;
    console.log(broker.value)
};


const socket = io('http://localhost:4001', { transports: ['websocket'] });
socket.emit('connectAdminClient');

socket.on('closeTrading', async () => {
  console.log('Торги завершились!');
  startTrading.value = false
});


socket.on('tradeUpdate', (data) => {
  console.log(data);
  startTrading.value = true
  stocks.value = data.stockPrices
});

onUnmounted(() => {
  console.log('Отключение от сокета');
  socket.disconnect();
});




getBrokersData();
</script>
  
  <style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
  }
  
  .table th, .table td {
    vertical-align: middle;
  }
  
  .chart-placeholder {
    width: 100%;
    height: 200px;
  }
  
  .modal.fade {
    display: none;
    opacity: 0;
  }
  
  .modal.fade.show {
    display: block;
    opacity: 1;
  }
  </style>
  