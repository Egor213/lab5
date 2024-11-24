import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/homePage'
import BrokerPage from './pages/brokerPage'

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <HomePage/>
        },
        {
          path: '/brokers',
          element: <BrokerPage/>
        }
    ])
    return (
        <div className="App">
            <RouterProvider router={router}/>
        </div>
    );
}

export default App;