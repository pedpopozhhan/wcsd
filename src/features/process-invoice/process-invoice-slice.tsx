
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IProcessInvoiceSliceState  {
 showInvoiceSavedNotification: boolean;
}

const initialState : IProcessInvoiceSliceState = {
    showInvoiceSavedNotification: false
}

export const processInvoiceSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
      setNotificationStatus: (state, action: PayloadAction<boolean>) => {
        state.showInvoiceSavedNotification = action.payload;
      },
    },
  });
  
  export const { setNotificationStatus } = processInvoiceSlice.actions;
  const processInvoiceReducer = processInvoiceSlice.reducer;
  export default processInvoiceReducer;