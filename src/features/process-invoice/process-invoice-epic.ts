import { Action, createAction } from '@reduxjs/toolkit';
import { EMPTY, Observable, catchError, filter, mergeMap, of, switchMap } from 'rxjs';
import { publishToast } from '@/common/toast';
import invoiceServiceSheetDataService from '@/services/invoice-service-sheet-data-service';
import { setServiceSheetData } from './tabs/service-sheet-slice';

const GET_SERVICE_SHEET_DATA = 'getServiceSheetData';
const ACTION_2 = 'action2';
export const getServiceSheetData = createAction(GET_SERVICE_SHEET_DATA);
export const action2 = createAction<number>(ACTION_2);

// https://redux-toolkit.js.org/api/createAction#with-redux-observable
export const processInvoiceEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter((action) => getServiceSheetData.match(action) || action2.match(action)),
    switchMap((action: Action) => {
      if (getServiceSheetData.match(action)) {
        return invoiceServiceSheetDataService.getAll().pipe(
          mergeMap((results) => of(setServiceSheetData(results))),
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
