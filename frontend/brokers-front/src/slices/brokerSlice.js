import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brokers: [],
};

const brokerSlice = createSlice({
  name: 'brokers',
  initialState,
  reducers: {
    setBrokers(state, action) {
      state.brokers = action.payload;
    },
    addArrBrokers(state, action) {
      for (let user of action.payload)
        state.brokers.push(user);
    },
    addBroker(state, action) {
      state.brokers.push(action.payload);
    },
    updateBroker(state, action) {
      const index = state.brokers.findIndex(broker => broker.id == action.payload.id);
      if (index !== -1) {
        state.brokers[index] = action.payload;
      }
    },
    removeBroker(state, action) {
      state.brokers = state.brokers.filter(broker => broker.id != action.payload);
    }
  }
});

export const { setBrokers, addBroker, updateBroker, removeBroker, addArrBrokers } = brokerSlice.actions;
export default brokerSlice.reducer;
