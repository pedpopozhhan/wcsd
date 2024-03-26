import { useRef, useState, useEffect, RefObject } from 'react';

const useOnScreen = <T extends HTMLElement>(): [boolean, RefObject<T>] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {});

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [isIntersecting, ref];
};

export default useOnScreen;
