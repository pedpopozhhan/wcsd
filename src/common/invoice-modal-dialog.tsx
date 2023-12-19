import {
    GoAInput,
    GoAButton,
    GoAFormItem,
    GoAInputDate,
    GoAModal,
    GoAButtonGroup,

} from '@abgov/react-components';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const InvoiceModalDialog = (props: any) => {
    const [invoiceId, setInvoiceId] = useState("");
    const [labelforInvoiceOperation, setlabelforInvoiceOperation] = useState("Continue");
    const [isInvoiceAddition, setIsInvoiceAddition] = useState(props.isAddition);
    const [invoiceIdError, setInvoiceIdError] = useState(false);
    const [dateOfInvoice, setDateOfInvoice] = useState(new Date(Date()));
    const [dateOfInvoiceError, setDateOfInvoiceError] = useState(false);
    const [invoiceAmount, setInvoiceAmount] = useState(0);
    const [invoiceAmountError, setInvoiceAmountError] = useState(false);
    const [periodEndingDate, setPeriodEndingDate] = useState(new Date(Date()));
    const [periodEndingDateError, setPeriodEndingDateError] = useState(false);
    const [invoiceReceivedDate, setInvoiceReceivedDate] = useState(new Date(Date()));
    const [invoiceReceivedDateError, setInvoiceReceivedDateError] = useState(false);
    const [maxDate, setMaxDate] = useState(getDateWithMonthOffset(1));
    const [contractNumber, setContractNumber] = useState(props.contract);
    const [timeReports, setTimeReports] = useState(props.timeReports);
    const [pageHasError, setPageHasError] = useState(false);
    const [minDate, setMinDate] = useState(new Date(1950, 1, 1));
    const [dialogTitle, setDialogTitle] = useState("");




    const invoiceForSession = {
        InvoiceID: invoiceId,
        DateOnInvoie: dateOfInvoice,
        InvoiceAmount: invoiceAmount,
        PeriodEnding: periodEndingDate,
        InvoiceReceived: invoiceReceivedDate,
        ContractNumber: contractNumber
    }

    const navigate = useNavigate();

    function getDateWithMonthOffset(offset: number) {
        const d = new Date();
        d.setMonth(d.getMonth() + offset);
        return d;
    }


    useEffect(() => {
        if (props.isAddition === "false") {
            setDialogTitle("Update invoice");
            setIsInvoiceAddition(false);
            setlabelforInvoiceOperation("Update");

            if (sessionStorage.getItem('invoiceData') !== null) {
                let invoiceData = JSON.parse(sessionStorage.getItem('invoiceData') || '{}');
                setInvoiceId(invoiceData.InvoiceID);
                setInvoiceAmount(invoiceData.InvoiceAmount);
                setDateOfInvoice(invoiceData.DateOnInvoie);
                setInvoiceReceivedDate(invoiceData.InvoiceReceived);
                setPeriodEndingDate(invoiceData.PeriodEnding);
                setContractNumber(invoiceData.ContractNumber);
            }
        } else
            setDialogTitle("Create Invoice");
    }, [isInvoiceAddition,]);

    const clearDialgoControls = () => {
        setInvoiceId("");
        setInvoiceIdError(false);
        setInvoiceAmount(0);
        setInvoiceAmountError(false);
        setDateOfInvoice(new Date(Date()));
        setDateOfInvoiceError(false);
        setPeriodEndingDate(new Date(Date()));
        setPeriodEndingDateError(false);
        setInvoiceReceivedDate(new Date(Date()));
        setInvoiceReceivedDateError(false);
    }

    const hideModalDialog = () => {
        if (props.isAddition === 'true')
            clearDialgoControls();

        props.showInvoiceDialog(false);
    }

    const setInvoice = () => {
        // Validate them and show errors
        if (invoiceId.trim().length <= 0) {
            setInvoiceIdError(true);
            return;
        } else {
            setInvoiceIdError(false);
        }

        if (Number.isNaN(invoiceAmount) || invoiceAmount <= 0 || invoiceAmount === null) {
            setInvoiceAmountError(true);
            return;
        } else {
            setInvoiceAmountError(false);
        }

        if (pageHasError)
            return;

        // put them in the session object
        if (isInvoiceAddition) {
            // Add object to session
            if (sessionStorage.getItem('invoiceData') !== null) {
                sessionStorage.removeItem('invoiceData');
            }

            if (sessionStorage.getItem('timeReportsToReconcile') !== null) {
                sessionStorage.removeItem('timeReportsToReconcile');
            }

            sessionStorage.setItem('invoiceData', JSON.stringify(invoiceForSession));
            sessionStorage.setItem('timeReportsToReconcile', JSON.stringify(props.timeReports));

            // Clear the modal contrls
            clearDialgoControls();

            // Navigate to invoice detail page
            navigate(`/invoice/${invoiceId}`, { state: invoiceId, });
        }
        else {
            // update object in session

            sessionStorage.setItem('invoiceData', JSON.stringify(invoiceForSession));
            props.stateChanged();
            props.showInvoiceDialog(false);
        }
    }


    return (
        <>
            <GoAModal
                heading={dialogTitle}
                open={props.visible}
                actions={
                    <GoAButtonGroup alignment="end">
                        <GoAButton type='secondary' onClick={() => hideModalDialog()}>Cancel</GoAButton>
                        <GoAButton type='primary' onClick={() => setInvoice()}>
                            {labelforInvoiceOperation}
                        </GoAButton>
                    </GoAButtonGroup>
                }
            >
                <table>
                    <tbody>
                        <tr >
                            <td>
                                <GoAFormItem label="Invoice">
                                    <GoAInput
                                        name='invoiceId'
                                        width='300px'
                                        maxLength={20}
                                        value={invoiceId}
                                        error={invoiceIdError}
                                        onBlur={(key, value) => {
                                        }}
                                        onChange={(key, value) => {
                                            setInvoiceId(value.trim())
                                            if (value.trim().length <= 0) {
                                                setInvoiceIdError(true);
                                            } else {
                                                setInvoiceIdError(false);
                                            }
                                        }}
                                    />
                                </GoAFormItem>
                            </td>
                            <td></td>
                            <td>
                                <GoAFormItem label="Date on invoice">
                                    <GoAInputDate
                                        // trailingIcon='calendar'
                                        name="dateOnInvoice"
                                        placeholder="YYYY-MM-DD"
                                        value={dateOfInvoice}
                                        min={minDate}
                                        max={maxDate}
                                        width="200px"
                                        onChange={(name, value) => {
                                            const propertyValue: Date = new Date(value);
                                            setDateOfInvoice(propertyValue);
                                            if (propertyValue < minDate) {
                                                setDateOfInvoiceError(true);
                                                setPageHasError(true);

                                            }
                                            else
                                                setDateOfInvoice(propertyValue);
                                        }}

                                    />
                                </GoAFormItem>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <GoAFormItem label="Invoice amount">
                                    <GoAInput
                                        name="ctrlInvoiceAmount"
                                        width='300px'
                                        maxLength={10}
                                        error={invoiceAmountError}
                                        value={invoiceAmount.toString()}
                                        prefix='$'
                                        onBlur={(key, value) => {
                                            //alert("onBlur")
                                            if (Number.isNaN(value) || Number.isNaN(Number.parseFloat(value))) {
                                                setInvoiceAmountError(true);
                                                setPageHasError(true);
                                            }
                                            else {
                                                setInvoiceAmount(Number(value));
                                                setInvoiceAmountError(false);
                                                setPageHasError(false);
                                            }
                                        }}
                                        onChange={(key, value) => {
                                            //alert("onChange");
                                            if (Number.isNaN(value) || Number.isNaN(Number.parseFloat(value))) {
                                                setInvoiceAmountError(true);
                                                setPageHasError(true);
                                                setInvoiceAmount(0);
                                            }
                                            else {
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
                                <GoAFormItem label="Period ending">
                                    <GoAInputDate
                                        // trailingIcon='calendar'
                                        name="periodEndingDate"
                                        placeholder="yyyy-MM-DD"
                                        value={periodEndingDate}
                                        error={periodEndingDateError}
                                        min={minDate}
                                        max={maxDate}
                                        width="200px"
                                        onChange={(name, value) => {
                                            const propertyValue: Date = new Date(value);
                                            setPeriodEndingDate(propertyValue);
                                            if (propertyValue < minDate) {
                                                setPeriodEndingDateError(true);
                                                setPageHasError(true);
                                            }
                                        }}
                                    />
                                </GoAFormItem>
                            </td>
                        </tr>
                        <tr >
                            <td>
                                <GoAFormItem label="Invoice received">
                                    <GoAInputDate
                                        // trailingIcon='calendar'
                                        name="invoiceReceivedDate"
                                        placeholder="YYYY-MM-DD"
                                        value={invoiceReceivedDate}
                                        min={minDate}
                                        max={maxDate}
                                        width="200px"
                                        onChange={(name, value) => {
                                            const propertyValue: Date = new Date(value);
                                            setInvoiceReceivedDate(propertyValue);
                                            if (propertyValue < minDate) {
                                                setInvoiceReceivedDateError(true);
                                                setPageHasError(true);
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