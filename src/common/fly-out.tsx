import styles from './fly-out.module.scss';
import { Fragment, PropsWithChildren, useEffect, useRef, useState } from 'react';

const { container, overlay, pane, content, body, header, footer } = styles;
interface IProps {
  heading: string;
  open: boolean;
  actions: any;
  position?: 'left' | 'right';
  onClose?: () => any;
}
const FlyOut: React.FC<PropsWithChildren<IProps>> = (props) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

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

  function getPosition() {
    return props.position ? (props.position === 'left' ? 'flex-start' : 'flex-end') : 'flex-end';
  }

  return isVisible ? (
    <Fragment>
      <div className={container} style={{ justifyContent: getPosition() }}>
        <div className={overlay} onClick={close}></div>
        <div className={pane}>
          <div className={content} onClick={containerClick}>
            <div className={header}>
              <h3>{props.heading}</h3>
            </div>
            <div ref={contentRef} className={body}>
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
