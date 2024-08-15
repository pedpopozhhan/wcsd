import { Action } from '@reduxjs/toolkit';
import { EMPTY, Observable, filter, switchMap } from 'rxjs';
import { StateObservable } from 'redux-observable';
import { RootState } from '@/app/store';
import {
  createFromDraft,
  createInvoice,
  handleCreateInvoice,
  handleUpdateInvoice,
  updateInvoice,
  //   handleCreateFromDraft,
} from './process-invoice-actions';

// https://redux-toolkit.js.org/api/createAction#with-redux-observable
export const processInvoiceEpic = (actions$: Observable<Action>, state$: StateObservable<RootState>) =>
  actions$.pipe(
    filter((action) => createInvoice.match(action) || updateInvoice.match(action) || createFromDraft.match(action)),
    switchMap((action: Action) => {
      if (createInvoice.match(action)) {
        return handleCreateInvoice(action, state$);
      } else if (updateInvoice.match(action)) {
        return handleUpdateInvoice(action, state$);
      }
      //   else if (createFromDraft.match(action)) {
      //     return handleCreateFromDraft(action, state$);
      //   }
      else {
        console.error(`${action.type} is not handled`);
        return EMPTY;
      }
    }),
  );
