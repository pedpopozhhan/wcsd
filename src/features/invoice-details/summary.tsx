import styles from './summary.module.scss';
import { yearMonthDay } from '@/common/dates';
import { GoAIcon } from '@abgov/react-components';
import { useAppDispatch, useAppSelector, useConditionalAuth } from '@/app/hooks';
import { useEffect, useState } from 'react';
import SheetNameModal from './sheet-name-modal';
import { EmptyInvoiceId } from '@/common/types/invoice';
import { updateInvoice } from '../process-invoice/process-invoice-epic';
const { container } = styles;
interface ISummaryProps {
  showSheet?: boolean;
}
const Summary: React.FC<ISummaryProps> = (props) => {
  const dispatch = useAppDispatch();
  const auth = useConditionalAuth();
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

  function onSheetNameUpdated() {
    setOpenModal(false);
    if (invoiceData.InvoiceID !== EmptyInvoiceId) {
      dispatch(updateInvoice({ token: auth?.user?.access_token }));
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === 'Enter' || e.code === 'Space') {
      setOpenModal(true);
    }
  }

  return (
    <div className={container}>
      <div>
        <div>Vendor</div>
        <div>{contract.vendorName}</div>
      </div>
      <div></div>
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
                <a onClick={serviceSheetClick} tabIndex={0} onKeyDown={handleKeyDown}>
                  <GoAIcon type='pencil' theme='outline'></GoAIcon>
                </a>
              )}
            </div>
            <div>
              {!invoiceData.UniqueServiceSheetName && (
                <a onClick={serviceSheetClick} tabIndex={0} onKeyDown={handleKeyDown}>
                  Enter name
                </a>
              )}
              {invoiceData.UniqueServiceSheetName && <>{invoiceData.UniqueServiceSheetName}</>}
            </div>
          </div>
          <div>
            <div>Service description</div>
            <div>{invoiceData.ServiceDescription}</div>
          </div>
          <SheetNameModal open={openModal} onClose={onCloseModal} onUpdate={onSheetNameUpdated}></SheetNameModal>
        </>
      )}
    </div>
  );
};

export default Summary;
