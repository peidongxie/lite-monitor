import {
  useCallback,
  useState,
  useRef,
  type Dispatch,
  type SetStateAction,
} from 'react';

interface ConditionalStateHook {
  <T>(initialState: T | (() => T)): [
    () => T,
    Dispatch<SetStateAction<T>>,
    Dispatch<SetStateAction<T>>,
  ];
  <T = undefined>(): [
    () => T | undefined,
    Dispatch<SetStateAction<T | undefined>>,
    Dispatch<SetStateAction<T | undefined>>,
  ];
}

export const useConditionalState: ConditionalStateHook = <T>(
  initialState?: T | (() => T),
): [
  () => T | undefined,
  Dispatch<SetStateAction<T | undefined>>,
  Dispatch<SetStateAction<T | undefined>>,
] => {
  const [state, setState] = useState(initialState);
  const ref = useRef(state);
  const getState = (): T | undefined => {
    return ref.current;
  };
  const setStateWithoutRerender = useCallback(
    (action: SetStateAction<T | undefined>) => {
      if (typeof action === 'function') {
        ref.current = (action as (prevState: T | undefined) => T | undefined)(
          ref.current,
        );
      } else {
        ref.current = action as T | undefined;
      }
    },
    [],
  );
  const setStateWithRerender = useCallback(
    (action: SetStateAction<T | undefined>) => {
      setStateWithoutRerender(action);
      setState(action);
    },
    [setStateWithoutRerender],
  );
  return [getState, setStateWithoutRerender, setStateWithRerender];
};
