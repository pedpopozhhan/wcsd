import styles from './fly-out.module.scss';
import { Fragment, PropsWithChildren, useEffect, useRef, useState } from 'react';

const { container, overlay, pane, content, body, header, footer } = styles;
interface IProps {
  heading: string;
  open: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any;
  position?: 'left' | 'right';
  onClose?: () => void;
  onOpen?: () => void;
}
const FlyOut: React.FC<PropsWithChildren<IProps>> = (props) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setIsVisible(props.open);
  }, [props.open]);

  useEffect(() => {
    if (isVisible) {
      if (props.onOpen) {
        props.onOpen();
      }
      contentRef.current.focus();
    }
  }, [isVisible]);
  function close() {
    setIsVisible(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  function getPosition() {
    return props.position ? (props.position === 'left' ? 'flex-start' : 'flex-end') : 'flex-end';
  }

  return isVisible ? (
    <Fragment>
      <div className={container} style={{ justifyContent: getPosition() }}>
        <div className={overlay} onClick={close}></div>
        <div className={pane}>
          <div className={content}>
            <div className={header}>
              <h3>{props.heading}</h3>
            </div>
            <div ref={contentRef} className={body} tabIndex={-1}>
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
