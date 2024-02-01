import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IDetailsTableRow } from './details-table-row.interface';
import { IOtherCostTableRowData } from '@/interfaces/invoice-details/other-cost-table-row-data';

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
  // TODO: this is for the next bug once it is unblocked
  //   const allowedRateTypes = [
  //     'Accommodation',
  //     'Airport Fee',
  //     'Basing',
  //     'Basing Non-Core',
  //     'Basing Penalty',
  //     'Charter Minimums',
  //     'Crew Exp - Breakfast',
  //     'Crew Exp - Lunch',
  //     'Crew Exp - Dinner',
  //     'Crew Expenses',
  //     'Double Crew',
  //     'Flat',
  //     'Fuel',
  //     'Landing Fee',
  //     'Nav Canada',
  //     'Passenger Fee',
  //     'Standby',
  //     'Vehicle Rental',
  //   ];
  //   const filtered = action.payload.filter((x) => allowedRateTypes.includes(x));
  //   state.rateTypes = filtered;

  state.rateTypes = action.payload;
};

export const invoiceDetailsSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setRowData: (state, action: PayloadAction<IDetailsTableRow[]>) => {
      state.rowData = action.payload;
    },
    setOtherCostData: (state, action: PayloadAction<IOtherCostTableRowData[]>) => {
      state.otherCostData = action.payload;
    },
    setRateTypes: setRateTypesReducer,
  },
});

export const { setRowData, setOtherCostData, setRateTypes } = invoiceDetailsSlice.actions;
const invoiceDetailsReducer = invoiceDetailsSlice.reducer;
export default invoiceDetailsReducer;
/*Accommodation

Airport Fee

Basing

Basing Non-Core

Basing Penalty

Charter Minimums

Crew Exp - Breakfast

Crew Exp - Lunch

Crew Exp - Dinner

Crew Expenses

Double Crew

Flat

Fuel

Landing Fee

Nav Canada

Passenger Fee

Standby

Vehicle Rental*/
