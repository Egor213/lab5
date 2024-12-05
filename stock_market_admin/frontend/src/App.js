import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/homePage'
import BrokerPage from './pages/brokerPage'
import StockPage from './pages/stockPage'
import BiddingPage from "./pages/biddingPage";

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <HomePage/>
        },
        {
          path: '/brokers',
          element: <BrokerPage/>
        },
        {
          path: '/stock',
          element: <StockPage/>
        },
        {
          path: '/bidding',
          element: <BiddingPage/>
        }
    ])
    return (
        <div className="App">
            <RouterProvider router={router}/>
        </div>
    );
}

export default App;