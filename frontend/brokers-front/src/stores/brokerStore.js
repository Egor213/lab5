import { configureStore } from '@reduxjs/toolkit';
import brokerReducer from '../slices/brokerSlice' 


export const store = configureStore({
    reducer: {
        brokers: brokerReducer,
    }
});

export default store;