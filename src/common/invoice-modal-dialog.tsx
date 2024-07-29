import { GoAInput, GoAButton, GoAFormItem, GoAInputDate, GoAModal, GoAButtonGroup } from '@abgov/react-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector, useConditionalAuth } from '@/app/hooks';
import { setInvoiceData } from '@/app/app-slice';
import { failedToPerform, publishToast } from './toast';
import { EmptyGuid } from './types/invoice';
import processInvoiceService from '@/services/process-invoice.service';
import { navigateTo } from './navigate';
import { Subscription } from 'rxjs';
import styles from './invoice-modal-dialog.module.scss';
import moment from 'moment';
import { InvoiceStatus } from '@/interfaces/invoices/invoice.interface';
import { saveDraftInvoice } from '@/features/invoice-details/invoice-details-actions';

const { container } = styles;
export interface IInvoiceData {
  InvoiceID: string;
  InvoiceNumber: string;
  InvoiceStatus?: InvoiceStatus;
  DateOnInvoice: string;
  InvoiceAmount: number;
  PeriodEnding: string;
  InvoiceReceived: string;
  ContractNumber: string;
  UniqueServiceSheetName: string;
  ServiceDescription?: string;
  CreatedBy: string;
}

interface InvoiceModalProps {
  isNew?: boolean;
  contract?: string;
  onClose?: () => void;
  onOpen?: () => void;
}

