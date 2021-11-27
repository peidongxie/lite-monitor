import {
  PureComponent,
  createContext,
  createElement,
  useCallback,
  useContext,
} from 'react';
import type {
  ComponentType,
  DependencyList,
  ReactNode,
  RefObject,
} from 'react';
import { WebMonitor } from './monitor';
import type { MonitorConfig } from './monitor';

interface ReactMonitorProps {
  config: MonitorConfig;
  ref?: RefObject<ReactMonitor>;
}

interface ReactMonitorState {
  monitor: WebMonitor;
}

const ReactMonitorContext = createContext<WebMonitor | null>(null);
const ReactMonitorProvider = ReactMonitorContext.Provider;
const ReactMonitorConsumer = ReactMonitorContext.Consumer;

class ReactMonitor extends PureComponent<ReactMonitorProps, ReactMonitorState> {
  static getDerivedStateFromError(): Partial<ReactMonitorState> | null {
    return null;
  }

  constructor(props: ReactMonitorProps) {
    super(props);
    const monitor = new WebMonitor(props.config);
    this.state = { monitor };
  }

  getMonitor(): WebMonitor {
    return this.state.monitor;
  }

  componentDidCatch(error: Error): void {
    this.state.monitor.reportError(error);
  }

  componentDidMount(): void {
    const monitor = this.getMonitor();
    monitor.addAccessListener();
  }

  render(): ReactNode {
    return createElement(
      ReactMonitorProvider,
      { value: this.state.monitor },
      this.props.children,
    );
  }
}

const withReactMonitor = <Props>(
  component: ComponentType<Props>,
  config: MonitorConfig,
  ref?: RefObject<ReactMonitor>,
): ComponentType<Props> => {
  const wrapped: ComponentType<Props> = (props) => {
    return createElement<ReactMonitorProps>(
      ReactMonitor,
      ref ? { config, ref } : { config },
      createElement<Props>(component, props),
    );
  };
  const name = component.displayName || component.name;
  wrapped.displayName = name ? `withReactMonitor(${name})` : 'withReactMonitor';
  return wrapped;
};

const getMonitor = (ref: RefObject<ReactMonitor>): WebMonitor | null => {
  return ref.current?.getMonitor() || null;
};

const getCallbackWithErrorCatch = <T extends (...args: never[]) => unknown>(
  callback: T,
  ref: RefObject<ReactMonitor>,
): T => {
  const monitor = getMonitor(ref);
  return monitor ? monitor.wrapErrorCatch(callback) : callback;
};

const useMonitor = (): WebMonitor | null => {
  return useContext(ReactMonitorContext);
};

const useCallbackWithErrorCatch = <T extends (...args: never[]) => unknown>(
  callback: T,
  deps: DependencyList,
): T => {
  const monitor = useMonitor();
  const wrapped = monitor ? monitor.wrapErrorCatch(callback) : callback;
  return useCallback(wrapped, deps);
};

export {
  ReactMonitor,
  ReactMonitorConsumer,
  ReactMonitorProvider,
  getCallbackWithErrorCatch,
  getMonitor,
  useCallbackWithErrorCatch,
  useMonitor,
  withReactMonitor,
};
export type { ReactMonitorProps, ReactMonitorState };
