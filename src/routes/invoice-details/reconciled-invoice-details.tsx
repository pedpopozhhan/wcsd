import { useState } from 'react';
import styles from './reconciled-invoice-details.module.scss';
import { GoAButton } from '@abgov/react-components';
import OtherCostModalDialog from './other-cost-modal-dialog';

let {
  headerButtonContainer,
  reconciledDetailsDiv,
  otherCostsDiv,
  otherCostHeader,
} = styles;




export default function ReconciledInvoiceDetails() { 
  
  const [parentShowModal, setParentShowModal] = useState(false);

  const showOtherCostsModal = () => {
    setParentShowModal(true);
  };
  

  return (
    <div>
      <div className={headerButtonContainer}>
        <GoAButton type='secondary' onClick={showOtherCostsModal}>Add other costs</GoAButton>
        <GoAButton type='tertiary'> Remove all</GoAButton>
      </div>
      <div className={reconciledDetailsDiv}>
      </div>
      <div className={otherCostHeader}>Other Costs</div>
      <div className= {otherCostsDiv}></div>
      <OtherCostModalDialog isAddition='true' visible={parentShowModal} showOtherCostDialog={setParentShowModal} />
    </div>
  );
}
