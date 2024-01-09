import { GoAAppHeader } from '@abgov/react-components';
import { Outlet } from 'react-router-dom';
import styles from './App.module.scss';
import { MainContextProvider } from './common/main-context';
let { mainContainer, outletContainer } = styles;

export function App() {
  const headerTitle = 'Wildfire Support';
  const menuItems: any[] = [];
  //   const menuItems = [
  //     { href: '/', text: 'Home' },
  //     // { href: 'utilization', text: 'Utilization' },
  //     // { href: '/', text: 'Invoicing' },
  //   ].map((item, idx) => (
  //     <a key={idx} href={item.href}>
  //       {item.text}
  //     </a>
  //   ));

  return (
    <div className={mainContainer}>
      <GoAAppHeader url='/' heading={headerTitle} maxContentWidth='100%'>
        {menuItems}
      </GoAAppHeader>

      <div className={outletContainer}>
        <MainContextProvider>
          <Outlet />
        </MainContextProvider>
      </div>
    </div>
  );
}

export default App;
