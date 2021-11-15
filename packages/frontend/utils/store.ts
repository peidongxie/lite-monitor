import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useState,
  useRef,
} from 'react';

interface RefStateHook {
  <T>(initialState: T | (() => T)): [
    MutableRefObject<T>,
    Dispatch<SetStateAction<T>>,
  ];
  <T = undefined>(): [
    MutableRefObject<T | undefined>,
    Dispatch<SetStateAction<T | undefined>>,
  ];
}

export const useRefState: RefStateHook = <T>(
  initialState?: T | (() => T),
): [
  MutableRefObject<T | undefined>,
  Dispatch<SetStateAction<T | undefined>>,
] => {
  const [initialValue] = useState(initialState);
  const ref = useRef(initialValue);
  const setRefState = useCallback((action: SetStateAction<T | undefined>) => {
    if (typeof action === 'function') {
      ref.current = (action as (prevState: T | undefined) => T | undefined)(
        ref.current,
      );
    } else {
      ref.current = action as T | undefined;
    }
  }, []);
  return [ref, setRefState];
};
