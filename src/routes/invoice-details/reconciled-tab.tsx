import { useState, useEffect, FC, useContext } from 'react';
import styles from './reconciled-tab.module.scss';
import { GoAButton } from '@abgov/react-components';
import OtherCostModalDialog from './other-cost-modal-dialog';
import { IOtherCostTableRowData } from '@/interfaces/invoice-details/other-cost-table-row-data';
import InvoiceOtherCostService from '@/services/invoice-other-cost.service';
import OtherCostDetailsTable from './other-cost-details-table';
import {
  InvoiceDetailsContext,
  IDetailsTableRow,
} from './invoice-details-context';
import InvoiceDataTable from './invoice-data-table';

let {
  headerButtonContainer,
  reconciledDetailsDiv,
  otherCostsDiv,
  otherCostHeader,
} = styles;

interface IReconciledTabProps {}
const ReconciledTab: FC<IReconciledTabProps> = (props) => {
  const context = useContext(InvoiceDetailsContext);
  const { rowData, setRowData } = context;
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
      <div className={reconciledDetailsDiv}>
        <InvoiceDataTable filter={(x: IDetailsTableRow) => x.isAdded} />
      </div>
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
};
export default ReconciledTab;
