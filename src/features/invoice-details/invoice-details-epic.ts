import { Action, PayloadAction, createAction } from '@reduxjs/toolkit';
import { EMPTY, Observable, catchError, filter, mergeMap, of, switchMap } from 'rxjs';
import { initializeRowData, setRateTypes } from './invoice-details-slice';
import invoiceDetailsService from '@/services/invoice-details.service';
import { publishToast } from '@/common/toast';

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
        return invoiceDetailsService.getInvoiceDetails(action.payload).pipe(
          mergeMap((results) => of(setRateTypes(results.rateTypes), initializeRowData(results.rows))),
          catchError((error) => {
            console.error(error);
            publishToast({
              type: 'error',
              message: 'Server error',
              action: action,
            });
            return EMPTY;
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
