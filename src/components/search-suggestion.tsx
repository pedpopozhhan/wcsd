import { SearchResult } from '@/models/search-result';
import { GoAIcon, GoAIconButton } from '@abgov/react-components';
import { useState, useRef, forwardRef, useEffect } from 'react';
import Select, {
  ControlProps,
  InputAction,
  InputActionMeta,
  Options,
  SelectInstance,
  components,
  createFilter,
} from 'react-select';
import styles from './search-suggestion.module.scss';
let {
  search,
  searchInput,
  container,
  item,
  active,
  hover,
  showMenu,
  hideMenu,
} = styles;

interface ISearchOption {
  value: string;
  label: string;
}
interface ISearchResultsProps {
  allData: SearchResult[];
}
const SearchSuggestion: React.FC<ISearchResultsProps> = (props) => {
  const [inputValue, setInputValue] = useState('');
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const [allSuggestions, setAllSuggestions] = useState([] as ISearchOption[]);
  const [arrowKeyPressed, setArrowKeyPressed] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef: any = useRef(null);
  const separator = ' - ';

  // local array of filtered options for when 'enter' is pressed
  let filteredSuggestions: ISearchOption[] = [];
  let currentInput: string = '';

  useEffect(() => {
    setAllSuggestions(
      props.allData.map((x) => {
        // TODO: value might be an identifier from aviation api
        const val = `${x.vendor}${separator}${x.businessId}`;
        return { value: val, label: val };
      })
    );
  }, [props.allData]);

  // remember to handle clicking off the menu or input
  useEffect(() => {
    const handleOffMenuClick = (e: any) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setMenuIsOpen(false);
      }
    };
    if (menuIsOpen) {
      window.addEventListener('click', handleOffMenuClick);
    } else {
      window.removeEventListener('click', handleOffMenuClick);
    }
    return () => window.removeEventListener('click', handleOffMenuClick);
  }, [menuIsOpen, setMenuIsOpen]);

  function filterSuggestions() {
    const filtered = allSuggestions.filter((x) => {
      const upCase = inputValue.toUpperCase();
      const splits = x.label.split(separator);
      const found = splits.some((x) => x.toUpperCase().startsWith(upCase));
      return found;
    });
    // save the filteredSuggestions
    filteredSuggestions = filtered.slice();
    return filtered.map((data, index) => (
      <div
        className={`${item} ${currentIndex === index ? hover : ''} ${
          selectedIndex === index ? active : ''
        }`}
        onClick={(e) => setSelection(index)}
        key={index}
      >
        {data.label}
      </div>
    ));
  }

  function setSelection(index: number) {
    // setCurrentIndex(index);
    setSelectedIndex(index);
    setInputValue(filteredSuggestions[index].label);
  }

  function handleInputKeyDown(e: any) {
    if (e.key === 'Enter') {
      if (!arrowKeyPressed) {
        // enter selected without pressing arrows
        setArrowKeyPressed(false);
        setMenuIsOpen(false);
      } else {
        // arrow pressed and enter selected
        if (filteredSuggestions[currentIndex]) {
          setSelectedIndex(currentIndex);
          setInputValue(filteredSuggestions[currentIndex].label);
        }
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      setArrowKeyPressed(true);
      // focus the menu items
      // scroll through the items and highlight it
      let newIndex = currentIndex;
      if (
        e.key === 'ArrowDown' &&
        containerRef.current &&
        currentIndex < containerRef.current.children.length - 1
      ) {
        newIndex++;
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        newIndex--;
      }
      // scrollintoview
      setCurrentIndex(newIndex);
      containerRef.current.children[newIndex].scrollIntoView({
        block: 'nearest',
      });
    } else {
      // any other key pressed
      // backspace unselects option
      // entering new character unselects option
      setCurrentIndex(0);
      setSelectedIndex(-1);
      // unset arrowpressed
      setArrowKeyPressed(false);
      //open the menu
      setMenuIsOpen(true);
    }
  }

  function resetInput() {
    setInputValue('');
    setCurrentIndex(0);
    setSelectedIndex(-1);
    setMenuIsOpen(false);
    setArrowKeyPressed(false);
  }

  return (
    <div className={search}>
      <div className={searchInput}>
        <GoAIcon type='search' ml='xs' />
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
        ></input>
        <GoAIconButton
          icon='close'
          mr='xs'
          onClick={resetInput}
          variant='dark'
        />
        <div
          className={`${container} ${menuIsOpen ? showMenu : hideMenu}`}
          ref={containerRef}
        >
          {filterSuggestions()}
        </div>
      </div>
    </div>
  );
};
export default SearchSuggestion;

/*Search Field pre-emptively suggests for input follows ‘aviations' search component

Search Field pre-emptively suggests for input translation of Business IDs to Vendor Name
concatenated

type in Cat, suggests Catlike Flying - 1234568, clicking that suggestion inputs Catlike Flying

type in 123, suggests 1234568 - Catlike Flying, clicking that suggestion inputs 
1234568


type in Cat and hit enter, should select all the ones in the suggestions?

Upon deletion of Search Field (clicking ‘X' inside of field), returns to default (alpha numeric || numeric alpha)

Alternatively deleting input characters with backspace will only clear field, not reset query. If they click enter on an empty search field will query default list

import Select from "react-select"; <====== it is this!

Line 439 
https://github.com/GovAlta-EMU/wmtt-aviation-reporting/blob/0e076ace73b0cc8219bab095b665fdd0f70e5806/src/pages/flightReport/EditFlightReportSummary.tsx
<Select
                name="selContractRegistration"
                options={contractRegistrationOptions}
                placeholder="--Select--"
                className="width100"
                isDisabled={!formValues.flightReportDate}
                value={contractRegistrationOptions.find(
                  (t) => t.value === formValues.contractRegistration?.id
                )}
                onChange={async (value: any) => {
                  if (value) {
                    var contractRegistration = getContractRegistration(
                      aircraftDetails,
                      value.value
                    );

                    if (contractRegistration && contractRegistration.staId)
                      var vendor: any = await VendorService.getByStackholderId(
                        contractRegistration.staId
                      );

                    onPropertyChange({
                      contractRegistration: contractRegistration ?? undefined,
                      contractRegistrationId: value.value,
                      vendor: vendor?.data[0],
                      vendorId: vendor?.data[0].vendorId,
                      flyingRegistration: contractRegistration ?? undefined,
                      flyingRegistrationId: value.value,
                    });
                    onChildDataValidityChange(
                      validate(
                        ruleCode,
                        "selContractRegistration",
                        "onChange",
                        value
                      )
                    );
                  }
                }}
                onInputChange={(value: any) => {
                  if (value)
                    contractRegistrationOptions.find((t) => t.value === value);
                }}
                isSearchable={true}
              />

*/
