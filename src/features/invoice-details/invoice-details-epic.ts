import { Action, AnyAction, createAction } from '@reduxjs/toolkit';
import { EMPTY, Observable, catchError, filter, map, mergeMap, of, switchMap } from 'rxjs';
import invoiceDetailsSlice, { initializeRowData, setRateTypes, setRowData } from './invoice-details-slice';
import invoiceDetailsReducer from './invoice-details-slice';
import { Epic } from 'redux-observable';
import { RootState } from '@/app/store';
import invoiceDetailsService from '@/services/invoice-details.service';
import { useAppDispatch } from '@/app/hooks';
import { setToast } from '@/app/app-slice';

const GET_INVOICE_DETAILS = 'getInvoiceDetails';
const ACTION_2 = 'action2';
export const getInvoiceDetails = createAction<number[]>(GET_INVOICE_DETAILS);
export const action2 = createAction<number>(ACTION_2);

// https://redux-toolkit.js.org/api/createAction#with-redux-observable
export const invoiceDetailsEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter((action) => getInvoiceDetails.match(action) || action2.match(action)),
    switchMap((action: Action) => {
      if (getInvoiceDetails.match(action)) {
        // Handle FETCH_USER action
        return invoiceDetailsService.getInvoiceDetails(action.payload).pipe(
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
        );
      } else if (action2.match(action)) {
        // This is a placeholder to be used as an example
        console.log('in second action');
        return EMPTY;
      } else {
        console.error(`${action.type} is not handled`);
        return EMPTY;
      }
    })
  );
