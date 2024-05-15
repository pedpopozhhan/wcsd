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
import IOtherCostTableRow from '@/interfaces/common/other-cost-table-row';
import { publishToast } from '@/common/toast';


const { container, headerButtonContainer, tabContainer, reconciledDetailsDiv, otherCostsDiv, otherCostHeader } = styles;

interface IReconciledTabProps { }
const ReconciledTab: FC<IReconciledTabProps> = () => {
  const dispatch = useAppDispatch();
  const rowData = useAppSelector((state) => state.invoiceDetails.rowData);
  const otherCostData = useAppSelector((state) => state.invoiceDetails.otherCostData);
  const [parentShowModal, setParentShowModal] = useState<boolean>(false);
  const [otherCostDataToUpdate] = useState<IOtherCostTableRow>();

  useEffect(() => { }, [otherCostData]);

  const showOtherCostsModal = () => {
    console.log('setParentShowModal(true);');
    setParentShowModal(true);
  };

  function onOtherCostAdded(item: IOtherCostTableRowData) {
    try {
      dispatch(setOtherCostData([...otherCostData, item]));
      publishToast({ type: 'success', message: 'Other cost was added.' });
    }
    catch (error) {
      publishToast({ type: 'error', message: `Other Cost addition failed with error: # ${error}` });
    }
  }

  function onOtherCostRemoved(item: IOtherCostTableRow) {
    try {
      const items = [...otherCostData];
      items.splice(item.index, 1);
      dispatch(setOtherCostData(items));
      publishToast({ type: 'success', message: 'Other cost was removed.' });
    }
    catch (error) {
      publishToast({ type: 'error', message: `Other Cost removal failed with error: # ${error}` });
    }
  }

  function onOtherCostUpdated(item: IOtherCostTableRow) {
    try {
      const items = [...otherCostData];
      items.splice(item.index, 1);
      dispatch(setOtherCostData([...items, item.data]));
      publishToast({ type: 'success', message: 'Other cost was updated.' });
    }
    catch (error) {
      publishToast({ type: 'error', message: `Other Cost update failed with error: # ${error}` });
    }
  }

  function removeAll() {
    dispatch(
      setRowData(
        rowData.map((x) => {
          return { ...x, isAdded: false };
        }),
      ),
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
          <OtherCostDetailsTable
            data={otherCostData}
            onRemoveOtherCost={onOtherCostRemoved}
            onUpdateOtherCost={onOtherCostUpdated}
            onAddOtherCost={onOtherCostAdded}
          />
        </div>{' '}
      </div>

      <OtherCostModalDialog
        isAddition={true}
        visible={parentShowModal}
        onAdd={onOtherCostAdded}
        onUpdate={onOtherCostUpdated}
        showOtherCostDialog={setParentShowModal}
        rowToUpdate={otherCostDataToUpdate}
      />
    </div>
  );
};
export default ReconciledTab;
