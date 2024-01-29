import { GoAInput, GoAButton, GoAFormItem, GoAInputDate, GoAModal, GoAButtonGroup } from '@abgov/react-components';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { yearMonthDay } from '@/common/dates';
import { MainContext } from './main-context';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setInvoiceData } from '@/app-slice';

export interface IInvoiceData {
  InvoiceID: string;
  DateOnInvoice: Date;
  InvoiceAmount: number;
  PeriodEnding: Date;
  InvoiceReceived: Date;
  ContractNumber: string;
}

const InvoiceModalDialog = (props: any) => {
  //   const mainContext = useContext(MainContext);
  //   const { invoiceData, setInvoiceData } = mainContext;
  const dispatch = useAppDispatch();
  const invoiceData = useAppSelector((state) => state.app.invoiceData);

  const [invoiceId, setInvoiceId] = useState<string>('');
  const [labelforInvoiceOperation, setlabelforInvoiceOperation] = useState<string>('Continue');
  const [isInvoiceAddition, setIsInvoiceAddition] = useState<boolean>(props.isAddition);
  const [invoiceIdError, setInvoiceIdError] = useState<boolean>(false);
  const [dateOfInvoice, setDateOfInvoice] = useState<Date>(new Date(Date()));
  const [dateOfInvoiceError, setDateOfInvoiceError] = useState<boolean>(false);
  const [invoiceAmount, setInvoiceAmount] = useState<number>(0);
  const [invoiceAmountError, setInvoiceAmountError] = useState<boolean>(false);
  const [periodEndingDate, setPeriodEndingDate] = useState<Date>(new Date(Date()));
  const [periodEndingDateError, setPeriodEndingDateError] = useState<boolean>(false);
  const [invoiceReceivedDate, setInvoiceReceivedDate] = useState<Date>(new Date(Date()));
  const [invoiceReceivedDateError, setInvoiceReceivedDateError] = useState<boolean>(false);
  const [maxDate, setMaxDate] = useState<Date>(getDateWithMonthOffset(1));
  const [contractNumber, setContractNumber] = useState(props.contract);
  const [timeReports, setTimeReports] = useState(props.timeReports);
  const [pageHasError, setPageHasError] = useState<boolean>(false);
  const [minDate, setMinDate] = useState<Date>(new Date(1950, 2, 1));
  const [dialogTitle, setDialogTitle] = useState<string>('');

  const invoiceForContext = {
    InvoiceID: invoiceId,
    DateOnInvoice: dateOfInvoice,
    InvoiceAmount: invoiceAmount,
    PeriodEnding: periodEndingDate,
    InvoiceReceived: invoiceReceivedDate,
    ContractNumber: contractNumber,
  };

  const navigate = useNavigate();
  const defaultErrorDate = new Date(Date());

  function getDateWithMonthOffset(offset: number) {
    const d = new Date();
    d.setMonth(d.getMonth() + offset);
    return d;
  }

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
    setInvoiceId(invoiceData.InvoiceID);
    setInvoiceAmount(invoiceData.InvoiceAmount);
    setDateOfInvoice(invoiceData.DateOnInvoice);
    setInvoiceReceivedDate(invoiceData.InvoiceReceived);
    setPeriodEndingDate(invoiceData.PeriodEnding);
    setContractNumber(invoiceData.ContractNumber);
  };

  const clearErrors = () => {
    setInvoiceIdError(false);
    setInvoiceAmountError(false);
    setDateOfInvoiceError(false);
    setPeriodEndingDateError(false);
    setInvoiceReceivedDateError(false);
  };

  const clearDataPoints = () => {
    setInvoiceId('');
    setInvoiceAmount(0);
    setDateOfInvoice(new Date(Date()));
    setPeriodEndingDate(new Date(Date()));
    setInvoiceReceivedDate(new Date(Date()));
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

  const setInvoice = () => {
    // Validate them and show errors
    if (invoiceId.trim().length <= 0) {
      setInvoiceIdError(true);
      return;
    } else {
      setInvoiceIdError(false);
    }

    if (Number.isNaN(invoiceAmount) || invoiceAmount <= 0 || invoiceAmount === null || invoiceAmount > 999999999.99) {
      setInvoiceAmountError(true);
      return;
    } else {
      setInvoiceAmountError(false);
    }

    if (new Date(yearMonthDay(dateOfInvoice)) < minDate) {
      setDateOfInvoiceError(true);
      return;
    } else {
      setDateOfInvoiceError(false);
    }

    if (new Date(yearMonthDay(periodEndingDate)) < minDate) {
      setPeriodEndingDateError(true);
      return;
    } else {
      setPeriodEndingDateError(false);
    }

    if (new Date(yearMonthDay(invoiceReceivedDate)) < minDate) {
      setInvoiceReceivedDateError(true);
      return;
    } else {
      setInvoiceReceivedDateError(false);
    }

    if (pageHasError) return;

    // put them in the session object
    if (isInvoiceAddition) {
      //   setInvoiceData(invoiceForContext);
      dispatch(setInvoiceData(invoiceForContext));
      clearDataPoints();
      clearErrors();

      // Navigate to invoice detail page
      navigate(`/invoice/${invoiceId}`, { state: invoiceId });
    } else {
      // update object in session
      //   setInvoiceData(invoiceForContext);
      dispatch(setInvoiceData(invoiceForContext));
      clearErrors();
      props.showInvoiceDialog(false);
    }
  };

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
        <table>
          <tbody>
            <tr>
              <td>
                <GoAFormItem label='Invoice'>
                  <GoAInput
                    name='invoiceId'
                    width='300px'
                    maxLength={20}
                    value={invoiceId}
                    error={invoiceIdError}
                    onBlur={(key, value) => {}}
                    onChange={(key, value) => {
                      setInvoiceId(value.trim());
                      if (value.trim().length <= 0) {
                        setInvoiceIdError(true);
                      } else {
                        setInvoiceIdError(false);
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
                        setDateOfInvoice(propertyValue);
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
                    prefix='$'
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
                        setPeriodEndingDate(propertyValue);
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
                        setInvoiceReceivedDate(propertyValue);
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
