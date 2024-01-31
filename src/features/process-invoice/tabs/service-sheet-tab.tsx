import { GoAInput, GoATable, GoATextArea } from '@abgov/react-components';
import styles from '../process-invoice.module.scss';
import { FC, useState } from 'react';
import { convertToCurrency } from '@/common/currency';

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

  const [serviceSheetName, setServiceSheetName] = useState<string>('');

  return (
    <div className={serviceSheetTabContainer}>
      <div>Unique service sheet name</div>
      <div>
        <GoAInput
          name='service-sheet-name'
          type='text'
          onChange={(key, value) => setServiceSheetName(value)}
          value={serviceSheetName}
        />
        <div className={serviceSheetNameDesc}>
          required from Arriba to finish
        </div>
      </div>

      <div>Purchase group</div>
      <div className={serviceSheetTabAltValues}>W01 (FP_W01)</div>

      <div>Service description</div>
      <div>Professional Services</div>

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
