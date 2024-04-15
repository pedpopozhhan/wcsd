import styles from './totalizer.module.scss';
import { FC, useEffect, useState } from 'react';
import { convertToCurrency } from '@/common/currency';
import FlipNumber from './flip-number';

const { container, totalizerAmount, totalizerAmountLabel, section } = styles;
interface ITotalizerProps {
  invoiceAmount: number;
  reconciledAmount: number;
  remainingAmount: number;
}

const Totalizer: FC<ITotalizerProps> = (props) => {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  useEffect(() => {
    setFirstLoad(false);
  }, [props.invoiceAmount]);
  return (
    <div className={container}>
      <div className={section}>
        <div className={totalizerAmountLabel}>Invoice amount</div>

        <div className={totalizerAmount}>{convertToCurrency(props.invoiceAmount)}</div>
      </div>
      <div className={section}>
        <div className={totalizerAmountLabel}>Reconciled Amount</div>

        <div className={totalizerAmount}>
          {firstLoad && props.reconciledAmount}
          {!firstLoad && <FlipNumber value={props.reconciledAmount}></FlipNumber>}
        </div>
      </div>
      <div className={section}>
        <div className={totalizerAmountLabel}>Remaining Amount</div>
        <div className={totalizerAmount}>
          {firstLoad && props.remainingAmount}
          {!firstLoad && <FlipNumber value={props.remainingAmount}></FlipNumber>}
        </div>
      </div>
    </div>
  );
};
export default Totalizer;
