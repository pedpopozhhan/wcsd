import { GoABlock, GoAFormItem, GoAIcon, GoATable } from '@abgov/react-components';
import styles from '@/features/contracts/onegx-contract-side-panel.module.scss';
import { IContractSearchResult } from '@/interfaces/contracts/contract-search-result';
import { ContractType, convertContractType } from '@/common/types/contract-type';

interface IContractTimeReportsSidePanelProps {
  contractDetails: IContractSearchResult;
}

const OneGxContractSidePanel: React.FC<IContractTimeReportsSidePanelProps> = (props) => {
  const { main } = styles;
  return (
    <div className={main}>
      <GoABlock gap='l'>
        <div></div>
        {/* className={vendorTimeReportSidePanelContract} */}
        <div >
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

      </GoABlock>
    </div>
  );
};

export default OneGxContractSidePanel;
