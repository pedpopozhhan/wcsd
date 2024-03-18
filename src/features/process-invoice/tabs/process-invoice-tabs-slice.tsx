import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IDetailsTableRow } from '@/features/invoice-details/details-table-row.interface';

interface IProcessInvoiceTabsDataSliceState {
  costDetailsData: ITimeReportDetailsTableRowData[];
  otherCostsData: IOtherCostTableRowData[];
  timeReportData: IDetailsTableRow[];
  nameChanged: boolean;
  invoiceNumber: string;
  invoiceAmount: number;
}

const initialState: IProcessInvoiceTabsDataSliceState = {
  costDetailsData: [],
  otherCostsData: [],
  timeReportData: [],
  nameChanged: false,
  invoiceNumber: '',
  invoiceAmount: 0,
};

export const processInvoiceTabsSlice = createSlice({
  name: 'sliceProcessInvoiceTabs',
  initialState,
  reducers: {
    setCostDetailsData: (state, action: PayloadAction<ITimeReportDetailsTableRowData[]>) => {
      state.costDetailsData = action.payload;
    },
    setOtherCostsData: (state, action: PayloadAction<IOtherCostTableRowData[]>) => {
      state.otherCostsData = action.payload;
    },
    setTimeReportData: (state, action: PayloadAction<IDetailsTableRow[]>) => {
      state.timeReportData = action.payload;
    },

    setInvoiceNumber: (state, action: PayloadAction<string>) => {
      state.invoiceNumber = action.payload;
    },
    setInvoiceAmount: (state, action: PayloadAction<number>) => {
      state.invoiceAmount = action.payload;
    },

    resetState: (state) => {
      state.costDetailsData = [];
      state.timeReportData = [];
      state.otherCostsData = [];
      state.invoiceNumber = '';
      state.invoiceAmount = 0;
    },
  },
});

export const { setCostDetailsData, setOtherCostsData, setTimeReportData, setInvoiceNumber, setInvoiceAmount, resetState } =
  processInvoiceTabsSlice.actions;
const processInvoiceTabsSliceReducer = processInvoiceTabsSlice.reducer;
export default processInvoiceTabsSliceReducer;
