import { useNavigate } from 'react-router-dom';
import styles from './invoice-details.module.scss';
import Summary from './summary';
import Totalizer from './totalizer';
import DetailsTab from './details-tab';
import ReconciledTab from './reconciled-tab';
import { useEffect, useState } from 'react';
import { GoAButton, GoAIcon } from '@abgov/react-components';
import InvoiceModalDialog from '@/common/invoice-modal-dialog';
import { useAppDispatch, useAppSelector, useConditionalAuth } from '@/app/hooks';
import { deleteDraftInvoice, getCustomLists, saveDraftInvoice } from './invoice-details-actions';
import { setAddedTimeReportData, setFlightReportIds, setInvoiceData, setOtherCostData, setRowData } from '@/app/app-slice';
import EditPayableModalDialog from './edit-payables-modal-dialog';
import { InvoiceStatus } from '@/interfaces/invoices/invoice.interface';
import DeleteInvoiceModal from './delete-invoice-modal';

const {
  container,
  content,
  sideBar,
  main,
  footer,
  icon,
  tabGroupContainer,
  tabList,
  tabContainer,
  summaryContainer,
  headerContent,
  tabHeader,
  spacer,
} = styles;

export default function InvoiceDetails() {
  const auth = useConditionalAuth();
  const dispatch = useAppDispatch();
  const rowData = useAppSelector((state) => state.app.rowData);
  const otherCostData = useAppSelector((state) => state.app.otherCostData);

  const navigate = useNavigate();

  const invoiceData = useAppSelector((state) => state.app.invoiceData);

  const [tabIndex, setTabIndex] = useState<number>(1);

  const [reconciledAmount, setReconciledAmount] = useState<number>(0);
  const [parentShowModal, setParentShowModal] = useState<boolean>(false);

  function isReconciled() {
    const delta = 0.01;
    const diff = Math.abs(invoiceData.InvoiceAmount - reconciledAmount);
    return diff < delta;
  }
  useEffect(() => {
    dispatch(getCustomLists({ token: auth?.user?.access_token }));
  }, [auth]);

  useEffect(() => {
    const total = rowData
      .filter((x) => x.isAdded)
      .reduce((acc, cur) => {
        return acc + cur.data.cost;
      }, 0);

    const otherTotal = otherCostData
      ? otherCostData.reduce((acc, cur) => {
          return acc + cur.cost;
        }, 0)
      : 0;
    setReconciledAmount(total + otherTotal);
  }, [rowData, otherCostData]);

  function save() {
    const flightReportIds = rowData.map((x) => x.data.flightReportId).filter((obj, index, self) => index === self.findIndex((o) => o === obj));

    dispatch(setInvoiceData(invoiceData));
    dispatch(setOtherCostData(otherCostData));
    dispatch(setAddedTimeReportData(rowData.filter((x) => x.isAdded)));
    dispatch(setFlightReportIds(flightReportIds));
    dispatch(saveDraftInvoice({ token: auth?.user?.access_token }));
  }

  function cancel() {
    dispatch(
      setRowData(
        rowData.map((r) => {
          return { ...r, isAdded: false };
        }),
      ),
    );
    dispatch(setOtherCostData([]));
    // navigate to time reports page
    navigate(`/invoice-processing/${invoiceData.ContractNumber}`);
  }
  function onNextClicked() {
    const flightReportIds = rowData.map((x) => x.data.flightReportId).filter((obj, index, self) => index === self.findIndex((o) => o === obj));

    dispatch(setInvoiceData(invoiceData));
    dispatch(setOtherCostData(otherCostData));
    dispatch(setAddedTimeReportData(rowData.filter((x) => x.isAdded)));
    dispatch(setFlightReportIds(flightReportIds));

    navigate(`/invoice-process/${invoiceData.InvoiceNumber}`);
  }

  function onDelete() {
    dispatch(deleteDraftInvoice({ token: auth?.user?.access_token, invoiceId: invoiceData.InvoiceID, contractNumber: invoiceData.ContractNumber }));
  }
  const showOtherCostsModal = () => {
    console.log('setParentShowModal(true);');
    setParentShowModal(true);
  };

  return (
    <div className={container}>
      <div className={content}>
        <div className={sideBar}>
          <div className={headerContent}>
            <div>
              <h2>Invoice</h2>
            </div>
            <div>
              <InvoiceModalDialog />
            </div>
          </div>

          <Totalizer
            invoiceAmount={invoiceData.InvoiceAmount}
            reconciledAmount={reconciledAmount}
            remainingAmount={invoiceData.InvoiceAmount - reconciledAmount}
          />
          <div className={summaryContainer}>
            <Summary />
          </div>
        </div>
        <div className={main}>
          <div className={tabGroupContainer}>
            <div className={tabHeader}>
              <div className={tabList}>
                <button id='Payables' role='tab' aria-selected={tabIndex === 1} onClick={() => setTabIndex(1)}>
                  <span>Payables</span>
                </button>
                <button id='Reconciled' role='tab' aria-selected={tabIndex === 2} onClick={() => setTabIndex(2)}>
                  <span>Reconciled</span>
                </button>
              </div>
              <GoAButton type='tertiary' onClick={showOtherCostsModal}>
                {' '}
                Edit Payables{' '}
              </GoAButton>
            </div>
            <div className={tabContainer}>
              {tabIndex === 1 && <DetailsTab />}
              {tabIndex === 2 && <ReconciledTab />}
            </div>
          </div>
        </div>
      </div>
      <div className={footer}>
        <GoAButton type='primary' onClick={onNextClicked} disabled={!isReconciled()}>
          <div className={icon}>
            <GoAIcon type='download'></GoAIcon>
          </div>
          Next
        </GoAButton>
        <GoAButton type='secondary' onClick={save}>
          Save
        </GoAButton>
        <GoAButton type='tertiary' onClick={cancel}>
          Cancel
        </GoAButton>
        <div className={spacer}></div>
        {invoiceData.InvoiceStatus === InvoiceStatus.Draft && <DeleteInvoiceModal onDelete={onDelete}></DeleteInvoiceModal>}
      </div>
      <EditPayableModalDialog
        contractNumber={invoiceData.ContractNumber}
        show={parentShowModal}
        showEditPayableDialog={setParentShowModal}
        searchValue=''
      />
    </div>
  );
}
