import React from 'react';
import ReactDOM from 'react-dom/client'; 
import { Provider } from 'react-redux';
import { store } from './stores/brokerStore';
import App from "./App";
import { Router } from './router';

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
    <Provider store={store}>
        <Router />
        <App />
    </Provider>
    
);
