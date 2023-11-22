import { GoACircularProgress } from '@abgov/react-components';
import * as React from 'react';

interface IPageLoaderProps {
  visible?:boolean
}

const PageLoader: React.FunctionComponent<IPageLoaderProps> = ({visible,...props}) => {
  return(
    <>
        <GoACircularProgress variant="fullscreen" size="small" visible={visible}/>
    </>
  );
};

export default PageLoader;
