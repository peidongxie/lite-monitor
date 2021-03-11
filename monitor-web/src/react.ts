import {
  ComponentType,
  PureComponent,
  ReactNode,
  createContext,
  createElement,
} from 'react';
import { MonitorConfig, WebMonitor } from './monitor';

export interface ReactMonitorProps {
  config: MonitorConfig;
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
    this.state = { monitor: new WebMonitor(props.config) };
  }

  componentDidMount(): void {
    window.addEventListener<'error'>('error', (event: ErrorEvent) => {
      this.state.monitor.reportError(event.error);
    });
    window.addEventListener<'unhandledrejection'>(
      'unhandledrejection',
      (event: PromiseRejectionEvent) => {
        if (event.reason instanceof Error) {
          this.state.monitor.reportError(event.reason);
        }
      },
    );
  }

  componentDidCatch(error: Error): void {
    this.state.monitor.reportError(error);
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
): ComponentType<Props> => {
  const wrapped: ComponentType<Props> = (props) =>
    createElement<ReactMonitorProps>(
      ReactMonitor,
      { config },
      createElement<Props>(component, props),
    );
  const name = component.displayName || component.name;
  wrapped.displayName = name ? `withReactMonitor(${name})` : 'withReactMonitor';
  return wrapped;
};
