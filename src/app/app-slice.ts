import { IInvoiceData } from '@/common/invoice-modal-dialog';
import { IContractSearchResult } from '@/interfaces/contracts/contract-search-result';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface IAppSliceState {
  invoiceChanged: boolean;
  timeReportsToReconcile: number[];
  invoiceData: IInvoiceData;
  contractForReconciliation: IContractSearchResult;
}

const initialState: IAppSliceState = {
  invoiceChanged: false,
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
      state.invoiceChanged = false;
      state.invoiceData = action.payload;
    },
    setContractForReconciliation: (state, action: PayloadAction<IContractSearchResult>) => {
      state.contractForReconciliation = action.payload;
    },
    setServiceSheetName: (state, action: PayloadAction<string>) => {
      if (state.invoiceData.UniqueServiceSheetName !== action.payload) {
        state.invoiceChanged = true;
      }
      state.invoiceData = { ...state.invoiceData, UniqueServiceSheetName: action.payload };
    },
    setInvoiceChanged: (state, action: PayloadAction<boolean>) => {
      state.invoiceChanged = action.payload;
    },
    setInvoiceId: (state, action: PayloadAction<string>) => {
      state.invoiceData = { ...state.invoiceData, InvoiceID: action.payload };
    },
  },
});

// exports
export const timeReportsToReconcile = (state: IAppSliceState) => state.timeReportsToReconcile;
export const { setTimeReportsToReconcile, setInvoiceData, setContractForReconciliation, setServiceSheetName, setInvoiceId, setInvoiceChanged } =
  appSlice.actions;

export default appSlice.reducer;
