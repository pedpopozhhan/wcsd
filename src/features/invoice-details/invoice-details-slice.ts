import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IDetailsTableRow } from './details-table-row.interface';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';

export interface IInvoiceDetailsSliceState {
  rowData: IDetailsTableRow[];
  otherCostData: IOtherCostTableRowData[];
  rateTypes: string[];
}

const initialState: IInvoiceDetailsSliceState = {
  rowData: [],
  otherCostData: [],
  rateTypes: [],
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
    resetInvoiceDetails: (state) => {
      state.rowData = [];
      state.otherCostData = [];
    },
  },
});

export const { setRowData, setOtherCostData, setRateTypes, initializeRowData, resetInvoiceDetails } = invoiceDetailsSlice.actions;
const invoiceDetailsReducer = invoiceDetailsSlice.reducer;
export default invoiceDetailsReducer;
