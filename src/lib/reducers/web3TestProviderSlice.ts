import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RegisteredSubscription } from 'web3-eth';
import Web3 from 'web3';

interface Web3ProviderState {
  value: Web3<RegisteredSubscription> | undefined;
}

const initialState: Web3ProviderState = {
  value: undefined
};

export const web3TestProviderSlice = createSlice({
  name: 'web3TestProvider',
  initialState,
  reducers: {
    reset: state => {
      state.value = undefined
    },
    setProvider: (state, action: PayloadAction<any>) => {
      state.value = action.payload
    },
  }
})

export const _web3TestProvider = web3TestProviderSlice.actions;
export default web3TestProviderSlice.reducer;