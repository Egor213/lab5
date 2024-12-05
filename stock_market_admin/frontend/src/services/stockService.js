import axios from 'axios';
import { API_URL } from '../constants';

const StockService = {
  getStock: async (id) => {
      const response = await axios.get(API_URL + `/stocks/${id}`)
      return response.data; 
  },

  getAllStocks: async () => {
    const response = await axios.get(API_URL + `/stocks/`)
    return response.data; 
},
};

export default StockService;
