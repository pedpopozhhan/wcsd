import styles from './navbar.module.scss';

const { tab, active } = styles;
export function NavBar() {
  return (
    <div>
      <div className={`${tab} ${active}`}>Contracts</div>
      <div className={tab}>Finance</div>
    </div>
  );
}

export default NavBar;
