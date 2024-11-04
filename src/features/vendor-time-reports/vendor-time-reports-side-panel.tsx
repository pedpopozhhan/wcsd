import { GoABlock, GoAFormItem, GoAIcon, GoATable } from '@abgov/react-components';
import styles from './vendor-time-reports.module.scss';
import { IContractSearchResult } from '@/interfaces/contracts/contract-search-result';
import { ContractType, convertContractType } from '@/common/types/custom-types';

interface IContractTimeReportsSidePanelProps {
  contractDetails: IContractSearchResult;
}

const VendorTimeReportsSidePanel: React.FC<IContractTimeReportsSidePanelProps> = (props) => {
  const { vendorTimeReportSidePanel, vendorTimeReportSidePanelContract, vendorTimeReportSidePanelContactInfo } = styles;
  return (
    <div className={vendorTimeReportSidePanel}>
      <GoABlock gap='l'>
        <div></div>
        <div className={vendorTimeReportSidePanelContract}>
          <GoAFormItem label='Contract' />
          <GoATable testId='times-report-side-panel' width='100%'>
            <tbody>
              <tr>
                <td style={{ borderBottom: 'none' }}>
                  <GoAIcon type='business'></GoAIcon>
                </td>
                <td style={{ borderBottom: 'none' }}>{props.contractDetails.vendorName}</td>
              </tr>
              <tr>
                <td style={{ borderBottom: 'none' }}>
                  <GoAIcon type='document-text'></GoAIcon>
                </td>
                <td style={{ borderBottom: 'none' }}>{props.contractDetails.contractNumber}</td>
              </tr>
              <tr>
                <td style={{ borderBottom: 'none' }}>
                  <GoAIcon type='pricetag'></GoAIcon>
                </td>
                <td style={{ borderBottom: 'none' }}>{convertContractType(props.contractDetails.contractType as ContractType)}</td>
              </tr>
            </tbody>
          </GoATable>
        </div>
      </GoABlock>
      <br /> <br />
      <GoABlock gap='l'>
        <div></div>
        <div className={vendorTimeReportSidePanelContactInfo}>
          {/* <GoAFormItem label='Contact Info' />
          <GoATable width='100%'>
            <tbody>
              <tr>
                <td style={{ borderBottom: 'none' }}>
                  <GoAIcon type='person'></GoAIcon>
                </td>
                <td style={{ borderBottom: 'none' }}>Test Data</td>
              </tr>
              <tr>
                <td style={{ borderBottom: 'none' }}>
                  <GoAIcon type='location'></GoAIcon>
                </td>
                <td style={{ borderBottom: 'none' }}>Toronto</td>
              </tr>
              <tr>
                <td style={{ borderBottom: 'none' }}>
                  <GoAIcon type='call'></GoAIcon>
                </td>
                <td style={{ borderBottom: 'none' }}>111-222-3333</td>
              </tr>
              <tr>
                <td style={{ borderBottom: 'none' }}>
                  <GoAIcon type='mail'></GoAIcon>
                </td>
                <td style={{ borderBottom: 'none' }}>abc@xyz.com</td>
              </tr>
            </tbody>
          </GoATable> */}
        </div>
      </GoABlock>
    </div>
  );
};

export default VendorTimeReportsSidePanel;
