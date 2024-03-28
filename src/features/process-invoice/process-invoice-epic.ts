import { Action, createAction } from '@reduxjs/toolkit';
import { EMPTY, Observable, catchError, filter, mergeMap, of, switchMap } from 'rxjs';
import { failedToPerform, publishToast } from '@/common/toast';
import { navigateTo } from '@/common/navigate';
import processInvoiceService from '@/services/process-invoice.service';
import { IProcessInvoiceData } from '@/interfaces/process-invoice/process-invoice-data';
import { setInvoiceChanged, setInvoiceId, setServiceSheetName } from '@/app/app-slice';
import { setOtherCostData, setRowData } from '@/features/invoice-details/invoice-details-slice';
import { setNotificationStatus } from './process-invoice-slice';
import { StateObservable } from 'redux-observable';
import { RootState } from '@/app/store';

const CREATE_INVOICE = 'createInvoice';
const UPDATE_INVOICE = 'updateInvoice';
export const createInvoice = createAction<{ token: string }>(CREATE_INVOICE);
export const updateInvoice = createAction<{ token: string }>(UPDATE_INVOICE);

// https://redux-toolkit.js.org/api/createAction#with-redux-observable
export const processInvoiceEpic = (actions$: Observable<Action>, state$: StateObservable<RootState>) =>
  actions$.pipe(
    filter((action) => createInvoice.match(action) || updateInvoice.match(action)),
    switchMap((action: Action) => {
      if (createInvoice.match(action)) {
        const invoiceData = state$.value.app.invoiceData;
        const contractDetails = state$.value.app.contractForReconciliation;
        const otherCostData = state$.value.processInvoiceTabs.otherCostsData;
        const timeReportData = state$.value.processInvoiceTabs.timeReportData;
        const invoiceTimeReportData = timeReportData.map((i) => i.data);

        const payload: IProcessInvoiceData = {
          invoiceId: invoiceData.InvoiceID,
          invoiceNumber: invoiceData.InvoiceNumber,
          invoiceDate: invoiceData.DateOnInvoice,
          invoiceAmount: invoiceData.InvoiceAmount,
          periodEndDate: invoiceData.PeriodEnding,
          invoiceReceivedDate: invoiceData.InvoiceReceived,
          vendorBusinessId: contractDetails.businessId.toString(),
          vendorName: contractDetails.vendorName,
          assignedTo: '',
          contractNumber: invoiceData.ContractNumber,
          type: contractDetails.contractType,
          uniqueServiceSheetName: invoiceData.UniqueServiceSheetName,
          serviceDescription: invoiceData.ServiceDescription,
          invoiceTimeReportCostDetails: invoiceTimeReportData,
          invoiceOtherCostDetails: otherCostData,
        };
        return processInvoiceService.createInvoice(action.payload.token, payload).pipe(
          mergeMap((data) => {
            publishToast({ type: 'success', message: `Invoice # ${invoiceData.InvoiceNumber} processed.` });
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
        const invoiceData = state$.value.app.invoiceData;
        const contractDetails = state$.value.app.contractForReconciliation;
        const otherCostData = state$.value.processInvoiceTabs.otherCostsData;
        const timeReportData = state$.value.processInvoiceTabs.timeReportData;
        const invoiceTimeReportData = timeReportData.map((i) => i.data);

        const payload: IProcessInvoiceData = {
          invoiceId: invoiceData.InvoiceID,
          invoiceNumber: invoiceData.InvoiceNumber,
          invoiceDate: invoiceData.DateOnInvoice,
          invoiceAmount: invoiceData.InvoiceAmount,
          periodEndDate: invoiceData.PeriodEnding,
          invoiceReceivedDate: invoiceData.InvoiceReceived,
          vendorBusinessId: contractDetails.businessId.toString(),
          vendorName: contractDetails.vendorName,
          assignedTo: '',
          contractNumber: invoiceData.ContractNumber,
          type: contractDetails.contractType,
          uniqueServiceSheetName: invoiceData.UniqueServiceSheetName,
          serviceDescription: invoiceData.ServiceDescription,
          invoiceTimeReportCostDetails: invoiceTimeReportData,
          invoiceOtherCostDetails: otherCostData,
        };
        return processInvoiceService.updateInvoice(action.payload.token, payload).pipe(
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
