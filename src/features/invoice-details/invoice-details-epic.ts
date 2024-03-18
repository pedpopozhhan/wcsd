import { Action, createAction } from '@reduxjs/toolkit';
import { EMPTY, Observable, catchError, filter, mergeMap, of, switchMap } from 'rxjs';
import { initializeRowData, setRateTypes } from './invoice-details-slice';
import timeReportDetailsService from '@/services/time-report-details.service';
import { failedToPerform, publishToast } from '@/common/toast';
import { navigateTo } from '@/common/navigate';

const GET_INVOICE_DETAILS = 'getInvoiceDetails';
const ACTION_2 = 'action2';
export const getInvoiceDetails = createAction<{ token: string; ids: number[] }>(GET_INVOICE_DETAILS);
export const action2 = createAction<number>(ACTION_2);

// https://redux-toolkit.js.org/api/createAction#with-redux-observable
export const invoiceDetailsEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter((action) => getInvoiceDetails.match(action) || action2.match(action)),
    switchMap((action: Action) => {
      if (getInvoiceDetails.match(action)) {
        return timeReportDetailsService.getTimeReportDetails(action.payload.token, action.payload.ids).pipe(
          mergeMap((results) => of(setRateTypes(results.rateTypes), initializeRowData(results.rows))),
          catchError((error) => {
            console.error(error);
            if (error.response && error.response.status === 403) {
              navigateTo('unauthorized');
            }
            publishToast({
              type: 'error',
              message: failedToPerform('get invoice details', 'Connection Error'),
              action: action,
            });
            return EMPTY;
          }),
        );
      } else if (action2.match(action)) {
        // This is a placeholder to be used as an example
        console.log('in second action');
        return EMPTY;
      } else {
        console.error(`${action.type} is not handled`);
        return EMPTY;
      }
    }),
  );
