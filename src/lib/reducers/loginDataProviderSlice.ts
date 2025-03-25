import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EthermailLoginData } from "@/intefaces/ethermail.interfaces";

interface LoginDataState {
  value: EthermailLoginData | undefined;
}

const initialState: LoginDataState = {
  value: undefined
};

export const loginDataProviderSlice = createSlice({
  name: 'loginData',
  initialState,
  reducers: {
    reset: state => {
      state.value = undefined
    },
    setData: (state, action: PayloadAction<EthermailLoginData>) => {
      state.value = action.payload
    },
  }
})

export const _loginDataProvider = loginDataProviderSlice.actions;
export default loginDataProviderSlice.reducer;