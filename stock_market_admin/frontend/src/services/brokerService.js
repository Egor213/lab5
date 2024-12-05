import axios from 'axios';
import { API_URL } from '../constants';

const BrokerService = {
  getBrokers: async () => {
    const response = await axios.get(API_URL + '/list-brokers/');
    return response.data;
  },

  deleteBroker: async (id) => {
    const response = await axios.post(API_URL + `/list-brokers/delete/${id}`);
    return response.data;
  },
  
  addBroker: async(newBroker) => {
    newBroker.balance = parseInt(newBroker.balance)
    const response = await axios.post(API_URL + `/list-brokers/create`, newBroker);
    return response.data;
  },

  updateBroker: async(id, data) => {
    const response = await axios.put(API_URL + `/list-brokers/update-broker/${id}`, data);
    return response.data
  }

 
};

export default BrokerService;
