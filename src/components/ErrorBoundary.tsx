import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#0a0a0b',
            color: '#ff6b6b',
            zIndex: 999999,
            padding: 16,
            fontFamily: 'monospace',
            fontSize: 12,
            lineHeight: 1.5,
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          ДИАГНОСТИКА ОШИБКИ (React):{'\n'}
          {this.state.error.message}
          {'\n\n'}
          {this.state.error.stack}
        </div>
      );
    }
    return this.props.children;
  }
}
