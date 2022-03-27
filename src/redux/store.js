import { configureStore } from '@reduxjs/toolkit'
import leBluetoothSlice from './reducers/leBluetoothSlice'
import adjustComponentSlice from './reducers/adjustComponentSlice'
import ListComponentSlice from './reducers/ListComponentSlice'

export default configureStore({
  reducer: {
    leBluetooth: leBluetoothSlice,
    adjustComponent: adjustComponentSlice,
    ListComponent: ListComponentSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
})