import styles from './version-bar.module.scss';

const { container, environment, spacer, build } = styles;

export default function VersionBar() {
  const env = import.meta.env.VITE_ENV;
  const buildNumber = import.meta.env.VITE_BUILD_NUMBER;
  const version = import.meta.env.VITE_WEB_VERSION;

  // env from environment variables come from github, can have different display values
  // we currently do not have 'test' in github
  const labels: { [key: string]: string } = {
    dev: 'DEV',
    test: 'TST',
    stage: 'QA',
    uat: 'UAT',
  };
  //   dev or stage or uat or prod
  if (env !== 'prod') {
    return (
      <div className={container}>
        <div className={`${environment} ${styles[env]}`}>{labels[env]}</div>
        <div className={styles.version}>{`Release ${version}`}</div>
        <div className={spacer}></div>
        <div className={build}>{`build ${buildNumber}`}</div>
      </div>
    );
  }
  return null;
}
