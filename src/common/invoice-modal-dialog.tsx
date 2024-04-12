import { GoAInput, GoAButton, GoAFormItem, GoAInputDate, GoAModal, GoAButtonGroup } from '@abgov/react-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector, useConditionalAuth } from '@/app/hooks';
import { setInvoiceData } from '@/app/app-slice';
import { failedToPerform, publishToast } from './toast';
import { EmptyInvoiceId } from './types/invoice';
import processInvoiceService from '@/services/process-invoice.service';
import { navigateTo } from './navigate';
import { Subscription } from 'rxjs';
import styles from './invoice-modal-dialog.module.scss';
const { container } = styles;
export interface IInvoiceData {
  InvoiceID: string;
  InvoiceNumber: string;
  DateOnInvoice: string;
  InvoiceAmount: number;
  PeriodEnding: string;
  InvoiceReceived: string;
  ContractNumber: string;
  UniqueServiceSheetName: string;
  PurchaseGroup?: string;
  ServiceDescription?: string;
  CommunityCode?: string;
  MaterialGroup?: string;
  AccountType?: string;
  Quantity?: string;
  UnitOfMeasure?: string;
  Price?: string;
}
interface InvoiceModalProps {
  isNew?: boolean;
  contract?: string;
  onClose?: () => void;
  onOpen?: () => void;
}

