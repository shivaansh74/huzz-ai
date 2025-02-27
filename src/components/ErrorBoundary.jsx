import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-lg bg-red-900 bg-opacity-20 border border-red-800 max-w-3xl mx-auto mt-10">
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-4 text-gray-300">
            There was a problem with the application. This might be due to:
          </p>
          <ul className="list-disc pl-5 mb-6 text-gray-300">
            <li>Missing or invalid API key</li>
            <li>Network connectivity issues</li>
            <li>Temporary API service outage</li>
          </ul>
          <div className="bg-gray-900 p-4 rounded-md mb-6 overflow-auto">
            <code className="text-sm text-gray-400">{this.state.error?.toString()}</code>
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="button-primary"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
