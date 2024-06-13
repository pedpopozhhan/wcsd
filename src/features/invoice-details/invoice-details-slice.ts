import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IDetailsTableRow } from './details-table-row.interface';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';
import IOtherCostDropDownLists from '@/interfaces/invoice-details/other-cost-drop-down-lists';

export interface IInvoiceDetailsSliceState {
  rowData: IDetailsTableRow[];
  otherCostData: IOtherCostTableRowData[];
  flightReportIds: number[];
  rateTypes: string[];
  lists: IOtherCostDropDownLists;
}

const initialState: IInvoiceDetailsSliceState = {
  rowData: [],
  otherCostData: [],
  flightReportIds: [],
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
    setRowData: (state, action: PayloadAction<IDetailsTableRow[]>) => {
      state.rowData = action.payload;
    },
    setFlightReportIds: (state, action: PayloadAction<number[]>) => {
      state.flightReportIds = action.payload;
    },
    setOtherCostData: (state, action: PayloadAction<IOtherCostTableRowData[]>) => {
      state.otherCostData = action.payload;
    },
    setRateTypes: (state: IInvoiceDetailsSliceState, action: PayloadAction<string[]>) => {
      state.rateTypes = action.payload;
    },
    resetInvoiceDetails: (state) => {
      state.rowData = [];
      state.otherCostData = [];
    },
    setLists: (state: IInvoiceDetailsSliceState, action: PayloadAction<IOtherCostDropDownLists>) => {
      state.lists = action.payload;
    },
  },
});

export const { setRowData, setOtherCostData, setRateTypes, setFlightReportIds, resetInvoiceDetails, setLists } = invoiceDetailsSlice.actions;
const invoiceDetailsReducer = invoiceDetailsSlice.reducer;
export default invoiceDetailsReducer;
