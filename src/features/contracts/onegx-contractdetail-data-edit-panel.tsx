import {
  GoADropdown,
  GoADropdownItem,
  GoAFormItem,
  GoAInput,

} from '@abgov/react-components';
import { useEffect, useState } from 'react';
import Styles from '@/features/contracts/onegx-contractdetail-data-edit-panel.module.scss';
import { ICorporateRegion, IOneGxContractAdditionalInfo, IOneGxContractDetail } from '@/interfaces/contract-management/onegx-contract-management-data';
import { holdbackAmountOption, holdbackAmountItems } from '@/common/types/OneGxContract-types';
import { convertToCurrency } from '@/common/currency';
import { yearMonthDay } from '@/common/dates';
import { EmptyGuid } from '@/common/types/invoice';

interface IOneGxContractDetailDataEditPanel {
  readChanges: boolean;
  contractToUpdate: IOneGxContractDetail | undefined;
  onUpdate: (value: IOneGxContractAdditionalInfo) => void;
  corporateRegions: ICorporateRegion[];
}
const OneGxContractDetailDataEditPanel = (props: IOneGxContractDetailDataEditPanel) => {
  const [vendorName] = useState<string>(getDisplayValue(props.contractToUpdate.supplierName));
  const [vendorId] = useState<string>(getDisplayValue(props.contractToUpdate.supplierid));
  const [relatedContractId, setRelatedContractId] = useState<string>(props.contractToUpdate.oneGxContractDetail?.relatedContractId);
  const [currentContractValue] = useState<string>(getDisplayCurrency(props.contractToUpdate.workspace?.currContractValue));
  const [currency] = useState<string>(getDisplayValue(props.contractToUpdate.workspace?.currencyType));

  const [holdBackAmount, setholdBackAmount] = useState(props.contractToUpdate.oneGxContractDetail?.holdbackAmount === null ?
    '' : props.contractToUpdate.oneGxContractDetail?.holdbackAmount);

  const [purchasingUnit, setPurchasingUnit] = useState<string>(props.contractToUpdate.oneGxContractDetail?.purchasingUnit);
  const [contractManager, setContractManager] = useState<string>(props.contractToUpdate.oneGxContractDetail?.contractManager);
  const [corporateRegion, setCorporateRegion] = useState<string | string[]>(props.contractToUpdate.oneGxContractDetail?.corporateRegion === null ?
    '' : props.contractToUpdate.oneGxContractDetail?.corporateRegion);
  const [corporateRegionName] = useState<string>(props.contractToUpdate.oneGxContractDetail?.corporateRegionName);
  const [corporateRegionList] = useState<ICorporateRegion[]>(props.corporateRegions);
  const [businessArea] = useState<string>(getDisplayValue(props.contractToUpdate.businessArea));
  const [supplierId] = useState<string>(getDisplayValue(props.contractToUpdate.supplierid));
  const [supplierName] = useState<string>(getDisplayValue(props.contractToUpdate.supplierName));
  const [effectiveDate] = useState<string>(getDisplayValue(yearMonthDay(props.contractToUpdate.workspace?.effectivedate)));
  const [expiryDate] = useState<string>(getDisplayValue(yearMonthDay(props.contractToUpdate.workspace?.currExpirationdate)));
  const [originalExpiryDate] = useState<string>(getDisplayValue(yearMonthDay(props.contractToUpdate.workspace?.origexpirationdate)));
  const [amendmentType] = useState<string>(getDisplayValue(props.contractToUpdate.workspace.amendmenttype));
  const [solicitationType] = useState<string>(getDisplayValue(props.contractToUpdate.workspace.solicitationType));
  const [contractType] = useState<string>(getDisplayValue(props.contractToUpdate.workspace.contractType));
  const [description] = useState<string>(getDisplayValue(props.contractToUpdate.workspace.description));
  const [contractManagerErrorLabel, setContractManagerErrorLabel] = useState<string>('');
  const contractManagerErrorLabelText = 'Please provide a valid email address';

  const { main, container, dropdownContainer } = Styles;
  const lg = '350px';

  useEffect(() => {
    invokeSave();
  }, [props.readChanges]);


  function invokeSave() {
    if (!(contractManager === undefined || contractManager === null) && contractManager.length > 0) {
      if (!validateEmail(contractManager)) {
        setContractManagerErrorLabel(contractManagerErrorLabelText);
        return;
      }
      else {
        setContractManagerErrorLabel('');
      }
    }
    const additionalInfo: IOneGxContractAdditionalInfo = {
      oneGxContractId: props.contractToUpdate.oneGxContractDetail === null ? EmptyGuid : props.contractToUpdate.oneGxContractDetail.oneGxContractId,
      contractNumber: props.contractToUpdate.contractNumber,
      contractWorkspace: props.contractToUpdate.workspace.contractWorkspace,
      relatedContractId: relatedContractId,
      holdbackAmount: holdBackAmount,
      contractManager: contractManager,
      purchasingUnit: purchasingUnit,
      corporateRegion: corporateRegion,
      corporateRegionName: corporateRegionName
    };
    props.onUpdate(additionalInfo);
  }

  function getDisplayValue(value: string | null | undefined): string {
    if (value === null || value === undefined || value.trim() === '') {
      return '--';
    }
    return value;
  }

  function getDisplayCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined || value === 0) {
      return '--';
    }
    return convertToCurrency(value);
  }

  function onChangeHoldbackAmount(name: string, type: string | string[]) {
    const _holdbackAmountOption = type as holdbackAmountOption;
    setholdBackAmount(_holdbackAmountOption as holdbackAmountOption);
    // rerun the search, sometimes it is the term, sometimes it is an item with a separator
  }

  function onChangeofRelatedContractId(name: string, value: string) {
    setRelatedContractId(value);
  }

  function onBlurofContractManager(name: string, value: string) {
    if (!(value === undefined) && value.length > 0) {
      if (!validateEmail(value)) {
        setContractManagerErrorLabel(contractManagerErrorLabelText);
        return;
      }
      else {
        setContractManagerErrorLabel('');
      }
    }
    setContractManager(value);
  }
  function onChangeofContractManager(name: string, value: string) {
    if (value === undefined || value.length === 0) {
      setContractManagerErrorLabel('');
    }
    setContractManager(value);
  }

  function onChangeofPurchasingUnit(name: string, value: string) {
    setPurchasingUnit(value);
  }

  function onChangeofCorporateRegion(name: string, value: string | string[]) {
    setCorporateRegion(value);
  }

  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };


  return (
    <div className={main}>
      <div className={container}>
        <div>
          <GoAFormItem label='Vendor'> <GoAInput name='vendorName' value={vendorName} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div>
          <GoAFormItem label='Vendor ID'> <GoAInput name='vendorId' value={vendorId} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div>
          <GoAFormItem label='Related contract ID'> <GoAInput name='relatedContractId' value={relatedContractId} width={lg} onChange={onChangeofRelatedContractId} /> </GoAFormItem>
        </div>
        <div>
          <GoAFormItem label='Current Value'> <GoAInput name='currentContractValue' value={currentContractValue} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div>
          <GoAFormItem label='Currency'> <GoAInput name='currency' value={currency} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div>
          <GoAFormItem label='Holdback amount'></GoAFormItem>
        </div>
        <div className={dropdownContainer}>
          <GoADropdown name='holdbackAmount' placeholder='-----Select-----' value={holdBackAmount} onChange={onChangeHoldbackAmount}>
            {holdbackAmountItems?.map((type, idx) => (
              <GoADropdownItem key={idx} value={type.value} label={type.label} />
            ))}
          </GoADropdown>
        </div>
        <div>
          <GoAFormItem label='Purchasing unit'> <GoAInput name='purchasingUnit' value={purchasingUnit} width={lg} onChange={onChangeofPurchasingUnit} /> </GoAFormItem>
        </div>
        <div>
          <GoAFormItem label='Contract manager' error={contractManagerErrorLabel}>
            <GoAInput name='contractManager' value={contractManager} width={lg} onChange={onChangeofContractManager} onBlur={onBlurofContractManager} />
          </GoAFormItem>
        </div>
        <div className={dropdownContainer}>
          <GoAFormItem label='Corporate region'>
            <GoADropdown placeholder='----Select-----' name='corporateRegion' value={corporateRegion} onChange={onChangeofCorporateRegion} width={lg} maxHeight="125px">
              {corporateRegionList.map((x, i) => {
                return <GoADropdownItem key={i} value={x.corporateRegionId} label={x.regionName} />;
              })}
            </GoADropdown>
          </GoAFormItem>
        </div>
        <div>
          <GoAFormItem label='Business area'> <GoAInput name='businessArea' value={businessArea} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div>
          <GoAFormItem label='Supplier ID'> <GoAInput name='supplierId' value={supplierId} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div>
          <GoAFormItem label='Supplier name'> <GoAInput name='supplierName' value={supplierName} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div>
          <GoAFormItem label='Effective date'> <GoAInput name='effectiveDate' trailingIcon="calendar" value={effectiveDate} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div>
          <GoAFormItem label='Expiry date'> <GoAInput name='expiryDate' trailingIcon="calendar" value={expiryDate} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div>
          <GoAFormItem label='Expiry date (Original)'> <GoAInput name='originalExpiryDate' trailingIcon="calendar" value={originalExpiryDate} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div>
          <GoAFormItem label='Solicitation type'> <GoAInput name='solicitationType' value={solicitationType} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div>
          <GoAFormItem label='Amendment type'> <GoAInput name='amendmentType' value={amendmentType} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div>
          <GoAFormItem label='Contract type'> <GoAInput name='contractType' value={contractType} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div>
          <GoAFormItem label='Description'> <GoAInput name='description' value={description} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
      </div>
    </div>
  );
};

export default OneGxContractDetailDataEditPanel;
