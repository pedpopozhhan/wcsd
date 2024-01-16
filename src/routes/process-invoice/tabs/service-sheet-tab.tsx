import { GoAInput, GoATable, GoATextArea } from '@abgov/react-components';
import styles from '../process-invoice.module.scss';
import { FC, useState } from 'react';
import { convertToCurrency } from '@/common/currency';

interface IServiceSheetTabProps{
  InvoiceID: string,
  InvoiceAmount: number
}
const ServiceSheetTab : FC<IServiceSheetTabProps> = (props: IServiceSheetTabProps) => {

  let {
    serviceSheetTabContainer,
    serviceSheetTabLabels,
    serviceSheetTabAltValues,
    gridContainer,
    serviceSheetNameDesc,
  } = styles;

  const [serviceSheetName, setServiceSheetName] = useState<string>('');

  return (
    <div className={serviceSheetTabContainer}>
      <GoATable>
        <tbody>
          <tr>
            <td >
              Unique service sheet name
            </td>
            <td>
              <div>
                <GoAInput
                  name='service-sheet-name'
                  type='text'
                  onChange={(key, value) => setServiceSheetName(value)}
                  value={serviceSheetName}
                />
              </div>
              <div className=''>required from Arriba to finish</div>
            </td>
          </tr>
          <tr>
            <td >Purchase Group</td>
            <td className={serviceSheetTabAltValues}>W01(FP_W01)</td>
          </tr>
          <tr>
            <td >
              Service Description
            </td>
            <td>Professional Services</td>
          </tr>
          <tr>
            <td >Commodity code</td>
            <td className={serviceSheetTabAltValues}>
              [Determined from Contract]
            </td>
          </tr>
          <tr>
            <td >Material group</td>
            <td className={serviceSheetTabAltValues}>
              [Determined from Contract]
            </td>
          </tr>
          <tr>
            <td >Account type</td>
            <td className={serviceSheetTabAltValues}>Expense</td>
          </tr>
          <tr>
            <td >Quantity</td>
            <td className={serviceSheetTabAltValues}>1</td>
          </tr>
          <tr>
            <td >Unit of measure</td>
            <td className={serviceSheetTabAltValues}>Hour</td>
          </tr>
          <tr>
            <td >Price</td>
            <td>  {convertToCurrency(props.InvoiceAmount)}</td>
          </tr>
        </tbody>
      </GoATable>
    </div>
  );
};

export default ServiceSheetTab;