import {
  ComponentType,
  PureComponent,
  ReactNode,
  RefObject,
  createContext,
  createElement,
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
  //     console.log('event', event);
  //     this.state.monitor.reportError(event.error);
  //   });
  //   window.addEventListener<'unhandledrejection'>(
  //     'unhandledrejection',
  //     (event: PromiseRejectionEvent) => {
  //       console.log('async', event);
  //       if (event.reason instanceof Error) {
  //         this.state.monitor.reportError(event.reason);
  //       }
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
