import styles from './navbar.module.scss';
import { useNavigate } from 'react-router-dom';
interface INavBarLink {
  label: string;
  path: string;
  isDefault?: boolean;
}
interface INavBarProps {
  links: INavBarLink[];
}
const { navbar, tab, current } = styles;
const NavBar: React.FC<INavBarProps> = (props: INavBarProps) => {
  const navigate = useNavigate();

  const isCurrent = (link: INavBarLink) => {
    const currentPath = window.location.pathname;

    return link.path === currentPath || (link.isDefault ? currentPath === '/' : false);
  };

  return (
    <div className={navbar}>
      {props.links.map((x, index) => (
        <div key={index} className={`${tab} ${isCurrent(x) ? current : ''}`} onClick={() => navigate(x.path)}>
          {x.label}
        </div>
      ))}
    </div>
  );
};

export default NavBar;
