import React from 'react';

interface State {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // You can integrate with a logging service here
    // eslint-disable-next-line no-console
    console.error('Uncaught error in component tree:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
          <div className="max-w-xl w-full bg-card/80 border border-border p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-4">An unexpected error occurred while rendering the application.</p>
            <details className="text-xs whitespace-pre-wrap mb-4">
              {this.state.error?.message}
              {this.state.error && this.state.error.stack ? `\n\n${this.state.error.stack}` : null}
            </details>
            <div className="flex gap-2">
              <button className="btn" onClick={() => window.location.reload()}>Reload</button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
