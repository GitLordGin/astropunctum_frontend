import { createSlice } from '@reduxjs/toolkit'

export const leBluetoothSlice = createSlice({
  name: 'leBluetooth',
  initialState: {
    characteristic: null
  },
  reducers: {
    set_characteristic: (state, characteristic) => {
      console.log(characteristic)
      state.characteristic = characteristic.payload
    }
  }
})

export const { set_characteristic } = leBluetoothSlice.actions

export default leBluetoothSlice.reducer