import { useParams } from 'react-router-dom';
import styles from './invoice-details.module.scss';
import Summary from './summary';

let { container, content, sideBar, main, footer } = styles;

export default function InvoiceDetails() {
  const { invoiceId } = useParams();

  return (
    <div className={container}>
      <div className={content}>
        <div className={sideBar}>
          <Summary />
        </div>
        <div className={main}>main</div>
      </div>
      <div className={footer}>footer</div>
    </div>
  );
}
