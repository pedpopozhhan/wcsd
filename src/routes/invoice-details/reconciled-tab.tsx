import { useState, useEffect, FC, useContext } from 'react';
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

interface IReconciledTabProps { }
const ReconciledTab: FC<IReconciledTabProps> = (props: IReconciledTabProps) => {
  const context = useContext(InvoiceDetailsContext);
  const { rowData, setRowData, otherCostData, setOtherCostData } = context;
  const [parentShowModal, setParentShowModal] = useState<boolean>(false);
  const [otherCostDataToUpdate, setOtherCostDataToUpdate] = useState<IOtherCostTableRowData>();

  useEffect(() => {

  }, [otherCostData]);

  const showOtherCostsModal = () => {
    setParentShowModal(true);
  };

  function onAddUpdateRemoveOtherCost(amountToAdjust: number) {
    //update the totalizer
    console.log(amountToAdjust);
  }

  function onOtherCostAdded(item: IOtherCostTableRowData) {
    setOtherCostData(
      [...otherCostData, item].map((x, index) => {
        x.index = index;
        return x;
      })
    );
  }

  function onOtherCostRemoved(item: IOtherCostTableRowData) {
    let items = [...otherCostData].filter(p => p.index != item.index);
    items.map((x, i) => {
      x.index = i;
      return x;
    });
    setOtherCostData(items);
  }

  function onOtherCostUpdated(item: IOtherCostTableRowData) {
    let items = [...otherCostData].filter(p => p.index != item.index);
    setOtherCostData(
      [...items, item].map((x, index) => {
        x.index = index;
        return x;
      })
    );
  }

  function removeAll() {
    setRowData(
      rowData.map((x) => {
        return { ...x, isAdded: false };
      })
    );
  }

  return (
    <div className={container}>
      <div className={headerButtonContainer}>
        <GoAButton type='secondary' onClick={showOtherCostsModal}>
          Add other costs
        </GoAButton>
        <GoAButton type='tertiary' onClick={removeAll}>
          Remove all
        </GoAButton>
      </div>
      <div className={tabContainer}>
        <div className={reconciledDetailsDiv}>
          <InvoiceDataTable filter={(x: IDetailsTableRow) => x.isAdded} />
        </div>
        <div className={otherCostHeader}>Other Costs</div>
        <div className={otherCostsDiv}>
          <OtherCostDetailsTable
            data={otherCostData}
            onRemoveOtherCost={onOtherCostRemoved}
            onUpdateOtherCost={onOtherCostUpdated}
          />
        </div>{' '}
      </div>

      <OtherCostModalDialog
        isAddition={true}
        visible={parentShowModal}
        onAddUpdate={onOtherCostAdded}
        showOtherCostDialog={setParentShowModal}
        data={otherCostDataToUpdate}
      />
    </div>
  );
};
export default ReconciledTab;
