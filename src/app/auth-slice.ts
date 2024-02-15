import { IUser } from '@/interfaces/common/user.interface';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface IAuthSliceState {
  user: IUser;
}

const initialState: IAuthSliceState = {
  user: null as any,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
