import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IInvoiceData } from '../common/invoice-modal-dialog';
import { IContractSearchResult } from '../interfaces/reconciliation/contract-search-result';
import { IToast } from '@/interfaces/toast.interface';
import { IUser } from '../interfaces/common/user.interface';

export interface IAuthSliceState {
  user: IUser;
}

const initialState: IAuthSliceState = {
  user: null as any,
};
// TODO: I am sure there are patterns to organize reducers and slices, so let's keep that in mind as this grows.
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
  },
});

// exports
// export const timeReportsToReconcile = (state: IAuthSliceState) => state.timeReportsToReconcile;
export const { setUser } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
