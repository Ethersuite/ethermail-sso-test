import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EtherMailProvider } from "@ethermail/ethermail-wallet-provider";

interface EthermailProviderState {
  value: EtherMailProvider | undefined;
}

const initialState: EthermailProviderState = {
  value: undefined
};

export const ethermailProviderSlice = createSlice({
  name: 'ethermailProvider',
  initialState,
  reducers: {
    reset: state => {
      state.value = undefined
    },
    setProvider: (state, action: PayloadAction<EtherMailProvider>) => {
      state.value = action.payload
    },
  }
})

export const _ethermailProvider = ethermailProviderSlice.actions;
export default ethermailProviderSlice.reducer;