import styles from './fly-out.module.scss';
import { Fragment, PropsWithChildren, useEffect, useRef, useState } from 'react';

let { overlay, container, header, content, footer } = styles;
interface IProps {
  heading: string;
  open: boolean;
  actions: any;
  onClose?: () => any;
}
const FlyOut: React.FC<PropsWithChildren<IProps>> = (props) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<string | number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setIsVisible(props.open);
  }, [props.open]);

  function containerClick(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    console.dir(event.target);
  }
  function close() {
    console.log('closing');
    setIsVisible(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  return isVisible ? (
    <Fragment>
      <div className={overlay} onClick={close}>
        <div ref={containerRef} className={container} onClick={containerClick}>
          <div>
            <div className={header}>
              <h3>{props.heading}</h3>
            </div>
            <div ref={contentRef} className={content}>
              {props.children}
            </div>
            <div className={footer}>{props.actions}</div>
          </div>
        </div>
      </div>
    </Fragment>
  ) : null;
};

export default FlyOut;
