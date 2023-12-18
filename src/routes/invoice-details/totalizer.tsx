import { GoAContainer, GoATable } from '@abgov/react-components';
import styles from './totalizer.module.scss';
import { useEffect, useState } from 'react';
import moment from 'moment';

let { totalizerAmount, totalizerAmountLabel } = styles;

export default function Totalizer() {

  const [invoiceAmount, setInvoiceAmount] = useState(0);

  const formatter = new Intl.NumberFormat('default', {
    style: 'currency',
    currency: 'USD',
  });

  let val = formatter.format(invoiceAmount);

  useEffect(() => {
    if (sessionStorage.getItem('invoiceData') !== null) {
      let invoiceData = JSON.parse(sessionStorage.getItem('invoiceData') || '{}');
      setInvoiceAmount(invoiceData.InvoiceAmount);
    }
  });

  return (
    <GoAContainer>
      <div className={totalizerAmountLabel}>Invoice Amount</div>
      <div>
        <label className={totalizerAmount}>{val}</label>
      </div>
      <br />
      <div className={totalizerAmountLabel}>Reconciled Amount</div>
      <div>
        {' '}
        <label className={totalizerAmount}>$0.00</label>
      </div>
      <br />
      <div className={totalizerAmountLabel}>Remaining Amount</div>
      <div>
        {' '}
        <label className={totalizerAmount}>$27,000.00</label>
      </div>
    </GoAContainer>
  );
}
