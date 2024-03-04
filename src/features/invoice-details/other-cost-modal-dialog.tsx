import {
  GoAInput,
  GoAButton,
  GoAFormItem,
  GoAInputDate,
  GoAButtonGroup,
  GoADropdown,
  GoADropdownItem,
  GoATextArea,
  GoAButtonType,
  GoABadge,
  GoABadgeType,
} from '@abgov/react-components';
import { useState, useEffect } from 'react';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import invoiceOtherCostDDLService from '@/services/invoice-other-cost-drop-down-lists.service';
import { useAppSelector, useConditionalAuth } from '@/app/hooks';
import { publishToast } from '@/common/toast';
import FlyOut from '@/common/fly-out';
import IOtherCostTableRow from '@/interfaces/common/other-cost-table-row';

interface IOtherCostModalDialog {
  onAdd: (item: IOtherCostTableRowData) => void;
  onUpdate: (item: IOtherCostTableRow) => void;
  showOtherCostDialog: (value: boolean) => void;
  isAddition: boolean;
  visible: boolean;
  rowToUpdate: IOtherCostTableRow | undefined;
}
const OtherCostModalDialog = (props: IOtherCostModalDialog) => {
  const auth = useConditionalAuth();
  const [cancelButtonlabel, setCancelButtonLabel] = useState<string>('Cancel');
  const [cancelButtonType, setCancelButtonType] = useState<GoAButtonType>('tertiary');
  const [addButtonlabel, setAddButtonLabel] = useState<string>('Update');
  const [addButtonType, setAddButtonType] = useState<GoAButtonType>('primary');
  const [addAnotherButtonlabel, setAddAnotherButtonLabel] = useState<string>('');
  const [addAnotherButtonType, setAddAnotherButtonType] = useState<GoAButtonType>('tertiary');
  const [respMessageType] = useState<GoABadgeType>('light');
  const [respMessageContent] = useState('');
  const [respMessageIcon] = useState<boolean>(false);

  const [addAnother, setAddAnother] = useState(false);
  const [iscancelled, setIsCancelled] = useState<boolean>(false);
  const [saveData, setSaveData] = useState<boolean>(false);
  const [minDate] = useState<Date>(new Date(1950, 1, 1));
  const [maxDate] = useState(new Date());
  const [dialogTitle, setDialogTitle] = useState<string>('');
  const [isOtherCostAddition, setIsOtherCostAddition] = useState<boolean>(props.isAddition);

  const [index] = useState<number>(0);
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

  const [glAccount, setGlAccount] = useState<string | string[]>('');
  const [profitCentre, setProfitCenter] = useState<string>('100063');
  const [costCenter, setCostCenter] = useState<string | string[]>('');
  const [internalOrder, setInternalOrder] = useState<string | string[]>('');
  const [fund, setFund] = useState<string | string[]>('');
  const [remarks, setRemarks] = useState<string>('');
  const [invoiceId] = useState<string>('');

  // const [rateTypes, setRateTypes] = useState<string[]>([]);
  const rateTypes = useAppSelector((state) => state.invoiceDetails.rateTypes);
  const [rateUnits, setRateUnits] = useState<string[]>([]);
  const [glAccounts, setGLAccounts] = useState<string[]>([]);
  const [costCenters, setCostCenters] = useState<string[]>([]);
  const [internalOrders, setInternalOrders] = useState<string[]>([]);
  const [funds, setFunds] = useState<string[]>([]);
  const [retry, setRetry] = useState<boolean>(true);

  const currentOtherCost = {
    index: index,
    from: fromDate,
    to: toDate,
    rateType: rateType,
    unit: unit,
    ratePerUnit: rate,
    numberOfUnits: numberOfUnits,
    cost: Number(cost),
    glAcct: glAccount,
    profitCentre: profitCentre,
    costCentre: costCenter,
    internalOrder: internalOrder,
    fund: fund,
    remarks: remarks,
    invoiceId: invoiceId,
  };

  const xl = '500px';
  const lg = '230px';
  const md = '175px';

  useEffect(() => {
    if (props.isAddition) {
      setControlsForAddition();
      clearDialgoControls();
    } else {
      setControlsForUpdate();
      if (props.rowToUpdate?.data.from !== undefined) setFromDate(props.rowToUpdate?.data.from);
      if (props.rowToUpdate?.data.to !== undefined) setToDate(props.rowToUpdate?.data.to);

      setRate(Number(props.rowToUpdate?.data.ratePerUnit));
      setNumberOfUnits(Number(props.rowToUpdate?.data.numberOfUnits));
      setCost(Number(props.rowToUpdate?.data.cost).toString());
      setRateType(String(props.rowToUpdate?.data.rateType));
      setUnit(String(props.rowToUpdate?.data.unit));
      setGlAccount(String(props.rowToUpdate?.data.glAcct));
      setProfitCenter(String(props.rowToUpdate?.data.profitCentre));
      setCostCenter(String(props.rowToUpdate?.data.costCentre));
      setInternalOrder(String(props.rowToUpdate?.data.internalOrder));
      setFund(String(props.rowToUpdate?.data.fund));
      setRemarks(String(props.rowToUpdate?.data.remarks));
    }
  }, [isOtherCostAddition, props.rowToUpdate?.data]);

  useEffect(() => {
    setRetry(false);
  });
  useEffect(() => {
    const subscription = invoiceOtherCostDDLService.getOtherCostDropDownLists(auth?.user?.access_token).subscribe({
      next: (results) => {
        setRateUnits(results.rateUnits);
        setCostCenters(results.costCenterList);
        setGLAccounts(results.glAccountList);
        setInternalOrders(results.internalOrderList);
        setFunds(results.fundList);
      },
      error: (error) => {
        console.error(error);
        publishToast({
          type: 'error',
          message: 'Connection Error',
          callback: () => {
            setRetry(!retry);
          },
        });
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [retry]);

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
      if (fromDateError || toDateError || rateError || numberOfUnitsError) return;
      else {
        if (props.isAddition) {
          props.onAdd(currentOtherCost);
          clearDialgoControls();
          if (!addAnother) {
            props.showOtherCostDialog(false);
          } else setIsOtherCostAddition(true);
        } else {
          if (props.rowToUpdate) {
            props.rowToUpdate.data = currentOtherCost;
            props.onUpdate(props.rowToUpdate);
            setIsCancelled(true);
            props.showOtherCostDialog(false);
          }
        }
      }
    } else {
      setRate(Number(rate));
      setCost((rate * numberOfUnits).toFixed(2).toString());
    }
  }, [saveData, rate, numberOfUnits]);

  useEffect(() => {
    if (iscancelled) {
      clearDialgoControls();
      setIsCancelled(false);
    }
  }, [iscancelled]);

  const clearDialgoControls = () => {
    clearDataPoints();
    clearErrors();
  };

  const hideModalDialog = () => {
    setIsCancelled(true);
    props.showOtherCostDialog(false);
  };

  function onRateTypeChange(name: string, value: string | string[]) {
    setRateType(value);
  }

  function onUnitChange(name: string, value: string | string[]) {
    setUnit(value);
  }

  function onCostCenterChange(name: string, value: string | string[]) {
    setCostCenter(value);
  }

  function onGLAccountChange(name: string, value: string | string[]) {
    setGlAccount(value);
  }

  function onInternalOrderChange(name: string, value: string | string[]) {
    setInternalOrder(value);
  }

  function onFundChange(name: string, value: string | string[]) {
    setFund(value);
  }

  const validateOtherCost = () => {
    if (new Date(fromDate) < minDate || fromDateError) {
      setFromDateError(true);
    } else {
      setFromDateError(false);
    }

    if (new Date(toDate) < minDate || toDateError) {
      setToDateError(true);
    } else {
      setToDateError(false);
    }

    if (Number.isNaN(rate) || rate <= 0 || rate > 99999.99) {
      setRateError(true);
    } else {
      setRateError(false);
    }

    if (Number.isNaN(numberOfUnits) || numberOfUnits <= 0 || numberOfUnits > 99999) {
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
    setProfitCenter('100063');
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
      <FlyOut
        heading={dialogTitle}
        open={props.visible}
        onClose={hideModalDialog}
        actions={
          <GoAButtonGroup alignment='end'>
            <GoABadge type={respMessageType} content={respMessageContent} icon={respMessageIcon} />
            <GoAButton type={cancelButtonType} onClick={hideModalDialog}>
              {cancelButtonlabel}
            </GoAButton>
            <GoAButton type={addButtonType} onClick={addOtherCost}>
              {addButtonlabel}
            </GoAButton>
            <GoAButton type={addAnotherButtonType} onClick={addAnohterOtherCost}>
              {addAnotherButtonlabel}
            </GoAButton>
          </GoAButtonGroup>
        }
      >
        <table>
          <tbody>
            <tr>
              <td>
                <GoAFormItem label='From'>
                  <GoAInputDate
                    name='fromDate'
                    placeholder='YYYY-MM-DD'
                    value={fromDate}
                    error={fromDateError}
                    min={minDate}
                    max={maxDate}
                    width={lg}
                    onChange={(name, value) => {
                      if (value === '') {
                        setFromDateError(true);
                      } else if (isNaN(Date.parse(value.toString()))) {
                        setToDateError(true);
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
              <td colSpan={3}>
                <GoAFormItem label='To'>
                  <GoAInputDate
                    name='dateOnInvoice'
                    placeholder='YYYY-MM-DD'
                    error={toDateError}
                    value={toDate}
                    min={minDate}
                    max={maxDate}
                    width={lg}
                    onChange={(name, value) => {
                      if (value === '') {
                        setToDateError(true);
                      } else if (isNaN(Date.parse(value.toString()))) {
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
              <td>
                <GoAFormItem label='Rate Type'>
                  <GoADropdown filterable placeholder='Select rate Type' name='rateTypes' value={rateType} onChange={onRateTypeChange} width={lg}>
                    {rateTypes.map((x, i) => {
                      return <GoADropdownItem key={i} value={x} label={x} />;
                    })}
                  </GoADropdown>
                </GoAFormItem>
              </td>
              <td></td>
              <td colSpan={3}>
                <GoAFormItem label='Unit'>
                  <GoADropdown filterable placeholder='Select rate unit' name='units' value={unit} onChange={onUnitChange} width={lg}>
                    {rateUnits.map((x, i) => {
                      return <GoADropdownItem key={i} value={x} label={x} />;
                    })}
                  </GoADropdown>
                </GoAFormItem>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                <GoAFormItem label='Rate'>
                  <GoAInput
                    name='rate'
                    type='number'
                    width={lg}
                    value={rate.toString()}
                    error={rateError}
                    max='99999.99'
                    min='0'
                    leadingContent='$'
                    trailingContent='Per&nbsp;Unit'
                    onChange={(key, value) => {
                      if (Number.isNaN(value) || Number.isNaN(Number.parseFloat(value)) || Number(value) <= 0) {
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
              <td>
                <GoAFormItem label='No. of units'>
                  <GoAInput
                    name='numberOfUnits'
                    type='number'
                    width={md}
                    value={numberOfUnits.toString()}
                    error={numberOfUnitsError}
                    max='99999'
                    min='0'
                    onChange={(key, value) => {
                      if (Number.isNaN(value) || Number.isNaN(Number.parseFloat(value) || Number(value) <= 0)) {
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
              <td></td>
            </tr>
            <tr>
              <td>
                <GoAFormItem label='Cost'>
                  <GoAInput
                    name='cost'
                    width={lg}
                    value={cost.toString()}
                    leadingContent='$'
                    disabled
                    onChange={(key, value) => {
                      setCost(Number(value).toFixed(2));
                    }}
                  />
                </GoAFormItem>
              </td>
              <td></td>
              <td colSpan={3}></td>
              <td> </td>
            </tr>
            <tr>
              <td>
                <GoAFormItem label='Cost Center'>
                  <GoADropdown
                    filterable
                    placeholder='Select cost center'
                    name='costCenter'
                    value={costCenter}
                    onChange={onCostCenterChange}
                    width={lg}
                  >
                    {costCenters.map((x, i) => {
                      return <GoADropdownItem key={i} value={x} label={x} />;
                    })}
                  </GoADropdown>
                </GoAFormItem>
              </td>
              <td></td>
              <td colSpan={3}>
                <GoAFormItem label='Fund'>
                  <GoADropdown filterable placeholder='Select fund' name='fund' value={fund} onChange={onFundChange} width={lg}>
                    {funds.map((x, i) => {
                      return <GoADropdownItem key={i} value={x} label={x} />;
                    })}
                  </GoADropdown>
                </GoAFormItem>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                <GoAFormItem label='Internal Order'>
                  <GoADropdown
                    placeholder='Select internal order'
                    filterable
                    name='internalOrder'
                    value={internalOrder}
                    onChange={onInternalOrderChange}
                    width={lg}
                  >
                    {internalOrders.map((x, i) => {
                      return <GoADropdownItem key={i} value={x} label={x} />;
                    })}
                  </GoADropdown>
                </GoAFormItem>
              </td>
              <td></td>
              <td>
                <GoAFormItem label='G/L Acc'>
                  <GoADropdown filterable placeholder='Select G/L account' name='glAccount' value={glAccount} onChange={onGLAccountChange} width={lg}>
                    {glAccounts.map((x, i) => {
                      return <GoADropdownItem key={i} value={x} label={x} />;
                    })}
                  </GoADropdown>
                </GoAFormItem>
              </td>
              <td></td>
            </tr>
            <tr>
              <td colSpan={10}>
                <GoAFormItem label='Remarks'>
                  <GoATextArea
                    name='remkarks'
                    width={xl}
                    countBy='character'
                    maxCount={300}
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
      </FlyOut>
    </>
  );
};

export default OtherCostModalDialog;
