import { Action, combineReducers, configureStore } from '@reduxjs/toolkit';
import appReducer from './app-slice';

import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import logger from 'redux-logger';
import invoiceDetailsReducer from '@/features/invoice-details/invoice-details-slice';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { catchError } from 'rxjs';
import { invoiceDetailsEpic } from '@/features/invoice-details/invoice-details-epic';

import serviceSheetDataReducer from '@/features/process-invoice/tabs/service-sheet-slice';
import processInvoiceReducer from '@/features/process-invoice/process-invoice-slice';
import { processInvoiceEpic } from '@/features/process-invoice/process-invoice-epic';

const environment = import.meta.env.VITE_ENV;
// https://redux-toolkit.js.org/usage/migrating-to-modern-redux#store-setup-with-configurestore

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};
const reducers = combineReducers({
  app: appReducer,
  invoiceDetails: invoiceDetailsReducer,
  serviceSheetData: serviceSheetDataReducer,
  processInvoiceNotification: processInvoiceReducer,
});
const persistedReducer = persistReducer(persistConfig, reducers);
export const epics: any = [
  invoiceDetailsEpic,
  processInvoiceEpic,
  // epic 2,
  // epic 3
];
// root epic with global error handling
const rootEpic = (action$: any, store$: any, dependencies: any) =>
  combineEpics(...epics)(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error('Error at rootEpic');
      console.error(error);
      return source;
    })
  );
const epicMiddleware = createEpicMiddleware();

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      // Customize the built-in serializability for redux persist
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });

    // Conditionally add another middleware in dev
    if (environment !== 'prod') {
      middleware.push(logger);
    }
    middleware.push(epicMiddleware);
    return middleware;
  },
  // Turn off devtools in prod, or pass options in dev
  devTools: environment !== 'prod',
});

epicMiddleware.run(rootEpic);
export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
