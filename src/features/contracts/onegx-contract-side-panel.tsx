import { GoAButton } from '@abgov/react-components';
import styles from '@/features/contracts/onegx-contract-side-panel.module.scss';
import { IOneGxContractDetail } from '@/interfaces/contract-management/onegx-contract-management-data';
import { yearMonthDay } from '@/common/dates';
import { convertToCurrency } from '@/common/currency';
import { useNavigate } from 'react-router-dom';

interface IContractSidePanelProps {
  contractDetails: IOneGxContractDetail;
}

const OneGxContractSidePanel: React.FC<IContractSidePanelProps> = (props) => {
  const { main, container, child, row, label, value, contractHeader, headerContentWithoutPadding, headerContentWithPadding } = styles;
  const navigate = useNavigate();

  function getDisplayValue(value: string | null): string {
    if (value === null || value.trim() === '') {
      return '--';
    }
    return value;
  }

  function getDisplayCurrency(value: number | null): string {
    if (value === null || value === 0) {
      return '--';
    }
    return convertToCurrency(value);
  }

  function openContractClick(selectedVendor: IOneGxContractDetail) {
    if (selectedVendor.contractNumber) {
      navigate(`/contract-processing/${selectedVendor.id}`, {
        state: selectedVendor.id,
      });
    }
  }

  return (
    <div className={main}>
      <div>
        <div className={!props.contractDetails ? headerContentWithPadding : headerContentWithoutPadding}>
          <GoAButton type='primary' trailingIcon='open' disabled={!props.contractDetails}
            onClick={() => openContractClick(props.contractDetails)}>
            Open contract
          </GoAButton>
        </div>
        {!props.contractDetails && (
          <div className={headerContentWithPadding}>
            <label className={child}>No contract selected</label>
          </div>
        )}
        {props.contractDetails && (

          <div className={container}>
            <div className={contractHeader}>
              <label className={child}>{getDisplayValue(props.contractDetails.contractNumber)}</label>
            </div>
            <div className={row}>
              <div className={label}>Vendor</div>
              <div className={value}>{getDisplayValue(props.contractDetails.supplierName)}</div>
            </div>
            <div className={row}>
              <div className={label}>Vendor ID</div>
              <div className={value}>{getDisplayValue(props.contractDetails.supplierid)}</div>
            </div>
            <div className={row}>
              <div className={label}>Related contract ID</div>
              <div className={value}>{getDisplayValue('')}</div>
            </div>
            <div className={row}>
              <div className={label}>Current value</div>
              <div className={value}>{getDisplayCurrency(props.contractDetails.workspace?.currContractValue)}</div>
            </div>
            <div className={row}>
              <div className={label}>Currency</div>
              <div className={value}>{getDisplayValue(props.contractDetails.workspace?.currencyType)}</div>
            </div>
            <div className={row}>
              <div className={label}>Holdback amount</div>
              <div className={value}>{ }--</div>
            </div>
            <div className={row}>
              <div className={label}>Purchasing unit</div>
              <div className={value}>--</div>
            </div>
            <div className={row}>
              <div className={label}>Contract manager</div>
              <div className={value}>--</div>
            </div>
            <div className={row}>
              <div className={label}>Corporate region</div>
              <div className={value}>--</div>
            </div>
            <div className={row}>
              <div className={label}>Business area</div>
              <div className={value}>{getDisplayValue(props.contractDetails.businessArea)}</div>
            </div>
            <div className={row}>
              <div className={label}>Supplier ID</div>
              <div className={value}>{getDisplayValue(props.contractDetails.supplierid)}</div>
            </div>
            <div className={row}>
              <div className={label}>Supplier name</div>
              <div className={value}>{getDisplayValue(props.contractDetails.supplierName)}</div>
            </div>
            <div className={row}>
              <div className={label}>Effective</div>
              <div className={value}>{getDisplayValue(yearMonthDay(props.contractDetails.workspace?.effectivedate))}</div>
            </div>
            <div className={row}>
              <div className={label}>Expires</div>
              <div className={value}>{getDisplayValue(yearMonthDay(props.contractDetails.workspace?.currExpirationdate))}</div>
            </div>
            <div className={row}>
              <div className={label}>Original Expiration</div>
              <div className={value}>{getDisplayValue(yearMonthDay(props.contractDetails.workspace?.origexpirationdate))}</div>
            </div>
            <div className={row}>
              <div className={label}>Amendment type</div>
              <div className={value}>{getDisplayValue(props.contractDetails.workspace.amendmenttype)}</div>
            </div>
            <div className={row}>
              <div className={label}>Solicitation type</div>
              <div className={value}>{getDisplayValue(props.contractDetails.workspace.solicitationType)}</div>
            </div>
            <div className={row}>
              <div className={label}>Contract type</div>
              <div className={value}>{getDisplayValue(props.contractDetails.workspace.contractType)}</div>
            </div>
            <div className={row}>
              <div className={label}>Description</div>
              <div className={value}>{getDisplayValue(props.contractDetails.workspace.description)}</div>
            </div>
            <div className={row}>
              <div className={label}></div>
              <div className={value}></div>
            </div>

          </div>)}
      </div>
    </div>
  );
};

export default OneGxContractSidePanel;
