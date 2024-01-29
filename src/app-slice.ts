import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IInvoiceData } from './common/invoice-modal-dialog';
import { IContractSearchResult } from './interfaces/reconciliation/contract-search-result';

export interface IAppSliceState {
  timeReportsToReconcile: number[];
  invoiceData: IInvoiceData;
  vendorForReconciliation: IContractSearchResult;
}

const initialState: IAppSliceState = {
  timeReportsToReconcile: [],
  invoiceData: null as any,
  vendorForReconciliation: null as any,
};

export const appSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setTimeReportsToReconcile: (state, action: PayloadAction<number[]>) => {
      state.timeReportsToReconcile = action.payload;
    },
    setInvoiceData: {
      reducer(state, action: PayloadAction<IInvoiceData>) {
        state.invoiceData = action.payload;
      },
      prepare(value: IInvoiceData) {
        return {
          payload: {
            ...value,
            // DateOnInvoice: value.DateOnInvoice.toISOString(),
            // PeriodEnding: value.PeriodEnding.toISOString(),
            // InvoiceReceived: value.InvoiceReceived.toISOString()
          },
        };
      },
    },

    // (state, action: PayloadAction<IInvoiceData>) => {
    //   state.invoiceData = action.payload;
    // },
    setVendorForReconciliation: (state, action: PayloadAction<IContractSearchResult>) => {
      state.vendorForReconciliation = action.payload;
    },
  },
});

// exports
export const timeReportsToReconcile = (state: IAppSliceState) => state.timeReportsToReconcile;
export const { setTimeReportsToReconcile, setInvoiceData, setVendorForReconciliation } = appSlice.actions;

export default appSlice.reducer;
