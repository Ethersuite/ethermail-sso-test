import { configureStore } from '@reduxjs/toolkit'
import web3ProviderSlice from "@/lib/reducers/web3ProviderSlice";
import web3TestProviderSlice from "@/lib/reducers/web3TestProviderSlice";
import ethermailProviderSlice from "@/lib/reducers/ethermailProviderSlice";
import loginDataSlice from "@/lib/reducers/loginDataProviderSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      web3Provider: web3ProviderSlice,
      ethermailProvider: ethermailProviderSlice,
      loginData: loginDataSlice,
      web3TestProvider: web3TestProviderSlice
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']