import { GoAContainer, GoATable } from '@abgov/react-components';
import styles from './totalizer.module.scss';

let { totalizerAmount, totalizerAmountLabel } = styles;

export default function Totalizer() {
  return (
    <GoAContainer>
      <div className={totalizerAmountLabel}>Invoice Amount</div>
      <div>
        <label className={totalizerAmount}>$27,000.00</label>
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
