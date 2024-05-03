import styles from './unauthorized.module.scss';
const { container } = styles;
export const UnAuthorized = () => {
  return (
    <>
      <div className={container}>
        <h1>Alberta Wildfire Applications Portal</h1>
        <span>
          You are currently unable to access any applications in the portal because no user roles are assigned to you. For access, please contact one
          of the following: your supervisor, your Area&apos;s Regional Administrator, your Wildfire Management Branch contact, or Wildfire
          Applications Support via <a href='mailto:wildfire.applications@gov.ab.ca'>wildfire.applications@gov.ab.ca</a> or +1 780-427-8100
        </span>
      </div>
    </>
  );
};
