import { configureStore } from '@reduxjs/toolkit';
import brokerReducer from '../slices/brokerSlice'
import stokeReducer from '../slices/stockSlice'


export const store = configureStore({
    reducer: {
        brokers: brokerReducer,
        stocks: stokeReducer
    }
});

export default store;