const InvoiceModalDialog = (props: InvoiceModalProps) => {
  function currentDate() {
    return moment().startOf('day').toISOString();
  }
  function currentDateWithMonthOffset(offset: number) {
    const dt = moment().add(offset, 'M').startOf('day').toISOString();
    return dt;
  }

  const dispatch = useAppDispatch();
  const auth = useConditionalAuth();
  const invoiceData = useAppSelector((state) => state.app.invoiceData);

  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [labelforInvoiceOperation, setlabelforInvoiceOperation] = useState<string>('Continue');
  const [isInvoiceAddition, setIsInvoiceAddition] = useState<boolean>(props.isNew);
  const [invoiceNumberError, setInvoiceNumberError] = useState<boolean>(false);
  const [invoiceNumberErrorLabel, setInvoiceNumberErrorLabel] = useState<string>('');
  const [dateOfInvoice, setDateOfInvoice] = useState<string>(currentDate());
  const [dateOfInvoiceError, setDateOfInvoiceError] = useState<boolean>(false);
  const [dateOfInvoiceErrorLabel, setDateOfInvoiceErrorLabel] = useState<string>('');
  const [invoiceAmount, setInvoiceAmount] = useState<number>(0);
  const [invoiceAmountError, setInvoiceAmountError] = useState<boolean>(false);
  const [invoiceAmountErrorLabel, setInvoiceAmountErrorLabel] = useState<string>('');
  const [periodEndingDate, setPeriodEndingDate] = useState<string>(currentDate());
  const [periodEndingDateError, setPeriodEndingDateError] = useState<boolean>(false);
  const [invoiceReceivedDate, setInvoiceReceivedDate] = useState<string>(currentDate());
  const [invoiceReceivedDateError, setInvoiceReceivedDateError] = useState<boolean>(false);
  const maxDate = currentDateWithMonthOffset(1);
  const invoiceReceivedMaxDate = currentDateWithMonthOffset(0);
  const [invoiceReceivedMaxDateErrorLabel, setInvoiceReceivedMaxDateErrorLabel] = useState<string>('');
  const [contractNumber, setContractNumber] = useState(props.contract);
  const [pageHasError, setPageHasError] = useState<boolean>(false);
  const [minDate] = useState<Date>(new Date(1950, 1, 2));
  const [dialogTitle, setDialogTitle] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  let subscription: Subscription;
  const invoiceForContext: IInvoiceData = {
    InvoiceID: EmptyGuid,
    InvoiceNumber: invoiceNumber,
    DateOnInvoice: dateOfInvoice,
    InvoiceAmount: invoiceAmount,
    PeriodEnding: periodEndingDate,
    InvoiceReceived: invoiceReceivedDate,
    ContractNumber: contractNumber,
    UniqueServiceSheetName: '',
    ServiceDescription: 'Professional Services',
    CreatedBy: '',
  };

  const invoiceAmountErrorLabelText = 'Cannot invoice for $0.00';
  const maxInvoiceAmountErrorLabelText = 'Cannot invoice over $999,999,999';
  const maxInvoiceAmount = 999999999;
  const dateOfInvoiceErrorLabelText = 'Date cannot be 1950/02/01 or earlier'; //
  const dateOfInvoiceEarlierThanPEDErrorLabelText = 'Cannot be earlier than period ending date';
  const invoiceReceivedDateEarlierDateErrorText = 'Cannot be earlier than Invoice date.';
  const invoiceReceivedDateFutureDateErrorText = 'Cannot be later than present date';
  const modalDialogWidth = '620px';
  const leftColumnControlWidth = '270px';
  const righColumnControlWidth = '280px';

  const navigate = useNavigate();

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
    setInvoiceReceivedMaxDateErrorLabel('');
  };

  const clearDataPoints = () => {
    const dt = currentDate();
    setInvoiceNumber('');
    setInvoiceAmount(0);
    setDateOfInvoice(dt);
    setPeriodEndingDate(dt);
    setInvoiceReceivedDate(dt);
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
    if (invoiceNumber.trim().length <= 0) {
      setInvoiceNumberError(true);
      return;
    }

    if (subscription) {
      subscription.unsubscribe();
    }

    subscription = processInvoiceService
      .doesInvoiceNumberExistForContract(auth?.user?.access_token, invoiceData.InvoiceID, invoiceNumber, contractNumber)
      .subscribe({
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
            message: failedToPerform('check invoice number exists', error.response.message),
          });
        },
      });
  }

  function processFields() {
    if (Number.isNaN(invoiceAmount) || invoiceAmount <= 0 || invoiceAmount === null) {
      setInvoiceAmountError(true);
      setInvoiceAmountErrorLabel(invoiceAmountErrorLabelText);
      return;
    } else if (invoiceAmount > maxInvoiceAmount) {
      setInvoiceAmountError(true);
      setInvoiceAmountErrorLabel(maxInvoiceAmountErrorLabelText);
      return;
    } else {
      setInvoiceAmountError(false);
      setInvoiceAmountErrorLabel('');
    }

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
      if (dateOfInvoice < periodEndingDate) {
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
    } else if (new Date(invoiceReceivedDate) > new Date(invoiceReceivedMaxDate)) {
      setInvoiceReceivedMaxDateErrorLabel(invoiceReceivedDateFutureDateErrorText);
      setInvoiceReceivedDateError(true);
      return;
    } else if (new Date(invoiceReceivedDate) < new Date(dateOfInvoice)) {
      setInvoiceReceivedMaxDateErrorLabel(invoiceReceivedDateEarlierDateErrorText);
      setInvoiceReceivedDateError(true);
      return;
    } else {
      setInvoiceReceivedDateError(false);
      setInvoiceReceivedMaxDateErrorLabel('');
    }

    if (pageHasError) return;
    invoiceForContext.CreatedBy = auth?.user?.profile.name;
    // put them in the session object
    if (isInvoiceAddition) {
      dispatch(setInvoiceData(invoiceForContext));
      clearDataPoints();
      clearErrors();

      // Navigate to invoice detail page
      navigate(`/invoice/${invoiceNumber}`, { state: invoiceNumber });
    } else {
      invoiceForContext.InvoiceID = invoiceData.InvoiceID;
      dispatch(setInvoiceData(invoiceForContext));
      if (invoiceData.InvoiceStatus === InvoiceStatus.Draft) {
        dispatch(saveDraftInvoice({ token: auth?.user?.access_token }));
      } else {
        publishToast({ type: 'info', message: 'Invoice updated.' });
      }
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
        <GoAButton size='normal' type='secondary' onClick={onOpen}>
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
                    max={maxInvoiceAmount}
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
                        } else if (Number(value) > maxInvoiceAmount) {
                          setInvoiceAmountError(true);
                          setInvoiceAmountErrorLabel(maxInvoiceAmountErrorLabelText);
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
                <GoAFormItem label='Invoice received' error={invoiceReceivedMaxDateErrorLabel}>
                  <GoAInputDate
                    name='invoiceReceivedDate'
                    placeholder='YYYY-MM-DD'
                    value={invoiceReceivedDate}
                    error={invoiceReceivedDateError}
                    min={minDate}
                    max={invoiceReceivedMaxDate}
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
                        } else if (propertyValue < new Date(dateOfInvoice)) {
                          setInvoiceReceivedDateError(true);
                          setInvoiceReceivedMaxDateErrorLabel(invoiceReceivedDateEarlierDateErrorText);
                          setPageHasError(true);
                        } else if (propertyValue > invoiceReceivedMaxDate) {
                          setInvoiceReceivedDateError(true);
                          setInvoiceReceivedMaxDateErrorLabel(invoiceReceivedDateFutureDateErrorText);
                          setPageHasError(true);
                        } else {
                          setInvoiceReceivedDateError(false);
                          setInvoiceReceivedMaxDateErrorLabel('');
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
