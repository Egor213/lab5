import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StockService from '../services/stockService';
import { setAllStocks, toggleStockSelection } from '../slices/stockSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import './stockPage.css';
import StockChart from './StockChart'; // Импортируем компонент для графика

const StockPage = () => {
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.stocks.stocks);
  const [selectViewTable, setSelectViewTable] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const historyData = await StockService.getAllStocks();
        for (let obj of historyData) obj.selected = false;
        dispatch(setAllStocks(historyData));
      } catch (error) {
        console.error('Ошибка загрузки истории акций:', error);
      }
    };

    fetchStocks();
  }, [dispatch]);

  const handleSelectStock = (id) => {
    dispatch(toggleStockSelection(id));
  };

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    setCurrentPage(1);
  };

  const findIndexById = (id) => {
    for (let obj in stocks) {
      if (stocks[obj].id == id) return obj;
    }
  };

  const changeView = () => {
    setSelectViewTable(!selectViewTable);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderTable = (history) => {
    const totalPages = Math.ceil(history.length / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const currentRecords = history.slice(startIndex, startIndex + recordsPerPage);

    return (
      <div>
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Цена открытия</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((entry, index) => (
              <tr key={index}>
                <td>{entry.Date}</td>
                <td>{entry.Open}</td>
              </tr>
            ))}
          </tbody>
        </table>

     
        <nav>
          <ul className="pagination">
            {[...Array(totalPages).keys()].map((page) => (
              <li
                key={page}
                className={`page-item ${currentPage == page + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(page + 1)}
              >
                <a className="page-link" style={{ cursor: 'pointer' }}>{page + 1}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Список акций</h2>

      <div className="mb-4">
        <h4>Выберите акции для торговли</h4>
        <div className="list-group">
          {stocks.length === 0 ? (
            <div>Нет акций для отображения.</div>
          ) : (
            stocks.map((stock, index) => (
              <div className="list-group-item d-flex justify-content-between align-items-center" key={stock.id || index}>
                <div>
                  <strong>
                    {stock.name} ({stock.label})
                  </strong>
                </div>
                <div>
                  <button
                    className={`btn btn-sm custom-margin ${stock.selected ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => handleSelectStock(stock.id)}
                  >
                    {stock.selected ? 'Отменить выбор' : 'Выбрать'}
                  </button>
                  <button className="btn btn-info btn-sm ml-4" onClick={() => handleStockClick(stock)}>
                    Смотреть историю
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedStock && (
        <div className="mt-4">
          <h4>История курса {selectedStock.name}</h4>
          <div className="history">
            <button
              className={`btn btn-sm custom-margin ${selectViewTable ? 'btn-success' : 'btn-warning'}`}
              onClick={changeView}
            >
              {selectViewTable ? 'Показать в виде графика' : 'Показать в виде таблицы'}
            </button>
            {selectViewTable
              ? renderTable(stocks[findIndexById(selectedStock.id)].history)
              : <StockChart data={stocks[findIndexById(selectedStock.id)].history} name={selectedStock.name} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPage;
