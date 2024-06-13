import { RootState } from '@/app/store';
import timeReportDetailsService from '@/services/time-report-details.service';
import { PayloadAction, createAction } from '@reduxjs/toolkit';
import { StateObservable } from 'redux-observable';
import { EMPTY, catchError, mergeMap, of, tap } from 'rxjs';
import { setLists, setOtherCostData, setRowData } from './invoice-details-slice';
import { navigateTo } from '@/common/navigate';
import { failedToPerform, publishToast } from '@/common/toast';
import dropDownListService from '@/services/drop-down-lists.service';
import { IInvoice, IProcessInvoiceData } from '@/interfaces/process-invoice/process-invoice-data';
import processInvoiceService from '@/services/process-invoice.service';
import { setInvoiceChanged, setInvoiceData, setInvoiceId, setServiceSheetName } from '@/app/app-slice';
import { IInvoiceData } from '@/common/invoice-modal-dialog';

const GET_INVOICE_DETAILS = 'getInvoiceDetails';
const CLICK_ON_DRAFT_INVOICE = 'clickOnDraftInvoice';
const GET_CUSTOM_LISTS = 'getCustomLists';
const SAVE_DRAFT_INVOICE = 'saveDraftInvoice';
export const getInvoiceDetails = createAction<{ token: string; ids: number[]; selectedIds?: number[] }>(GET_INVOICE_DETAILS);
export const getCustomLists = createAction<{ token: string }>(GET_CUSTOM_LISTS);
export const clickOnDraftInvoice = createAction<{ token: string; invoice: IInvoice; contractNumber: string }>(CLICK_ON_DRAFT_INVOICE);
export const saveDraftInvoice = createAction<{ token: string }>(SAVE_DRAFT_INVOICE);

export function handleDraftInvoiceClicked(action: PayloadAction<{ token: string; invoice: IInvoice; contractNumber: string }>) {
  const invoice = action.payload.invoice;
  const token = action.payload.token;
  const flightReportIds = invoice.invoiceTimeReports.map((x) => x.flightReportId);
  return timeReportDetailsService.getTimeReportDetails(token, flightReportIds).pipe(
    mergeMap((timeReportResults) => {
      const contractNumber = action.payload.contractNumber;
      const invoiceForContext: IInvoiceData = {
        InvoiceID: invoice.invoiceId,
        InvoiceNumber: invoice.invoiceNumber,
        DateOnInvoice: new Date(invoice.invoiceDate).toISOString(),
        InvoiceAmount: invoice.invoiceAmount,
        PeriodEnding: new Date(invoice.periodEndDate).toISOString(),
        InvoiceReceived: new Date(invoice.invoiceReceivedDate).toISOString(),
        ContractNumber: contractNumber,
        UniqueServiceSheetName: invoice.uniqueServiceSheetName,
        ServiceDescription: invoice.serviceDescription,
        CreatedBy: invoice.createdBy,
      };
      const selectedIds = invoice.invoiceTimeReportCostDetails.map((x) => x.flightReportCostDetailsId);
      const union = timeReportResults.rows.slice().concat(invoice.invoiceTimeReportCostDetails);
      const data = union
        .map((x, i) => {
          return {
            index: i,
            data: x,
            isAdded: selectedIds ? selectedIds.includes(x.flightReportCostDetailsId) : false,
            isSelected: false,
          };
        })
        .sort((a, b) => {
          if (a.data.flightReportDate < b.data.flightReportDate) {
            return -1;
          }
          if (a.data.flightReportDate > b.data.flightReportDate) {
            return 1;
          }
          return 0;
        });
      return of(setRowData(data), setOtherCostData(invoice.invoiceOtherCostDetails), setInvoiceData(invoiceForContext));
    }),
    tap((action) => {
      navigateTo(`/invoice/${invoice.invoiceNumber}`);
    }),
    catchError((error) => {
      console.error(error);
      if (error.response && error.response.status === 403) {
        navigateTo('unauthorized');
      }
      publishToast({
        type: 'info',
        message: error.response.data,
      });
      return EMPTY;
    }),
  );
}
export function handleGetInvoiceDetails(action: PayloadAction<{ token: string; ids: number[]; selectedIds?: number[] }>) {
  return timeReportDetailsService.getTimeReportDetails(action.payload.token, action.payload.ids).pipe(
    mergeMap((timeReportResults) => {
      const data = timeReportResults.rows.slice().map((x, i) => {
        return {
          index: i,
          data: x,
          isAdded: false,
          isSelected: false,
        };
      });
      return of(setRowData(data));
    }),
    catchError((error) => {
      console.error(error);
      if (error.response && error.response.status === 403) {
        navigateTo('unauthorized');
      }
      publishToast({
        type: 'info',
        message: error.response.data,
      });
      return EMPTY;
    }),
  );
}

export function handleGetCustomLists(action: PayloadAction<{ token: string }>) {
  return dropDownListService.getOtherCostDropDownLists(action.payload.token).pipe(
    mergeMap((dropDownLists) => {
      return of(setLists(dropDownLists));
    }),
    catchError((error) => {
      console.error(error);
      if (error.response && error.response.status === 403) {
        navigateTo('unauthorized');
      }
      publishToast({
        type: 'error',
        message: failedToPerform('getCustomLists', 'Connection Error'),
        action: action,
      });
      return EMPTY;
    }),
  );
}
export function handleSaveDraftInvoice(action: PayloadAction<{ token: string }>, state$: StateObservable<RootState>) {
  const invoiceData = state$.value.app.invoiceData;
  const contractDetails = state$.value.app.contractForReconciliation;
  const otherCostData = state$.value.processInvoiceTabs.otherCostsData;
  const timeReportData = state$.value.processInvoiceTabs.timeReportData;
  const flightReportIds = state$.value.invoiceDetails.flightReportIds;
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
    invoiceTimeReportCostDetails: timeReportData.map((i) => i.data),
    invoiceOtherCostDetails: otherCostData,
    flightReportIds: flightReportIds,
  };

  return processInvoiceService.saveDraft(action.payload.token, payload).pipe(
    mergeMap((data) => {
      // eslint-disable-next-line quotes
      publishToast({ type: 'success', message: "Invoice saved. Accessible in 'Drafts' Tab." });
      return of(setInvoiceId(data), setServiceSheetName(data), setInvoiceChanged(false));
    }),
    catchError((error) => {
      console.error(error);
      if (error.response && error.response.status === 403) {
        navigateTo('unauthorized');
      }
      publishToast({
        type: 'error',
        message: 'Invoice failed to save.',
      });
      return EMPTY;
    }),
  );
}
