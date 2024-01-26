import { createSlice } from '@reduxjs/toolkit';
import { IInvoiceData } from './common/invoice-modal-dialog';

export interface IAppSliceState {
  timeReportsToReconcile: number[];
  invoiceData: IInvoiceData;
}

const initialState: IAppSliceState = {
  timeReportsToReconcile: [],
  invoiceData: null as any,
};

export const appSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setTimeReportsToReconcile: (state, action) => {
      state.timeReportsToReconcile += action.payload;
    },
  },
});
export const timeReportsToReconcile = (state: IAppSliceState) =>
  state.timeReportsToReconcile;
export const { setTimeReportsToReconcile } = appSlice.actions;

const appReducer = appSlice.reducer;
export default appReducer;
