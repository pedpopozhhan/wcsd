import { useNavigate, useParams } from 'react-router-dom';
import styles from './reconciled-invoice-details.module.scss';
import { GoAButton } from '@abgov/react-components';

let {
  headerButtonContainer,
  reconciledDetailsDiv,
  otherCostsDiv,
  otherCostHeader,
} = styles;

export default function ReconciledInvoiceDetails() {  
  return (
    <div>
      <div className={headerButtonContainer}>
        <GoAButton type='secondary'>Add other costs</GoAButton>
        <GoAButton type='tertiary'> Remove all</GoAButton>
      </div>
      <div className={reconciledDetailsDiv}>
      </div>
      <div className={otherCostHeader}>Other Costs</div>
      <div className= {otherCostsDiv}></div>
    </div>
  );
}
