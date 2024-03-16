// import { IServiceSheetData } from '@/interfaces/common/service-sheet-data';
import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IProcessInvoiceTabsDataSliceState {
  costDetailsData: ITimeReportDetailsTableRowData[];
  otherCostsData: IOtherCostTableRowData[];
  nameChanged: boolean;
  invoiceNumber: string;
  invoiceAmount: number;
}

const initialState: IProcessInvoiceTabsDataSliceState = {
  costDetailsData: [],
  otherCostsData: [],
  nameChanged: false,
  invoiceNumber: '',
  invoiceAmount: 0,
};

export const processInvoiceTabsSlice = createSlice({
  name: 'sliceProcessInvoiceTabs',
  initialState,
  reducers: {
    setcostDetailsData: (state, action: PayloadAction<ITimeReportDetailsTableRowData[]>) => {
      state.costDetailsData = action.payload;
    },
    setotherCostsData: (state, action: PayloadAction<IOtherCostTableRowData[]>) => {
      state.otherCostsData = action.payload;
    },

    setInvoiceNumber: (state, action: PayloadAction<string>) => {
      state.invoiceNumber = action.payload;
    },
    setInvoiceAmount: (state, action: PayloadAction<number>) => {
      state.invoiceAmount = action.payload;
    },

    resetState: (state) => {
      state.costDetailsData = [];
      state.otherCostsData = [];
      state.invoiceNumber = '';
      state.invoiceAmount = 0;
    },
  },
});

export const { setcostDetailsData, setotherCostsData, setInvoiceNumber, setInvoiceAmount, resetState } = processInvoiceTabsSlice.actions;
const processInvoiceTabsSliceReducer = processInvoiceTabsSlice.reducer;
export default processInvoiceTabsSliceReducer;
