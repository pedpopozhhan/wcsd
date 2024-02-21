import { GoAAppHeader } from '@abgov/react-components';
import { Outlet } from 'react-router-dom';
import styles from './App.module.scss';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import Toast from '@/common/toast';

const { mainContainer, outletContainer } = styles;

export function App() {
  const headerTitle = 'Wildfire Support';

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className={mainContainer}>
          <GoAAppHeader url='/' heading={headerTitle} maxContentWidth='100%'></GoAAppHeader>

          <div className={outletContainer}>
            <Outlet />
          </div>
          <Toast></Toast>
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
