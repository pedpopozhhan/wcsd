import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IInvoiceData } from '../common/invoice-modal-dialog';
import { IContractSearchResult } from '../interfaces/reconciliation/contract-search-result';

export interface IAppSliceState {
  timeReportsToReconcile: number[];
  invoiceData: IInvoiceData;
  contractForReconciliation: IContractSearchResult;
}

const initialState: IAppSliceState = {
  timeReportsToReconcile: [],
  invoiceData: null,
  contractForReconciliation: null,
};
// TODO: I am sure there are patterns to organize reducers and slices, so let's keep that in mind as this grows.
export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTimeReportsToReconcile: (state, action: PayloadAction<number[]>) => {
      state.timeReportsToReconcile = action.payload;
    },
    setInvoiceData: (state, action: PayloadAction<IInvoiceData>) => {
      state.invoiceData = action.payload;
    },
    setContractForReconciliation: (state, action: PayloadAction<IContractSearchResult>) => {
      state.contractForReconciliation = action.payload;
    },
  },
});

// exports
export const timeReportsToReconcile = (state: IAppSliceState) => state.timeReportsToReconcile;
export const { setTimeReportsToReconcile, setInvoiceData, setContractForReconciliation } = appSlice.actions;

export default appSlice.reducer;
