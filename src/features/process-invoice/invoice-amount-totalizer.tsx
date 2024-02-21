import styles from './invoice-amount-totalizer.module.scss';
import { FC } from 'react';
import { convertToCurrency } from '@/common/currency';
//import FlipNumber from './flip-number';

const { container, totalizerAmount, totalizerAmountLabel, section } = styles;
interface IInvoiceAmountTotalizer {
  invoiceAmount: number | undefined;
}

const InvoiceAmountTotalizer: FC<IInvoiceAmountTotalizer> = (props) => {
  return (
    <div className={container}>
      <div className={section}>
        <div className={totalizerAmountLabel}>Invoice amount</div>
        <div className={totalizerAmount}>
          {convertToCurrency(Number(props.invoiceAmount))}
        </div>
      </div>
    </div>
  );
};
export default InvoiceAmountTotalizer;
