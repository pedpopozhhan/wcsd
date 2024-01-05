import { useState, useEffect } from 'react';
import styles from './reconciled-tab.module.scss';
import { GoAButton } from '@abgov/react-components';
import OtherCostModalDialog from './other-cost-modal-dialog';
import { IOtherCostTableRowData } from '@/interfaces/invoice-details/other-cost-table-row-data';
import InvoiceOtherCostService from '@/services/invoice-other-cost.service';
import OtherCostDetailsTable from './other-cost-details-table';

let {
  headerButtonContainer,
  reconciledDetailsDiv,
  otherCostsDiv,
  otherCostHeader,
} = styles;

export default function ReconciledTab() {
  const [parentShowModal, setParentShowModal] = useState<boolean>(false);
  const [allData, setAllData] = useState([] as IOtherCostTableRowData[]);

  const showOtherCostsModal = () => {
    setParentShowModal(true);
  };

  useEffect(() => {
    const subscription = InvoiceOtherCostService.getAll().subscribe(
      (results) => {
        const data = results.slice();
        setAllData(data);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  });

  function onAddRemove(newTotal: number) {
    //update the totalizer
  }

  return (
    <div>
      <div className={headerButtonContainer}>
        <GoAButton type='secondary' onClick={showOtherCostsModal}>
          Add other costs
        </GoAButton>
        <GoAButton type='tertiary'> Remove all</GoAButton>
      </div>
      <div className={reconciledDetailsDiv}></div>
      <div className={otherCostHeader}>Other Costs</div>
      <div className={otherCostsDiv}>
        <OtherCostDetailsTable data={allData} onAddRemove={onAddRemove} />
      </div>
      <OtherCostModalDialog
        isAddition='true'
        visible={parentShowModal}
        showOtherCostDialog={setParentShowModal}
      />
    </div>
  );
}
