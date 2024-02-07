import { GoAInput, GoATable, GoATextArea } from '@abgov/react-components';
import styles from '../process-invoice.module.scss';
import { FC, useEffect, useState } from 'react';
import { convertToCurrency } from '@/common/currency';
import invoiceServiceSheetDataService from '@/services/invoice-service-sheet-data-service';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setServiceSheetData, setServiceSheetNameChange } from './service-sheet-slice';

interface IServiceSheetTabProps {
  InvoiceID: string;
  InvoiceAmount: number;
}
const ServiceSheetTab: FC<IServiceSheetTabProps> = (
  props: IServiceSheetTabProps
) => {
  let {
    serviceSheetTabContainer,
    serviceSheetTabLabels,
    serviceSheetTabAltValues,
    gridContainer,
    serviceSheetNameDesc,
    invoiceAmountLabel
  } = styles;
 
 const dispatch = useAppDispatch();
  const serviceSheetData = useAppSelector((state) => state.serviceSheetData.value);
  function updateServiceSheetName(val: string){
        if(serviceSheetData && serviceSheetData.uniqueServiceSheetName !== val){
          dispatch(setServiceSheetData({...serviceSheetData,  uniqueServiceSheetName: val}));
          dispatch(setServiceSheetNameChange(true));
        }
   }

  useEffect(() => {
   if(!serviceSheetData){
      const subscription = invoiceServiceSheetDataService.getAll().subscribe({
        next: (result) => {
          dispatch(setServiceSheetData(result));
        },
        error: (error) => {
          console.error(error);
        },
      });
  
      return () => {
        subscription.unsubscribe();
      };
    }
  });

  return (
    <div className={serviceSheetTabContainer}>
      <div>Unique service sheet name</div>
      <div>
        <GoAInput
          name='service-sheet-name'
          type='text'
          maxLength={10}
          onChange={(key,value) => updateServiceSheetName(value)}
          value={serviceSheetData ? serviceSheetData.uniqueServiceSheetName : ''}
        />
        <div className={serviceSheetNameDesc}>
          required from Arriba to finish
        </div>
      </div>

      <div>Purchase group</div>
      <div className={serviceSheetTabAltValues}>W01 (FP_W01)</div>

      <div>Service description</div>
      <div>{serviceSheetData?.serviceDescription}</div>

      <div>Commodity code</div>
      <div className={serviceSheetTabAltValues}>[Determined from Contract]</div>

      <div>Material group</div>
      <div className={serviceSheetTabAltValues}>[Determined from Contract]</div>

      <div>Account type</div>
      <div className={serviceSheetTabAltValues}>Expense</div>

      <div>Quantity</div>
      <div className={serviceSheetTabAltValues}>1</div>

      <div>Unit of measure</div>
      <div className={serviceSheetTabAltValues}>Hour</div>

      <div>Price</div>
      <div className={invoiceAmountLabel}>$ {convertToCurrency(props.InvoiceAmount).replace("$", '')}</div>
    </div>
  );
};

export default ServiceSheetTab;
