import styles from '@/features/contracts/onegx-contractdetail-data-view-panel.module.scss';
import { IOneGxContractDetail } from '@/interfaces/contract-management/onegx-contract-management-data';
import { yearMonthDay } from '@/common/dates';
import { convertToCurrency } from '@/common/currency';

interface IContractSidePanelProps {
  contractDetails: IOneGxContractDetail;
}

const OneGxContractDetailDataViewPanel: React.FC<IContractSidePanelProps> = (props) => {
  const { main, container, row, label, value } = styles;

  function getDisplayValue(value: string | null | undefined): string {
    if (value === null || value === undefined || value.trim() === '') {
      return '--';
    }
    return value;
  }

  function getDisplayCurrency(value: number | null): string {
    if (value === null || value === undefined || value === 0) {
      return '--';
    }
    return convertToCurrency(value);
  }

  return (
    <div className={main}>
      <div>
        {props.contractDetails && (
          <div className={container}>
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
              <div className={value}>{getDisplayValue(props.contractDetails.oneGxContractDetail?.relatedContractId)}</div>
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
              <div className={value}>{getDisplayValue(props.contractDetails.oneGxContractDetail?.holdbackAmount)}</div>
            </div>
            <div className={row}>
              <div className={label}>Purchasing unit</div>
              <div className={value}>{getDisplayValue(props.contractDetails.oneGxContractDetail?.purchasingUnit)}</div>
            </div>
            <div className={row}>
              <div className={label}>Contract manager</div>
              <div className={value}>{getDisplayValue(props.contractDetails.oneGxContractDetail?.contractManager)}</div>
            </div>
            <div className={row}>
              <div className={label}>Corporate region</div>
              <div className={value}>{getDisplayValue(props.contractDetails.oneGxContractDetail?.corporateRegionName)}</div>
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

export default OneGxContractDetailDataViewPanel;
