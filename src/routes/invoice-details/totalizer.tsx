import styles from './totalizer.module.scss';
import { FC, useEffect, useState } from 'react';
import { convertToCurrency } from '@/common/currency';

let {
  container,
  totalizerAmount,
  totalizerAmountLabel,
  section,
  reconciledAmount,
  remainingAmount,
} = styles;
interface ITotalizerProps {
  invoiceAmount: number;
  reconciledAmount: number;
  remainingAmount: number;
}

const Totalizer: FC<ITotalizerProps> = (props) => {
  const [reconciledAmountStyle, setReconciledAmountStyle] = useState({
    '--recWhole': 0,
    '--recFraction': 0,
  });
  const [remainingAmountStyle, setRemainingAmountStyle] = useState({
    '--remWhole': 0,
    '--remFraction': 0,
  });

  useEffect(() => {
    // fix to 2 decimal places
    const reconciled = (Math.round(props.reconciledAmount * 100) / 100).toFixed(
      2
    );
    const reconciledSplits = reconciled.toString().split('.');
    const recProperties = {
      '--recWhole': parseInt(reconciledSplits[0]),
      '--recFraction': parseInt(reconciledSplits[1]),
    };

    const remaining = (Math.round(props.remainingAmount * 100) / 100).toFixed(
      2
    );
    const remainingSplits = remaining.toString().split('.');
    const remProperties = {
      '--remWhole': parseInt(remainingSplits[0]),
      '--remFraction': parseInt(remainingSplits[1]),
    };
    setRemainingAmountStyle(remProperties);
    setReconciledAmountStyle(recProperties);
  }, [props]);

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
        <div
          className={`${totalizerAmount} ${reconciledAmount}`}
          style={reconciledAmountStyle as any}
        ></div>
      </div>
      <div className={section}>
        <div className={totalizerAmountLabel}>Remaining Amount</div>
        <div
          className={`${totalizerAmount} ${remainingAmount}`}
          style={remainingAmountStyle as any}
        ></div>
      </div>
    </div>
  );
};
export default Totalizer;
