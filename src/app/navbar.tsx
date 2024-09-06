import styles from './navbar.module.scss';
import { useNavigate } from 'react-router-dom';
interface INavBarProps {
  links: { label: string; path: string }[];
}
const { navbar, tab, current } = styles;
const NavBar: React.FC<INavBarProps> = (props: INavBarProps) => {
  const navigate = useNavigate();

  const isCurrent = (path: string) => {
    const currentPath = window.location.pathname;
    return path === currentPath;
  };

  return (
    <div className={navbar}>
      {props.links.map((x, index) => (
        <div key={index} className={`${tab} ${isCurrent(x.path) ? current : ''}`} onClick={() => navigate(x.path)}>
          {x.label}
        </div>
      ))}
    </div>
  );
};

export default NavBar;
