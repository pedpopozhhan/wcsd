import { Action, createAction } from '@reduxjs/toolkit';
import { EMPTY, Observable, catchError, filter, mergeMap, of, switchMap } from 'rxjs';
import { initializeRowData, setRateTypes } from './invoice-details-slice';
import timeReportDetailsService from '@/services/time-report-details.service';
import { failedToPerform, publishToast } from '@/common/toast';
import { navigateTo } from '@/common/navigate';
import dropDownListService from '@/services/drop-down-lists.service';

const GET_INVOICE_DETAILS = 'getInvoiceDetails';
const GET_RATE_TYPES = 'getRateTypes';
export const getInvoiceDetails = createAction<{ token: string; ids: number[] }>(GET_INVOICE_DETAILS);
export const getRateTypes = createAction<{ token: string }>(GET_RATE_TYPES);

// https://redux-toolkit.js.org/api/createAction#with-redux-observable
export const invoiceDetailsEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter((action) => getInvoiceDetails.match(action) || getRateTypes.match(action)),
    switchMap((action: Action) => {
      if (getInvoiceDetails.match(action)) {
        return timeReportDetailsService.getTimeReportDetails(action.payload.token, action.payload.ids).pipe(
          mergeMap((timeReportResults) => of(initializeRowData(timeReportResults.rows))),
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
      } else if (getRateTypes.match(action)) {
        return dropDownListService.getOtherCostDropDownLists(action.payload.token).pipe(
          mergeMap((dropDownLists) => {
            return of(setRateTypes(dropDownLists.rateTypes));
          }),
          catchError((error) => {
            console.error(error);
            if (error.response && error.response.status === 403) {
              navigateTo('unauthorized');
            }
            publishToast({
              type: 'error',
              message: failedToPerform('getRateTypes', 'Connection Error'),
              action: action,
            });
            return EMPTY;
          }),
        );
      } else {
        console.error(`${action.type} is not handled`);
        return EMPTY;
      }
    }),
  );
