<template>
    <div class="container py-4">
      <Navigation />
      <div class="card p-4" v-if="broker">
        <h1 class="text-center mb-4">Профиль</h1>
        <div>
          <h2>Имя брокера: <span class="fw-bold">{{ broker.name }}</span></h2>
          <p class="fs-3 ">Баланс: <span class="fs-4 text-success fw-bold"> {{ broker.balance.toLocaleString('en-US') }}  $</span></p>
          <p class="fs-3 ">Стоимость всех акции: <span class="fs-4 text-success fw-bold"> {{ broker.priceStocks().toLocaleString('en-US') }}  $</span></p>
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
                <p class="card-text">Общая стоимость: {{ (stock.amount * stock.price).toLocaleString('en-US')}} $</p>
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


const broker = ref(null);

const getBrokerData = async () => {
    const id = localStorage.getItem('user')
    const response = await axios.get(BASE_API + 'list-brokers/' + id);
    broker.value = response.data
    broker.value.priceStocks = () => {
        let all_sum = 0
        for (let stock of response.data.stocks) {
            all_sum += stock.price * stock.amount
        }
        return all_sum
    }
    console.log(broker)
}


getBrokerData();



</script>
  
