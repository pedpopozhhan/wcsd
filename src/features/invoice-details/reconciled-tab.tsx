import { useState, useEffect, FC } from 'react';
import styles from './reconciled-tab.module.scss';
import { GoAButton } from '@abgov/react-components';
import OtherCostModalDialog from './other-cost-modal-dialog';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import OtherCostDetailsTable from './other-cost-details-table';
import { IDetailsTableRow } from './details-table-row.interface';
import InvoiceDataTable from './invoice-data-table';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setOtherCostData, setRowData } from './invoice-details-slice';
import FlyOut from '@/common/fly-out';

let { container, headerButtonContainer, tabContainer, reconciledDetailsDiv, otherCostsDiv, otherCostHeader } = styles;

interface IReconciledTabProps { }
const ReconciledTab: FC<IReconciledTabProps> = (props: IReconciledTabProps) => {
  const dispatch = useAppDispatch();
  const rowData = useAppSelector((state) => state.invoiceDetails.rowData);
  const otherCostData = useAppSelector((state) => state.invoiceDetails.otherCostData);
  const [parentShowModal, setParentShowModal] = useState<boolean>(false);
  const [otherCostDataToUpdate, setOtherCostDataToUpdate] = useState<IOtherCostTableRowData>();

  useEffect(() => { }, [otherCostData]);

  const showOtherCostsModal = () => {
    console.log('setParentShowModal(true);');
    setParentShowModal(true);
  };

  function onAddUpdateRemoveOtherCost(amountToAdjust: number) {
    //update the totalizer
    console.log(amountToAdjust);
  }

  function onOtherCostAdded(item: IOtherCostTableRowData) {
    dispatch(
      setOtherCostData(
        [...otherCostData, item].map((x, index) => {
          x.index = index;
          return x;
        })
      )
    );
  }

  function onOtherCostRemoved(item: IOtherCostTableRowData) {
    let items = [...otherCostData].filter((p) => p.index != item.index);
    items.map((x, i) => {
      x.index = i;
      return x;
    });
    dispatch(setOtherCostData(items));
  }

  function onOtherCostUpdated(item: IOtherCostTableRowData) {
    let items = [...otherCostData].filter((p) => p.index != item.index);
    dispatch(
      setOtherCostData(
        [...items, item].map((x, index) => {
          x.index = index;
          return x;
        })
      )
    );
  }

  function removeAll() {
    dispatch(
      setRowData(
        rowData.map((x) => {
          return { ...x, isAdded: false };
        })
      )
    );
    dispatch(setOtherCostData([]));
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
          <OtherCostDetailsTable data={otherCostData} onRemoveOtherCost={onOtherCostRemoved} onUpdateOtherCost={onOtherCostUpdated} />
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
