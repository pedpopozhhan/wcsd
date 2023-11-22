import {
  GoAContainer,
  GoAFormItem,
  GoAIcon,
  GoASpacer,
  GoATable,
} from '@abgov/react-components';

const VendorTimeReportsSidePanel = () => {
  return (
    <div style={{ minWidth: '20%' }}>
      <GoASpacer></GoASpacer>
      <GoAContainer>
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
        </GoATable>
        <br/> <br/>
        <GoAFormItem label='Contact Info' />
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
      </GoAContainer>
    </div>
  );
};

export default VendorTimeReportsSidePanel;
