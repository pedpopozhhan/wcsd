import { useState } from 'react';
import styles from './navbar.module.scss';
import { useNavigate } from 'react-router-dom';
interface INavBarProps {
  links: { label: string; path: string }[];
}
const { navbar, tab, current } = styles;
const NavBar: React.FC<INavBarProps> = (props: INavBarProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  //   const links = [
  //     { label: 'Contracts', path: 'blah1' },
  //     { label: 'Invoices', path: 'blah2' },
  //   ];
  const tabClicked = (index: number) => {
    setCurrentIndex(index);
  };
  const isCurrent = (path: string) => {
    const currentPath = window.location.pathname;
    return path === currentPath;
  };
  return (
    <div className={navbar}>
      {props.links.map((x, index) => (
        <div key={index} className={`${tab} ${isCurrent(x.path) ? current : ''}`} onClick={() => tabClicked(index)}>
          {x.label}
        </div>
      ))}
    </div>
  );
};

export default NavBar;