const InvoiceModalDialog = (props: InvoiceModalProps) => {
  const dispatch = useAppDispatch();
  const auth = useConditionalAuth();
  const invoiceData = useAppSelector((state) => state.app.invoiceData);

  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [labelforInvoiceOperation, setlabelforInvoiceOperation] = useState<string>('Continue');
  const [isInvoiceAddition, setIsInvoiceAddition] = useState<boolean>(props.isNew);
  const [invoiceNumberError, setInvoiceNumberError] = useState<boolean>(false);
  const [invoiceNumberErrorLabel, setInvoiceNumberErrorLabel] = useState<string>('');
  const [dateOfInvoice, setDateOfInvoice] = useState<string>(new Date().toISOString());
  const [dateOfInvoiceError, setDateOfInvoiceError] = useState<boolean>(false);
  const [dateOfInvoiceErrorLabel, setDateOfInvoiceErrorLabel] = useState<string>('');
  const [invoiceAmount, setInvoiceAmount] = useState<number>(0);
  const [invoiceAmountError, setInvoiceAmountError] = useState<boolean>(false);
  const [invoiceAmountErrorLabel, setInvoiceAmountErrorLabel] = useState<string>('');
  const [periodEndingDate, setPeriodEndingDate] = useState<string>(new Date().toISOString());
  const [periodEndingDateError, setPeriodEndingDateError] = useState<boolean>(false);
  const [invoiceReceivedDate, setInvoiceReceivedDate] = useState<string>(new Date().toISOString());
  const [invoiceReceivedDateError, setInvoiceReceivedDateError] = useState<boolean>(false);
  const [maxDate] = useState<Date>(getDateWithMonthOffset(1));
  const [contractNumber, setContractNumber] = useState(props.contract);
  const [pageHasError, setPageHasError] = useState<boolean>(false);
  const [minDate] = useState<Date>(new Date(1950, 1, 2));
  const [dialogTitle, setDialogTitle] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  let subscription: Subscription;
  const invoiceForContext = {
    InvoiceID: EmptyInvoiceId,
    InvoiceNumber: invoiceNumber,
    DateOnInvoice: dateOfInvoice,
    InvoiceAmount: invoiceAmount,
    PeriodEnding: periodEndingDate,
    InvoiceReceived: invoiceReceivedDate,
    ContractNumber: contractNumber,
    UniqueServiceSheetName: '',
    ServiceDescription: 'Professional Services',
  };

  const invoiceAmountErrorLabelText = 'Cannot invoice for $0.00';
  const dateOfInvoiceErrorLabelText = 'Date cannot be 1950/02/01 or earlier'; //
  const dateOfInvoiceEarlierThanPEDErrorLabelText = 'Cannot be earlier than period ending date';
  const modalDialogWidth = '620px';
  const leftColumnControlWidth = '270px';
  const righColumnControlWidth = '280px';

  const navigate = useNavigate();
  function getDateWithMonthOffset(offset: number) {
    const d = new Date();
    d.setMonth(d.getMonth() + offset);
    return d;
  }
  useEffect(() => {
    const re = /^[a-zA-Z0-9\b]+$/;
    if (!re.test(invoiceNumber)) {
      setInvoiceNumber(invoiceNumber.replace(/[^a-zA-Z0-9]/gi, ''));
    }
  });
  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  });

  useEffect(() => {
    if (!props.isNew) {
      setEditMode(true);
      setDialogTitle('Update invoice');
      setIsInvoiceAddition(false);
      setlabelforInvoiceOperation('Update');

      if (invoiceData != null) {
        setToSessionData();
      }
    } else {
      setEditMode(false);
      setDialogTitle('Create invoice');
    }
  }, [isInvoiceAddition]);

  const setToSessionData = () => {
    setInvoiceNumber(invoiceData.InvoiceNumber);
    setInvoiceAmount(invoiceData.InvoiceAmount);
    setDateOfInvoice(invoiceData.DateOnInvoice);
    setInvoiceReceivedDate(invoiceData.InvoiceReceived);
    setPeriodEndingDate(invoiceData.PeriodEnding);
    setContractNumber(invoiceData.ContractNumber);
  };

  const clearErrors = () => {
    setInvoiceNumberError(false);
    setInvoiceAmountError(false);
    setDateOfInvoiceError(false);
    setPeriodEndingDateError(false);
    setInvoiceReceivedDateError(false);
    setInvoiceNumberErrorLabel('');
    setInvoiceAmountErrorLabel('');
    setDateOfInvoiceErrorLabel('');
  };

  const clearDataPoints = () => {
    setInvoiceNumber('');
    setInvoiceAmount(0);
    setDateOfInvoice(new Date().toISOString());
    setPeriodEndingDate(new Date().toISOString());
    setInvoiceReceivedDate(new Date().toISOString());
  };

  const hideModalDialog = () => {
    if (props.isNew) {
      clearDataPoints();
    } else {
      if (invoiceData != null) setToSessionData();
    }
    clearErrors();
    setIsVisible(false);
    if (props.onClose) {
      props.onClose();
    }
  };

  function setInvoice() {
    if (invoiceNumber.trim().length <= 0 /* || invoiceNumberErrorLabel*/) {
      setInvoiceNumberError(true);
      return;
    }

    if (subscription) {
      subscription.unsubscribe();
    }

    subscription = processInvoiceService.doesInvoiceNumberExistForContract(auth?.user?.access_token, invoiceNumber, contractNumber).subscribe({
      next: (data) => {
        if (data) {
          setInvoiceNumberErrorLabel('Invoice already exists. Must be unique.');
          setInvoiceNumberError(true);
        } else {
          setInvoiceNumberErrorLabel('');
          processFields();
        }
      },
      error: (error) => {
        console.log(error);
        if (error.response && error.response.status === 403) {
          navigateTo('unauthorized');
        }
        publishToast({
          type: 'error',
          message: failedToPerform('check invoice number exists', error.response.data),
        });
      },
    });
  }

  function processFields() {
    if (Number.isNaN(invoiceAmount) || invoiceAmount <= 0 || invoiceAmount === null || invoiceAmount > 999999999.99) {
      setInvoiceAmountError(true);
      setInvoiceAmountErrorLabel(invoiceAmountErrorLabelText);
      return;
    } else {
      setInvoiceAmountError(false);
      setInvoiceAmountErrorLabel('');
    }

    //if (new Date(yearMonthDay(dateOfInvoice)) < minDate || dateOfInvoiceError) {
    if (new Date(dateOfInvoice) < minDate || dateOfInvoiceError) {
      setDateOfInvoiceError(true);
      setDateOfInvoiceErrorLabel(dateOfInvoiceErrorLabelText);
      return;
    } else {
      setDateOfInvoiceError(false);
      setDateOfInvoiceErrorLabel('');
    }

    if (new Date(periodEndingDate) < minDate || periodEndingDateError) {
      setPeriodEndingDateError(true);
      return;
    } else {
      if (new Date(dateOfInvoice) < new Date(periodEndingDate)) {
        setDateOfInvoiceErrorLabel(dateOfInvoiceEarlierThanPEDErrorLabelText);
        return;
      } else {
        setDateOfInvoiceErrorLabel('');
        setPeriodEndingDateError(false);
      }
    }

    if (new Date(invoiceReceivedDate) < minDate || invoiceReceivedDateError) {
      setInvoiceReceivedDateError(true);
      return;
    } else {
      setInvoiceReceivedDateError(false);
    }

    if (pageHasError) return;

    // put them in the session object
    if (isInvoiceAddition) {
      dispatch(setInvoiceData(invoiceForContext));
      clearDataPoints();
      clearErrors();

      // Navigate to invoice detail page
      navigate(`/invoice/${invoiceNumber}`, { state: invoiceNumber });
    } else {
      dispatch(setInvoiceData(invoiceForContext));
      publishToast({ type: 'info', message: 'Invoice updated.' });
      clearErrors();
      setIsVisible(false);
      if (props.onClose) {
        props.onClose();
      }
    }
  }

  function getHelperText() {
    return invoiceNumberErrorLabel ? '' : 'Number on invoice. Must be unique.';
  }

  function onOpen() {
    if (props.onOpen) {
      props.onOpen();
      setIsVisible(true);
    }
  }
  return (
    <>
      {editMode && (
        <GoAButton type='tertiary' onClick={() => setIsVisible(true)}>
          Edit
        </GoAButton>
      )}
      {!editMode && (
        <GoAButton size='compact' type='primary' onClick={onOpen}>
          Reconcile
        </GoAButton>
      )}
      <GoAModal
        heading={dialogTitle}
        open={isVisible}
        maxWidth={modalDialogWidth}
        actions={
          <GoAButtonGroup alignment='end'>
            <GoAButton type='secondary' onClick={() => hideModalDialog()}>
              Cancel
            </GoAButton>

            <GoAButton type='primary' onClick={() => setInvoice()}>
              {labelforInvoiceOperation}
            </GoAButton>
          </GoAButtonGroup>
        }
      >
        <table className={container}>
          <tbody>
            <tr>
              <td>
                <GoAFormItem label='Invoice' helpText={getHelperText()} error={invoiceNumberErrorLabel}>
                  <GoAInput
                    name='invoiceNumber'
                    width={leftColumnControlWidth}
                    maxLength={16}
                    value={invoiceNumber}
                    error={invoiceNumberError}
                    onBlur={() => {}}
                    onChange={(key, value) => {
                      setInvoiceNumber(value.trim());
                      if (!value) {
                        setInvoiceNumberErrorLabel('');
                      }
                      if (value.trim().length <= 0) {
                        setInvoiceNumberError(true);
                      } else {
                        setInvoiceNumberError(false);
                        setPageHasError(false);
                        setInvoiceNumberErrorLabel('');
                      }
                    }}
                  />
                </GoAFormItem>
              </td>
              <td></td>
              <td>
                <GoAFormItem label='Date on invoice' error={dateOfInvoiceErrorLabel}>
                  <GoAInputDate
                    name='dateOnInvoice'
                    placeholder='YYYY-MM-DD'
                    error={dateOfInvoiceError}
                    value={dateOfInvoice}
                    min={minDate}
                    max={maxDate}
                    width={righColumnControlWidth}
                    onChange={(name, value) => {
                      if (value === '') {
                        setDateOfInvoiceError(true);
                        setPageHasError(true);
                      } else if (isNaN(Date.parse(value.toString()))) {
                        setDateOfInvoiceError(true);
                        setPageHasError(true);
                      } else {
                        const propertyValue: Date = new Date(value);
                        setDateOfInvoice(propertyValue.toISOString());
                        if (propertyValue < minDate) {
                          setDateOfInvoiceError(true);
                          setDateOfInvoiceErrorLabel(dateOfInvoiceErrorLabelText);
                          setPageHasError(true);
                        } else {
                          setDateOfInvoiceError(false);
                          setDateOfInvoiceErrorLabel('');
                          setPageHasError(false);
                        }
                      }
                    }}
                  />
                </GoAFormItem>
              </td>
            </tr>
            <tr>
              <td>
                <GoAFormItem label='Invoice amount' error={invoiceAmountErrorLabel}>
                  <GoAInput
                    name='ctrlInvoiceAmount'
                    type='number'
                    width={leftColumnControlWidth}
                    maxLength={10}
                    error={invoiceAmountError}
                    value={invoiceAmount.toString()}
                    max='99999999'
                    min='0'
                    leadingContent='$'
                    onBlur={(key, value) => {
                      if (Number.isNaN(value) || Number.isNaN(Number.parseFloat(value))) {
                        setInvoiceAmountError(true);
                        setInvoiceAmountErrorLabel(invoiceAmountErrorLabelText);
                        setPageHasError(true);
                      } else {
                        setInvoiceAmount(Number(value));
                        setInvoiceAmountError(false);
                        setInvoiceAmountErrorLabel('');
                        setPageHasError(false);
                      }
                    }}
                    onChange={(key, value) => {
                      if (Number.isNaN(value) || Number.isNaN(Number.parseFloat(value))) {
                        setInvoiceAmountError(true);
                        setInvoiceAmountErrorLabel(invoiceAmountErrorLabelText);
                        setPageHasError(true);
                        setInvoiceAmount(0);
                      } else {
                        if (Number(value) <= 0) {
                          setInvoiceAmountError(true);
                          setInvoiceAmountErrorLabel(invoiceAmountErrorLabelText);
                          setPageHasError(true);
                          setInvoiceAmount(0);
                        } else {
                          setInvoiceAmount(Number(value));
                          setInvoiceAmountError(false);
                          setInvoiceAmountErrorLabel('');
                          setPageHasError(false);
                        }
                      }
                    }}
                  />
                </GoAFormItem>
              </td>
              <td></td>
              <td>
                <GoAFormItem label='Period ending'>
                  <GoAInputDate
                    name='periodEndingDate'
                    placeholder='yyyy-MM-DD'
                    value={periodEndingDate}
                    error={periodEndingDateError}
                    min={minDate}
                    max={maxDate}
                    width={righColumnControlWidth}
                    onChange={(name, value) => {
                      if (value === '') {
                        setPeriodEndingDateError(true);
                        setPageHasError(true);
                      } else if (isNaN(Date.parse(value.toString()))) {
                        setPeriodEndingDateError(true);
                        setPageHasError(true);
                      } else {
                        const propertyValue: Date = new Date(value);
                        setPeriodEndingDate(propertyValue.toISOString());
                        if (propertyValue < minDate) {
                          setPeriodEndingDateError(true);
                          setPageHasError(true);
                        } else {
                          if (new Date(dateOfInvoice) < propertyValue) {
                            setDateOfInvoiceErrorLabel(dateOfInvoiceEarlierThanPEDErrorLabelText);
                          } else {
                            setDateOfInvoiceErrorLabel('');
                            setPeriodEndingDateError(false);
                            setPageHasError(false);
                          }
                        }
                      }
                    }}
                  />
                </GoAFormItem>
              </td>
            </tr>
            <tr>
              <td>
                <GoAFormItem label='Invoice received'>
                  <GoAInputDate
                    name='invoiceReceivedDate'
                    placeholder='YYYY-MM-DD'
                    value={invoiceReceivedDate}
                    error={invoiceReceivedDateError}
                    min={minDate}
                    max={maxDate}
                    width={leftColumnControlWidth}
                    onChange={(name, value) => {
                      if (value === '') {
                        setInvoiceReceivedDateError(true);
                        setPageHasError(true);
                      } else if (isNaN(Date.parse(value.toString()))) {
                        setInvoiceReceivedDateError(true);
                        setPageHasError(true);
                      } else {
                        const propertyValue: Date = new Date(value);
                        setInvoiceReceivedDate(propertyValue.toISOString());
                        if (propertyValue < minDate) {
                          setInvoiceReceivedDateError(true);
                          setPageHasError(true);
                        } else {
                          setInvoiceReceivedDateError(false);
                          setPageHasError(false);
                        }
                      }
                    }}
                  />
                </GoAFormItem>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </GoAModal>
    </>
  );
};

export default InvoiceModalDialog;
