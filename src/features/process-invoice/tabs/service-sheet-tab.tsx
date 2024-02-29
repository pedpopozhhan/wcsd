import { GoAInput } from '@abgov/react-components';
import styles from '@/features/process-invoice/process-invoice.module.scss';
import { FC, useEffect } from 'react';
import { convertToCurrency } from '@/common/currency';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setServiceSheetData, setServiceSheetNameChange } from './process-invoice-tabs-slice';
import { getServiceSheetData } from '@/features/process-invoice/process-invoice-epic';
import { useAuth } from 'react-oidc-context';
import authNoop from '@/common/auth-noop';

interface IServiceSheetTabProps {
  InvoiceID: string;
  InvoiceAmount: number;
}
const ServiceSheetTab: FC<IServiceSheetTabProps> = (props: IServiceSheetTabProps) => {
  const auth = import.meta.env.VITE_ENABLE_AUTHORIZATION ? useAuth() : authNoop;
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
      <div className={invoiceAmountLabel}>$ {convertToCurrency(props.InvoiceAmount).replace('$', '')}</div>
    </div>
  );
};

export default ServiceSheetTab;
