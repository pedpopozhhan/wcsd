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
// TODO: this should have props
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InvoiceModalDialog = (props: any) => {
  const dispatch = useAppDispatch();
  const auth = useConditionalAuth();
  const invoiceData = useAppSelector((state) => state.app.invoiceData);

  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [labelforInvoiceOperation, setlabelforInvoiceOperation] = useState<string>('Continue');
  const [isInvoiceAddition, setIsInvoiceAddition] = useState<boolean>(props.isAddition);
  const [invoiceNumberError, setInvoiceNumberError] = useState<boolean>(false);
  const [invoiceNumberErrorLabel, setInvoiceNumberErrorLabel] = useState<string>('');
  const [dateOfInvoice, setDateOfInvoice] = useState<string>(new Date().toISOString());
  const [dateOfInvoiceError, setDateOfInvoiceError] = useState<boolean>(false);
  const [invoiceAmount, setInvoiceAmount] = useState<number>(0);
  const [invoiceAmountError, setInvoiceAmountError] = useState<boolean>(false);
  const [periodEndingDate, setPeriodEndingDate] = useState<string>(new Date().toISOString());
  const [periodEndingDateError, setPeriodEndingDateError] = useState<boolean>(false);
  const [invoiceReceivedDate, setInvoiceReceivedDate] = useState<string>(new Date().toISOString());
  const [invoiceReceivedDateError, setInvoiceReceivedDateError] = useState<boolean>(false);
  const [maxDate] = useState<Date>(getDateWithMonthOffset(1));
  const [contractNumber, setContractNumber] = useState(props.contract);
  const [pageHasError, setPageHasError] = useState<boolean>(false);
  const [minDate] = useState<Date>(new Date(1950, 1, 1));
  const [dialogTitle, setDialogTitle] = useState<string>('');
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
  };

  const navigate = useNavigate();

  function getDateWithMonthOffset(offset: number) {
    const d = new Date();
    d.setMonth(d.getMonth() + offset);
    return d;
  }
  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  });
  useEffect(() => {
    if (props.isAddition === 'false') {
      setDialogTitle('Update invoice');
      setIsInvoiceAddition(false);
      setlabelforInvoiceOperation('Update');

      if (invoiceData != null) {
        setToSessionData();
      }
    } else {
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
  };

  const clearDataPoints = () => {
    setInvoiceNumber('');
    setInvoiceAmount(0);
    setDateOfInvoice(new Date().toISOString());
    setPeriodEndingDate(new Date().toISOString());
    setInvoiceReceivedDate(new Date().toISOString());
  };

  const hideModalDialog = () => {
    if (props.isAddition === 'true') {
      clearDataPoints();
    } else {
      if (invoiceData != null) setToSessionData();
    }
    clearErrors();
    props.showInvoiceDialog(false);
  };

  function setInvoice() {
    if (subscription) {
      subscription.unsubscribe();
    }
    subscription = processInvoiceService.doesInvoiceNumberExist(auth?.user?.access_token, invoiceNumber).subscribe({
      next: (data) => {
        if (data) {
          setInvoiceNumberErrorLabel('Number on invoice must be unique.');
          setInvoiceNumberError(true);
        } else {
          setInvoiceNumberErrorLabel('');
          processFields();
          props.showInvoiceDialog(false);
        }
      },
      error: (error) => {
        console.log(error);
        if (error.response && error.response.status === 403) {
          navigateTo('unauthorized');
        }
        publishToast({
          type: 'error',
          message: failedToPerform('check invoice number exists', 'Connection Error'),
        });
      },
    });
  }
  function processFields() {
    // Validate them and show errors

    if (invoiceNumber.trim().length <= 0 || invoiceNumberErrorLabel) {
      setInvoiceNumberError(true);
      return;
    } else {
      setInvoiceNumberError(false);
    }

    if (Number.isNaN(invoiceAmount) || invoiceAmount <= 0 || invoiceAmount === null || invoiceAmount > 999999999.99) {
      setInvoiceAmountError(true);
      return;
    } else {
      setInvoiceAmountError(false);
    }

    //if (new Date(yearMonthDay(dateOfInvoice)) < minDate || dateOfInvoiceError) {
    if (new Date(dateOfInvoice) < minDate || dateOfInvoiceError) {
      setDateOfInvoiceError(true);
      return;
    } else {
      setDateOfInvoiceError(false);
    }

    if (new Date(periodEndingDate) < minDate || periodEndingDateError) {
      setPeriodEndingDateError(true);
      return;
    } else {
      setPeriodEndingDateError(false);
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
      props.showInvoiceDialog(false);
    }
  }

  function getHelperText() {
    return invoiceNumberErrorLabel ? '' : 'Number on invoice. Must be unique.';
  }
  return (
    <>
      <GoAModal
        heading={dialogTitle}
        open={props.visible}
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
                    width='300px'
                    maxLength={20}
                    value={invoiceNumber}
                    error={invoiceNumberError}
                    onBlur={() => {}}
                    onChange={(key, value) => {
                      setInvoiceNumber(value.trim());
                      if (value.trim().length <= 0) {
                        setInvoiceNumberError(true);
                      } else {
                        setInvoiceNumberError(false);
                        setPageHasError(false);
                      }
                    }}
                  />
                </GoAFormItem>
              </td>
              <td></td>
              <td>
                <GoAFormItem label='Date on invoice'>
                  <GoAInputDate
                    name='dateOnInvoice'
                    placeholder='YYYY-MM-DD'
                    error={dateOfInvoiceError}
                    value={dateOfInvoice}
                    min={minDate}
                    max={maxDate}
                    width='200px'
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
                          setPageHasError(true);
                        } else {
                          setDateOfInvoiceError(false);
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
                <GoAFormItem label='Invoice amount'>
                  <GoAInput
                    name='ctrlInvoiceAmount'
                    type='number'
                    width='300px'
                    maxLength={10}
                    error={invoiceAmountError}
                    value={invoiceAmount.toString()}
                    max='99999999'
                    min='0'
                    leadingContent='$'
                    onBlur={(key, value) => {
                      if (Number.isNaN(value) || Number.isNaN(Number.parseFloat(value))) {
                        setInvoiceAmountError(true);
                        setPageHasError(true);
                      } else {
                        setInvoiceAmount(Number(value));
                        setInvoiceAmountError(false);
                        setPageHasError(false);
                      }
                    }}
                    onChange={(key, value) => {
                      if (Number.isNaN(value) || Number.isNaN(Number.parseFloat(value))) {
                        setInvoiceAmountError(true);
                        setPageHasError(true);
                        setInvoiceAmount(0);
                      } else {
                        setInvoiceAmount(Number(value));
                        setInvoiceAmountError(false);
                        setPageHasError(false);
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
                    width='200px'
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
                          setPeriodEndingDateError(false);
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
                <GoAFormItem label='Invoice received'>
                  <GoAInputDate
                    name='invoiceReceivedDate'
                    placeholder='YYYY-MM-DD'
                    value={invoiceReceivedDate}
                    error={invoiceReceivedDateError}
                    min={minDate}
                    max={maxDate}
                    width='200px'
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
