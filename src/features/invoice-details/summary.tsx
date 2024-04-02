import styles from './summary.module.scss';
import { yearMonthDay } from '@/common/dates';
import { GoAIcon, GoAIconButton } from '@abgov/react-components';
import { useAppSelector } from '@/app/hooks';
import { useEffect, useState } from 'react';
import SheetNameModal from './sheet-name-modal';
const { container, assignedToLabel, assignedToIcon, assignedToHeader } = styles;
interface ISummaryProps {
  showSheet?: boolean;
}
const Summary: React.FC<ISummaryProps> = (props) => {
  const invoiceData = useAppSelector((state) => state.app.invoiceData);
  const contract = useAppSelector((state) => state.app.contractForReconciliation);
  const [showSheet, setShowSheet] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    setShowSheet(props.showSheet);
  }, [props]);
  function serviceSheetClick() {
    // launch modal
    setOpenModal(true);
  }
  function onCloseModal() {
    setOpenModal(false);
  }

  return (
    <div className={container}>
      <div>
        <div>Vendor</div>
        <div>{contract.vendorName}</div>
      </div>
      <div>
        <div className={assignedToHeader}>
          <label>Assigned to</label>
          <div className={assignedToIcon}>
            <GoAIconButton icon='information-circle' />
          </div>
        </div>
        <div className={assignedToLabel}>Sarah Tale</div>
      </div>
      <div>
        <div>Contract no.</div>
        <div>{invoiceData.ContractNumber}</div>
      </div>
      <div>
        <div>Type</div>
        <div>{contract.contractType}</div>
      </div>
      <div>
        <div>Invoice no.</div>
        <div>{invoiceData.InvoiceNumber}</div>
      </div>
      <div>
        <div>Invoice date</div>
        <div>{yearMonthDay(invoiceData.DateOnInvoice)}</div>
      </div>
      <div>
        <div>Invoice received</div>
        <div>{yearMonthDay(invoiceData.InvoiceReceived)}</div>
      </div>
      <div>
        <div>Period ending</div>
        <div>{yearMonthDay(invoiceData.PeriodEnding)}</div>
      </div>
      {showSheet && (
        <>
          <div>
            <div>
              Service sheet
              {invoiceData.UniqueServiceSheetName && (
                <a onClick={serviceSheetClick}>
                  <GoAIcon type='pencil' theme='outline'></GoAIcon>
                </a>
              )}
              {/* //   <GoAIconButton onClick={serviceSheetClick} icon='pencil' theme='filled'></GoAIconButton>} */}
            </div>
            <div>
              {!invoiceData.UniqueServiceSheetName && <a onClick={serviceSheetClick}>Enter name</a>}
              {invoiceData.UniqueServiceSheetName && <>{invoiceData.UniqueServiceSheetName}</>}
            </div>
          </div>
          <div>
            <div>Service description</div>
            <div>{invoiceData.ServiceDescription}</div>
          </div>
          <SheetNameModal open={openModal} onClose={onCloseModal}></SheetNameModal>
        </>
      )}
    </div>
  );
};

export default Summary;
