import {
  PureComponent,
  createContext,
  createElement,
  useContext,
  type ComponentType,
  type ReactNode,
  type RefObject,
} from 'react';
import { WebMonitor, type MonitorConfig } from './monitor';

/**
 * Type(s) related to the React monitor context
 */

const ReactMonitorContext = createContext<WebMonitor | null>(null);
const ReactMonitorProvider = ReactMonitorContext.Provider;
const ReactMonitorConsumer = ReactMonitorContext.Consumer;

/**
 * Type(s) related to the React monitor
 */

interface ReactMonitorProps {
  children?: ReactNode | undefined;
  config?: MonitorConfig | undefined;
  ref?: RefObject<ReactMonitor> | undefined;
}

interface ReactMonitorState {
  monitor: WebMonitor;
}

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
    monitor.addErrorListener();
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

const withReactMonitor = <Props extends Record<string, unknown>>(
  component: ComponentType<Props>,
  config?: MonitorConfig,
  ref?: RefObject<ReactMonitor>,
): ComponentType<Props> => {
  const wrapped: ComponentType<Props> = (props) => {
    return createElement<ReactMonitorProps>(
      ReactMonitor,
      { config, ref },
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

const useMonitor = (): WebMonitor | null => {
  return useContext(ReactMonitorContext);
};

export {
  ReactMonitor,
  ReactMonitorConsumer,
  ReactMonitorProvider,
  getMonitor,
  useMonitor,
  withReactMonitor,
  type ReactMonitorProps,
  type ReactMonitorState,
};
