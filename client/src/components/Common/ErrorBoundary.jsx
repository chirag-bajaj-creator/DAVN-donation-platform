import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="client-panel client-card-compact">
          <h2 className="font-bold text-lg mb-2 text-white">Something went wrong</h2>
          <p className="client-muted">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="client-button mt-4"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
