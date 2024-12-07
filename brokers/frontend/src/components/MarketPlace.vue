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
        <span class="fs-5">{{ broker.balance.toLocaleString('en-US') }} $</span>
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
                        <th scope="col">Количество</th>
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
                            <td>{{ getCountStocks(label) }}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-outline-secondary me-1" @click="openChartModal(label)">График</button>
                                <button class="btn btn-sm btn-outline-primary me-1" @click="openBuyModal(label, price, currentDate)">Купить</button>
                                <button class="btn btn-sm btn-outline-danger" @click="openSellModal(label, price)">Продать</button>
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
    </div>



        <!-- Модальное окно для покупки акции -->
        <div v-if="showBuyModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Покупка акции: {{ selectedStockLabel }}</h5>
            <button type="button" class="btn-close" @click="closeModal('buy')"></button>
          </div>
          <div class="modal-body">
            <p>Текущая цена: {{ selectedStockPrice }} $</p>
            <div class="mb-3">
              <label for="amount" class="form-label">Количество</label>
              <input v-model="buyAmount" type="number" id="amount" class="form-control" min="1" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal('buy')">Закрыть</button>
            <button type="button" class="btn btn-primary" @click="buyStockAction">Купить</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для продажи акции -->
    <div v-if="showSellModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Продажа акции: {{ selectedStockLabel }}</h5>
            <button type="button" class="btn-close" @click="closeModal('sell')"></button>
          </div>
          <div class="modal-body">
            <p>Текущая цена: {{ selectedStockPrice }} $</p>
            <div class="mb-3">
              <label for="amount" class="form-label">Количество</label>
              <input v-model="sellAmount" type="number" id="amount" class="form-control" min="1" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal('sell')">Закрыть</button>
            <button type="button" class="btn btn-danger" @click="sellStockAction">Продать</button>
          </div>
        </div>
      </div>
    </div>


     <!-- Модальное окно для графика -->
     <div v-if="showChartModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">График акции: {{ selectedStockLabel }}</h5>
            <button type="button" class="btn-close" @click="closeModal('chart')"></button>
          </div>
          <div class="modal-body">
            <div class="chart-placeholder">
              <canvas ref="chartCanvas"></canvas>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal('chart')">Закрыть</button>
          </div>
        </div>
      </div>
    </div>

  </template>
  
<script setup>
import { nextTick, onUnmounted, ref } from "vue";
import Navigation from "./Navigation.vue";
import axios from "axios";
import { BASE_API } from "../constants";
import { io } from "socket.io-client";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  LineController,
} from 'chart.js';
const selectedStock = ref(true)
const startTrading = ref(false)
const loaded = ref(true)
const currentDate = ref(null);
const stocks = ref(null)
const chartInstance = ref(null);

let startBalanceBroker;
const broker = ref(null);

const getCountStocks = (label) => {
    for (let obj of broker.value.stocks) {
        if (obj.label == label) {
            return obj.amount
        }
    }
    return 0
}

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
  currentDate.value = data.currentDate
});

onUnmounted(() => {
  console.log('Отключение от сокета');
  socket.disconnect();
});


const selectedStockLabel = ref("");
const selectedStockPrice = ref(0);
const selectedStockDate = ref(null)
const buyAmount = ref(0);
const sellAmount = ref(0);
const showBuyModal = ref(false);
const showSellModal = ref(false);
const showChartModal = ref(false)

const openBuyModal = (label, price, date) => {
  selectedStockLabel.value = label;
  selectedStockPrice.value = price;
  selectedStockDate.value = date;
  buyAmount.value = 0;
  showBuyModal.value = true;
};

const openSellModal = (label, price) => {
  selectedStockLabel.value = label;
  selectedStockPrice.value = price;
  sellAmount.value = 0;
  showSellModal.value = true;
};

const closeModal = (type) => {
  if (type == 'buy') {
    showBuyModal.value = false;
  } else if (type == 'chart') {
    showChartModal.value = false;
    if (chartInstance.value) {
      chartInstance.value.destroy();  
    }
  } else {
    showSellModal.value = false;
  }
};

const buyStockAction = async () => {
    const cost = buyAmount.value * selectedStockPrice.value
    if ( buyAmount.value <= 0) {
        alert("Количество меньше или равно нулю!")
        return
    }
    const balanceDifference = broker.value.balance - cost;
    if (cost > broker.value.balance) {
        alert(`Недостаточно средств на балансе! Ваш баланс: ${broker.value.balance} $, недостающая сумма: ${Math.abs(balanceDifference)} $`);
    } else {
        const data = {
            label: selectedStockLabel.value,
            amount: parseInt(getCountStocks(selectedStockLabel.value)) + parseInt(buyAmount.value),
            price: selectedStockPrice.value,
            date_buy: selectedStockDate.value
        }
        broker.value.balance = balanceDifference
        const id = localStorage.getItem('user')
        const result1 = await axios.put(BASE_API + 'list-brokers/update-balance/' + id + '?balance=' + balanceDifference)
        const result2 = await axios.put(BASE_API + 'list-brokers/update-stock/' + id, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer your-token'
                }
            })
        

        let isFound = false
        for (let obj of broker.value.stocks) {
            if (obj.label == selectedStockLabel.value) {
                isFound = true
                obj.amount = parseInt(getCountStocks(selectedStockLabel.value)) + parseInt(buyAmount.value)
                obj.price = selectedStockPrice.value
            }
        }
        if (!isFound) {
            broker.value.stocks.push({
                label: selectedStockLabel.value,
                amount: parseInt(getCountStocks(selectedStockLabel.value)) + parseInt(buyAmount.value),
                price: selectedStockPrice.value,
                date_buy: selectedStockDate.value
            })
        }
        closeModal('buy'); 
    }
};

const sellStockAction = () => {
  console.log(`Продано: ${sellAmount.value} акций ${selectedStockLabel.value} по цене ${selectedStockPrice.value}`);
  // Добавить логику продажи акции
  closeModal('sell');
};




Chart.register(Title, Tooltip, Legend, LineController, LineElement, PointElement, CategoryScale, LinearScale);
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
  