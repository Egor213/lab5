import React, { useState, useEffect } from 'react';
import io from "socket.io-client";
import { useSelector } from 'react-redux';


const BiddingPage = () => {
  const [currentDate, setCurrentDate] = useState('Не начато');
  const [stockPrices, setStockPrices] = useState({});
  const [startDate, setStartDate] = useState('');
  const [tradeSpeed, setTradeSpeed] = useState(1);
  const [isTrading, setIsTrading] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setStockPrices(loadStartStocks())
    const newSocket = io("http://localhost:4001", { transports: ['websocket'] });
    setSocket(newSocket);
    newSocket.on('tradeUpdate', (data) => {
        console.log(data)
        if (Object.keys(data.stockPrices).length != 0) {
            setStockPrices(data.stockPrices);
        }
        setCurrentDate(data.currentDate);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleCloseTrading = () => {
    socket?.emit('closeTrading');
    setIsTrading(false);
  }

  const loadStartStocks = () => {
    if ('stocks' in localStorage) {
        const data = (localStorage['stocks']).split(',')
        let temp = {}
        for (let obj of data) {
            temp[obj] = null
        }
        return temp
      }
      return {}
  }

  const handleStartTrading = () => {
    if (!startDate || tradeSpeed <= 0) {
      alert('Пожалуйста, укажите дату начала торгов и скорость смены дат.');
      return;
    }
    const minDate = new Date('2023-11-24');
    const maxDate = new Date('2024-11-24');
    const curDate = new Date(startDate);
    if (curDate < minDate || curDate > maxDate) {
      alert('min: 2023-11-24, max: 2024-11-24 date');
      return;
    }
    if (!('stocks' in localStorage)) {
      alert("Вы не выбрали акции!");
      return;
    }
    let stocksList = localStorage['stocks']
    setIsTrading(true);
    socket?.emit('startTrading', {
      startDate,
      tradeSpeed,
      stocksList,
    });
  };

  return (
    <div className="container mt-4">
      <h2>Настройки биржи</h2>
      <div className="form-group">
        <label htmlFor="startDate" className='mt-3 mb-2'>Дата начала торгов:</label>
        <input 
          type="date" 
          className="form-control" 
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min="2023-11-24"
          max="2024-11-22" 
        />
      </div>
      <div className="form-group">
        <label htmlFor="tradeSpeed" className='mt-3 mb-2'>Скорость смены дат (секунды):</label>
        <input 
          type="number" 
          className="form-control" 
          id="tradeSpeed"
          value={tradeSpeed}
          onChange={(e) => setTradeSpeed(e.target.value)}
          min="1"
        />
      </div>
      <button 
        className="btn btn-success mt-3"
        onClick={handleStartTrading}
        disabled={isTrading}
      >
        {isTrading ? 'Торговля началась' : 'Начало торгов'}
      </button>
      <span>
     
        <button 
        className="btn btn-info mt-3 mx-3"
        onClick={handleCloseTrading}
        disabled={!isTrading}
      >
        Завершить торги
      </button>
      
      </span>

      <h3 className="mt-4">Текущая дата торгов: <span>{currentDate}</span></h3>
      
      <h4>Текущие стоимости акций:</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Акция</th>
            <th>Цена</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(stockPrices).map((stock, index) => (
            <tr key={index}>
              <td>{stock}</td>
              <td>{stockPrices[stock]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BiddingPage;
