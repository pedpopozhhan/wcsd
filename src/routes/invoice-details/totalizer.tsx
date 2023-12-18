import { GoAContainer, GoATable } from '@abgov/react-components';
import styles from './totalizer.module.scss';
import { useEffect, useState } from 'react';
import { convertToCurrency } from '@/common/currency';


let { totalizerAmount, totalizerAmountLabel } = styles;
interface ITotalizer {
  InvoiceAmount: number
}

const Totalizer: React.FC<ITotalizer> = (props) => {
  return (
    <GoAContainer>
      <div className={totalizerAmountLabel}>Invoice Amount</div>
      <div>
        <label className={totalizerAmount}>{convertToCurrency(props.InvoiceAmount)}</label>
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
};

export default Totalizer;
