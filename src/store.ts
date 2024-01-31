import { configureStore } from '@reduxjs/toolkit';
import appReducer from './app-slice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import logger from 'redux-logger';
// https://redux-toolkit.js.org/usage/migrating-to-modern-redux#store-setup-with-configurestore

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, appReducer);
const environment = import.meta.env.VITE_ENV;
const store = configureStore({
  // Can create a root reducer separately and pass that in
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      // Customize the built-in serializability dev check
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });

    // Conditionally add another middleware in dev
    if (environment !== 'prod') {
      middleware.push(logger);
    }

    return middleware;
  },
  // Turn off devtools in prod, or pass options in dev
  devTools: environment !== 'prod',
});

export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
