import { IServiceSheetData } from "@/interfaces/process-invoice/service-sheet-data";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IServiceSheetDataSliceState  {
 value: IServiceSheetData | undefined;
 nameChanged: boolean;
}

const initialState : IServiceSheetDataSliceState = {
 value: undefined,
 nameChanged: false
}

export const serviceSheetSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
      setServiceSheetData: (state, action: PayloadAction<IServiceSheetData>) => {
        state.value = action.payload;
      },
      setServiceSheetNameChange: (state, action: PayloadAction<boolean>) => {
        state.nameChanged = action.payload;
      },
    },
  });
  
  export const { setServiceSheetData, setServiceSheetNameChange } = serviceSheetSlice.actions;
  const serviceSheetDataReducer = serviceSheetSlice.reducer;
  export default serviceSheetDataReducer;