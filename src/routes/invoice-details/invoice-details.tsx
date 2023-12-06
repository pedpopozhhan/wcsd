import { useParams } from 'react-router-dom';
import styles from './invoice-details.module.scss';
import Summary from './summary';
import Totalizer from './totalizer';
import DetailsTable from './details-table';
import { GoATab, GoATabs } from '@abgov/react-components';

let { container, content, sideBar, main, footer, header, tabs } = styles;

export default function InvoiceDetails() {
  const { invoiceId } = useParams();
  const initialTab = 1;
  return (
    <div className={container}>
      <div className={content}>
        <div className={sideBar}>
          <div className={header}>Invoice</div>
          <Totalizer />
          <Summary />
        </div>
        <div className={main}>
          <GoATabs initialTab={initialTab}>
            <GoATab heading='Details'>
              <DetailsTable />
            </GoATab>
          </GoATabs>
        </div>
      </div>
      <div className={footer}>footer</div>
    </div>
  );
}
