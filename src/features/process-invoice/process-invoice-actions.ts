import { setInvoiceChanged, setInvoiceId, setInvoiceStatus, setOtherCostData, setRowData, setServiceSheetName } from '@/app/app-slice';
import { RootState } from '@/app/store';
import { navigateTo } from '@/common/navigate';
import { failedToPerform, publishToast } from '@/common/toast';
import { InvoiceStatus } from '@/interfaces/invoices/invoice.interface';
import { IProcessInvoiceData } from '@/interfaces/process-invoice/process-invoice-data';
import processInvoiceService from '@/services/process-invoice.service';
import { PayloadAction, createAction } from '@reduxjs/toolkit';
import { StateObservable } from 'redux-observable';
import { EMPTY, catchError, mergeMap, of } from 'rxjs';

const CREATE_INVOICE = 'createInvoice';
const UPDATE_INVOICE = 'updateInvoice';
const CREATE_FROM_DRAFT = 'createFromDraft';
export const createInvoice = createAction<{ token: string }>(CREATE_INVOICE);
export const updateInvoice = createAction<{ token: string }>(UPDATE_INVOICE);
export const createFromDraft = createAction<{ token: string }>(CREATE_FROM_DRAFT);

export function handleCreateInvoice(action: PayloadAction<{ token: string }>, state$: StateObservable<RootState>) {
  const invoiceData = state$.value.app.invoiceData;
  const contractDetails = state$.value.app.contractForReconciliation;

  const otherCostData = state$.value.app.otherCostData;
  const addedTimeReportData = state$.value.app.addedTimeReportData;
  const invoiceTimeReportData = addedTimeReportData.map((i) => i.data);

  const payload: IProcessInvoiceData = {
    invoiceId: invoiceData.InvoiceID,
    invoiceNumber: invoiceData.InvoiceNumber,
    invoiceDate: invoiceData.DateOnInvoice,
    invoiceAmount: invoiceData.InvoiceAmount,
    periodEndDate: invoiceData.PeriodEnding,
    invoiceReceivedDate: invoiceData.InvoiceReceived,
    vendorBusinessId: contractDetails.businessId.toString(),
    vendorName: contractDetails.vendorName,
    contractNumber: invoiceData.ContractNumber,
    type: contractDetails.contractType,
    uniqueServiceSheetName: invoiceData.UniqueServiceSheetName,
    serviceDescription: invoiceData.ServiceDescription,
    invoiceTimeReportCostDetails: invoiceTimeReportData,
    invoiceOtherCostDetails: otherCostData,
    flightReportIds: state$.value.app.flightReportIds,
  };
  return processInvoiceService.createInvoice(action.payload.token, payload).pipe(
    mergeMap((data) => {
      publishToast({ type: 'success', message: `Invoice # ${invoiceData.InvoiceNumber} processed.` });
      // todo clear flightreportids? timeReportIds?...maybe just make a reset action
      return of(setInvoiceId(data), setRowData([]), setOtherCostData([]), setInvoiceChanged(false), setInvoiceStatus(InvoiceStatus.Processed));
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
}

export function handleUpdateInvoice(action: PayloadAction<{ token: string }>, state$: StateObservable<RootState>) {
  const invoiceData = state$.value.app.invoiceData;
  const contractDetails = state$.value.app.contractForReconciliation;
  const otherCostData = state$.value.app.otherCostData;
  const addedTimeReportData = state$.value.app.addedTimeReportData;
  const invoiceTimeReportData = addedTimeReportData.map((i) => i.data);

  const payload: IProcessInvoiceData = {
    invoiceId: invoiceData.InvoiceID,
    invoiceNumber: invoiceData.InvoiceNumber,
    invoiceDate: invoiceData.DateOnInvoice,
    invoiceAmount: invoiceData.InvoiceAmount,
    periodEndDate: invoiceData.PeriodEnding,
    invoiceReceivedDate: invoiceData.InvoiceReceived,
    vendorBusinessId: contractDetails.businessId.toString(),
    vendorName: contractDetails.vendorName,
    contractNumber: invoiceData.ContractNumber,
    type: contractDetails.contractType,
    uniqueServiceSheetName: invoiceData.UniqueServiceSheetName,
    serviceDescription: invoiceData.ServiceDescription,
    invoiceTimeReportCostDetails: invoiceTimeReportData,
    invoiceOtherCostDetails: otherCostData,
    flightReportIds: state$.value.app.flightReportIds,
  };
  return processInvoiceService.updateInvoice(action.payload.token, payload).pipe(
    mergeMap((data) => {
      if (invoiceData.InvoiceStatus === InvoiceStatus.Draft) {
        publishToast({ type: 'success', message: `Invoice # ${invoiceData.InvoiceNumber} processed.` });
      } else {
        publishToast({ type: 'success', message: 'Invoice updated successfully.' });
      }
      return of(setServiceSheetName(data), setInvoiceChanged(false), setInvoiceStatus(InvoiceStatus.Processed));
    }),
    catchError((error) => {
      console.error(error);
      if (error.response && error.response.status === 403) {
        navigateTo('unauthorized');
      }

      if (invoiceData.InvoiceStatus === InvoiceStatus.Draft) {
        publishToast({
          type: 'error',
          message: failedToPerform('create invoice', 'Connection Error'),
          action: action,
        });
      } else {
        publishToast({
          type: 'error',
          message: failedToPerform('update invoice', 'Connection Error'),
          action: action,
        });
      }

      return EMPTY;
    }),
  );
}

// export function handleCreateFromDraft(action: PayloadAction<{ token: string }>, state$: StateObservable<RootState>) {
//   const invoiceData = state$.value.app.invoiceData;
//   const contractDetails = state$.value.app.contractForReconciliation;
//   const otherCostData = state$.value.app.otherCostData;
//   const addedTimeReportData = state$.value.app.addedTimeReportData;
//   const invoiceTimeReportData = addedTimeReportData.map((i) => i.data);

//   const payload: IProcessInvoiceData = {
//     invoiceId: invoiceData.InvoiceID,
//     invoiceNumber: invoiceData.InvoiceNumber,
//     invoiceDate: invoiceData.DateOnInvoice,
//     invoiceAmount: invoiceData.InvoiceAmount,
//     periodEndDate: invoiceData.PeriodEnding,
//     invoiceReceivedDate: invoiceData.InvoiceReceived,
//     vendorBusinessId: contractDetails.businessId.toString(),
//     vendorName: contractDetails.vendorName,
//     contractNumber: invoiceData.ContractNumber,
//     type: contractDetails.contractType,
//     uniqueServiceSheetName: invoiceData.UniqueServiceSheetName,
//     serviceDescription: invoiceData.ServiceDescription,
//     invoiceTimeReportCostDetails: invoiceTimeReportData,
//     invoiceOtherCostDetails: otherCostData,
//     flightReportIds: state$.value.app.flightReportIds,
//   };
//   return processInvoiceService.updateInvoice(action.payload.token, payload).pipe(
//     mergeMap((data) => {
//       if (invoiceData.InvoiceStatus === InvoiceStatus.Draft) {
//         publishToast({ type: 'success', message: `Invoice # ${invoiceData.InvoiceNumber} processed.` });
//       } else {
//         publishToast({ type: 'success', message: 'Invoice updated successfully.' });
//       }
//       return of(setServiceSheetName(data), setInvoiceChanged(false), setInvoiceStatus(InvoiceStatus.Processed));
//     }),
//     catchError((error) => {
//       console.error(error);
//       if (error.response && error.response.status === 403) {
//         navigateTo('unauthorized');
//       }
//       publishToast({
//         type: 'error',
//         message: failedToPerform('update invoice', 'Connection Error'),
//         action: action,
//       });
//       return EMPTY;
//     }),
//   );
// }
