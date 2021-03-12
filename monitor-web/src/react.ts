import {
  ComponentType,
  DependencyList,
  PureComponent,
  ReactNode,
  RefObject,
  createContext,
  createElement,
  useCallback,
  useContext,
} from 'react';
import { MonitorConfig, WebMonitor } from './monitor';

export interface ReactMonitorProps {
  config: MonitorConfig;
  ref?: RefObject<ReactMonitor>;
}

export interface ReactMonitorState {
  monitor: WebMonitor;
}

export const ReactMonitorContext = createContext<WebMonitor | null>(null);

export class ReactMonitor extends PureComponent<
  ReactMonitorProps,
  ReactMonitorState
> {
  constructor(props: ReactMonitorProps) {
    super(props);
    const monitor = new WebMonitor(props.config);
    this.state = { monitor };
  }

  get monitor(): WebMonitor {
    return this.state.monitor;
  }

  // componentDidMount(): void {
  //   window.addEventListener<'error'>('error', (event: ErrorEvent) => {
  //     this.state.monitor.reportError(event.error);
  //   });
  //   window.addEventListener<'unhandledrejection'>(
  //     'unhandledrejection',
  //     (event: PromiseRejectionEvent) => {
  //       this.state.monitor.reportError(event.reason);
  //     },
  //   );
  // }

  componentDidCatch(error: Error): void {
    this.state.monitor.reportError(error);
  }

  static getDerivedStateFromError(): Partial<ReactMonitorState> | null {
    return null;
  }

  render(): ReactNode {
    return createElement(
      ReactMonitorContext.Provider,
      { value: this.state.monitor },
      this.props.children,
    );
  }
}

export const withReactMonitor = <Props>(
  component: ComponentType<Props>,
  config: MonitorConfig,
  ref?: RefObject<ReactMonitor>,
): ComponentType<Props> => {
  const wrapped: ComponentType<Props> = (props) =>
    createElement<ReactMonitorProps>(
      ReactMonitor,
      { config, ref },
      createElement<Props>(component, props),
    );
  const name = component.displayName || component.name;
  wrapped.displayName = name ? `withReactMonitor(${name})` : 'withReactMonitor';
  return wrapped;
};

export const getMonitor = (ref: RefObject<ReactMonitor>): WebMonitor | null => {
  return ref.current?.monitor || null;
};

export const getCallbackWithErrorCatch = <
  T extends (...args: never[]) => unknown
>(
  callback: T,
  ref: RefObject<ReactMonitor>,
): T | ((...args: Parameters<T>) => ReturnType<T>) => {
  const monitor = getMonitor(ref);
  return monitor ? monitor.wrapErrorCatch(callback) : callback;
};

export const useMonitor = (): WebMonitor | null => {
  return useContext(ReactMonitorContext);
};

export const useCallbackWithErrorCatch = <
  T extends (...args: never[]) => unknown
>(
  callback: T,
  deps: DependencyList,
): T | ((...args: Parameters<T>) => ReturnType<T>) => {
  const monitor = useMonitor();
  const wrapped = monitor ? monitor.wrapErrorCatch(callback) : callback;
  return useCallback(wrapped, deps);
};
