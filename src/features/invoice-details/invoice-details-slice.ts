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

const setRateTypesReducer = (state: IInvoiceDetailsSliceState, action: PayloadAction<string[]>) => {
  const allowedRateTypes = [
    'Accommodation',
    'Airport Fee',
    'Basing',
    'Basing Non-Core',
    'Basing Penalty',
    'Charter Minimums',
    'Crew Exp - Breakfast',
    'Crew Exp - Lunch',
    'Crew Exp - Dinner',
    'Crew Expenses',
    'Double Crew',
    'Flat',
    'Fuel',
    'Landing Fee',
    'Nav Canada',
    'Passenger Fee',
    'Standby',
    'Vehicle Rental',
  ];
  const filtered = action.payload.filter((x) => allowedRateTypes.includes(x));
  state.rateTypes = filtered;
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
    setRateTypes: setRateTypesReducer,
  },
});

export const { setRowData, setOtherCostData, setRateTypes, initializeRowData } = invoiceDetailsSlice.actions;
const invoiceDetailsReducer = invoiceDetailsSlice.reducer;
export default invoiceDetailsReducer;
