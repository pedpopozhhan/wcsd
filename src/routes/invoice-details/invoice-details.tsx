import { useParams } from 'react-router-dom';
import styles from './invoice-details.module.scss';

let { top, search } = styles;

export default function InvoiceDetails() {
  const { invoiceId } = useParams();

  return <div>Invoice Details</div>;
}
