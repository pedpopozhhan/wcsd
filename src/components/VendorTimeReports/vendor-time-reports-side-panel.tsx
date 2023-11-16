import {
  GoAContainer,
  GoAFormItem,
  GoAIcon,
  GoASpacer,
  GoATable,
} from '@abgov/react-components';

const VendorTimeReportsSidePanel = () => {
  return (
    <div>
      <GoASpacer></GoASpacer>
      <GoAContainer>
        <GoAFormItem label='Contracts' />
        <GoATable>
          <tbody>
            <tr>
              <td>
                <GoAIcon type='business'></GoAIcon>
              </td>
              <td>John Wick</td>
            </tr>
            <tr>
              <td>
                <GoAIcon type='document-text'></GoAIcon>
              </td>
              <td>111222333</td>
            </tr>
            <tr>
              <td>
                <GoAIcon type='pricetag'></GoAIcon>
              </td>
              <td>Casual</td>
            </tr>
          </tbody>
        </GoATable>
      </GoAContainer>
      <GoAContainer>
        <GoATable>
          <tbody>
            <tr>
              <td>
                <GoAIcon type='person'></GoAIcon>
              </td>
              <td>[Rep Name]</td>
            </tr>
            <tr>
              <td>
                <GoAIcon type='location'></GoAIcon>
              </td>
              <td>[Location]</td>
            </tr>
            <tr>
              <td>
                <GoAIcon type='call'></GoAIcon>
              </td>
              <td>[Phone Number]</td>
            </tr>
            <tr>
              <td>
                <GoAIcon type='mail'></GoAIcon>
              </td>
              <td>[Email]</td>
            </tr>
          </tbody>
        </GoATable>
      </GoAContainer>
    </div>
  );
};

export default VendorTimeReportsSidePanel;
