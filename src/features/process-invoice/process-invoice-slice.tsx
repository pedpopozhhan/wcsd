import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IProcessInvoiceSliceState {
  showInvoiceSavedNotification: boolean;
  isRedirectedFromProcessInvoice: boolean;
}

const initialState: IProcessInvoiceSliceState = {
  showInvoiceSavedNotification: false,
  isRedirectedFromProcessInvoice: false,
};

export const processInvoiceSlice = createSlice({
  name: 'sliceProcessInvoice',
  initialState,
  reducers: {
    setNotificationStatus: (state, action: PayloadAction<boolean>) => {
      state.showInvoiceSavedNotification = action.payload;
    },
    setRedirectionFromProcessInvoice: (state, action: PayloadAction<boolean>) => {
      state.isRedirectedFromProcessInvoice = action.payload;
    },
  },
});

export const { setNotificationStatus, setRedirectionFromProcessInvoice } = processInvoiceSlice.actions;
const processInvoiceReducer = processInvoiceSlice.reducer;
export default processInvoiceReducer;
