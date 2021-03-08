import { PureComponent } from 'react';
import { Monitor, MonitorConfig } from './monitor';

interface ReactMonitorProps {
  config: MonitorConfig;
}

interface ReactMonitorState {
  monitor: Monitor;
}

class ReactMonitor extends PureComponent<ReactMonitorProps, ReactMonitorState> {
  constructor(props: ReactMonitorProps) {
    super(props);
    this.state = { monitor: new Monitor(props.config) };
  }

  render() {
    return this.props.children;
  }
}

export { ReactMonitor, ReactMonitorProps, ReactMonitorState };
