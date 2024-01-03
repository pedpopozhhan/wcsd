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
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


const OtherCostModalDialog = (props: any) => {

    const [pageHasError, setPageHasError] = useState(false);
    const [minDate, setMinDate] = useState(new Date(1950, 1, 1));
    const [dialogTitle, setDialogTitle] = useState("");
    const [isOtherCostAddition, setIsOtherCostAddition] = useState(props.isAddition);

    const [rateType, setRateType] = useState("");
    const [unit, setUnit] = useState("");
    const [rate, setRate] = useState(0);
    const [numberOfUnits, setNumberOfUnits] = useState(0);
    const [unitCost, setUnitCost] = useState("");

    const [glAccount, setGlAccount] = useState("");
    const [profitCentre, setProfitCenter] = useState("");
    const [costCenter, setCostCenter] = useState("");
    const [internalOrder, setInternalOrder] = useState("");
    const [fund, setFund] = useState("");
    const [remarks, setRemarks] = useState("");

    const otherCostForSession = {}
    const navigate = useNavigate();
    const xl = "500px"
    const lg = "250px";
    const md = "150px";
    const sm = "125px";
    const xs = "120px";

    useEffect(() => {
        if (props.isAddition === "false") {
            setDialogTitle("Update other cost");
        } else {
            setDialogTitle("Add other cost");
        }

    }, [isOtherCostAddition,]);

    const clearDialgoControls = () => { }

    const hideModalDialog = () => {
        props.showOtherCostDialog(false);
    }

    function onRateChange(name: string, value: string | string[]) {
        setRateType(rateType);
    }

    function onUnitChange(name: string, value: string | string[]) {
        setUnit(unit);
    }


    return (
        <GoAModal
            heading={dialogTitle}
            open={props.visible}
            width='30vw'
            actions={
                <GoAButtonGroup alignment="end">
                    <GoAButton type='tertiary' onClick={() => hideModalDialog()}>Cancel</GoAButton>
                    <GoAButton type='secondary'>Add</GoAButton>
                    <GoAButton type='primary'>Add Another</GoAButton>
                </GoAButtonGroup>
            }
        >
            <table>
                <tbody>
                    <tr >
                        <td>
                            <GoAFormItem label="From">
                                <GoAInputDate
                                    name="dateOnInvoice"
                                    placeholder="YYYY-MM-DD"
                                    value={new Date()}
                                    min={minDate}
                                    width={lg}
                                    onChange={(name, value) => { }}

                                />
                            </GoAFormItem>
                        </td>
                        <td></td>
                        <td colSpan={2}>
                            <GoAFormItem label="To">
                                <GoAInputDate
                                    name="dateOnInvoice"
                                    placeholder="YYYY-MM-DD"
                                    value={new Date()}
                                    min={minDate}
                                    width={lg}
                                    onChange={(name, value) => { }}
                                />
                            </GoAFormItem>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>
                            <GoAFormItem label="Rate Type">
                                <GoADropdown name="rateTypes" value={rateType} onChange={onRateChange} width={lg}>
                                    <GoADropdownItem value="TYPE1" label="TYPE1" />
                                    <GoADropdownItem value="TYPE2" label="TYPE2" />
                                    <GoADropdownItem value="TYPE3" label="TYPE3" />
                                </GoADropdown>
                            </GoAFormItem>
                        </td>
                        <td></td>
                        <td colSpan={2}>
                            <GoAFormItem label="Unit">
                                <GoADropdown name="units" value={unit} onChange={onRateChange} width={lg}>
                                    <GoADropdownItem value="UNIT1" label="UNIT1" />
                                    <GoADropdownItem value="UNIT2" label="UNIT2" />
                                    <GoADropdownItem value="UNIT3" label="UNIT3" />
                                </GoADropdown>
                            </GoAFormItem>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>
                            <GoAFormItem label="Rate">
                                <GoAInput
                                    name="rate"
                                    type='number'
                                    width={lg}
                                    value={rate.toString()}
                                    prefix='$'
                                    suffix="Per&nbsp;Unit"
                                    onBlur={(key, value) => { }}
                                    onChange={(key, value) => { }}
                                />
                            </GoAFormItem>
                        </td>
                        <td></td>
                        <td><GoAFormItem label="No. of Units">
                            <GoAInput
                                name="numberOfUnits"
                                type='number'
                                width={xs}
                                value={numberOfUnits.toString()}
                                onBlur={(key, value) => { }}
                                onChange={(key, value) => { }}
                            />
                        </GoAFormItem></td>
                        <td>
                            <GoAFormItem label="Unit Cost">
                                <GoAInput
                                    name="unitCost"
                                    width={sm}
                                    value={unitCost.toString()}
                                    prefix='$'
                                    disabled
                                    onChange={() => { }}
                                />
                            </GoAFormItem>
                        </td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <GoAFormItem label="GL Account">
                                <GoAInput
                                    name="glAccount"
                                    width={md}
                                    value={glAccount}
                                    onChange={() => { }}
                                />
                            </GoAFormItem>
                        </td>
                        <td></td>
                        <td>
                            <GoAFormItem label="Profit Center">
                                <GoAInput
                                    name="profitCenter"
                                    width={md}
                                    value={profitCentre}
                                    onChange={() => { }}
                                />
                            </GoAFormItem>
                        </td>
                        <td></td>
                        <td>
                            <GoAFormItem label="Cost Center">
                                <GoAInput
                                    name="costCenter"
                                    width={md}
                                    value={costCenter}
                                    onChange={() => { }}
                                />
                            </GoAFormItem>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <GoAFormItem label="Internal Order">
                                <GoAInput
                                    name="internalOrder"
                                    width={md}
                                    value={internalOrder}
                                    onChange={() => { }}
                                />
                            </GoAFormItem>
                        </td>
                        <td></td>
                        <td>
                            <GoAFormItem label="Fund">
                                <GoAInput
                                    name="fund"
                                    width={md}
                                    value={fund}
                                    onChange={() => { }}
                                />
                            </GoAFormItem>
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colSpan={5}>
                            <GoAFormItem label="Remarks">
                                <GoATextArea
                                    name="remkarks"
                                    width={xl}

                                    value={remarks}
                                    onChange={() => { }}
                                />
                            </GoAFormItem>
                        </td>
                    </tr>
                </tbody>
            </table>
        </GoAModal>
    );
};

export default OtherCostModalDialog;