import { GoAAppHeader } from '@abgov/react-components';
import { Outlet } from 'react-router-dom';
import styles from './App.module.scss';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';

let { mainContainer, outletContainer } = styles;

export function App() {
  const headerTitle = 'Wildfire Support';
  const menuItems: any[] = [];

  return (
    <Provider store={store as any}>
      <PersistGate loading={null} persistor={persistor}>
        <div className={mainContainer}>
          <GoAAppHeader url='/' heading={headerTitle} maxContentWidth='100%'>
            {menuItems}
          </GoAAppHeader>

          <div className={outletContainer}>
            <Outlet />
          </div>
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
