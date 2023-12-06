import { useParams } from 'react-router-dom';
import styles from './invoice-details.module.scss';
import Summary from './summary';
import Totalizer from './totalizer';
import DetailsTable from './details-table';

let { container, content, sideBar, main, footer } = styles;

export default function InvoiceDetails() {
  const { invoiceId } = useParams();

  return (
    <div className={container}>
      <div className={content}>
        <div className={sideBar}>
          <Totalizer />
          <Summary />
        </div>
        <div className={main}>
          <DetailsTable />
        </div>
      </div>
      <div className={footer}>footer</div>
    </div>
  );
}
