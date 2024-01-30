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
    if (process.env.NODE_ENV !== 'production') {
      middleware.push(logger);
    }

    return middleware;
  },
  // Turn off devtools in prod, or pass options in dev
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
