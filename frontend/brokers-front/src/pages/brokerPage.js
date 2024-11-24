import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BrokerService from '../services/brokerService';
import { removeBroker, addArrBrokers, addBroker } from '../slices/brokerSlice';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './brokerPage.css'

const BrokerPage = () => {
  const dispatch = useDispatch();
  const brokers = useSelector((state) => state.brokers.brokers);
  const [newBroker, setNewBroker] = useState({ name: '', balance: '' });
  const [changeBroker, setChangeBroker] = useState({ name: '', balance: '' });
  const [editingBroker, setEditingBroker] = useState(null);

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const brokersData = await BrokerService.getBrokers();
        dispatch(addArrBrokers(brokersData));
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      }
    };
    fetchBrokers();
  }, [dispatch]);

  const handleDeleteBroker = async (id) => {
    try {
      const result = await BrokerService.deleteBroker(id);
      if (result) {
        dispatch(removeBroker(id));
      }
    } catch (error) {
      console.error('Ошибка удаления брокера:', error);
    }
  };

  const handleEditBroker = (broker) => {
    setEditingBroker(broker);
    setChangeBroker({ name: changeBroker.name, balance: changeBroker.balance });
  };

  const handleSaveBroker = async () => {
    try {
      if (editingBroker) {
        await BrokerService.updateBroker(editingBroker.id, newBroker);
        dispatch(removeBroker(editingBroker.id)); 
        dispatch(addArrBrokers([newBroker])); 
        setEditingBroker(null);
      }
    } catch (error) {
      console.error('Ошибка сохранения брокера:', error);
    }
  };

  const handleAddBroker = async () => {
    console.log(brokers)
    try {
      const addedBroker = await BrokerService.addBroker(newBroker);
      if (addedBroker) {
        dispatch(addBroker(newBroker));
        setNewBroker({ name: '', balance: '' });
      } else {
        console.error(addedBroker)
      }
    } catch (error) {
      console.error('Ошибка добавления брокера:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Список брокеров</h2>
      <div className="mb-4">
        <h4>Добавить нового брокера</h4>
        <div className="mb-2">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Имя брокера"
            value={newBroker.name}
            onChange={(e) => setNewBroker({ ...newBroker, name: e.target.value })}
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Баланс"
            value={newBroker.balance}
            onChange={(e) => setNewBroker({ ...newBroker, balance: e.target.value })}
          />
          <button className="btn btn-primary" onClick={handleAddBroker}>Добавить брокера</button>
        </div>
      </div>

      {brokers.length > 0 ? (
        <div className="list-group">
          {brokers.map((broker, index) => (
            <div className="list-group-item d-flex justify-content-between align-items-center" key={broker.id || index}>
              <div>
                <strong>{broker.name}</strong> - Баланс: {broker.balance} $
              </div>
              <div>
                <button 
                  className="btn btn-warning btn-sm custom-margin"
                  onClick={() => handleEditBroker(broker)}>
                  Изменить
                </button>
                <button 
                  className="btn btn-danger btn-sm ml-4"
                  onClick={() => handleDeleteBroker(broker.id)}>
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">Брокеров не найдено!</div>
      )}

      {editingBroker && (
        <div className="mt-4">
          <h4>Редактировать брокера</h4>
          <div className="mb-2">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Имя брокера"
              value={editingBroker.name}
              onChange={(e) => setChangeBroker({ ...changeBroker, name: e.target.value })}
            />
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Баланс"
              value={editingBroker.balance}
              onChange={(e) => setChangeBroker({ ...changeBroker, balance: e.target.value })}
            />
            <button className="btn btn-success custom-margin" onClick={handleSaveBroker}>Сохранить изменения</button>
            <button className="btn btn-secondary ml-2" onClick={() => setEditingBroker(null)}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrokerPage;
