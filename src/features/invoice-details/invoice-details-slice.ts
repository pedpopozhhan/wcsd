import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';
import IOtherCostDropDownLists from '@/interfaces/invoice-details/other-cost-drop-down-lists';
import { navigateTo } from '@/common/navigate';

export interface IInvoiceDetailsSliceState {
  rateTypes: string[];
  lists: IOtherCostDropDownLists;
}

const initialState: IInvoiceDetailsSliceState = {
  rateTypes: [],
  lists: null,
};

export interface IInitializeRowDataPayload {
  data: ITimeReportDetailsTableRowData[];
  selectedIds: number[];
}
export const invoiceDetailsSlice = createSlice({
  name: 'invoiceDetailsSlice',
  initialState,
  reducers: {
    setRateTypes: (state: IInvoiceDetailsSliceState, action: PayloadAction<string[]>) => {
      state.rateTypes = action.payload;
    },
    setLists: (state: IInvoiceDetailsSliceState, action: PayloadAction<IOtherCostDropDownLists>) => {
      state.lists = action.payload;
    },
    deleteDraftInvoiceSuccess: (state, action: PayloadAction<{ contractNumber: string }>) => {
      navigateTo(`/invoicing/invoice-processing/${action.payload.contractNumber}`);
    },
  },
});

export const { setRateTypes, setLists, deleteDraftInvoiceSuccess } = invoiceDetailsSlice.actions;
const invoiceDetailsReducer = invoiceDetailsSlice.reducer;
export default invoiceDetailsReducer;
