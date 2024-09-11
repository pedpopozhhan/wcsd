import {
  GoAInput,
  GoAFormItem
} from '@abgov/react-components';
import { useState } from 'react';
import Styles from '@/features/contracts/onegx-contractdetail-data-edit-panel.module.scss';
import { IOneGxContractDetail } from '@/interfaces/contract-management/onegx-contract-management-data';
import { convertToCurrency } from '@/common/currency';
import { yearMonthDay } from '@/common/dates';

interface IOneGxContractDetailDataEditPanel {
  //onUpdate: (item: IOneGxContractDetail) => void;
  contractToUpdate: IOneGxContractDetail | undefined;
}
const OneGxContractDetailDataEditPanel = (props: IOneGxContractDetailDataEditPanel) => {
  const [vendorName] = useState<string>(getDisplayValue(props.contractToUpdate.supplierName));
  const [vendorId] = useState<string>(getDisplayValue(props.contractToUpdate.supplierid));
  const [relatedContractId] = useState<string>('');
  const [currentContractValue] = useState<string>(getDisplayCurrency(props.contractToUpdate.workspace?.currContractValue));
  const [currency] = useState<string>(getDisplayValue(props.contractToUpdate.workspace?.currencyType));
  const [holdBackAmount] = useState<string>('');
  const [purchasingUnit] = useState<string>('');
  const [contractManager] = useState<string>('');
  const [corporateRegion] = useState<string>('');
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


  const { main, container, leftColumn, rightColumn } = Styles;
  const lg = '350px';

  function getDisplayValue(value: string | null): string {
    if (value === null || value.trim() === '') {
      return '--';
    }
    return value;
  }

  function getDisplayCurrency(value: number | null): string {
    if (value === null || value === 0) {
      return '--';
    }
    return convertToCurrency(value);
  }


  return (
    <div className={main}>
      <div className={container}>
        <div className={leftColumn}>
          <GoAFormItem label='Vendor'> <GoAInput name='vendorName' value={vendorName} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div className={rightColumn}>
          <GoAFormItem label='Vendor ID'> <GoAInput name='vendorId' value={vendorId} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
      </div>
      <div className={container}>
        <div className={leftColumn}>
          <GoAFormItem label='Related contract ID'> <GoAInput name='relatedContractId' value={relatedContractId} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div>
        </div>
      </div>
      <div className={container}>
        <div className={leftColumn}>
          <GoAFormItem label='Current Value'> <GoAInput name='currentContractValue' value={currentContractValue} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div className={rightColumn}>
          <GoAFormItem label='Currency'> <GoAInput name='currency' value={currency} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
      </div>
      <div className={container}>
        <div className={leftColumn}>
          <GoAFormItem label='Holdback amount'> <GoAInput name='holdbackAmount' value={holdBackAmount} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div className={rightColumn}>
          <GoAFormItem label='Purchasing unit'> <GoAInput name='purchasingUnit' value={purchasingUnit} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
      </div>
      <div className={container}>
        <div className={leftColumn}>
          <GoAFormItem label='Contract manager'> <GoAInput name='contractManager' value={contractManager} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div className={rightColumn}>
          <GoAFormItem label='Corporate region'> <GoAInput name='corporateRegion' value={corporateRegion} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
      </div>
      <div className={container}>
        <div className={leftColumn}>
          <GoAFormItem label='Business area'> <GoAInput name='businessArea' value={businessArea} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div className={rightColumn}>

        </div>
      </div>
      <div className={container}>
        <div className={leftColumn}>
          <GoAFormItem label='Supplier ID'> <GoAInput name='supplierId' value={supplierId} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div className={rightColumn}>
          <GoAFormItem label='Supplier name'> <GoAInput name='supplierName' value={supplierName} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
      </div>
      <div className={container}>
        <div className={leftColumn}>
          <GoAFormItem label='Effective date'> <GoAInput name='effectiveDate' trailingIcon="calendar" value={effectiveDate} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div className={rightColumn}>
          <GoAFormItem label='Expiry date'> <GoAInput name='expiryDate' trailingIcon="calendar" value={expiryDate} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
      </div>
      <div className={container}>
        <div className={leftColumn}>
          <GoAFormItem label='Expiry date (Original)'> <GoAInput name='originalExpiryDate' trailingIcon="calendar" value={originalExpiryDate} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div className={rightColumn}>

        </div>
      </div>
      <div className={container}>
        <div className={leftColumn}>
          <GoAFormItem label='Solicitation type'> <GoAInput name='solicitationType' value={solicitationType} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div className={rightColumn}>
          <GoAFormItem label='Amendment type'> <GoAInput name='amendmentType' value={amendmentType} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
      </div>
      <div className={container}>
        <div className={leftColumn}>
          <GoAFormItem label='Contract type'> <GoAInput name='contractType' value={contractType} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
        <div className={rightColumn}>
          <GoAFormItem label='Description'> <GoAInput name='description' value={description} width={lg} disabled onChange={() => { }} /> </GoAFormItem>
        </div>
      </div>
    </div>
  );
};

export default OneGxContractDetailDataEditPanel;
