import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IDetailsTableRow } from './details-table-row.interface';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';
import IOtherCostDropDownLists from '@/interfaces/invoice-details/other-cost-drop-down-lists';

export interface IInvoiceDetailsSliceState {
  rowData: IDetailsTableRow[];
  otherCostData: IOtherCostTableRowData[];
  rateTypes: string[];
  lists: IOtherCostDropDownLists;
  flightReportIds: number[];
}

const initialState: IInvoiceDetailsSliceState = {
  rowData: [],
  otherCostData: [],
  rateTypes: [],
  lists: null,
  flightReportIds: [],
};

export const invoiceDetailsSlice = createSlice({
  name: 'invoiceDetailsSlice',
  initialState,
  reducers: {
    initializeRowData: (state, action: PayloadAction<ITimeReportDetailsTableRowData[]>) => {
      const data = action.payload.slice().map((x, i) => {
        return {
          index: i,
          data: x,
          isAdded: false,
          isSelected: false,
        };
      });
      state.rowData = data;
    },
    setRowData: (state, action: PayloadAction<IDetailsTableRow[]>) => {
      state.rowData = action.payload;
    },
    setOtherCostData: (state, action: PayloadAction<IOtherCostTableRowData[]>) => {
      state.otherCostData = action.payload;
    },
    setRateTypes: (state: IInvoiceDetailsSliceState, action: PayloadAction<string[]>) => {
      state.rateTypes = action.payload;
    },
    setFlightReportIds: (state: IInvoiceDetailsSliceState, action: PayloadAction<number[]>) => {
      state.flightReportIds = action.payload;
    },
    resetInvoiceDetails: (state) => {
      state.rowData = [];
      state.otherCostData = [];
      state.flightReportIds = [];
    },
    setLists: (state: IInvoiceDetailsSliceState, action: PayloadAction<IOtherCostDropDownLists>) => {
      state.lists = action.payload;
    },
  },
});

export const { setRowData, setOtherCostData, setRateTypes, initializeRowData, resetInvoiceDetails, setLists, setFlightReportIds } = invoiceDetailsSlice.actions;
const invoiceDetailsReducer = invoiceDetailsSlice.reducer;
export default invoiceDetailsReducer;
