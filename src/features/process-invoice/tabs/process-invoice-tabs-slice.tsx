import { IServiceSheetData } from "@/interfaces/common/service-sheet-data";
import { ITimeReportDetailsTableRowData } from "@/interfaces/invoice-details/time-report-details-table-row-data";
import { IOtherCostTableRowData } from "@/interfaces/common/other-cost-table-row-data";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IProcessInvoiceTabsDataSliceState {
  serviceSheetData: IServiceSheetData | undefined;
  costDetailsData: ITimeReportDetailsTableRowData[];
  otherCostsData: IOtherCostTableRowData[];
  nameChanged: boolean;
  readonly: boolean;
  invoiceceId: string;
  invoiceAmount: number;
}

const initialState: IProcessInvoiceTabsDataSliceState = {
  serviceSheetData: undefined,
  costDetailsData: [],
  otherCostsData: [],
  nameChanged: false,
  readonly: false,
  invoiceceId: '',
  invoiceAmount: 0,
}

export const processInvoiceTabsSlice = createSlice({
  name: 'sliceProcessInvoiceTabs',
  initialState,
  reducers: {
    setServiceSheetData: (state, action: PayloadAction<IServiceSheetData | undefined>) => {
      state.serviceSheetData = action.payload;
    },
    setcostDetailsData: (state, action: PayloadAction<ITimeReportDetailsTableRowData[]>) => {
      state.costDetailsData = action.payload;
    },
    setotherCostsData: (state, action: PayloadAction<IOtherCostTableRowData[]>) => {
      state.otherCostsData = action.payload;
    },
    setServiceSheetNameChange: (state, action: PayloadAction<boolean>) => {
      state.nameChanged = action.payload;
    },
    setReadOnly: (state, action: PayloadAction<boolean>) => {
      state.readonly = action.payload;
    },
    setInvoiceId: (state, action: PayloadAction<string>) => {
      state.invoiceceId = action.payload;
    },
    setInvoiceAmount: (state, action: PayloadAction<number>) => {
      state.invoiceAmount = action.payload;
    },

  },
});

export const { setServiceSheetData, setcostDetailsData, setotherCostsData, setServiceSheetNameChange, setReadOnly, setInvoiceId, setInvoiceAmount, } = processInvoiceTabsSlice.actions;
const processInvoiceTabsSliceReducer = processInvoiceTabsSlice.reducer;
export default processInvoiceTabsSliceReducer;