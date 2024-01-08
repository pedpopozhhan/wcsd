import {
    GoAInput,
    GoAButton,
    GoAFormItem,
    GoAInputDate,
    GoAModal,
    GoAButtonGroup,
    GoADropdown,
    GoADropdownItem,
    GoATextArea,
} from '@abgov/react-components';
import { useState, useEffect } from 'react';
import { json, useNavigate } from 'react-router-dom';
import { IOtherCostTableRowData } from '@/interfaces/invoice-details/other-cost-table-row-data';
import { useSessionStorage } from 'usehooks-ts';
import { yearMonthDay } from '@/common/dates';
import { dateValidator } from '@/common/validation';

const OtherCostModalDialog = (props: any) => {
    const [pageHasError, setPageHasError] = useState<boolean>(false);
    const [minDate, setMinDate] = useState<Date>(new Date(1950, 1, 1));
    const [dialogTitle, setDialogTitle] = useState<string>('');
    const [isOtherCostAddition, setIsOtherCostAddition] = useState<boolean>(props.isAddition);

    const [recordId, setRecordId] = useState<number>(0);
    const [fromDate, setFromDate] = useState<Date>(new Date());
    const [fromDateError, setFromDateError] = useState<boolean>(false);
    const [toDate, setToDate] = useState<Date>(new Date());
    const [toDateError, setToDateError] = useState<boolean>(false);
    const [rateType, setRateType] = useState<string | string[]>('');
    const [rateTypeError, setRateTypeError] = useState<boolean>(false);
    const [unit, setUnit] = useState<string | string[]>('');
    const [unitError, setUnitError] = useState<boolean>(false);
    const [rate, setRate] = useState<number>(0);
    const [rateError, setRateError] = useState<boolean>(false);
    const [numberOfUnits, setNumberOfUnits] = useState<number>(0);
    const [numberOfUnitsError, setNumberOfUnitsError] = useState<boolean>(false);
    const [cost, setCost] = useState<string>('');

    const [glAccount, setGlAccount] = useState<string>('');
    const [glAccountError, setGlAccountError] = useState<boolean>(false);
    const [profitCentre, setProfitCenter] = useState<string>('');
    const [profitCentreError, setProfitCenterError] = useState<boolean>(false);
    const [costCenter, setCostCenter] = useState<string>('');
    const [costCenterError, setCostCenterError] = useState<boolean>(false);
    const [internalOrder, setInternalOrder] = useState<string>('');
    const [internalOrderError, setInternalOrderError] = useState<boolean>(false);
    const [fund, setFund] = useState<string>('');
    const [fundError, setFundError] = useState<boolean>(false);
    const [remarks, setRemarks] = useState<string>('');
    const [invoiceId, setInvoiceId] = useState<string>('testing');

    const [otherCostsData, setOtherCostsData] = useSessionStorage<IOtherCostTableRowData[]>('invoiceOtherCostData', []);
    const defaultErrorDate = new Date(1950, 0, 1);

    const currentOtherCost = {
        recordid: recordId,
        from: fromDate,
        to: toDate,
        rateType: rateType,
        unit: unit,
        ratePerUnit: rate,
        numberOfUnits: numberOfUnits,
        cost: Number(cost),
        glAccountNumber: glAccount,
        profitCentre: profitCentre,
        costCentre: costCenter,
        internalOrder: internalOrder,
        fund: fund,
        remarks: remarks,
        invoiceId: invoiceId
    };

    const navigate = useNavigate();
    const xl = '500px'
    const lg = '225px';
    const xmd = '225px'
    const md = '150px';
    const sm = '125px';
    const xs = '120px';

    useEffect(() => {
        if (props.isAddition === 'true') {
            setDialogTitle('Add other cost');
            clearDialgoControls();
        } else {
            setDialogTitle('Update other cost');
        }
    }, [isOtherCostAddition,]);

    const clearDialgoControls = () => {
        clearDataPoints();
        clearErrors();
    }

    const hideModalDialog = () => {
        props.showOtherCostDialog(false);
    }

    function onRateChange(name: string, value: string | string[]) {
        setRateType(value);
    }

    function onUnitChange(name: string, value: string | string[]) {
        setUnit(value);
    }

    const validateOtherCost = () => {

        if (new Date(yearMonthDay(fromDate)) < minDate) {
            setFromDateError(true);
            setPageHasError(true);
        } else {
            setFromDateError(false);
        }

        if (new Date(yearMonthDay(toDate)) < minDate) {
            setToDateError(true);
            setPageHasError(true);
        } else {
            setToDateError(false);
        }

        if (unit === undefined || unit === '') {
            setUnitError(true);
            setPageHasError(true);
        }
        else {
            setUnitError(false);
        }

        if (Number.isNaN(rate) || rate <= 0 || rate === null || rate > 99999.99) {
            setRateError(true);
            setPageHasError(true);
        }
        else {
            setRateError(false);
        }

        if (Number.isNaN(numberOfUnits) || numberOfUnits <= 0 || numberOfUnits === null || numberOfUnits > 99999) {
            setNumberOfUnitsError(true);
            setPageHasError(true);
        }
        else {
            setNumberOfUnitsError(false);
        }

        if (glAccount === '') {
            setGlAccountError(true);
            setPageHasError(true);
        }
        else
            setGlAccountError(false);

        if (profitCentre === '') {
            setProfitCenterError(true);
            setPageHasError(true);
        }
        else
            setProfitCenterError(false);

        if (costCenter === '') {
            setCostCenterError(true);
            setPageHasError(true);
        }
        else
            setCostCenterError(false);

        if (internalOrder === '') {
            setInternalOrderError(true);
            setPageHasError(true);
        }
        else
            setInternalOrderError(false);

        if (fund === '') {
            setFundError(true);
            setPageHasError(true);
        }
        else
            setFundError(false);
    }

    const clearErrors = () => {
        setFromDateError(false);
        setToDateError(false);
        setRateTypeError(false);
        setNumberOfUnitsError(false);
        setUnitError(false);
        setRateError(false);
        setGlAccountError(false);
        setProfitCenterError(false);
        setCostCenterError(false);
        setInternalOrderError(false);
        setFundError(false);
    }

    const clearDataPoints = () => {
        setFromDate(new Date());
        setToDate(new Date());
        setRateType(' ');
        setUnit(' ');
        setRate(0);
        setNumberOfUnits(0);
        setCost('');
        setGlAccount('');
        setProfitCenter('');
        setCostCenter('');
        setInternalOrder('');
        setFund('');
        setRemarks('');
    }

    const addOtherCost = () => {
        validateOtherCost();
        if (pageHasError)
            return;
        let otherCosts = otherCostsData;
        let max = Math.max.apply(Math, otherCosts.map(function (a) { return a.recordid }));
        if (max.toString() === '-Infinity')
            currentOtherCost.recordid = 0;
        else
            currentOtherCost.recordid = max + 1;
        otherCosts.push(currentOtherCost);
        setOtherCostsData(otherCosts);
        props.onAddUpdateOtherCost(Number(cost));
        clearDialgoControls();
        setIsOtherCostAddition(false);
        props.showOtherCostDialog(false);
    }

    const addAnohterOtherCost = () => {
        validateOtherCost();
        if (pageHasError)
            return;
        let otherCosts = otherCostsData;
        let max = Math.max.apply(Math, otherCosts.map(function (a) { return a.recordid }));
        if (max.toString() === '-Infinity')
            currentOtherCost.recordid = 0;
        else
            currentOtherCost.recordid = max + 1;
        otherCosts.push(currentOtherCost);
        setOtherCostsData(otherCosts);
        props.onAddUpdateOtherCost(Number(cost));
        clearDialgoControls();
        setIsOtherCostAddition(true);

    }

    return (
        <>
            <GoAModal
                heading={dialogTitle}
                open={props.visible}
                actions={
                    <GoAButtonGroup alignment='end'>
                        <GoAButton type='tertiary' onClick={hideModalDialog}>Cancel</GoAButton>
                        <GoAButton type='secondary' onClick={addOtherCost}>Add</GoAButton>
                        <GoAButton type='primary' onClick={addAnohterOtherCost}>Add Another</GoAButton>
                    </GoAButtonGroup>
                }
            >
                <table>
                    <tbody>
                        <tr>
                            <td colSpan={5}>
                                <GoAFormItem label='From'>
                                    <GoAInputDate
                                        name='fromDate'
                                        placeholder='YYYY-MM-DD'
                                        value={new Date()}
                                        error={fromDateError}
                                        min={minDate}
                                        width={lg}
                                        onChange={(name, value) => {
                                            if (value === '') {
                                                setFromDate(defaultErrorDate);
                                                setFromDateError(true);
                                                setPageHasError(true);
                                            } else {
                                                const propertyValue: Date = new Date(value);
                                                setFromDate(propertyValue);
                                                if (propertyValue < minDate) {
                                                    setFromDateError(true);
                                                    setPageHasError(true);
                                                } else {
                                                    setFromDateError(false);
                                                    setPageHasError(false);
                                                }
                                            }
                                        }}
                                    />
                                </GoAFormItem>
                            </td>
                            <td></td>
                            <td colSpan={4}>
                                <GoAFormItem label='To'>
                                    <GoAInputDate
                                        name='dateOnInvoice'
                                        placeholder='YYYY-MM-DD'
                                        error={toDateError}
                                        value={new Date()}
                                        min={minDate}
                                        width={lg}
                                        onChange={(name, value) => {
                                            if (value === '') {
                                                setToDate(defaultErrorDate);
                                                setToDateError(true);
                                                setPageHasError(true);
                                            } else {
                                                const propertyValue: Date = new Date(value);
                                                setToDate(propertyValue);
                                                if (propertyValue < minDate) {
                                                    setToDateError(true);
                                                    setPageHasError(true);
                                                } else {
                                                    setToDateError(false);
                                                    setPageHasError(false);
                                                }
                                            }
                                        }}
                                    />
                                </GoAFormItem>
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colSpan={5}>
                                <GoAFormItem label='Rate Type'>
                                    <GoADropdown name='rateTypes' value={rateType} onChange={onRateChange} width={lg} error={rateTypeError}>
                                        <GoADropdownItem value='Dry' label='Dry' />
                                        <GoADropdownItem value='Ferry' label='Ferry' />
                                        <GoADropdownItem value='Flat' label='Flat' />
                                        <GoADropdownItem value='Mars' label='Mars' />
                                        <GoADropdownItem value='Primary' label='Primary' />
                                        <GoADropdownItem value='Secondary' label='Secondary' />
                                        <GoADropdownItem value='Wet' label='Wet' />
                                        <GoADropdownItem value='Accommodation' label='Accommodation' />
                                        <GoADropdownItem value='Airport Fee' label='Airport Fee' />
                                        <GoADropdownItem value='Basing' label='Basing' />
                                        <GoADropdownItem value='Basing Non-Core' label='Basing Non-Core' />
                                        <GoADropdownItem value='Basing Penalty' label='Basing Penalty' />
                                        <GoADropdownItem value='Charter Minimums' label='Charter Minimums' />
                                        <GoADropdownItem value='Crew Exp - Breakfast' label='Crew Exp - Breakfast' />
                                        <GoADropdownItem value='Crew Exp - Dinner' label='Crew Exp - Dinner' />
                                        <GoADropdownItem value='Crew Exp - Lunch' label='Crew Exp - Lunch' />
                                        <GoADropdownItem value='Crew Expenses' label='Crew Expenses' />
                                        <GoADropdownItem value='Double Crew' label='Double Crew' />
                                        <GoADropdownItem value='Landing Fee' label='Landing Fee' />
                                        <GoADropdownItem value='Nav Canada' label='Nav Canada' />
                                        <GoADropdownItem value='Passenger Fee' label='Passenger Fee' />
                                        <GoADropdownItem value='Standby' label='Standby' />
                                        <GoADropdownItem value='Vehicle Rental' label='Vehicle Rental' />
                                    </GoADropdown>
                                </GoAFormItem>
                            </td>
                            <td></td>
                            <td colSpan={4}>
                                <GoAFormItem label='Unit'>
                                    <GoADropdown name='units' value={unit} onChange={onUnitChange} width={lg} error={unitError}>
                                        <GoADropdownItem value='UNIT1' label='UNIT1' />
                                        <GoADropdownItem value='UNIT2' label='UNIT2' />
                                        <GoADropdownItem value='UNIT3' label='UNIT3' />
                                    </GoADropdown>
                                </GoAFormItem>
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colSpan={5}>
                                <GoAFormItem label='Rate'>
                                    <GoAInput
                                        name='rate'
                                        type='number'
                                        width={lg}
                                        error={rateError}
                                        value={rate.toString()}
                                        max='99999.99'
                                        min='0'
                                        prefix='$'
                                        suffix='Per&nbsp;Unit'
                                        onBlur={(key, value) => {
                                            if (
                                                Number.isNaN(value) ||
                                                Number.isNaN(Number.parseFloat(value))
                                            ) {
                                                setRateError(true);
                                                setPageHasError(true);
                                            } else {
                                                setRate(Number(value));
                                                setCost((rate * numberOfUnits).toString())
                                                setRateError(false);
                                                setPageHasError(false);
                                            }
                                        }}
                                        onChange={(key, value) => {
                                            if (
                                                Number.isNaN(value) ||
                                                Number.isNaN(Number.parseFloat(value))
                                            ) {
                                                setRateError(true);
                                                setPageHasError(true);
                                            } else {
                                                setRate(Number(value));
                                                setCost((rate * numberOfUnits).toString())
                                                setRateError(false);
                                                setPageHasError(false);
                                            }
                                        }}
                                    />
                                </GoAFormItem>
                            </td>
                            <td></td>
                            <td colSpan={1}>
                                <GoAFormItem label='No. of Units'>
                                    <GoAInput
                                        name='numberOfUnits'
                                        type='number'
                                        width={sm}
                                        value={numberOfUnits.toString()}
                                        error={numberOfUnitsError}
                                        max='99999'
                                        min='0'
                                        onBlur={(key, value) => {
                                            if (
                                                Number.isNaN(value) ||
                                                Number.isNaN(Number.parseFloat(value))
                                            ) {
                                                setNumberOfUnitsError(true);
                                                setPageHasError(true);
                                            } else {
                                                setNumberOfUnits(Number(value));
                                                setCost((rate * numberOfUnits).toString())
                                                setNumberOfUnitsError(false);
                                                setPageHasError(false);
                                            }
                                        }}
                                        onChange={(key, value) => {
                                            if (
                                                Number.isNaN(value) ||
                                                Number.isNaN(Number.parseFloat(value))
                                            ) {
                                                setNumberOfUnitsError(true);
                                                setPageHasError(true);
                                            } else {
                                                setNumberOfUnits(Number(value));
                                                setCost((rate * numberOfUnits).toString())
                                                setNumberOfUnitsError(false);
                                                setPageHasError(false);
                                            }
                                        }}
                                    />
                                </GoAFormItem>
                            </td>
                            <td colSpan={3}>
                                <GoAFormItem label='Cost'>
                                    <GoAInput
                                        name='cost'
                                        width={md}
                                        value={cost.toString()}
                                        prefix='$'
                                        disabled
                                        onChange={(key, value) => {
                                            setCost(value);
                                        }}
                                    />
                                </GoAFormItem>
                            </td>

                        </tr>
                        <tr>
                            <td colSpan={4}>
                                <GoAFormItem label='GL Account'>
                                    <GoAInput
                                        name='glAccount'
                                        width={md}
                                        value={glAccount}
                                        error={glAccountError}
                                        maxLength={12}
                                        onChange={(key, value) => {
                                            setGlAccount(value.trim());
                                            if (value.trim().length <= 0) {
                                                setGlAccountError(true);
                                            } else {
                                                setGlAccountError(false);
                                                setPageHasError(false);
                                            }
                                        }}
                                    />
                                </GoAFormItem>
                            </td>
                            <td colSpan={3}>
                                <GoAFormItem label='Profit Center'>
                                    <GoAInput
                                        name='profitCenter'
                                        width={sm}
                                        value={profitCentre}
                                        error={profitCentreError}
                                        maxLength={12}
                                        onChange={(key, value) => {
                                            setProfitCenter(value.trim());
                                            if (value.trim().length <= 0) {
                                                setProfitCenterError(true);
                                            } else {
                                                setProfitCenterError(false);
                                                setPageHasError(false);
                                            }
                                        }}
                                    />
                                </GoAFormItem>
                            </td>
                            <td colSpan={5}>
                                <GoAFormItem label='Cost Center'>
                                    <GoAInput
                                        name='costCenter'
                                        width={sm}
                                        value={costCenter}
                                        error={costCenterError}
                                        maxLength={12}
                                        onChange={(key, value) => {
                                            setCostCenter(value.trim());
                                            if (value.trim().length <= 0) {
                                                setCostCenterError(true);
                                            } else {
                                                setCostCenterError(false);
                                                setPageHasError(false);
                                            }
                                        }}
                                    />
                                </GoAFormItem>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={4}>
                                <GoAFormItem label='Internal Order'>
                                    <GoAInput
                                        name='internalOrder'
                                        width={md}
                                        value={internalOrder}
                                        error={internalOrderError}
                                        maxLength={12}
                                        onChange={(key, value) => {
                                            setInternalOrder(value.trim());
                                            if (value.trim().length <= 0) {
                                                setInternalOrderError(true);
                                            } else {
                                                setInternalOrderError(false);
                                                setPageHasError(false);
                                            }
                                        }}
                                    />
                                </GoAFormItem>
                            </td>
                            <td colSpan={3}>
                                <GoAFormItem label='Fund'>
                                    <GoAInput
                                        name='fund'
                                        width={sm}
                                        value={fund}
                                        error={fundError}
                                        maxLength={12}
                                        onChange={(key, value) => {
                                            setFund(value.trim());
                                            if (value.trim().length <= 0) {
                                                setFundError(true);
                                            } else {
                                                setFundError(false);
                                                setPageHasError(false);
                                            }
                                        }}
                                    />
                                </GoAFormItem>
                            </td>
                            <td colSpan={5}></td>
                        </tr>
                        <tr>
                            <td colSpan={12}>
                                <GoAFormItem label='Remarks'>
                                    <GoATextArea
                                        name='remkarks'
                                        width={xl}
                                        maxCharCount={1000}
                                        value={remarks}
                                        onChange={(key, value) => {
                                            setRemarks(value.trim());
                                        }}
                                    />
                                </GoAFormItem>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </GoAModal>
        </>
    );
};

export default OtherCostModalDialog;
