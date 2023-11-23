import {
  GoABlock,
  GoAContainer,
  GoAFormItem,
  GoAIcon,
  GoASpacer,
  GoATable,
  GoATwoColumnLayout,
} from '@abgov/react-components';
import styles from '../../App.module.scss'

const VendorTimeReportsSidePanel = () => {
  const {vendorTimeReportSidePanel, vendorTimeReportSidePanelSection, vendorTimeReportSidePanelContract, vendorTimeReportSidePanelContactInfo} = styles;
  return (
    <div className={vendorTimeReportSidePanel}>
      <GoASpacer></GoASpacer>
      <div className={vendorTimeReportSidePanelSection}>
        <GoABlock gap="l"> 
        <div></div>
        <div className={vendorTimeReportSidePanelContract}>
        <GoAFormItem label='Contract' />
        <GoATable testId='times-report-side-panel'>
          <tbody>
            <tr>
              <td style={{ borderBottom: 'none' }}>
                <GoAIcon type='business'></GoAIcon>
              </td>
              <td style={{ borderBottom: 'none' }}>Test Vendor</td>
            </tr>
            <tr>
              <td style={{ borderBottom: 'none' }}>
                <GoAIcon type='document-text'></GoAIcon>
              </td>
              <td style={{ borderBottom: 'none' }}>12345680</td>
            </tr>
            <tr>
              <td style={{ borderBottom: 'none' }}>
                <GoAIcon type='pricetag'></GoAIcon>
              </td>
              <td style={{ borderBottom: 'none' }}>Casual</td>
            </tr>
          </tbody>
        </GoATable></div></GoABlock>
       
        <br/> <br/>
    
        <GoABlock gap="l">
          <div></div>
          <div className={vendorTimeReportSidePanelContactInfo}>
          <GoAFormItem label='Contact Info'/>
          <GoATable testId='tbl-contact-info-side-panel-table' >
          <tbody>
            <tr>
              <td style={{ borderBottom: 'none' }}>
                <GoAIcon type='person'></GoAIcon>
              </td>
              <td style={{ borderBottom: 'none' }}>Viral Patel</td>
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
        </GoATable>
          </div>
        </GoABlock>
      </div>
    </div>
  );
};

export default VendorTimeReportsSidePanel;
