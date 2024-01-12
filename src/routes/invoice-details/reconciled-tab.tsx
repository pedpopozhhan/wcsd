import { useState, FC, useContext } from 'react';
import styles from './reconciled-tab.module.scss';
import { GoAButton } from '@abgov/react-components';
import OtherCostModalDialog from './other-cost-modal-dialog';
import { IOtherCostTableRowData } from '@/interfaces/invoice-details/other-cost-table-row-data';
import OtherCostDetailsTable from './other-cost-details-table';
import {
  InvoiceDetailsContext,
  IDetailsTableRow,
} from './invoice-details-context';
import InvoiceDataTable from './invoice-data-table';

let {
  container,
  headerButtonContainer,
  tabContainer,
  reconciledDetailsDiv,
  otherCostsDiv,
  otherCostHeader,
} = styles;

interface IReconciledTabProps {}
const ReconciledTab: FC<IReconciledTabProps> = (props: IReconciledTabProps) => {
  const context = useContext(InvoiceDetailsContext);
  const { otherData, setOtherData } = context;
  const [parentShowModal, setParentShowModal] = useState<boolean>(false);

  const showOtherCostsModal = () => {
    setParentShowModal(true);
  };

  function onAddUpdateRemoveOtherCost(amountToAdjust: number) {
    //update the totalizer
    console.log(amountToAdjust);
  }

  function onOtherCostAdded(item: IOtherCostTableRowData) {
    setOtherData(
      [...otherData, item].map((x, index) => {
        x.recordid = index;
        return x;
      })
    );
  }

  return (
    <div className={container}>
      <div className={headerButtonContainer}>
        <GoAButton type='secondary' onClick={showOtherCostsModal}>
          Add other costs
        </GoAButton>
        <GoAButton type='tertiary'> Remove all</GoAButton>
      </div>
      <div className={tabContainer}>
        <div className={reconciledDetailsDiv}>
          <InvoiceDataTable filter={(x: IDetailsTableRow) => x.isAdded} />
        </div>
        <div className={otherCostHeader}>Other Costs</div>
        <div className={otherCostsDiv}>
          <OtherCostDetailsTable
            data={otherData}
            onAddUpdateRemoveOtherCost={onAddUpdateRemoveOtherCost}
          />
        </div>{' '}
      </div>

      <OtherCostModalDialog
        isAddition={true}
        visible={parentShowModal}
        onAdd={onOtherCostAdded}
        showOtherCostDialog={setParentShowModal}
      />
    </div>
  );
};
export default ReconciledTab;
