import { GoAInput } from '@abgov/react-components';
import styles from '@/features/process-invoice/process-invoice.module.scss';
import { FC, useEffect } from 'react';
import { convertToCurrency } from '@/common/currency';
import { useAppDispatch, useAppSelector, useConditionalAuth } from '@/app/hooks';
import { setServiceSheetData, setServiceSheetNameChange } from './process-invoice-tabs-slice';
import { getServiceSheetData } from '@/features/process-invoice/process-invoice-epic';

interface IServiceSheetTabProps {
  InvoiceAmount: number;
}
const ServiceSheetTab: FC<IServiceSheetTabProps> = () => {
  const auth = useConditionalAuth();
  const { serviceSheetTabContainer, serviceSheetTabAltValues, serviceSheetNameDesc, invoiceAmountLabel } = styles;

  const dispatch = useAppDispatch();
  const serviceSheetData = useAppSelector((state) => state.processInvoiceTabs.serviceSheetData);
  const isReadonly = useAppSelector((state) => state.processInvoiceTabs.readonly);

  function updateServiceSheetName(val: string) {
    if (serviceSheetData && serviceSheetData.uniqueServiceSheetName !== val) {
      dispatch(setServiceSheetData({ ...serviceSheetData, uniqueServiceSheetName: val }));
      dispatch(setServiceSheetNameChange(true));
    }
  }

  useEffect(() => {
    if (!serviceSheetData) {
      dispatch(getServiceSheetData(auth?.user?.access_token));
    }
  }, [auth]);

  return (
    <div className={serviceSheetTabContainer}>
      <div>Unique service sheet name</div>
      <div>
        <GoAInput
          name='service-sheet-name'
          type='text'
          maxLength={10}
          onChange={(key, value) => updateServiceSheetName(value)}
          disabled={isReadonly}
          value={serviceSheetData ? serviceSheetData.uniqueServiceSheetName : ''}
        />
        <div className={serviceSheetNameDesc}>required from Arriba to finish</div>
      </div>

      <div>Purchase group</div>
      <div className={serviceSheetTabAltValues}>{serviceSheetData?.purchaseGroup}</div>

      <div>Service description</div>
      <div>{serviceSheetData?.serviceDescription}</div>

      <div>Commodity code</div>
      <div className={serviceSheetTabAltValues}>{serviceSheetData?.communityCode}</div>

      <div>Material group</div>
      <div className={serviceSheetTabAltValues}>{serviceSheetData?.materialGroup}</div>

      <div>Account type</div>
      <div className={serviceSheetTabAltValues}>{serviceSheetData?.accountType}</div>

      <div>Quantity</div>
      <div className={serviceSheetTabAltValues}>{serviceSheetData?.quantity}</div>

      <div>Unit of measure</div>
      <div className={serviceSheetTabAltValues}>{serviceSheetData?.unitOfMeasure}</div>

      <div>Price</div>
      <div className={invoiceAmountLabel}>$ {convertToCurrency(serviceSheetData?.price).replace('$', '')}</div>
    </div>
  );
};

export default ServiceSheetTab;
