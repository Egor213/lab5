import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stocks: [],
};

const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    setAllStocks(state, action) {
      state.stocks = action.payload; 
    },
    toggleStockSelection(state, action) {
      const stock = state.stocks.find(stock => stock.id == action.payload);
      if (stock) {
        stock.selected = !stock.selected;
      }
    }
  }
});

export const { setAllStocks, toggleStockSelection } = stockSlice.actions;
export default stockSlice.reducer;

