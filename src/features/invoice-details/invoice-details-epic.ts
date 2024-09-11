import { Action } from '@reduxjs/toolkit';
import { EMPTY, Observable, filter, switchMap } from 'rxjs';
import {
  clickOnDraftInvoice,
  deleteDraftInvoice,
  getCustomLists,
  getInvoiceDetails,
  handleDeleteDraftInvoice,
  handleDraftInvoiceClicked,
  handleGetCustomLists,
  handleGetInvoiceDetails,
  handleSaveDraftInvoice,
  saveDraftInvoice,
} from './invoice-details-actions';
import { StateObservable } from 'redux-observable';
import { RootState } from '@/app/store';

// https://redux-toolkit.js.org/api/createAction#with-redux-observable
export const invoiceDetailsEpic = (actions$: Observable<Action>, state$: StateObservable<RootState>) =>
  actions$.pipe(
    filter(
      (action) =>
        getInvoiceDetails.match(action) ||
        getCustomLists.match(action) ||
        saveDraftInvoice.match(action) ||
        clickOnDraftInvoice.match(action) ||
        deleteDraftInvoice.match(action),
    ),
    switchMap((action: Action) => {
      if (getInvoiceDetails.match(action)) {
        return handleGetInvoiceDetails(action, state$);
      } else if (getCustomLists.match(action)) {
        return handleGetCustomLists(action);
      } else if (saveDraftInvoice.match(action)) {
        return handleSaveDraftInvoice(action, state$);
      } else if (clickOnDraftInvoice.match(action)) {
        return handleDraftInvoiceClicked(action);
      } else if (deleteDraftInvoice.match(action)) {
        return handleDeleteDraftInvoice(action);
      } else {
        console.error(`${action.type} is not handled`);
        return EMPTY;
      }
    }),
  );
