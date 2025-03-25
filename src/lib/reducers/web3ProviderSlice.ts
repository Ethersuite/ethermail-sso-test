import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BrowserProvider } from "ethers";

interface Web3ProviderState {
  value: BrowserProvider | undefined;
}

const initialState: Web3ProviderState = {
  value: undefined
};

export const web3ProviderSlice = createSlice({
  name: 'web3Provider',
  initialState,
  reducers: {
    reset: state => {
      state.value = undefined
    },
    setProvider: (state, action: PayloadAction<BrowserProvider>) => {
      state.value = action.payload
    },
  }
})

export const _web3Provider = web3ProviderSlice.actions;
export default web3ProviderSlice.reducer;