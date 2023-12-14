import { GoAContainer, GoATable } from '@abgov/react-components';
import styles from './totalizer.module.scss';
import { FC } from 'react';
import { convertToCurrency } from '@/common/currency';

let { container, totalizerAmount, totalizerAmountLabel, section } = styles;
interface ITotalizerProps {
  invoiceAmount: number;
  reconciledAmount: number;
  remainingAmount: number;
}
//   const DetailsTable: React.FC<IDetailsTableProps> = (props) =>
const Totalizer: FC<ITotalizerProps> = (props) => {
  return (
    <div className={container}>
      <div className={section}>
        <div className={totalizerAmountLabel}>Invoice Amount</div>

        <div className={totalizerAmount}>
          {convertToCurrency(props.invoiceAmount)}
        </div>
      </div>
      <div className={section}>
        <div className={totalizerAmountLabel}>Reconciled Amount</div>
        <div className={totalizerAmount}>
          {convertToCurrency(props.reconciledAmount)}
        </div>{' '}
      </div>
      <div className={section}>
        <div className={totalizerAmountLabel}>Remaining Amount</div>
        <div className={totalizerAmount}>
          {convertToCurrency(props.remainingAmount)}
        </div>{' '}
      </div>
    </div>
  );
};
export default Totalizer;
