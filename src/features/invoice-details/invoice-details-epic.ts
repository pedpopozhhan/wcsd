import { Action, AnyAction, createAction } from '@reduxjs/toolkit';
import { Observable, catchError, filter, map, mergeMap, of } from 'rxjs';
import invoiceDetailsSlice, { initializeRowData, setRateTypes, setRowData } from './invoice-details-slice';
import invoiceDetailsReducer from './invoice-details-slice';
import { Epic } from 'redux-observable';
import { RootState } from '@/app/store';
import invoiceDetailsService from '@/services/invoice-details.service';
import { useAppDispatch } from '@/app/hooks';
import { setToast } from '@/app/app-slice';

const GET_INVOICE_DETAILS = 'getInvoiceDetails';
const GET_OTHER_DATA = 'getOtherData';
export const getInvoiceDetails = createAction<number[]>(GET_INVOICE_DETAILS);
export const getOtherData = createAction<number>(GET_OTHER_DATA);

// https://redux-toolkit.js.org/api/createAction#with-redux-observable
export const invoiceDetailsEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter(getInvoiceDetails.match),
    mergeMap((action) =>
      invoiceDetailsService.getInvoiceDetails(action.payload).pipe(
        mergeMap((results) => of(setRateTypes(results.rateTypes), initializeRowData(results.rows))),
        catchError((error) => {
          console.error(error);
          return of(
            setToast({
              type: 'error',
              message: JSON.stringify(error),
            })
          );
        })
      )
    )
  );
