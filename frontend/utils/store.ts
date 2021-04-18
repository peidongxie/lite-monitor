import { Dispatch, SetStateAction, useCallback, useState, useRef } from 'react';

interface RefStateHook {
  <T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>];
  <T = undefined>(): [T | undefined, Dispatch<SetStateAction<T | undefined>>];
}

export const useRefState: RefStateHook = <T>(
  initialState?: T | (() => T),
): [T | undefined, Dispatch<SetStateAction<T | undefined>>] => {
  const [initialValue] = useState(initialState);
  const ref = useRef(initialValue);
  const refState = ref.current;
  const setRefState = useCallback((action: SetStateAction<T | undefined>) => {
    if (typeof action === 'function') {
      ref.current = (action as (prevState: T | undefined) => T | undefined)(
        ref.current,
      );
    } else {
      ref.current = action as T | undefined;
    }
  }, []);
  return [refState, setRefState];
};
