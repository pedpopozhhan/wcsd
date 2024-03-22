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
import { useState, useEffect, useRef } from 'react';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import invoiceOtherCostDDLService from '@/services/drop-down-lists.service';
import { useAppSelector, useConditionalAuth } from '@/app/hooks';
import { publishToast } from '@/common/toast';
import FlyOut from '@/common/fly-out';
import IOtherCostTableRow from '@/interfaces/common/other-cost-table-row';
import { IDropDownListResponse } from '@/interfaces/common/drop-down-list-response';
import Select from 'react-select';
import Styles from './other-cost-modal-dialog.module.scss';
import './other-cost-modal-dialog.css';
import { navigateTo } from '@/common/navigate';

interface IOtherCostModalDialog {
  onAdd: (item: IOtherCostTableRowData) => void;
  onUpdate: (item: IOtherCostTableRow) => void;
  showOtherCostDialog: (value: boolean) => void;
  isAddition: boolean;
  visible: boolean;
  rowToUpdate: IOtherCostTableRow | undefined;
}
const OtherCostModalDialog = (props: IOtherCostModalDialog) => {
  const tableRef = useRef<HTMLTableElement>(null);
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
  const [fromDate, setFromDate] = useState<string>(new Date().toISOString());
  const [fromDateError, setFromDateError] = useState<boolean>(false);
  const [toDate, setToDate] = useState<string>(new Date().toISOString());
  const [toDateError, setToDateError] = useState<boolean>(false);
  const [rateType, setRateType] = useState<string | string[]>('');
  const [unit, setUnit] = useState<string | string[]>('');

  const [rate, setRate] = useState<number>(0);
  const [rateError, setRateError] = useState<boolean>(true);
  const [numberOfUnits, setNumberOfUnits] = useState<number>(0);
  const [numberOfUnitsError, setNumberOfUnitsError] = useState<boolean>(true);
  const [cost, setCost] = useState<string>('');

  const [glAccount, setGlAccount] = useState<string>('');
  const [profitCentre, setProfitCenter] = useState<string>('100063');
  const [costCenter, setCostCenter] = useState<string>('');
  const [internalOrder, setInternalOrder] = useState<string>('');
  const [fund, setFund] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [remarksError, setRemarksError] = useState<boolean>(true);
  const [invoiceNumber] = useState<string>('');

  const rateTypes = useAppSelector((state) => state.invoiceDetails.rateTypes);
  const [rateUnits, setRateUnits] = useState<string[]>([]);
  const [glAccounts, setGLAccounts] = useState<IDropDownListResponse[]>([]);
  const [costCenters, setCostCenters] = useState<IDropDownListResponse[]>([]);
  const [internalOrders, setInternalOrders] = useState<IDropDownListResponse[]>([]);
  const [funds, setFunds] = useState<IDropDownListResponse[]>([]);
  const [retry, setRetry] = useState<boolean>(true);
  const { tableFormatter } = Styles;
  const [visible, setVisible] = useState<boolean>(false);
  const currentOtherCost = {
    index: index,
    from: fromDate,
    to: toDate,
    rateType: rateType,
    rateUnit: unit,
    ratePerUnit: rate,
    noOfUnits: numberOfUnits,
    cost: Number(cost),
    account: glAccount,
    profitCentre: profitCentre,
    costCentre: costCenter,
    internalOrder: internalOrder,
    fund: fund,
    remarks: remarks,
    invoiceNumber: invoiceNumber,
  };

  const xl = '500px';
  const lg = '230px';
  const md = '175px';
  const placeHolderForDDL = '----------Select----------';
  useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);

  useEffect(() => {
    if (props.isAddition) {
      setControlsForAddition();
      clearDialgoControls();
    } else {
      setControlsForUpdate();
      if (props.rowToUpdate?.data.from !== undefined) setFromDate(props.rowToUpdate?.data.from);
      if (props.rowToUpdate?.data.to !== undefined) setToDate(props.rowToUpdate?.data.to);

      setRate(Number(props.rowToUpdate?.data.ratePerUnit));
      setNumberOfUnits(Number(props.rowToUpdate?.data.noOfUnits));
      setCost(Number(props.rowToUpdate?.data.cost).toString());
      setRateType(String(props.rowToUpdate?.data.rateType));
      setUnit(String(props.rowToUpdate?.data.rateUnit));
      setGlAccount(String(props.rowToUpdate?.data.account));
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
        if (error.response && error.response.status === 403) {
          navigateTo('unauthorized');
        }
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
    setRemarksError(false);
  }

  useEffect(() => {
    if (saveData) {
      setSaveData(false);
      if (fromDateError || toDateError || rateError || numberOfUnitsError || remarksError) return;
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
      if (remarks.trim().length > 300) {
        setRemarksError(true);
      } else {
        setRemarksError(false);
      }
    }
  }, [saveData, rate, numberOfUnits, remarks]);

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
    if (remarks.trim().length > 300) {
      setRemarksError(true);
    } else {
      setRemarksError(false);
    }
  };

  const clearErrors = () => {
    setFromDateError(false);
    setToDateError(false);
    setNumberOfUnitsError(false);
    setRateError(false);
    setRemarksError(false);
  };

  const clearDataPoints = () => {
    setFromDate(new Date().toISOString());
    setToDate(new Date().toISOString());
    setRateType(' ');
    setUnit(' ');
    setRate(0);
    setNumberOfUnits(0);
    setCost(' ');
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

  const addAnotherOtherCost = () => {
    setSaveData(true);
    setAddAnother(true);
    validateOtherCost();
  };

  function flyoutOpened(): void {
    tableRef.current.focus();
  }

  return (
    <>
      <FlyOut
        heading={dialogTitle}
        open={visible}
        onClose={hideModalDialog}
        onOpen={flyoutOpened}
        actions={
          <GoAButtonGroup alignment='end'>
            <GoABadge type={respMessageType} content={respMessageContent} icon={respMessageIcon} />
            <GoAButton type={cancelButtonType} onClick={hideModalDialog}>
              {cancelButtonlabel}
            </GoAButton>
            <GoAButton type={addButtonType} onClick={addOtherCost}>
              {addButtonlabel}
            </GoAButton>
            <GoAButton type={addAnotherButtonType} onClick={addAnotherOtherCost}>
              {addAnotherButtonlabel}
            </GoAButton>
          </GoAButtonGroup>
        }
      >
        <table className={tableFormatter} ref={tableRef} tabIndex={0}>
          <tbody>
            <tr>
              <td>
                <GoAFormItem label='From'>
                  <GoAInputDate
                    name='fromDate'
                    placeholder='YYYY-MM-DD'
                    value={new Date(fromDate)}
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
                        setFromDate(propertyValue.toISOString());
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
                    value={new Date(toDate)}
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
                        setToDate(propertyValue.toISOString());
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
                  <GoADropdown filterable placeholder={placeHolderForDDL} name='rateTypes' value={rateType} onChange={onRateTypeChange} width={lg}>
                    {rateTypes.map((x, i) => {
                      return <GoADropdownItem key={i} value={x} label={x} />;
                    })}
                  </GoADropdown>
                </GoAFormItem>
              </td>
              <td></td>
              <td colSpan={3}>
                <GoAFormItem label='Unit'>
                  <GoADropdown filterable placeholder={placeHolderForDDL} name='units' value={unit} onChange={onUnitChange} width={lg}>
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
                  <Select
                    options={costCenters}
                    placeholder={placeHolderForDDL}
                    value={costCenter === '' ? null : costCenters?.find((t: IDropDownListResponse) => t.value === costCenter)}
                    menuPosition='fixed'
                    onChange={async (value: IDropDownListResponse) => {
                      if (value.value) {
                        setCostCenter(value.value);
                      }
                    }}
                    isSearchable={true}
                    className='css-other-cost-control-width'
                  />
                </GoAFormItem>
              </td>
              <td></td>
              <td>
                <GoAFormItem label='Fund'>
                  <Select
                    options={funds}
                    placeholder={placeHolderForDDL}
                    value={fund === '' ? null : funds?.find((t: IDropDownListResponse) => t.value === fund)}
                    onChange={async (value: IDropDownListResponse) => {
                      if (value.value) {
                        setFund(value.value);
                      }
                    }}
                    menuPosition='fixed'
                    isSearchable={true}
                    className='css-other-cost-control-width'
                  />
                </GoAFormItem>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                <GoAFormItem label='Internal Order'>
                  <Select
                    options={internalOrders}
                    placeholder={placeHolderForDDL}
                    value={internalOrder === '' ? null : internalOrders?.find((t: IDropDownListResponse) => t.value === internalOrder)}
                    onChange={async (value: IDropDownListResponse | null) => {
                      if (value.value) {
                        setInternalOrder(value.value);
                      }
                    }}
                    menuPosition='fixed'
                    isSearchable={true}
                    className='css-other-cost-control-width'
                  />
                </GoAFormItem>
              </td>
              <td></td>
              <td>
                <GoAFormItem label='G/L Acc'>
                  <Select
                    options={glAccounts}
                    placeholder={placeHolderForDDL}
                    value={glAccount === '' ? null : glAccounts?.find((t: IDropDownListResponse) => t.value === glAccount)}
                    onChange={async (value: IDropDownListResponse) => {
                      if (value.value) {
                        setGlAccount(value.value);
                      }
                    }}
                    menuPosition='fixed'
                    isSearchable={true}
                    className='css-other-cost-control-width'
                  />
                </GoAFormItem>
              </td>
              <td></td>
            </tr>
            <tr>
              <td colSpan={10}>
                <GoAFormItem label='Remarks'>
                  <GoATextArea
                    error={remarksError}
                    name='remkarks'
                    width={xl}
                    countBy='character'
                    maxCount={300}
                    value={remarks}
                    onChange={(key, value) => {
                      setRemarks(value.trim());
                      if (remarks.trim().length > 300) {
                        setRemarksError(true);
                      } else {
                        setRemarksError(false);
                      }
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
