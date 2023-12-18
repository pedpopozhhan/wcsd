import {
    GoATable,
    GoAInput,
    GoAButton,
    GoATableSortHeader,
    GoAIconButton,
    GoAFormItem,
    GoAGrid,
    GoAInputDate,
    GoAInputText,
    GoARadioGroup,
    GoARadioItem,
    GoATextArea,
    GoAModal,
    GoAButtonGroup,

} from '@abgov/react-components';
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';

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
    const [invoiceReceivedDate, setInvoiceReceivedDate] = useState(new Date(Date()));
    const [maxDate, setMaxDate] = useState(getDateWithMonthOffset(1));
    const [contractNumber, setContractNumber] = useState(props.contract);
    const [timeReports, setTimeReports] = useState(props.timeReports);


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
        }
    }, [isInvoiceAddition,]);

    const clearDialgoControls = () => {
        setInvoiceId("");
        setInvoiceIdError(false);
        setInvoiceAmount(0);
        setInvoiceAmountError(false);
        setDateOfInvoice(new Date(Date()));
        setDateOfInvoiceError(false);
        setPeriodEndingDate(new Date(Date()));
        setInvoiceReceivedDate(new Date(Date()));
    }

    const hideModalDialog = () => {
        if (props.isAddition === "true"){
            clearDialgoControls();
        }
        props.showInvoiceDialog(false);
    }

    const validateInvoiceID = () => {
        if (invoiceId.length <= 0) {
            setInvoiceIdError(true);
        } else {
            setInvoiceIdError(false);
        }
    }

    const validateInvoiceAmount = () => {
        if (invoiceAmount <= 0) {
            setInvoiceAmountError(true);
        } else {
            setInvoiceAmountError(false);
        }
    }

    const validateDateOnInvoice = () => {

    }

    const setInvoice = () => {
        // Validate them and show errors
        if (invoiceId.length <= 0) {
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
            props.showInvoiceDialog(false);
        }
    }


    return (
        <>
            <GoAModal
                heading="Create invoice"
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
                                        name="invoiceId"
                                        width='300px'
                                        value={invoiceId}
                                        error={invoiceIdError}
                                        onBlur={(key, value) => {                                            
                                        }}
                                        onChange={(key, value) => { 
                                            setInvoiceId(value)
                                            if (value.length <= 0) {
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
                                        min={new Date(1950, 1, 1)}
                                        max={new Date()}
                                        width="200px"
                                        onChange={(name, value) => {
                                            const propertyValue: Date = new Date(value);
                                            setDateOfInvoice(propertyValue);
                                            validateDateOnInvoice();
                                        }}
                                    />
                                </GoAFormItem>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <GoAFormItem label="Invoice amount">
                                    <GoAInput
                                        name="invoiceAmount"
                                        width='300px'
                                        error={invoiceAmountError}
                                        value={invoiceAmount.toString()}
                                        prefix='$'
                                        onBlur={(key, value) => {
                                            
                                        }}
                                        onChange={(key, value) => {
                                            if (Number.isNaN(value) || Number.isNaN(Number.parseFloat(value)))
                                            {
                                                setInvoiceAmountError(true);
                                            }
                                            else{
                                                setInvoiceAmount(Number(value));
                                                setInvoiceAmountError(false);
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
                                        min={new Date(1950, 1, 1)}
                                        max={new Date()}
                                        width="200px"
                                        onChange={(name, value) => {
                                            const propertyValue: Date = new Date(value);
                                            setPeriodEndingDate(propertyValue);
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
                                        min={new Date(1950, 1, 1)}
                                        max={new Date()}
                                        width="200px"
                                        onChange={(name, value) => {
                                            const propertyValue: Date = new Date(value);
                                            setInvoiceReceivedDate(propertyValue);
                                        }}
                                    />
                                </GoAFormItem>
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </GoAModal>
        </>
    );
};

export default InvoiceModalDialog;