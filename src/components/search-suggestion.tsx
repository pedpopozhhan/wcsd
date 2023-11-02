import { SearchResult } from '@/models/search-result';
import { GoAIcon, GoAIconButton } from '@abgov/react-components';
import { useState, useRef, useEffect } from 'react';

import styles from './search-suggestion.module.scss';
let {
  search,
  searchInput,
  searchInputWrapper,
  highlight,
  closeButton,
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
  //   optionDef: (data:SearchResult)=>ISearchOption;
  onEnter: (results: SearchResult[]) => any;
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

  function highlightLabel(label: string) {
    const regex = new RegExp(inputValue, 'gi');
    const parts = label.split(regex);
    const matches = label.match(regex) || [];
    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < matches.length && (
              <span className={highlight}>{matches[index]}</span>
            )}
          </span>
        ))}
      </>
    );
  }

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
        {highlightLabel(data.label)}
      </div>
    ));
  }

  // option click handler
  function setSelection(index: number) {
    setSelectedIndex(index);
    setInputValue(filteredSuggestions[index].label);
    handleOnEnter([filteredSuggestions[index]]);
  }

  function handleOnEnter(filtered: ISearchOption[]) {
    const results = filtered.map((x) => {
      const splits = x.label.split(separator);
      const foundIdx = props.allData.findIndex(
        (x) => x.vendor === splits[0] && x.businessId.toString() === splits[1]
      );
      //   if (foundIdx > -1) {
      return props.allData[foundIdx];
      //   }
    });

    props.onEnter(results);
  }

  function handleInputKeyDown(e: any) {
    if (e.key === 'Enter') {
      if (!arrowKeyPressed) {
        // enter selected without pressing arrows
        setArrowKeyPressed(false);
        setMenuIsOpen(false);
        handleOnEnter(filteredSuggestions);
      } else {
        // arrow pressed and enter selected
        if (filteredSuggestions[currentIndex]) {
          setSelectedIndex(currentIndex);
          setInputValue(filteredSuggestions[currentIndex].label);
          handleOnEnter([filteredSuggestions[currentIndex]]);
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
    filteredSuggestions = [];
    setInputValue('');
    setCurrentIndex(0);
    setSelectedIndex(-1);
    setMenuIsOpen(false);
    setArrowKeyPressed(false);
  }

  return (
    <div className={search}>
      <div className={searchInput}>
        <div className={searchInputWrapper}>
          <GoAIcon type='search' ml='xs' />
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
          ></input>
          <div className={closeButton} onClick={(e) => resetInput()}>
            <GoAIcon type='close' />
          </div>
        </div>

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
