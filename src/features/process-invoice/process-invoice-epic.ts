import { Action, createAction } from '@reduxjs/toolkit';
import { EMPTY, Observable, catchError, filter, mergeMap, of, switchMap } from 'rxjs';
import { failedToPerform, publishToast } from '@/common/toast';
import { navigateTo } from '@/common/navigate';
import processInvoiceService from '@/services/process-invoice.service';
import { IProcessInvoiceData } from '@/interfaces/process-invoice/process-invoice-data';
import { setInvoiceChanged, setInvoiceId, setServiceSheetName } from '@/app/app-slice';
import { setOtherCostData, setRowData } from '@/features/invoice-details/invoice-details-slice';
import { setNotificationStatus } from './process-invoice-slice';

const CREATE_INVOICE = 'createInvoice';
const UPDATE_INVOICE = 'updateInvoice';
export const createInvoice = createAction<{ token: string; invoiceData: IProcessInvoiceData }>(CREATE_INVOICE);
export const updateInvoice = createAction<{ token: string; invoiceData: IProcessInvoiceData }>(UPDATE_INVOICE);

// https://redux-toolkit.js.org/api/createAction#with-redux-observable
export const processInvoiceEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter((action) => createInvoice.match(action) || updateInvoice.match(action)),
    switchMap((action: Action) => {
      if (createInvoice.match(action)) {
        return processInvoiceService.createInvoice(action.payload.token, action.payload.invoiceData).pipe(
          mergeMap((data) => {
            publishToast({ type: 'success', message: `Invoice #${action.payload.invoiceData.invoiceNumber} processed.` });
            return of(setInvoiceId(data), setRowData([]), setOtherCostData([]), setNotificationStatus(true), setInvoiceChanged(false));
          }),
          catchError((error) => {
            console.error(error);
            if (error.response && error.response.status === 403) {
              navigateTo('unauthorized');
            }
            publishToast({
              type: 'error',
              message: failedToPerform('create invoice', 'Connection Error'),
              action: action,
            });
            return EMPTY;
          }),
        );
      } else if (updateInvoice.match(action)) {
        return processInvoiceService.updateInvoice(action.payload.token, action.payload.invoiceData).pipe(
          mergeMap((data) => {
            publishToast({ type: 'success', message: 'Invoice updated successfully.' });
            return of(setServiceSheetName(data), setNotificationStatus(true), setInvoiceChanged(false));
          }),
          catchError((error) => {
            console.error(error);
            if (error.response && error.response.status === 403) {
              navigateTo('unauthorized');
            }
            publishToast({
              type: 'error',
              message: failedToPerform('update invoice', 'Connection Error'),
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
