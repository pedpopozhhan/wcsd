import { IInvoiceData } from '@/common/invoice-modal-dialog';
import { EmptyInvoiceId } from '@/common/types/invoice';
import { IDetailsTableRow } from '@/features/invoice-details/details-table-row.interface';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { IContractSearchResult } from '@/interfaces/contracts/contract-search-result';
import { InvoiceStatus } from '@/interfaces/invoices/invoice.interface';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface IAppSliceState {
  invoiceChanged: boolean;
  invoiceData: IInvoiceData;
  contractForReconciliation: IContractSearchResult;
  rowData: IDetailsTableRow[];
  otherCostData: IOtherCostTableRowData[];
  flightReportIds: number[];
  addedTimeReportData: IDetailsTableRow[];
}

const initialState: IAppSliceState = {
  invoiceChanged: false,
  invoiceData: {
    InvoiceID: EmptyInvoiceId,
    InvoiceNumber: '',
    DateOnInvoice: '',
    InvoiceAmount: 0,
    PeriodEnding: '',
    InvoiceReceived: '',
    ContractNumber: '',
    UniqueServiceSheetName: '',
    ServiceDescription: 'Professional Services',
    CreatedBy: '',
  },
  contractForReconciliation: null,
  rowData: [],
  otherCostData: [],
  flightReportIds: [],
  addedTimeReportData: [],
};
function hasOtherCostsArrayChanged(array1: IOtherCostTableRowData[], array2: IOtherCostTableRowData[]): boolean {
  if (array1.length !== array2.length) {
    return true;
  }

  const set1 = new Set(array1.map((item) => JSON.stringify(item)));
  const set2 = new Set(array2.map((item) => JSON.stringify(item)));

  if (set1.size !== set2.size) {
    return true;
  }

  for (const item of set1) {
    if (!set2.has(item)) {
      return true;
    }
  }

  return false;
}
function hasDetailsTableRowArrayChanged(array1: IDetailsTableRow[], array2: IDetailsTableRow[]): boolean {
  const filtered1 = array1.filter((x) => x.isAdded);
  const filtered2 = array2.filter((x) => x.isAdded);
  if (filtered1.length !== filtered2.length) {
    return true;
  }
  // find all the added ones
  const set1 = new Set(array1.map((item) => JSON.stringify(item.data)));
  const set2 = new Set(array2.map((item) => JSON.stringify(item.data)));

  for (const item of set1) {
    if (!set2.has(item)) {
      return true;
    }
  }

  return false;
}
export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setInvoiceData: (state: IAppSliceState, action: PayloadAction<IInvoiceData>) => {
      state.invoiceChanged = false;
      state.invoiceData = action.payload;
    },
    setContractForReconciliation: (state: IAppSliceState, action: PayloadAction<IContractSearchResult>) => {
      state.contractForReconciliation = action.payload;
    },
    setServiceSheetName: (state: IAppSliceState, action: PayloadAction<string>) => {
      if (state.invoiceData.UniqueServiceSheetName !== action.payload) {
        state.invoiceChanged = state.invoiceChanged || true;
      }
      state.invoiceData = { ...state.invoiceData, UniqueServiceSheetName: action.payload };
    },
    setInvoiceChanged: (state: IAppSliceState, action: PayloadAction<boolean>) => {
      // currently used to enable the Update button on process-invoice (via formChanged variable)
      state.invoiceChanged = action.payload;
    },
    setInvoiceId: (state: IAppSliceState, action: PayloadAction<string>) => {
      state.invoiceData = { ...state.invoiceData, InvoiceID: action.payload };
    },
    setInvoiceStatus: (state: IAppSliceState, action: PayloadAction<InvoiceStatus>) => {
      state.invoiceData = { ...state.invoiceData, InvoiceStatus: action.payload };
    },

    setRowData: (state: IAppSliceState, action: PayloadAction<IDetailsTableRow[]>) => {
      const hasChanged = hasDetailsTableRowArrayChanged(action.payload, state.rowData);
      state.invoiceChanged = state.invoiceChanged || hasChanged;
      state.rowData = action.payload;
    },

    setOtherCostData: (state: IAppSliceState, action: PayloadAction<IOtherCostTableRowData[]>) => {
      const hasChanged = hasOtherCostsArrayChanged(action.payload, state.otherCostData);
      state.invoiceChanged = state.invoiceChanged || hasChanged;
      state.otherCostData = action.payload;
    },
    setFlightReportIds: (state: IAppSliceState, action: PayloadAction<number[]>) => {
      state.flightReportIds = action.payload;
    },
    resetState: (state: IAppSliceState) => {
      state.rowData = [];
      state.otherCostData = [];
      state.flightReportIds = [];
      state.addedTimeReportData = [];
      state.invoiceChanged = false;
    },

    setAddedTimeReportData: (state: IAppSliceState, action: PayloadAction<IDetailsTableRow[]>) => {
      state.addedTimeReportData = action.payload;
    },
  },
});

// exports
export const {
  setInvoiceData,
  setContractForReconciliation,
  setServiceSheetName,
  setInvoiceStatus,
  setInvoiceId,
  setInvoiceChanged,
  setRowData,
  setOtherCostData,
  resetState,
  setFlightReportIds,
  setAddedTimeReportData,
} = appSlice.actions;

export default appSlice.reducer;
