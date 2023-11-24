import {
  GoAAppHeader,
  GoAMicrositeHeader,
  GoAAppFooter,
  GoAPageBlock,
  GoAAppFooterMetaSection,
  GoAOneColumnLayout,
} from '@abgov/react-components';
import { Outlet } from 'react-router-dom';
import styles from './App.module.scss';
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
        <Outlet />
      </div>
    </div>
  );
}

export default App;
