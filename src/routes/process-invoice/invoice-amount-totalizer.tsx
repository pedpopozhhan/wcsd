import styles from './invoice-amount-totalizer.module.scss';
import { FC } from 'react';
import { convertToCurrency } from '@/common/currency';
//import FlipNumber from './flip-number';

let { container, totalizerAmount, totalizerAmountLabel, section } = styles;
interface IInvoiceAmountTotalizer {
  invoiceAmount: number;
}

const InvoiceAmountTotalizer: FC<IInvoiceAmountTotalizer> = (props) => {
  return (
    <div className={container}>
     <div className={section}>
        <div className={totalizerAmountLabel}>Invoice Amount</div>
        <div className={totalizerAmount}>
          {convertToCurrency(props.invoiceAmount)}
        </div>
      </div>
    </div>
  );
};
export default InvoiceAmountTotalizer;
