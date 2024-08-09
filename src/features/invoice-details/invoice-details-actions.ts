import { RootState } from '@/app/store';
import timeReportDetailsService from '@/services/time-report-details.service';
import { PayloadAction, createAction } from '@reduxjs/toolkit';
import { StateObservable } from 'redux-observable';
import { EMPTY, catchError, map, mergeMap, of, tap } from 'rxjs';
import { navigateTo } from '@/common/navigate';
import { failedToPerform, publishToast } from '@/common/toast';
import dropDownListService from '@/services/drop-down-lists.service';
import { IInvoice, IProcessInvoiceData } from '@/interfaces/process-invoice/process-invoice-data';
import processInvoiceService from '@/services/process-invoice.service';
import { setInvoiceChanged, setInvoiceData, setInvoiceId, setInvoiceStatus, setOtherCostData, setRowData } from '@/app/app-slice';
import { IInvoiceData } from '@/common/invoice-modal-dialog';
import { InvoiceStatus } from '@/interfaces/invoices/invoice.interface';
import { deleteDraftInvoiceSuccess, setLists } from './invoice-details-slice';
import { EmptyGuid } from '@/common/types/invoice';

const GET_INVOICE_DETAILS = 'getInvoiceDetails';
const CLICK_ON_DRAFT_INVOICE = 'clickOnDraftInvoice';
const GET_CUSTOM_LISTS = 'getCustomLists';
const SAVE_DRAFT_INVOICE = 'saveDraftInvoice';
const DELETE_DRAFT_INVOICE = 'deleteDraftInvoice';


interface IGetInvoiceDetailsPayLoad {
  token: string;
  ids: number[];
  invoiceID: string;
}
export const getInvoiceDetails = createAction<IGetInvoiceDetailsPayLoad>(GET_INVOICE_DETAILS);
export const getCustomLists = createAction<{ token: string }>(GET_CUSTOM_LISTS);
export const clickOnDraftInvoice = createAction<{ token: string; invoice: IInvoice; contractNumber: string }>(CLICK_ON_DRAFT_INVOICE);
export const saveDraftInvoice = createAction<{ token: string }>(SAVE_DRAFT_INVOICE);
export const deleteDraftInvoice = createAction<{ token: string; invoiceId: string; contractNumber: string }>(DELETE_DRAFT_INVOICE);

export function handleDraftInvoiceClicked(action: PayloadAction<{ token: string; invoice: IInvoice; contractNumber: string }>) {
  const invoice = action.payload.invoice;
  const token = action.payload.token;
  const flightReportIds = invoice.invoiceTimeReports.map((x) => x.flightReportId);
  const getTimeReportDetailsPayLoad = {
    token: token,
    timeReportIds: flightReportIds,
    invoiceID: ''
  };
  return timeReportDetailsService.getTimeReportDetails(getTimeReportDetailsPayLoad).pipe(
    mergeMap((timeReportResults) => {
      const contractNumber = action.payload.contractNumber;
      const invoiceForContext: IInvoiceData = {
        InvoiceID: invoice.invoiceId,
        InvoiceNumber: invoice.invoiceNumber,
        InvoiceStatus: invoice.invoiceStatus,
        DateOnInvoice: invoice.invoiceDate,
        InvoiceAmount: invoice.invoiceAmount,
        PeriodEnding: invoice.periodEndDate,
        InvoiceReceived: invoice.invoiceReceivedDate,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export function handleGetInvoiceDetails(action: PayloadAction<IGetInvoiceDetailsPayLoad>) {
  const getTimeReportDetailsPayLoad = {
    token: action.payload.token,
    timeReportIds: action.payload.ids,
    invoiceID: action.payload.invoiceID
  };
  return timeReportDetailsService.getTimeReportDetails(getTimeReportDetailsPayLoad).pipe(
    mergeMap((timeReportResults) => {
      const data = timeReportResults.rows.slice().map((x, i) => {
        return {
          index: i,
          data: x,
          isAdded: x.invoiceID !== EmptyGuid ? true : false,
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
  const otherCostData = state$.value.app.otherCostData;
  const addedTimeReportData = state$.value.app.addedTimeReportData;
  const flightReportIds = state$.value.app.flightReportIds;
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
    invoiceTimeReportCostDetails: addedTimeReportData.map((i) => i.data),
    invoiceOtherCostDetails: otherCostData,
    flightReportIds: flightReportIds,
  };
  //   setIsLoading(true);
  return processInvoiceService.saveDraft(action.payload.token, payload).pipe(
    mergeMap((data) => {
      // eslint-disable-next-line quotes
      publishToast({ type: 'success', message: "Invoice saved. Accessible in 'Drafts' Tab." });
      return of(setInvoiceStatus(InvoiceStatus.Draft), setInvoiceId(data), setInvoiceChanged(false));
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

export function handleDeleteDraftInvoice(action: PayloadAction<{ token: string; invoiceId: string; contractNumber: string }>) {
  const contractNumber = action.payload.contractNumber;
  return processInvoiceService.deleteDraft(action.payload.token, action.payload.invoiceId).pipe(
    mergeMap((invoiceId: string) => {
      return of(invoiceId).pipe(map(() => deleteDraftInvoiceSuccess({ contractNumber: contractNumber })));
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
