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
    GoAButtonType,
} from '@abgov/react-components';
import { useState, useEffect } from 'react';
import { IOtherCostTableRowData } from '@/interfaces/invoice-details/other-cost-table-row-data';
import { yearMonthDay } from '@/common/dates';

interface IOtherCostModalDialog {
    onAddUpdate: (item: IOtherCostTableRowData) => any;
    showOtherCostDialog: (value: boolean) => any;
    isAddition: boolean;
    visible: boolean;
    data: IOtherCostTableRowData | undefined;
}
const OtherCostModalDialog = (props: IOtherCostModalDialog) => {

    const [otherCostToUpdate, setOtherCostToUpdate] = useState(props.data);
    const [cancelButtonlabel, setCancelButtonLabel] = useState<string>('Cancel');
    const [cancelButtonType, setCancelButtonType] = useState<GoAButtonType>('tertiary');
    const [addButtonlabel, setAddButtonLabel] = useState<string>('Update');
    const [addButtonType, setAddButtonType] = useState<GoAButtonType>('primary');
    const [addAnotherButtonlabel, setAddAnotherButtonLabel] = useState<string>('');
    const [addAnotherButtonType, setAddAnotherButtonType] = useState<GoAButtonType>('tertiary');

    const [addAnother, setAddAnother] = useState(false);
    const [iscancelled, setIsCancelled] = useState<boolean>(false);
    const [saveData, setSaveData] = useState<boolean>(false);
    const [minDate, setMinDate] = useState<Date>(new Date(1950, 1, 1));
    const [dialogTitle, setDialogTitle] = useState<string>('');
    const [isOtherCostAddition, setIsOtherCostAddition] = useState<boolean>(props.isAddition);

    const [index, setIndex] = useState<number>(0);
    const [id, setId] = useState<number>(0);
    const [fromDate, setFromDate] = useState<Date>(new Date(Date()));
    const [fromDateError, setFromDateError] = useState<boolean>(false);
    const [toDate, setToDate] = useState<Date>(new Date(Date()));
    const [toDateError, setToDateError] = useState<boolean>(false);
    const [rateType, setRateType] = useState<string | string[]>('');
    const [unit, setUnit] = useState<string | string[]>('');

    const [rate, setRate] = useState<number>(0);
    const [rateError, setRateError] = useState<boolean>(true);
    const [numberOfUnits, setNumberOfUnits] = useState<number>(0);
    const [numberOfUnitsError, setNumberOfUnitsError] = useState<boolean>(true);
    const [cost, setCost] = useState<string>('');

    const [glAccount, setGlAccount] = useState<string>('');
    const [profitCentre, setProfitCenter] = useState<string>('');
    const [costCenter, setCostCenter] = useState<string>('');
    const [internalOrder, setInternalOrder] = useState<string>('');
    const [fund, setFund] = useState<string>('');
    const [remarks, setRemarks] = useState<string>('');
    const [invoiceId, setInvoiceId] = useState<string>('');
    const defaultErrorDate = new Date(Date());

    const currentOtherCost = {
        index: index,
        id: id,
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
        invoiceId: invoiceId,
    };

    const xl = '500px';
    const lg = '225px';
    const md = '150px';
    const sm = '125px';

    useEffect(() => {
        if (props.isAddition) {
            setControlsForAddition();
            clearDialgoControls();
        } else {
            setControlsForUpdate();
            if (props.data?.from !== undefined)
                setFromDate(props.data?.from);
            if (props.data?.to !== undefined)
                setToDate(props.data?.to);

            setRate(Number(props.data?.ratePerUnit));
            setNumberOfUnits(Number(props.data?.numberOfUnits));
            setCost(Number(props.data?.cost).toString());
            setRateType(String(props.data?.rateType));
            setUnit(String(props.data?.unit));
        }
    }, [isOtherCostAddition, props.data]);

    function setControlsForAddition() {
        setDialogTitle('Add other cost');
        setCancelButtonLabel('Cancel');
        setCancelButtonType('tertiary');
        setAddButtonLabel('Add');
        setAddButtonType('secondary');
        setAddAnotherButtonLabel('Add Another');
        setAddAnotherButtonType('primary');
    }

    function setControlsForUpdate() {
        setDialogTitle('Update other cost');
        setCancelButtonLabel('Cancel');
        setCancelButtonType('secondary');
        setAddButtonLabel('Update');
        setAddButtonType('primary');
        setAddAnotherButtonLabel('');
        setAddAnotherButtonType('tertiary');
        setRateError(false);
        setNumberOfUnitsError(false);
    }

    useEffect(() => {
        if (saveData) {
            setSaveData(false);
            if (fromDateError || toDateError || rateError || numberOfUnitsError)
                return;
            else {
                if (props.isAddition) {
                    props.onAddUpdate(currentOtherCost);
                    clearDialgoControls();
                    if (!addAnother) {
                        props.showOtherCostDialog(false);
                    }
                    else
                        setIsOtherCostAddition(true);
                }
                else {
                    setIsCancelled(true);
                    props.showOtherCostDialog(false);
                }
            }
        }
        else {
            setRate(Number(rate));
            setCost((rate * numberOfUnits).toFixed(2).toString());
        }
    }, [saveData, rate, numberOfUnits,]);

    useEffect(() => {
        if (iscancelled) {
            clearDialgoControls();
            setIsCancelled(false);
        }
    }, [iscancelled,]);

    const clearDialgoControls = () => {
        clearDataPoints();
        clearErrors();
    };

    const hideModalDialog = () => {
        setIsCancelled(true);
        props.showOtherCostDialog(false);
    };

    function onRateChange(name: string, value: string | string[]) {
        setRateType(value);
    }

    function onUnitChange(name: string, value: string | string[]) {
        setUnit(value);
    }

    const validateOtherCost = () => {
        if (new Date(yearMonthDay(fromDate)) < minDate) {
            setFromDateError(true);
        } else {
            setFromDateError(false);
        }

        if (new Date(yearMonthDay(toDate)) < minDate) {
            setToDateError(true);
        } else {
            setToDateError(false);
        }

        if (Number.isNaN(rate) || rate <= 0 || rate > 99999.99) {
            setRateError(true);
        } else {
            setRateError(false);
        }

        if (
            Number.isNaN(numberOfUnits) || numberOfUnits <= 0 || numberOfUnits > 99999
        ) {
            setNumberOfUnitsError(true);
        } else {
            setNumberOfUnitsError(false);
        }
    };

    const clearErrors = () => {
        setFromDateError(false);
        setToDateError(false);
        setNumberOfUnitsError(false);
        setRateError(false);
    };

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
    };

    const addOtherCost = () => {
        setSaveData(true);
        setAddAnother(false);
        validateOtherCost();
    };

    const addAnohterOtherCost = () => {
        setSaveData(true);
        setAddAnother(true);
        validateOtherCost();
    };

    return (
        <>
            <GoAModal
                heading={dialogTitle}
                open={props.visible}
                actions={
                    <GoAButtonGroup alignment='end'>
                        <GoAButton type={cancelButtonType} onClick={hideModalDialog}>
                            {cancelButtonlabel}
                        </GoAButton>
                        <GoAButton type={addButtonType} onClick={addOtherCost}>
                            {addButtonlabel}
                        </GoAButton>
                        <GoAButton type={addAnotherButtonType} onClick={addAnohterOtherCost} >
                            {addAnotherButtonlabel}
                        </GoAButton>
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
                                        value={fromDate}
                                        error={fromDateError}
                                        min={minDate}
                                        width={lg}
                                        onChange={(name, value) => {
                                            if (value === '') {
                                                setFromDate(defaultErrorDate);
                                                setFromDateError(true);
                                            } else {
                                                const propertyValue: Date = new Date(value);
                                                setFromDate(propertyValue);
                                                if (propertyValue < minDate) {
                                                    setFromDateError(true);
                                                } else {
                                                    setFromDateError(false);
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
                                        value={toDate}
                                        min={minDate}
                                        width={lg}
                                        onChange={(name, value) => {
                                            if (value === '') {
                                                setToDate(defaultErrorDate);
                                                setToDateError(true);
                                            } else {
                                                const propertyValue: Date = new Date(value);
                                                setToDate(propertyValue);
                                                if (propertyValue < minDate) {
                                                    setToDateError(true);
                                                } else {
                                                    setToDateError(false);
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
                                    <GoADropdown
                                        name='rateTypes'
                                        value={rateType}
                                        onChange={onRateChange}
                                        width={lg}
                                    >
                                        <GoADropdownItem value='Dry' label='Dry' />
                                        <GoADropdownItem value='Ferry' label='Ferry' />
                                        <GoADropdownItem value='Flat' label='Flat' />
                                        <GoADropdownItem value='Mars' label='Mars' />
                                        <GoADropdownItem value='Primary' label='Primary' />
                                        <GoADropdownItem value='Secondary' label='Secondary' />
                                        <GoADropdownItem value='Wet' label='Wet' />
                                        <GoADropdownItem
                                            value='Accommodation'
                                            label='Accommodation'
                                        />
                                        <GoADropdownItem value='Airport Fee' label='Airport Fee' />
                                        <GoADropdownItem value='Basing' label='Basing' />
                                        <GoADropdownItem
                                            value='Basing Non-Core'
                                            label='Basing Non-Core'
                                        />
                                        <GoADropdownItem
                                            value='Basing Penalty'
                                            label='Basing Penalty'
                                        />
                                        <GoADropdownItem
                                            value='Charter Minimums'
                                            label='Charter Minimums'
                                        />
                                        <GoADropdownItem
                                            value='Crew Exp - Breakfast'
                                            label='Crew Exp - Breakfast'
                                        />
                                        <GoADropdownItem
                                            value='Crew Exp - Dinner'
                                            label='Crew Exp - Dinner'
                                        />
                                        <GoADropdownItem
                                            value='Crew Exp - Lunch'
                                            label='Crew Exp - Lunch'
                                        />
                                        <GoADropdownItem
                                            value='Crew Expenses'
                                            label='Crew Expenses'
                                        />
                                        <GoADropdownItem value='Double Crew' label='Double Crew' />
                                        <GoADropdownItem value='Landing Fee' label='Landing Fee' />
                                        <GoADropdownItem value='Nav Canada' label='Nav Canada' />
                                        <GoADropdownItem
                                            value='Passenger Fee'
                                            label='Passenger Fee'
                                        />
                                        <GoADropdownItem value='Standby' label='Standby' />
                                        <GoADropdownItem
                                            value='Vehicle Rental'
                                            label='Vehicle Rental'
                                        />
                                    </GoADropdown>
                                </GoAFormItem>
                            </td>
                            <td></td>
                            <td colSpan={4}>
                                <GoAFormItem label='Unit'>
                                    <GoADropdown
                                        name='units'
                                        value={unit}
                                        onChange={onUnitChange}
                                        width={lg}
                                    >
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
                                        value={rate.toString()}
                                        error={rateError}
                                        max='99999.99'
                                        min='0'
                                        prefix='$'
                                        suffix='Per&nbsp;Unit'
                                        onChange={(key, value) => {
                                            if (
                                                Number.isNaN(value) ||
                                                Number.isNaN(Number.parseFloat(value))
                                                || Number(value) <= 0
                                            ) {
                                                setRateError(true);
                                            } else {
                                                setRate(Number(value));
                                                setCost((rate * numberOfUnits).toFixed(2).toString());
                                                setRateError(false);
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
                                        onChange={(key, value) => {
                                            if (
                                                Number.isNaN(value) ||
                                                Number.isNaN(Number.parseFloat(value)
                                                    || Number(value) <= 0)
                                            ) {
                                                setNumberOfUnitsError(true);
                                            } else {
                                                setNumberOfUnits(Number(value));
                                                setCost((rate * numberOfUnits).toFixed(2).toString());
                                                setNumberOfUnitsError(false);
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
                                            setCost(Number(value).toFixed(2));
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
                                        maxLength={12}
                                        onChange={(key, value) => {
                                            setGlAccount(value.trim());
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
                                        maxLength={12}
                                        onChange={(key, value) => {
                                            setProfitCenter(value.trim());
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
                                        maxLength={12}
                                        onChange={(key, value) => {
                                            setCostCenter(value.trim());
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
                                        maxLength={12}
                                        onChange={(key, value) => {
                                            setInternalOrder(value.trim());
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
                                        maxLength={12}
                                        onChange={(key, value) => {
                                            setFund(value.trim());
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
                                        maxCount={1000}
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