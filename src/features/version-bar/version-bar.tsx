import styles from './version-bar.module.scss';

const { container, environment, spacer, build } = styles;
export type VersionBarEnvironment = 'dev' | 'test' | 'uat';
interface IVersionBarProps {
  environment: VersionBarEnvironment;
  environmentLabel: string;
  versionLabel: string;
  buildLabel?: string;
}
const VersionBar: React.FC<IVersionBarProps> = (props) => {
  if (!['dev', 'test', 'uat'].includes(props.environment)) {
    console.error('Environment must be dev, test, or uat');
    return null;
  }
  return (
    <div className={container}>
      <div className={`${environment} ${styles[props.environment]}`}>{props.environmentLabel}</div>
      <div className={styles.version}>{props.versionLabel}</div>
      <div className={spacer}></div>
      {props.buildLabel && <div className={build}>{`${props.buildLabel}`}</div>}
    </div>
  );
};
export default VersionBar;
