import styles from './version-bar.module.scss';

const { container, environment, spacer, build } = styles;

export default function VersionBar() {
  const env = import.meta.env.VITE_ENV;
  const prNumber = import.meta.env.VITE_PR_NUMBER;
  const branch = import.meta.env.VITE_TARGET_BRANCH;
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
        <div className={build}>{`pr ${prNumber} ${branch}`}</div>
      </div>
    );
  }
  return null;
}
