import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center max-w-lg">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-destructive/10 mb-8">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              Something went <span className="text-gradient">wrong</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-2">
              An unexpected error occurred. Don't worry, it's not your fault.
            </p>
            {this.state.error && (
              <p className="text-sm text-muted-foreground/70 mb-8 p-4 rounded-xl bg-card border border-border font-mono break-all">
                {this.state.error.message}
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              <Link
                to="/"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-xl font-medium hover:bg-white/5 transition-all duration-300"
              >
                <Home className="w-5 h-5" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
